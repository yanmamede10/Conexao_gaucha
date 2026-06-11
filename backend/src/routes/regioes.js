const express = require('express');
const { query } = require('../database/db');

const router = express.Router();

// GET /api/regioes — lista todas as regiões
router.get('/', async (req, res) => {
  try {
    const regioes = await query('SELECT * FROM regioes ORDER BY nome');
    return res.json(regioes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar regiões.' });
  }
});

// GET /api/regioes/:slug/locais — locais de uma região com filtros opcionais
router.get('/:slug/locais', async (req, res) => {
  try {
    const { slug } = req.params;
    const { categoria, orcamento } = req.query;

    const [regiao] = await query('SELECT * FROM regioes WHERE slug = ?', [slug]);
    if (!regiao) return res.status(404).json({ error: 'Região não encontrada.' });

    let sql = 'SELECT * FROM locais WHERE regiao_id = ?';
    const params = [regiao.id];

    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }

    if (orcamento === 'economico') {
      sql += ' AND custo_medio <= 30';
    } else if (orcamento === 'moderado') {
      sql += ' AND custo_medio <= 100';
    }
    // premium = sem filtro de custo

    sql += ' ORDER BY avaliacao DESC';

    const locais = await query(sql, params);
    return res.json({ regiao, locais });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar locais.' });
  }
});
// GET /api/regioes/populares — top 5 locais por época do ano
router.get('/populares', async (req, res) => {
  try {
    const mes = new Date().getMonth() + 1;

    // Verão: dez-fev → litoral | Outono: mar-mai → missões e campanha
    // Inverno: jun-ago → serra e nordeste | Primavera: set-nov → vinhedos e porto alegre
    let categoriasPref = [];
    let slugsPref = [];

    if (mes >= 12 || mes <= 2) {
      // Verão
      slugsPref = ['litoral-gaucho', 'campanha-gaucha'];
      categoriasPref = ['natureza', 'aventura'];
    } else if (mes >= 3 && mes <= 5) {
      // Outono
      slugsPref = ['missoes', 'vale-vinhedos'];
      categoriasPref = ['historia', 'gastronomia', 'cultura'];
    } else if (mes >= 6 && mes <= 8) {
      // Inverno
      slugsPref = ['serra-gaucha', 'serra-nordeste'];
      categoriasPref = ['natureza', 'aventura', 'cultura'];
    } else {
      // Primavera
      slugsPref = ['vale-vinhedos', 'porto-alegre'];
      categoriasPref = ['gastronomia', 'cultura', 'natureza'];
    }

    const placeholders = slugsPref.map(() => '?').join(',');
    const catPlaceholders = categoriasPref.map(() => '?').join(',');

    const locais = await query(`
      SELECT l.*, r.nome AS regiao_nome, r.slug AS regiao_slug, r.imagem_url AS regiao_imagem
      FROM locais l
      JOIN regioes r ON l.regiao_id = r.id
      WHERE r.slug IN (${placeholders})
        AND l.categoria IN (${catPlaceholders})
      ORDER BY l.avaliacao DESC
      LIMIT 5
    `, [...slugsPref, ...categoriasPref]);

    return res.json(locais);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar locais populares.' });
  }
});

module.exports = router;
