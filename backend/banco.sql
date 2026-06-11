-- ============================================================
--  Conexão Gaúcha — Schema completo + Seed
--  Execute: mysql -u root -p < banco.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS conexao_gaucha
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE conexao_gaucha;

-- ── Usuários ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  senha_hash    VARCHAR(255) NOT NULL,
  criado_em     DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Regiões do RS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS regioes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  descricao  TEXT,
  imagem_url VARCHAR(500)
);

-- ── Roteiros ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roteiros (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id      INT NOT NULL,
  regiao_id       INT NOT NULL,
  titulo          VARCHAR(200) NOT NULL,
  data_inicio     DATE NOT NULL,
  data_fim        DATE NOT NULL,
  nivel_orcamento ENUM('economico','moderado','premium') DEFAULT 'moderado',
  custo_total     DECIMAL(10,2) DEFAULT 0,
  status          ENUM('planejamento','confirmado','em_andamento','concluido','cancelado') DEFAULT 'planejamento',
  criado_em       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (regiao_id)  REFERENCES regioes(id)
);

-- ── Preferências do roteiro ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS preferencias_roteiro (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  roteiro_id INT NOT NULL,
  tipo       VARCHAR(50) NOT NULL,
  FOREIGN KEY (roteiro_id) REFERENCES roteiros(id) ON DELETE CASCADE
);

-- ── Dias do roteiro ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dias_roteiro (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  roteiro_id INT NOT NULL,
  numero_dia INT NOT NULL,
  data       DATE NOT NULL,
  custo_dia  DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (roteiro_id) REFERENCES roteiros(id) ON DELETE CASCADE
);

-- ── Locais ────────────────────────────────────────────────────────────────────
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
);

-- ── Voos do roteiro (CT-61) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roteiro_voos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  roteiro_id    INT NOT NULL,
  origem        VARCHAR(100) NOT NULL,
  destino       VARCHAR(100) NOT NULL,
  data_ida      DATE NOT NULL,
  data_volta    DATE,
  companhia     VARCHAR(120),
  preco         DECIMAL(10,2),
  moeda         VARCHAR(10) DEFAULT 'BRL',
  link_externo  TEXT,
  payload_json  JSON,
  criado_em     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (roteiro_id) REFERENCES roteiros(id) ON DELETE CASCADE
);

-- ── Itens do roteiro ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS itens_roteiro (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  dia_id      INT NOT NULL,
  local_id    INT,
  nome_manual VARCHAR(200),
  horario     TIME,
  ordem       INT DEFAULT 0,
  nota        TEXT,
  concluido   TINYINT(1) DEFAULT 0,
  FOREIGN KEY (dia_id)   REFERENCES dias_roteiro(id) ON DELETE CASCADE,
  FOREIGN KEY (local_id) REFERENCES locais(id)
);

-- ============================================================
--  SEED — Regiões
-- ============================================================
INSERT IGNORE INTO regioes (nome, slug, descricao, imagem_url) VALUES
  ('Serra Gaúcha',          'serra-gaucha',    'Gramado, Canela, Bento Gonçalves e região serrana',         'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80'),
  ('Litoral Gaúcho',        'litoral-gaucho',  'Torres, Tramandaí, Capão da Canoa',                         'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'),
  ('Missões',               'missoes',         'São Miguel das Missões, Santo Ângelo',                      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80'),
  ('Campanha Gaúcha',       'campanha-gaucha', 'Bagé, Santana do Livramento, Dom Pedrito',                  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80'),
  ('Porto Alegre e Região', 'porto-alegre',    'Porto Alegre, Novo Hamburgo, São Leopoldo',                 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80'),
  ('Serra do Nordeste',     'serra-nordeste',  'Vacaria, Bom Jesus, São Francisco de Paula',                'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80'),
  ('Vale dos Vinhedos',     'vale-vinhedos',   'Garibaldi, Carlos Barbosa, Monte Belo do Sul',              'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80');

-- ============================================================
--  SEED — Locais (referencia regioes por slug via subquery)
-- ============================================================

-- Serra Gaúcha
INSERT IGNORE INTO locais (regiao_id, nome, cidade, descricao, latitude, longitude, custo_medio, avaliacao, duracao_estimada, categoria) VALUES
  ((SELECT id FROM regioes WHERE slug='serra-gaucha'), 'Parque do Caracol',  'Canela',          'Cachoeira de 131m em plena mata nativa. Trilhas e tirolesa.',         -29.3289, -50.8497, 38,  4.8, '3-4 horas', 'natureza'),
  ((SELECT id FROM regioes WHERE slug='serra-gaucha'), 'Rua Coberta',        'Gramado',         'Centro comercial com chocolates artesanais e produtos coloniais.',    -29.3794, -50.8751,  0,  4.5, '2-3 horas', 'cultura'),
  ((SELECT id FROM regioes WHERE slug='serra-gaucha'), 'Mundo a Vapor',      'Gramado',         'Museu interativo com miniaturas e trens a vapor.',                    -29.3801, -50.8734, 60,  4.7, '2-3 horas', 'cultura'),
  ((SELECT id FROM regioes WHERE slug='serra-gaucha'), 'Vale dos Vinhedos',  'Bento Gonçalves', 'Rota do vinho com degustação em vinícolas premiadas.',                -29.1563, -51.5318, 80,  4.9, '4-5 horas', 'gastronomia'),
  ((SELECT id FROM regioes WHERE slug='serra-gaucha'), 'Lago Negro',         'Gramado',         'Lago com pedalinhos rodeado de pinheiros e araucárias.',              -29.3766, -50.8689, 25,  4.6, '1-2 horas', 'natureza');

-- Litoral Gaúcho
INSERT IGNORE INTO locais (regiao_id, nome, cidade, descricao, latitude, longitude, custo_medio, avaliacao, duracao_estimada, categoria) VALUES
  ((SELECT id FROM regioes WHERE slug='litoral-gaucho'), 'Praia de Torres',   'Torres', 'Praias com falésias e pedras basálticas únicas no Brasil.',   -29.3351, -49.7262,  0, 4.6, '4-5 horas', 'natureza'),
  ((SELECT id FROM regioes WHERE slug='litoral-gaucho'), 'Parque da Guarita', 'Torres', 'Falésias e trilhas com vista panorâmica do oceano.',           -29.3508, -49.7191,  0, 4.7, '2-3 horas', 'natureza');

-- Missões
INSERT IGNORE INTO locais (regiao_id, nome, cidade, descricao, latitude, longitude, custo_medio, avaliacao, duracao_estimada, categoria) VALUES
  ((SELECT id FROM regioes WHERE slug='missoes'), 'Ruínas de São Miguel', 'São Miguel das Missões', 'Patrimônio Mundial da UNESCO. Ruínas jesuíticas do século XVII.', -28.5570, -54.6946, 20, 4.9, '3-4 horas', 'historia'),
  ((SELECT id FROM regioes WHERE slug='missoes'), 'Museu das Missões',    'São Miguel das Missões', 'Acervo de esculturas e peças das reduções jesuíticas.',           -28.5577, -54.6952, 10, 4.5, '1-2 horas', 'historia');

-- Porto Alegre
INSERT IGNORE INTO locais (regiao_id, nome, cidade, descricao, latitude, longitude, custo_medio, avaliacao, duracao_estimada, categoria) VALUES
  ((SELECT id FROM regioes WHERE slug='porto-alegre'), 'Mercado Público',    'Porto Alegre', 'Mercado histórico com gastronomia típica gaúcha e artesanato.',         -30.0277, -51.2287,  0, 4.4, '2-3 horas', 'gastronomia'),
  ((SELECT id FROM regioes WHERE slug='porto-alegre'), 'Parque Farroupilha', 'Porto Alegre', 'O maior parque urbano da cidade, ideal para passeios e piqueniques.',   -30.0384, -51.2139,  0, 4.6, '2-3 horas', 'natureza');

-- Vale dos Vinhedos
INSERT IGNORE INTO locais (regiao_id, nome, cidade, descricao, latitude, longitude, custo_medio, avaliacao, duracao_estimada, categoria) VALUES
  ((SELECT id FROM regioes WHERE slug='vale-vinhedos'), 'Vinícola Miolo',   'Bento Gonçalves', 'Uma das mais premiadas vinícolas do Brasil, com tour e degustação.',       -29.1721, -51.5604, 60, 4.8, '2-3 horas', 'gastronomia'),
  ((SELECT id FROM regioes WHERE slug='vale-vinhedos'), 'Linha Leopoldina', 'Garibaldi',       'Estrada rural com vinhedos centenários e arquitetura colonial italiana.',   -29.2498, -51.5318,  0, 4.5, '2-3 horas', 'cultura');
