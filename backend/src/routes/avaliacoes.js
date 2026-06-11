const express = require('express');
const auth    = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();
router.use(auth);

// GET /api/avaliacoes — lista todas as avaliações do usuário
router.get('/', async (req, res) => {
  try {
    const avaliacoes = await query(`
      SELECT a.id, a.estrelas, a.comentario, a.criado_em, a.atualizado_em,
             r.id AS roteiro_id, r.titulo, r.data_inicio, r.data_fim,
             rg.nome AS regiao_nome, rg.slug AS regiao_slug
      FROM avaliacoes a
      JOIN roteiros r  ON a.roteiro_id = r.id
      JOIN regioes rg  ON r.regiao_id  = rg.id
      WHERE a.usuario_id = ?
      ORDER BY a.atualizado_em DESC
    `, [req.usuario.id]);
    return res.json(avaliacoes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
});

// GET /api/avaliacoes/pendentes — roteiros sem avaliação
router.get('/pendentes', async (req, res) => {
  try {
    const pendentes = await query(`
      SELECT r.id, r.titulo, r.data_inicio, r.data_fim,
             rg.nome AS regiao_nome, rg.slug AS regiao_slug
      FROM roteiros r
      JOIN regioes rg ON r.regiao_id = rg.id
      WHERE r.usuario_id = ?
        AND r.id NOT IN (
          SELECT roteiro_id FROM avaliacoes WHERE usuario_id = ?
        )
      ORDER BY r.criado_em DESC
    `, [req.usuario.id, req.usuario.id]);
    return res.json(pendentes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar roteiros pendentes.' });
  }
});

// POST /api/avaliacoes — criar ou atualizar avaliação
router.post('/', async (req, res) => {
  try {
    const { roteiro_id, estrelas, comentario } = req.body;
    if (!roteiro_id || !estrelas) return res.status(400).json({ error: 'roteiro_id e estrelas são obrigatórios.' });
    if (estrelas < 1 || estrelas > 5) return res.status(400).json({ error: 'Estrelas deve ser entre 1 e 5.' });

    const [roteiro] = await query(
      'SELECT id FROM roteiros WHERE id = ? AND usuario_id = ?',
      [roteiro_id, req.usuario.id]
    );
    if (!roteiro) return res.status(404).json({ error: 'Roteiro não encontrado.' });

    await query(`
      INSERT INTO avaliacoes (usuario_id, roteiro_id, estrelas, comentario)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE estrelas = VALUES(estrelas), comentario = VALUES(comentario), atualizado_em = NOW()
    `, [req.usuario.id, roteiro_id, estrelas, comentario || null]);

    return res.json({ message: 'Avaliação salva com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao salvar avaliação.' });
  }
});

// DELETE /api/avaliacoes/:roteiro_id — remover avaliação
router.delete('/:roteiro_id', async (req, res) => {
  try {
    await query(
      'DELETE FROM avaliacoes WHERE usuario_id = ? AND roteiro_id = ?',
      [req.usuario.id, req.params.roteiro_id]
    );
    return res.json({ message: 'Avaliação removida.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao remover avaliação.' });
  }
});

module.exports = router;
