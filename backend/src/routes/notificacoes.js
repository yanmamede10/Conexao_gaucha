const express = require('express');
const auth    = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();
router.use(auth);

// GET /api/notificacoes
router.get('/', async (req, res) => {
  try {
    const notificacoes = await query(
      'SELECT * FROM notificacoes WHERE usuario_id = ? ORDER BY criado_em DESC LIMIT 20',
      [req.usuario.id]
    );
    return res.json(notificacoes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar notificações.' });
  }
});

// PATCH /api/notificacoes/lidas — marca todas como lidas
router.patch('/lidas', async (req, res) => {
  try {
    await query(
      'UPDATE notificacoes SET lida = 1 WHERE usuario_id = ?',
      [req.usuario.id]
    );
    return res.json({ message: 'Notificações marcadas como lidas.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar notificações.' });
  }
});

module.exports = router;