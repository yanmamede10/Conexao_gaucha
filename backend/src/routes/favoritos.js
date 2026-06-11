const express = require('express');
const auth    = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();
router.use(auth);

// GET /api/favoritos — lista regiões favoritas com contador de roteiros
router.get('/', async (req, res) => {
  try {
    const favoritos = await query(`
      SELECT r.id, r.nome, r.slug, r.descricao, r.imagem_url,
             COUNT(rot.id) AS total_roteiros
      FROM regioes_favoritas rf
      JOIN regioes r ON rf.regiao_id = r.id
      LEFT JOIN roteiros rot ON rot.regiao_id = r.id AND rot.usuario_id = ?
      WHERE rf.usuario_id = ?
      GROUP BY r.id
      ORDER BY r.nome
    `, [req.usuario.id, req.usuario.id]);
    return res.json(favoritos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar favoritos.' });
  }
});

// POST /api/favoritos/:regiao_id — favoritar região
router.post('/:regiao_id', async (req, res) => {
  try {
    await query(
      'INSERT IGNORE INTO regioes_favoritas (usuario_id, regiao_id) VALUES (?, ?)',
      [req.usuario.id, req.params.regiao_id]
    );
    return res.json({ message: 'Região favoritada.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao favoritar região.' });
  }
});

// DELETE /api/favoritos/:regiao_id — desfavoritar região
router.delete('/:regiao_id', async (req, res) => {
  try {
    await query(
      'DELETE FROM regioes_favoritas WHERE usuario_id = ? AND regiao_id = ?',
      [req.usuario.id, req.params.regiao_id]
    );
    return res.json({ message: 'Região removida dos favoritos.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao desfavoritar região.' });
  }
});

// GET /api/favoritos/ids — retorna só os IDs favoritados (para marcar na UI)
router.get('/ids', async (req, res) => {
  try {
    const rows = await query(
      'SELECT regiao_id FROM regioes_favoritas WHERE usuario_id = ?',
      [req.usuario.id]
    );
    return res.json(rows.map(r => r.regiao_id));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar IDs favoritos.' });
  }
});

module.exports = router;
