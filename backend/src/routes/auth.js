const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { query } = require('../database/db');
const { enviarBoasVindas, enviarRecuperacaoSenha } = require('../services/email');

const router = express.Router();

// RF-01 — Cadastrar usuário
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nome_completo, email, senha } = req.body;

    if (!nome_completo || !email || !senha)
      return res.status(400).json({ error: 'nome_completo, email e senha são obrigatórios.' });

    if (senha.length < 6)
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });

    const existing = await query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const senha_hash = await bcrypt.hash(senha, 10);
    const result = await query(
      'INSERT INTO usuarios (nome_completo, email, senha_hash) VALUES (?, ?, ?)',
      [nome_completo, email, senha_hash]
    );

    const [usuario] = await query(
      'SELECT id, nome_completo, email, criado_em FROM usuarios WHERE id = ?',
      [result.insertId]
    );

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome_completo: usuario.nome_completo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // CT-19: e-mail de boas-vindas (não bloqueia a resposta)
    enviarBoasVindas(usuario.email, usuario.nome_completo).catch(() => {});
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso.', token, usuario });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// RF-02 — Login
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha)
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });

    const [usuario] = await query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash)))
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome_completo: usuario.nome_completo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      usuario: { id: usuario.id, nome_completo: usuario.nome_completo, email: usuario.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// RF-02 — CT-09: Recuperar senha com e-mail real via Resend
router.post('/recuperar-senha', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-mail é obrigatório.' });

    const [usuario] = await query('SELECT id, nome_completo FROM usuarios WHERE email = ?', [email]);

    // Sempre retorna sucesso para não vazar info de cadastro (segurança)
    if (usuario) {
      // Gera token JWT de curta duração (1h) para recuperação
      const resetToken = jwt_node.sign(
        { id: usuario.id, tipo: 'reset_senha' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      // Envia e-mail real via Resend
      await enviarRecuperacaoSenha(email, usuario.nome_completo, resetToken);
    }

    return res.json({ message: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao processar recuperação de senha.' });
  }
});

module.exports = router;
