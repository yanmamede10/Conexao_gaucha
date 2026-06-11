const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     process.env.DB_PORT     || 3306,
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'conexao_gaucha',
      waitForConnections: true,
      connectionLimit:    10,
    });
  }
  return pool;
}

async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

async function initTables() {
  const pool = getPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      nome_completo VARCHAR(150) NOT NULL,
      email         VARCHAR(150) NOT NULL UNIQUE,
      senha_hash    VARCHAR(255) NOT NULL,
      criado_em     DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS regioes (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      nome       VARCHAR(100) NOT NULL,
      slug       VARCHAR(100) NOT NULL UNIQUE,
      descricao  TEXT,
      imagem_url VARCHAR(500)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS roteiros (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id      INT NOT NULL,
      regiao_id       INT NOT NULL,
      titulo          VARCHAR(200) NOT NULL,
      data_inicio     DATE NOT NULL,
      data_fim        DATE NOT NULL,
      nivel_orcamento ENUM('economico','moderado','premium') DEFAULT 'moderado',
      custo_total     DECIMAL(10,2) DEFAULT 0,
      criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (regiao_id)  REFERENCES regioes(id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS preferencias_roteiro (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      roteiro_id INT NOT NULL,
      tipo       VARCHAR(50) NOT NULL,
      FOREIGN KEY (roteiro_id) REFERENCES roteiros(id) ON DELETE CASCADE
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS dias_roteiro (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      roteiro_id INT NOT NULL,
      numero_dia INT NOT NULL,
      data       DATE NOT NULL,
      custo_dia  DECIMAL(10,2) DEFAULT 0,
      FOREIGN KEY (roteiro_id) REFERENCES roteiros(id) ON DELETE CASCADE
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS locais (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      regiao_id        INT NOT NULL,
      nome             VARCHAR(150) NOT NULL,
      cidade           VARCHAR(100) NOT NULL,
      descricao        TEXT,
      latitude         DECIMAL(10,8),
      longitude        DECIMAL(11,8),
      custo_medio      DECIMAL(10,2) DEFAULT 0,
      avaliacao        FLOAT DEFAULT 0,
      duracao_estimada VARCHAR(50),
      imagem_url       VARCHAR(500),
      categoria        VARCHAR(50),
      FOREIGN KEY (regiao_id) REFERENCES regioes(id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS itens_roteiro (
      id       INT AUTO_INCREMENT PRIMARY KEY,
      dia_id   INT NOT NULL,
      local_id INT NOT NULL,
      horario  TIME,
      ordem    INT DEFAULT 0,
      FOREIGN KEY (dia_id)   REFERENCES dias_roteiro(id) ON DELETE CASCADE,
      FOREIGN KEY (local_id) REFERENCES locais(id)
    )
  `);
  await pool.execute(`
  CREATE TABLE IF NOT EXISTS notificacoes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo     VARCHAR(150) NOT NULL,
    mensagem   TEXT NOT NULL,
    lida       TINYINT(1) DEFAULT 0,
    criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await pool.execute(`
  CREATE TABLE IF NOT EXISTS regioes_favoritas (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    regiao_id  INT NOT NULL,
    criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_fav (usuario_id, regiao_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (regiao_id)  REFERENCES regioes(id)  ON DELETE CASCADE
  )
`);

await pool.execute(`
  CREATE TABLE IF NOT EXISTS avaliacoes (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    roteiro_id INT NOT NULL,
    estrelas   TINYINT NOT NULL CHECK (estrelas BETWEEN 1 AND 5),
    comentario TEXT,
    criado_em  DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_aval (usuario_id, roteiro_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (roteiro_id) REFERENCES roteiros(id) ON DELETE CASCADE
  ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
`);
  console.log('✅ Tabelas verificadas/criadas com sucesso.');
}

module.exports = { getPool, query, initTables };
