const express  = require('express');
const auth     = require('../middleware/auth');
const { query, getPool } = require('../database/db');
const { buscarVoos }            = require('../services/skyscanner');
const { calcularDistanciaRota } = require('../services/rotas');

const router = express.Router();

// Todas as rotas abaixo exigem autenticação
router.use(auth);

// ── RF-04 / RF-03: Criar roteiro (planejar viagem + montar roteiro) ──────────
// POST /api/roteiros
router.post('/', async (req, res) => {
  const conn = await getPool().getConnection();
  try {
    const { regiao_id, data_inicio, data_fim, nivel_orcamento, preferencias } = req.body;
    const usuario_id = req.usuario.id;

    if (!regiao_id || !data_inicio || !data_fim)
      return res.status(400).json({ error: 'regiao_id, data_inicio e data_fim são obrigatórios.' });

    const inicio = new Date(data_inicio);
    const fim    = new Date(data_fim);
    if (fim <= inicio)
      return res.status(400).json({ error: 'data_fim deve ser posterior a data_inicio.' });

    const [regiao] = await query('SELECT * FROM regioes WHERE id = ?', [regiao_id]);
    if (!regiao) return res.status(404).json({ error: 'Região não encontrada.' });

    // Calcula dias de viagem
    const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));

    // CT-44: limite máximo de 60 dias
    if (dias > 60)
      return res.status(400).json({ error: 'O roteiro não pode ter mais de 60 dias.' });
    const titulo = `${regiao.nome} — ${dias} dia${dias > 1 ? 's' : ''}`;

    await conn.beginTransaction();

    // Busca locais da região filtrados por preferências e orçamento
    let sqlLocais = 'SELECT * FROM locais WHERE regiao_id = ?';
    const paramsLocais = [regiao_id];

    if (preferencias && preferencias.length > 0) {
      sqlLocais += ` AND categoria IN (${preferencias.map(() => '?').join(',')})`;
      paramsLocais.push(...preferencias);
    }

    if (nivel_orcamento === 'economico') sqlLocais += ' AND custo_medio <= 30';
    if (nivel_orcamento === 'moderado')  sqlLocais += ' AND custo_medio <= 100';
    if (nivel_orcamento === 'premium')   sqlLocais += ' AND custo_medio > 100';

    sqlLocais += ' ORDER BY avaliacao DESC LIMIT 20';
    const [locaisRows] = await conn.execute(sqlLocais, paramsLocais);

    // Cria o roteiro
    const [roteiroResult] = await conn.execute(
      'INSERT INTO roteiros (usuario_id, regiao_id, titulo, data_inicio, data_fim, nivel_orcamento) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario_id, regiao_id, titulo, data_inicio, data_fim, nivel_orcamento || 'moderado']
    );
    const roteiro_id = roteiroResult.insertId;

    // Salva preferências
    if (preferencias && preferencias.length > 0) {
      for (const pref of preferencias) {
        await conn.execute(
          'INSERT INTO preferencias_roteiro (roteiro_id, tipo) VALUES (?, ?)',
          [roteiro_id, pref]
        );
      }
    }

    // Distribui locais pelos dias
    let custo_total = 0;
    const locaisPorDia = Math.max(2, Math.ceil(locaisRows.length / dias));

    for (let d = 0; d < dias; d++) {
      const dataDodia = new Date(inicio);
      dataDodia.setDate(inicio.getDate() + d);
      const dataStr = dataDodia.toISOString().split('T')[0];

      const locaisDoDia = locaisRows.slice(d * locaisPorDia, (d + 1) * locaisPorDia);
      const custo_dia   = locaisDoDia.reduce((s, l) => s + Number(l.custo_medio), 0);
      custo_total += custo_dia;

      const [diaResult] = await conn.execute(
        'INSERT INTO dias_roteiro (roteiro_id, numero_dia, data, custo_dia) VALUES (?, ?, ?, ?)',
        [roteiro_id, d + 1, dataStr, custo_dia]
      );
      const dia_id = diaResult.insertId;

      const horarios = ['09:00', '14:00', '17:00', '20:00'];
      for (let i = 0; i < locaisDoDia.length; i++) {
        await conn.execute(
          'INSERT INTO itens_roteiro (dia_id, local_id, horario, ordem) VALUES (?, ?, ?, ?)',
          [dia_id, locaisDoDia[i].id, horarios[i] || '10:00', i]
        );
      }
    }

    // Atualiza custo total
    await conn.execute(
      'UPDATE roteiros SET custo_total = ? WHERE id = ?',
      [custo_total, roteiro_id]
    );

    await conn.commit();

    // Retorna roteiro completo
    const roteiro = await getRoteiroCompleto(roteiro_id);
    return res.status(201).json({ message: 'Roteiro criado com sucesso.', roteiro });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar roteiro.' });
  } finally {
    conn.release();
  }
});

// ── RF-08: Histórico de roteiros ─────────────────────────────────────────────
// GET /api/roteiros
router.get('/', async (req, res) => {
  try {
    const roteiros = await query(`
      SELECT r.*, rg.nome AS regiao_nome, rg.slug AS regiao_slug
      FROM roteiros r
      JOIN regioes rg ON r.regiao_id = rg.id
      WHERE r.usuario_id = ?
      ORDER BY r.criado_em DESC
    `, [req.usuario.id]);

    return res.json(roteiros);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar roteiros.' });
  }
});

// GET /api/roteiros/:id — detalhes de um roteiro
router.get('/:id', async (req, res) => {
  try {
    const roteiro = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });
    return res.json(roteiro);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar roteiro.' });
  }
});

// ── RF-05: Visualizar custo total ─────────────────────────────────────────────
// GET /api/roteiros/:id/custo
router.get('/:id/custo', async (req, res) => {
  try {
    const [roteiro] = await query(
      'SELECT id, titulo, custo_total FROM roteiros WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const dias = await query(
      'SELECT numero_dia, data, custo_dia FROM dias_roteiro WHERE roteiro_id = ? ORDER BY numero_dia',
      [roteiro.id]
    );
    return res.json({ ...roteiro, custo_por_dia: dias });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao calcular custo.' });
  }
});

// ── RF-06: Exportar roteiro como PDF ─────────────────────────────────────────
// GET /api/roteiros/:id/export
const PDFDocument = require('pdfkit');
router.get('/:id/export', async (req, res) => {
  try {
    const roteiro = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="roteiro-${roteiro.id}.pdf"`);
    doc.pipe(res);

    doc.fontSize(20).fillColor('#0f766e').text('CONEXÃO GAÚCHA', { align: 'center' });
    doc.fontSize(13).fillColor('#334155').text('Roteiro de Viagem', { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#0f766e').lineWidth(1.5).stroke();
    doc.moveDown(0.5);

    doc.fontSize(11).fillColor('#1e293b');
    doc.text(`Destino: ${roteiro.regiao_nome}`);
    doc.text(`Título: ${roteiro.titulo}`);
    doc.text(`Período: ${roteiro.data_inicio} até ${roteiro.data_fim}`);
    doc.text(`Orçamento: ${roteiro.nivel_orcamento}`);
    doc.text(`Custo total estimado: R$ ${Number(roteiro.custo_total).toFixed(2)}`);
    doc.moveDown(1);

    for (const dia of (roteiro.dias || [])) {
      doc.fontSize(12).fillColor('#0f766e').text(`Dia ${dia.numero_dia} — ${dia.data}`, { underline: true });
      doc.fontSize(10).fillColor('#64748b').text(`Custo do dia: R$ ${Number(dia.custo_dia).toFixed(2)}`);
      doc.moveDown(0.3);
      for (const item of (dia.itens || [])) {
        doc.fontSize(10).fillColor('#1e293b').text(`  ${item.horario || '--:--'}  ${item.local_nome || item.nome_manual || 'Atividade'}`);
        if (item.descricao) doc.fontSize(9).fillColor('#64748b').text(`    ${item.descricao}`);
        doc.fontSize(9).fillColor('#0f766e').text(`    R$ ${Number(item.custo_medio || 0).toFixed(2)}  ·  ${item.duracao_estimada || ''}`);
        doc.moveDown(0.3);
      }
      doc.moveDown(0.5);
    }

    doc.addPage();
    doc.fontSize(14).fillColor('#0f766e').text('Resumo Financeiro', { align: 'center' });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#0f766e').lineWidth(1).stroke();
    doc.moveDown(0.5);
    for (const dia of (roteiro.dias || [])) {
      doc.fontSize(10).fillColor('#1e293b').text(`Dia ${dia.numero_dia} (${dia.data})`, { continued: true })
         .fillColor('#0f766e').text(`  R$ ${Number(dia.custo_dia).toFixed(2)}`, { align: 'right' });
    }
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#94a3b8').lineWidth(0.5).stroke();
    doc.moveDown(0.3);
    doc.fontSize(12).fillColor('#0f766e').text('TOTAL ESTIMADO', { continued: true })
       .text(`R$ ${Number(roteiro.custo_total).toFixed(2)}`, { align: 'right' });

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao exportar roteiro.' });
  }
});

// ── Resumo financeiro da viagem ───────────────────────────────────────────────
// GET /api/roteiros/:id/resumo-financeiro
router.get('/:id/resumo-financeiro', async (req, res) => {
  try {
    const roteiro = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });
    const dias = (roteiro.dias || []).map(d => ({
      numero_dia: d.numero_dia, data: d.data, custo_dia: Number(d.custo_dia),
      itens: (d.itens || []).map(i => ({ nome: i.local_nome || i.nome_manual, custo: Number(i.custo_medio || 0), categoria: i.categoria })),
    }));
    const categorias = {};
    dias.forEach(d => d.itens.forEach(i => {
      const cat = i.categoria || 'Outros';
      categorias[cat] = (categorias[cat] || 0) + i.custo;
    }));
    return res.json({
      titulo: roteiro.titulo, nivel_orcamento: roteiro.nivel_orcamento,
      data_inicio: roteiro.data_inicio, data_fim: roteiro.data_fim,
      custo_total: Number(roteiro.custo_total),
      por_categoria: categorias, por_dia: dias,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao calcular resumo.' });
  }
});

// ── RF-07: Compartilhar roteiro ───────────────────────────────────────────────
// GET /api/roteiros/:id/share
router.get('/:id/share', async (req, res) => {
  try {
    const [roteiro] = await query(
      'SELECT id, titulo FROM roteiros WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const baseUrl = (process.env.APP_URL || 'http://200.132.38.218:8084').replace(/\/$/, '');
    const link = `${baseUrl}/roteiro/${roteiro.id}`;

    return res.json({
      message: 'Link de compartilhamento gerado.',
      link,
      titulo: roteiro.titulo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao gerar link.' });
  }
});

// DELETE /api/roteiros/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM roteiros WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Roteiro não encontrado.' });
    return res.json({ message: 'Roteiro excluído com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao excluir roteiro.' });
  }
});

// ── Helper: busca roteiro completo com dias e itens ──────────────────────────
async function getRoteiroCompleto(id, usuario_id = null) {
  let sql = `
    SELECT r.*, rg.nome AS regiao_nome, rg.slug AS regiao_slug
    FROM roteiros r JOIN regioes rg ON r.regiao_id = rg.id
    WHERE r.id = ?
  `;
  const params = [id];
  if (usuario_id) { sql += ' AND r.usuario_id = ?'; params.push(usuario_id); }

  const [roteiro] = await query(sql, params);
  if (!roteiro) return null;

  const dias = await query(
    'SELECT * FROM dias_roteiro WHERE roteiro_id = ? ORDER BY numero_dia',
    [id]
  );

  for (const dia of dias) {
    dia.itens = await query(`
      SELECT ir.horario, ir.ordem,
             l.id AS local_id, l.nome AS local_nome, l.cidade,
             l.descricao, l.custo_medio, l.avaliacao,
             l.duracao_estimada, l.imagem_url, l.categoria,
             l.latitude, l.longitude
      FROM itens_roteiro ir
      JOIN locais l ON ir.local_id = l.id
      WHERE ir.dia_id = ?
      ORDER BY ir.ordem
    `, [dia.id]);
  }

  roteiro.dias = dias;

  roteiro.preferencias = (await query(
    'SELECT tipo FROM preferencias_roteiro WHERE roteiro_id = ?', [id]
  )).map(p => p.tipo);

  return roteiro;
}


// ── CT-83: Clonar roteiro ─────────────────────────────────────────────────────
router.post('/:id/clonar', async (req, res) => {
  const conn = await getPool().getConnection();
  try {
    const original = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!original) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    await conn.beginTransaction();
    const [r] = await conn.execute(
      'INSERT INTO roteiros (usuario_id, regiao_id, titulo, data_inicio, data_fim, nivel_orcamento, custo_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.usuario.id, original.regiao_id, `${original.titulo} (cópia)`, original.data_inicio, original.data_fim, original.nivel_orcamento, original.custo_total]
    );
    const novo_id = r.insertId;

    for (const dia of original.dias) {
      const [dr] = await conn.execute(
        'INSERT INTO dias_roteiro (roteiro_id, numero_dia, data, custo_dia) VALUES (?, ?, ?, ?)',
        [novo_id, dia.numero_dia, dia.data, dia.custo_dia]
      );
      for (const item of dia.itens) {
        await conn.execute(
          'INSERT INTO itens_roteiro (dia_id, local_id, horario, ordem, nota, concluido) VALUES (?, ?, ?, ?, ?, ?)',
          [dr.insertId, item.local_id, item.horario, item.ordem, item.nota || null, 0]
        );
      }
    }
    await conn.commit();
    const novo = await getRoteiroCompleto(novo_id, req.usuario.id);
    return res.status(201).json({ message: 'Roteiro clonado com sucesso.', roteiro: novo });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Erro ao clonar roteiro.' });
  } finally {
    conn.release();
  }
});

// ── CT-28: Remover item do roteiro ────────────────────────────────────────────
router.delete('/itens/:itemId', async (req, res) => {
  try {
    // Garante que o item pertence a um roteiro do usuário
    const [item] = await query(`
      SELECT ir.id FROM itens_roteiro ir
      JOIN dias_roteiro dr ON ir.dia_id = dr.id
      JOIN roteiros r ON dr.roteiro_id = r.id
      WHERE ir.id = ? AND r.usuario_id = ?
    `, [req.params.itemId, req.usuario.id]);
    if (!item) return res.status(404).json({ error: 'Item não encontrado.' });

    await query('DELETE FROM itens_roteiro WHERE id = ?', [req.params.itemId]);
    return res.json({ message: 'Item removido com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao remover item.' });
  }
});

// ── CT-39/43: Atualizar item (nota, concluido) ────────────────────────────────
router.put('/itens/:itemId', async (req, res) => {
  try {
    const [item] = await query(`
      SELECT ir.id FROM itens_roteiro ir
      JOIN dias_roteiro dr ON ir.dia_id = dr.id
      JOIN roteiros r ON dr.roteiro_id = r.id
      WHERE ir.id = ? AND r.usuario_id = ?
    `, [req.params.itemId, req.usuario.id]);
    if (!item) return res.status(404).json({ error: 'Item não encontrado.' });

    const { nota, concluido, horario, custo_medio, ordem } = req.body;
    const fields = [];
    const vals = [];
    if (nota        !== undefined) { fields.push('nota = ?');        vals.push(nota); }
    if (concluido   !== undefined) { fields.push('concluido = ?');   vals.push(concluido ? 1 : 0); }
    if (horario     !== undefined) { fields.push('horario = ?');     vals.push(horario); }
    if (custo_medio !== undefined) { fields.push('custo_medio = ?'); vals.push(custo_medio); }
    if (ordem       !== undefined) { fields.push('ordem = ?');       vals.push(ordem); }
    if (!fields.length) return res.status(400).json({ error: 'Nenhum campo para atualizar.' });

    vals.push(req.params.itemId);
    await query(`UPDATE itens_roteiro SET ${fields.join(', ')} WHERE id = ?`, vals);
    return res.json({ message: 'Item atualizado com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar item.' });
  }
});

// ── CT-34: Adicionar item manual a um dia ─────────────────────────────────────
router.post('/dias/:diaId/itens', async (req, res) => {
  try {
    const [dia] = await query(`
      SELECT dr.id FROM dias_roteiro dr
      JOIN roteiros r ON dr.roteiro_id = r.id
      WHERE dr.id = ? AND r.usuario_id = ?
    `, [req.params.diaId, req.usuario.id]);
    if (!dia) return res.status(404).json({ error: 'Dia não encontrado.' });

    const { local_id, nome_manual, horario, nota } = req.body;
    if (!local_id && !nome_manual)
      return res.status(400).json({ error: 'Informe local_id ou nome_manual.' });

    const [ordemRow] = await query(
      'SELECT COALESCE(MAX(ordem),0)+1 AS proxima FROM itens_roteiro WHERE dia_id = ?',
      [req.params.diaId]
    );
    const result = await query(
      'INSERT INTO itens_roteiro (dia_id, local_id, nome_manual, horario, ordem, nota) VALUES (?, ?, ?, ?, ?, ?)',
      [req.params.diaId, local_id || null, nome_manual || null, horario || '09:00', ordemRow.proxima || 1, nota || null]
    );
    return res.status(201).json({ message: 'Item adicionado.', id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao adicionar item.' });
  }
});

// ── CT-40: Limpar todos os itens de um dia ────────────────────────────────────
router.delete('/dias/:diaId/itens', async (req, res) => {
  try {
    const [dia] = await query(`
      SELECT dr.id FROM dias_roteiro dr
      JOIN roteiros r ON dr.roteiro_id = r.id
      WHERE dr.id = ? AND r.usuario_id = ?
    `, [req.params.diaId, req.usuario.id]);
    if (!dia) return res.status(404).json({ error: 'Dia não encontrado.' });

    await query('DELETE FROM itens_roteiro WHERE dia_id = ?', [req.params.diaId]);
    return res.json({ message: 'Dia limpo com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao limpar dia.' });
  }
});

// ── CT-50: Otimizar rota por proximidade (ordena por longitude) ───────────────
router.post('/dias/:diaId/otimizar', async (req, res) => {
  try {
    const [dia] = await query(`
      SELECT dr.id FROM dias_roteiro dr
      JOIN roteiros r ON dr.roteiro_id = r.id
      WHERE dr.id = ? AND r.usuario_id = ?
    `, [req.params.diaId, req.usuario.id]);
    if (!dia) return res.status(404).json({ error: 'Dia não encontrado.' });

    const itens = await query(`
      SELECT ir.id, l.longitude FROM itens_roteiro ir
      JOIN locais l ON ir.local_id = l.id
      WHERE ir.dia_id = ? ORDER BY l.longitude
    `, [req.params.diaId]);

    for (let i = 0; i < itens.length; i++) {
      await query('UPDATE itens_roteiro SET ordem = ? WHERE id = ?', [i, itens[i].id]);
    }
    return res.json({ message: 'Rota otimizada por proximidade.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao otimizar rota.' });
  }
});

// ── CT-48: Buscar locais por palavra-chave ────────────────────────────────────
router.get('/locais/buscar', async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) return res.json([]);
    const locais = await query(
      'SELECT l.*, r.nome AS regiao_nome FROM locais l JOIN regioes r ON l.regiao_id = r.id WHERE l.nome LIKE ? OR l.descricao LIKE ? OR l.categoria LIKE ? ORDER BY l.avaliacao DESC LIMIT 20',
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );
    return res.json(locais);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro na busca.' });
  }
});


// ── CT-61: Preços de voos via Skyscanner/RapidAPI (datas editáveis) ───────────
// GET /api/roteiros/:id/voos?origem=São+Paulo&data_ida=2026-07-01&data_volta=2026-07-10
router.get('/:id/voos', async (req, res) => {
  try {
    const roteiro = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const { origem = 'São Paulo', data_ida, data_volta } = req.query;
    const dataIda   = data_ida   || roteiro.data_inicio;
    const dataVolta = data_volta || roteiro.data_fim;

    // Usa POA como aeroporto hub do RS para o destino
    const destino = 'Porto Alegre';

    const voos = await buscarVoos({
      origem,
      destino,
      dataIda,
      dataVolta,
    });

    if (!voos) return res.json({ message: 'Serviço de voos indisponível no momento.', voos: [] });
    return res.json({ voos, origem, destino, data_ida: dataIda, data_volta: dataVolta });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar voos.' });
  }
});

// ── CT-61: Salvar voo escolhido ──────────────────────────────────────────────
// POST /api/roteiros/:id/voos/escolher
router.post('/:id/voos/escolher', async (req, res) => {
  try {
    const roteiro_id = req.params.id;
    // Valida que o roteiro pertence ao usuário
    const [roteiro] = await query(
      'SELECT id FROM roteiros WHERE id = ? AND usuario_id = ?',
      [roteiro_id, req.usuario.id]
    );
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const { origem, destino, data_ida, data_volta, companhia, preco, moeda, link_externo, payload_json } = req.body;
    if (!origem || !destino || !data_ida)
      return res.status(400).json({ error: 'origem, destino e data_ida são obrigatórios.' });

    // REPLACE: remove voo anterior e insere novo
    await query('DELETE FROM roteiro_voos WHERE roteiro_id = ?', [roteiro_id]);
    await query(
      `INSERT INTO roteiro_voos (roteiro_id, origem, destino, data_ida, data_volta, companhia, preco, moeda, link_externo, payload_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [roteiro_id, origem, destino, data_ida, data_volta || null, companhia || null, preco || null, moeda || 'BRL', link_externo || null, payload_json ? JSON.stringify(payload_json) : null]
    );

    const [voo] = await query('SELECT * FROM roteiro_voos WHERE roteiro_id = ? LIMIT 1', [roteiro_id]);
    return res.json({ message: 'Voo salvo.', voo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao salvar voo.' });
  }
});

// ── CT-61: Obter voo escolhido ───────────────────────────────────────────────
// GET /api/roteiros/:id/voo-escolhido
router.get('/:id/voo-escolhido', async (req, res) => {
  try {
    const [roteiro] = await query(
      'SELECT id FROM roteiros WHERE id = ? AND usuario_id = ?',
      [req.params.id, req.usuario.id]
    );
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    const [voo] = await query('SELECT * FROM roteiro_voos WHERE roteiro_id = ? LIMIT 1', [req.params.id]);
    return res.json({ voo: voo || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar voo escolhido.' });
  }
});

// ── CT-97: Km percorridos entre locais do roteiro via OpenRouteService ────────
// GET /api/roteiros/:id/km
router.get('/:id/km', async (req, res) => {
  try {
    const roteiro = await getRoteiroCompleto(req.params.id, req.usuario.id);
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    // Coleta todos os locais com coordenadas, em ordem de dia + ordem
    const pontos = [];
    for (const dia of roteiro.dias || []) {
      for (const item of dia.itens || []) {
        if (item.latitude && item.longitude) {
          pontos.push({
            nome: item.local_nome || item.nome_manual,
            dia: dia.numero_dia,
            latitude: item.latitude,
            longitude: item.longitude,
          });
        }
      }
    }

    if (pontos.length < 2) {
      return res.json({ km: 0, duracao_minutos: 0, pontos: pontos.length,
        message: 'São necessários pelo menos 2 locais com coordenadas para calcular a rota.' });
    }

    const resultado = await calcularDistanciaRota(pontos);
    if (!resultado) return res.json({ km: 0, duracao_minutos: 0, pontos: pontos.length,
      message: 'Serviço de rotas indisponível no momento.' });

    return res.json({ ...resultado, roteiro_titulo: roteiro.titulo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao calcular distância.' });
  }
});

module.exports = router;