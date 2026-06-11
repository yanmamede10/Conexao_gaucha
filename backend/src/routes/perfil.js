const express = require('express');
const bcrypt  = require('bcryptjs');
const auth    = require('../middleware/auth');
const { query } = require('../database/db');

const router = express.Router();
router.use(auth);

// GET /api/perfil — dados do usuário + estatísticas
router.get('/', async (req, res) => {
  try {
    const [usuario] = await query(
      'SELECT id, nome_completo, email, criado_em FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const [[stats]] = [await query(`
      SELECT
        COUNT(*)                  AS total_roteiros,
        COUNT(DISTINCT regiao_id) AS total_regioes,
        COALESCE(SUM(custo_total), 0) AS total_estimado
      FROM roteiros WHERE usuario_id = ?
    `, [req.usuario.id])];

    return res.json({ ...usuario, stats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
});

// PUT /api/perfil — atualiza nome ou senha
router.put('/', async (req, res) => {
  try {
    const { nome_completo, senha_atual, nova_senha } = req.body;
    const updates = [];
    const params  = [];

    if (nome_completo) {
      updates.push('nome_completo = ?');
      params.push(nome_completo);
    }

    if (nova_senha) {
      if (!senha_atual)
        return res.status(400).json({ error: 'Informe a senha atual para alterá-la.' });

      const [usuario] = await query('SELECT senha_hash FROM usuarios WHERE id = ?', [req.usuario.id]);
      const ok = await bcrypt.compare(senha_atual, usuario.senha_hash);
      if (!ok) return res.status(401).json({ error: 'Senha atual incorreta.' });

      if (nova_senha.length < 6)
        return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });

      updates.push('senha_hash = ?');
      params.push(await bcrypt.hash(nova_senha, 10));
    }

    if (updates.length === 0)
      return res.status(400).json({ error: 'Nenhum campo para atualizar.' });

    params.push(req.usuario.id);
    await query(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`, params);

    return res.json({ message: 'Perfil atualizado com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
});

module.exports = router;
