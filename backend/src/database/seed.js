require('dotenv').config();
const { query, initTables } = require('./db');

async function seed() {
  await initTables();

  const regioes = [
    ['Serra Gaúcha',          'serra-gaucha',    'Gramado, Canela, Bento Gonçalves e região serrana',          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80'],
    ['Litoral Gaúcho',        'litoral-gaucho',  'Torres, Tramandaí, Capão da Canoa',                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'],
    ['Missões',               'missoes',         'São Miguel das Missões, Santo Ângelo',                       'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80'],
    ['Campanha Gaúcha',       'campanha-gaucha', 'Bagé, Santana do Livramento, Dom Pedrito',                   'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80'],
    ['Porto Alegre e Região', 'porto-alegre',    'Porto Alegre, Novo Hamburgo, São Leopoldo',                  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80'],
    ['Serra do Nordeste',     'serra-nordeste',  'Vacaria, Bom Jesus, São Francisco de Paula',                 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80'],
    ['Vale dos Vinhedos',     'vale-vinhedos',   'Garibaldi, Carlos Barbosa, Monte Belo do Sul',               'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80'],
  ];

  for (const [nome, slug, descricao, imagem_url] of regioes) {
    await query(
      'INSERT INTO regioes (nome, slug, descricao, imagem_url) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE descricao=VALUES(descricao), imagem_url=VALUES(imagem_url)',
      [nome, slug, descricao, imagem_url]
    );
  }

  const regsRows = await query('SELECT id, slug FROM regioes');
  const regId = {};
  for (const r of regsRows) regId[r.slug] = r.id;

  const locais = [
    // ── Serra Gaúcha ──────────────────────────────────────────────────────────
    [regId['serra-gaucha'], 'Parque do Caracol',       'Canela',           'Cachoeira de 131m em plena mata nativa. Trilhas, tirolesa e mirante.',         -29.3289, -50.8497, 38,  4.8, '3-4 horas',  'natureza'],
    [regId['serra-gaucha'], 'Rua Coberta',             'Gramado',          'Centro comercial com chocolates artesanais e produtos coloniais.',              -29.3794, -50.8751, 30,  4.5, '2-3 horas',  'cultura'],
    [regId['serra-gaucha'], 'Mundo a Vapor',           'Gramado',          'Museu interativo com miniaturas e trens a vapor.',                              -29.3801, -50.8734, 60,  4.7, '2-3 horas',  'cultura'],
    [regId['serra-gaucha'], 'Vale dos Vinhedos',       'Bento Gonçalves',  'Rota do vinho com degustação em vinícolas premiadas.',                          -29.1563, -51.5318, 80,  4.9, '4-5 horas',  'gastronomia'],
    [regId['serra-gaucha'], 'Lago Negro',              'Gramado',          'Lago com pedalinhos rodeado de pinheiros e araucárias.',                        -29.3766, -50.8689, 25,  4.6, '1-2 horas',  'natureza'],
    [regId['serra-gaucha'], 'Mini Mundo',              'Gramado',          'Parque temático com réplicas em miniatura de monumentos mundiais.',             -29.3712, -50.8698, 55,  4.7, '2-3 horas',  'cultura'],
    [regId['serra-gaucha'], 'Snowland',                'Gramado',          'Primeiro parque de neve indoor das Américas.',                                  -29.3650, -50.8720, 120, 4.8, '3-4 horas',  'aventura'],
    [regId['serra-gaucha'], 'Alpen Park',              'Canela',           'Parque de aventura com tirolesa, arvorismo e rapel.',                           -29.3601, -50.8512, 90,  4.6, '3-4 horas',  'aventura'],

    // ── Litoral Gaúcho ────────────────────────────────────────────────────────
    [regId['litoral-gaucho'], 'Praia de Torres',       'Torres',           'Praias com falésias e pedras basálticas únicas no Brasil.',                    -29.3351, -49.7262, 20,  4.6, '4-5 horas',  'natureza'],
    [regId['litoral-gaucho'], 'Parque da Guarita',     'Torres',           'Falésias e trilhas com vista panorâmica do oceano.',                            -29.3508, -49.7191, 15,  4.7, '2-3 horas',  'natureza'],
    [regId['litoral-gaucho'], 'Praia de Tramandaí',    'Tramandaí',        'Praia movimentada com infraestrutura completa e águas calmas.',                 -29.9847, -50.1317, 10,  4.3, '4-5 horas',  'natureza'],
    [regId['litoral-gaucho'], 'Lagoa dos Quadros',     'Capão da Canoa',   'Lagoa ideal para esportes náuticos como kitesurf e windsurf.',                  -29.7612, -50.0198, 45,  4.5, '3-4 horas',  'aventura'],
    [regId['litoral-gaucho'], 'Farol de Torres',       'Torres',           'Farol histórico com vista privilegiada do litoral gaúcho.',                     -29.3389, -49.7281, 10,  4.4, '1-2 horas',  'historia'],
    [regId['litoral-gaucho'], 'Parque Estadual de Itapeva', 'Torres',      'Área de preservação com dunas, lagoas e fauna nativa.',                         -29.3700, -49.8100, 20,  4.6, '2-3 horas',  'natureza'],

    // ── Missões ───────────────────────────────────────────────────────────────
    [regId['missoes'], 'Ruínas de São Miguel',         'São Miguel das Missões', 'Patrimônio Mundial da UNESCO. Ruínas jesuíticas do século XVII.',          -28.5570, -54.6946, 20,  4.9, '3-4 horas',  'historia'],
    [regId['missoes'], 'Museu das Missões',            'São Miguel das Missões', 'Acervo de esculturas e peças das reduções jesuíticas.',                    -28.5577, -54.6952, 10,  4.5, '1-2 horas',  'historia'],
    [regId['missoes'], 'Espetáculo Som e Luz',         'São Miguel das Missões', 'Show noturno nas ruínas com projeções e narração histórica.',              -28.5570, -54.6946, 35,  4.8, '1-2 horas',  'cultura'],
    [regId['missoes'], 'Sítio Arqueológico de São João', 'Entre-Ijuís',    'Ruínas de redução jesuítica com museu a céu aberto.',                           -28.3800, -54.2600, 15,  4.4, '2-3 horas',  'historia'],
    [regId['missoes'], 'Catedral de Santo Ângelo',     'Santo Ângelo',     'Réplica da Igreja de São Miguel, símbolo da cultura missioneira.',              -28.2994, -54.2631, 0,   4.5, '1-2 horas',  'religioso'],
    [regId['missoes'], 'Museu Municipal de Santo Ângelo', 'Santo Ângelo',  'Acervo histórico sobre a cultura guarani e jesuítica da região.',               -28.2990, -54.2620, 10,  4.3, '1-2 horas',  'historia'],

    // ── Campanha Gaúcha ───────────────────────────────────────────────────────
    [regId['campanha-gaucha'], 'Fronteira Seca',       'Santana do Livramento', 'Fronteira única onde Brasil e Uruguai dividem a mesma praça.',             -30.8906, -55.5328, 0,   4.7, '2-3 horas',  'cultura'],
    [regId['campanha-gaucha'], 'Vinícola Almadén',     'Santana do Livramento', 'Uma das maiores vinícolas do Brasil com tour e degustação.',               -30.8800, -55.5200, 50,  4.6, '2-3 horas',  'gastronomia'],
    [regId['campanha-gaucha'], 'Parque Estadual do Espinilho', 'Barra do Quaraí', 'Único parque do Brasil com vegetação de espinilho e fauna pampeana.',    -30.2100, -57.5400, 15,  4.8, '3-4 horas',  'natureza'],
    [regId['campanha-gaucha'], 'Museu Dom Diogo de Souza', 'Bagé',         'Museu histórico com acervo sobre as guerras e cultura gaúcha.',                 -31.3289, -54.1069, 10,  4.3, '1-2 horas',  'historia'],
    [regId['campanha-gaucha'], 'Rota do Charque',      'Pelotas',          'Roteiro gastronômico com o tradicional charque e doces pelotenses.',            -31.7654, -52.3376, 40,  4.5, '2-3 horas',  'gastronomia'],
    [regId['campanha-gaucha'], 'Lagoa Mirim',          'Santa Vitória do Palmar', 'Segunda maior lagoa do Brasil, ideal para pesca e observação de aves.',  -33.0800, -52.8500, 20,  4.4, '3-4 horas',  'natureza'],

    // ── Porto Alegre e Região ─────────────────────────────────────────────────
    [regId['porto-alegre'], 'Mercado Público',         'Porto Alegre',     'Mercado histórico com gastronomia típica gaúcha e artesanato.',                 -30.0277, -51.2287, 35,  4.4, '2-3 horas',  'gastronomia'],
    [regId['porto-alegre'], 'Parque Farroupilha',      'Porto Alegre',     'O maior parque urbano da cidade, ideal para passeios e piqueniques.',           -30.0384, -51.2139, 0,   4.6, '2-3 horas',  'natureza'],
    [regId['porto-alegre'], 'Fundação Iberê Camargo',  'Porto Alegre',     'Museu de arte contemporânea com arquitetura premiada de Álvaro Siza.',          -30.0534, -51.2378, 30,  4.7, '2-3 horas',  'cultura'],
    [regId['porto-alegre'], 'Usina do Gasômetro',      'Porto Alegre',     'Centro cultural às margens do Guaíba com exposições e pôr do sol.',            -30.0317, -51.2378, 0,   4.5, '1-2 horas',  'cultura'],
    [regId['porto-alegre'], 'Parque Histórico do Rodeio', 'Novo Hamburgo', 'Parque temático sobre a cultura gaúcha com rodeios e shows.',                  -29.6783, -51.1306, 40,  4.4, '3-4 horas',  'cultura'],
    [regId['porto-alegre'], 'Casa de Cultura Mario Quintana', 'Porto Alegre', 'Centro cultural no antigo Hotel Majestic com exposições e café.',           -30.0289, -51.2289, 15,  4.6, '1-2 horas',  'cultura'],

    // ── Serra do Nordeste ─────────────────────────────────────────────────────
    [regId['serra-nordeste'], 'Parque Nacional Aparados da Serra', 'Cambará do Sul', 'Cânion Itaimbezinho com 720m de profundidade e trilhas incríveis.',   -29.2300, -50.0800, 30,  4.9, '4-5 horas',  'natureza'],
    [regId['serra-nordeste'], 'Cânion Fortaleza',      'Cambará do Sul',   'Segundo maior cânion do Brasil com vista panorâmica deslumbrante.',             -29.1200, -50.0600, 30,  4.8, '3-4 horas',  'natureza'],
    [regId['serra-nordeste'], 'Cascata do Avencal',    'Urubici',          'Cachoeira de 100m em meio à Mata Atlântica serrana.',                           -28.0100, -49.5900, 20,  4.6, '2-3 horas',  'natureza'],
    [regId['serra-nordeste'], 'Fazenda Pinheiro Torto', 'Bom Jesus',       'Fazenda histórica com cavalgadas e culinária típica da serra.',                 -28.6700, -50.4300, 80,  4.5, '4-5 horas',  'aventura'],
    [regId['serra-nordeste'], 'Museu do Pinheiro',     'São Francisco de Paula', 'Museu dedicado à araucária e à cultura serrana gaúcha.',                  -29.4500, -50.5800, 10,  4.3, '1-2 horas',  'cultura'],
    [regId['serra-nordeste'], 'Rota dos Tropeiros',    'Vacaria',          'Roteiro histórico pelos caminhos dos tropeiros com paisagens campestres.',      -28.5120, -50.9340, 25,  4.4, '3-4 horas',  'historia'],

    // ── Vale dos Vinhedos ─────────────────────────────────────────────────────
    [regId['vale-vinhedos'], 'Vinícola Miolo',         'Bento Gonçalves',  'Uma das mais premiadas vinícolas do Brasil, com tour e degustação.',            -29.1721, -51.5604, 60,  4.8, '2-3 horas',  'gastronomia'],
    [regId['vale-vinhedos'], 'Linha Leopoldina',       'Garibaldi',        'Estrada rural com vinhedos centenários e arquitetura colonial italiana.',        -29.2498, -51.5318, 30,  4.5, '2-3 horas',  'cultura'],
    [regId['vale-vinhedos'], 'Cave Geisse',            'Pinto Bandeira',   'Espumantes premiados mundialmente produzidos em cave histórica.',               -29.0800, -51.4900, 55,  4.9, '2-3 horas',  'gastronomia'],
    [regId['vale-vinhedos'], 'Maria Fumaça',           'Bento Gonçalves',  'Passeio de trem histórico pelos vinhedos com degustação a bordo.',              -29.1700, -51.5200, 90,  4.8, '3-4 horas',  'cultura'],
    [regId['vale-vinhedos'], 'Caminhos de Pedra',      'Bento Gonçalves',  'Roteiro de arquitetura italiana com casas centenárias e gastronomia.',          -29.1300, -51.4800, 20,  4.7, '2-3 horas',  'historia'],
    [regId['vale-vinhedos'], 'Vinícola Don Laurindo',  'Monte Belo do Sul', 'Vinícola familiar com produção artesanal e vista privilegiada dos vinhedos.',  -29.1500, -51.6100, 45,  4.6, '1-2 horas',  'gastronomia'],
  ];

  for (const l of locais) {
    await query(`
      INSERT INTO locais
        (regiao_id, nome, cidade, descricao, latitude, longitude, custo_medio, avaliacao, duracao_estimada, categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, l);
  }

  console.log('✅ Seed concluído! Regiões e locais inseridos.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
