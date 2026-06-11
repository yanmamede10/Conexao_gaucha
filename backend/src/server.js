require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { initTables } = require('./database/db');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/regioes',  require('./routes/regioes'));
app.use('/api/roteiros', require('./routes/roteiros'));
app.use('/api/perfil',   require('./routes/perfil'));
app.use('/api/notificacoes', require('./routes/notificacoes'));
app.use('/api/favoritos',  require('./routes/favoritos'));
app.use('/api/avaliacoes', require('./routes/avaliacoes'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'Conexão Gaúcha' }));

// 404
app.use((_, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
initTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📋 Rotas disponíveis:`);
      console.log(`   POST /api/auth/register`);
      console.log(`   POST /api/auth/login`);
      console.log(`   GET  /api/regioes`);
      console.log(`   GET  /api/regioes/:slug/locais`);
      console.log(`   POST /api/roteiros`);
      console.log(`   GET  /api/roteiros`);
      console.log(`   GET  /api/roteiros/:id`);
      console.log(`   GET  /api/roteiros/:id/custo`);
      console.log(`   GET  /api/roteiros/:id/export`);
      console.log(`   GET  /api/roteiros/:id/share`);
      console.log(`   GET  /api/perfil`);
      console.log(`   PUT  /api/perfil`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no banco:', err.message);
    process.exit(1);
  });
