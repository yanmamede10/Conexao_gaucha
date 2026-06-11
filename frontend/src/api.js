const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api`;

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

export const api = {
  // ── Auth ─────────────────────────────────────────────────────────────────
  login: (email, senha) =>
    fetch(`${BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, senha }) }).then(r => r.json()),

  register: (nome_completo, email, senha) =>
    fetch(`${BASE}/auth/register`, { method: 'POST', headers: headers(), body: JSON.stringify({ nome_completo, email, senha }) }).then(r => r.json()),

  recuperarSenha: (email) =>
    fetch(`${BASE}/auth/recuperar-senha`, { method: 'POST', headers: headers(), body: JSON.stringify({ email }) }).then(r => r.json()),

  // ── Regiões ───────────────────────────────────────────────────────────────
  getRegioes: (token) =>
    fetch(`${BASE}/regioes`, { headers: headers(token) }).then(r => r.json()),

  // ── Roteiros ──────────────────────────────────────────────────────────────
  criarRoteiro: (token, dados) =>
    fetch(`${BASE}/roteiros`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  getRoteiros: (token) =>
    fetch(`${BASE}/roteiros`, { headers: headers(token) }).then(r => r.json()),

  getRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}`, { headers: headers(token) }).then(r => r.json()),

  deletarRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  clonarRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/clonar`, { method: 'POST', headers: headers(token) }).then(r => r.json()),

  // ── Custo / Export / Share ────────────────────────────────────────────────
  getCustoRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/custo`, { headers: headers(token) }).then(r => r.json()),

  exportarRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/export`, { headers: { Authorization: `Bearer ${token}` } }),

  compartilharRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/share`, { headers: headers(token) }).then(r => r.json()),

  // ── Km percorridos ────────────────────────────────────────────────────────
  getKmRoteiro: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/km`, { headers: headers(token) }).then(r => r.json()),

  // ── Voos ──────────────────────────────────────────────────────────────────
  getVoos: (token, id, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE}/roteiros/${id}/voos${qs ? '?' + qs : ''}`, { headers: headers(token) }).then(r => r.json());
  },

  escolherVoo: (token, id, dados) =>
    fetch(`${BASE}/roteiros/${id}/voos/escolher`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  getVooEscolhido: (token, id) =>
    fetch(`${BASE}/roteiros/${id}/voo-escolhido`, { headers: headers(token) }).then(r => r.json()),

  // ── Itens do roteiro ──────────────────────────────────────────────────────
  atualizarItem: (token, itemId, dados) =>
    fetch(`${BASE}/roteiros/itens/${itemId}`, { method: 'PUT', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  removerItem: (token, itemId) =>
    fetch(`${BASE}/roteiros/itens/${itemId}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  adicionarItem: (token, diaId, dados) =>
    fetch(`${BASE}/roteiros/dias/${diaId}/itens`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  limparDia: (token, diaId) =>
    fetch(`${BASE}/roteiros/dias/${diaId}/itens`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  otimizarDia: (token, diaId) =>
    fetch(`${BASE}/roteiros/dias/${diaId}/otimizar`, { method: 'POST', headers: headers(token) }).then(r => r.json()),

  // ── Busca de locais ───────────────────────────────────────────────────────
  buscarLocais: (token, q) =>
    fetch(`${BASE}/roteiros/locais/buscar?q=${encodeURIComponent(q)}`, { headers: headers(token) }).then(r => r.json()),

  // ── Perfil ────────────────────────────────────────────────────────────────
  getPerfil: (token) =>
    fetch(`${BASE}/perfil`, { headers: headers(token) }).then(r => r.json()),

  atualizarPerfil: (token, dados) =>
    fetch(`${BASE}/perfil`, { method: 'PUT', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  // ── Notificações ──────────────────────────────────────────────────────────
  getNotificacoes: (token) =>
    fetch(`${BASE}/notificacoes`, { headers: headers(token) }).then(r => r.json()),

  marcarNotificacoesLidas: (token) =>
    fetch(`${BASE}/notificacoes/lidas`, { method: 'PATCH', headers: headers(token) }).then(r => r.json()),

  // ── Favoritos ─────────────────────────────────────────────────────────────
  getFavoritos: (token) =>
    fetch(`${BASE}/favoritos`, { headers: headers(token) }).then(r => r.json()),

  getFavoritosIds: (token) =>
    fetch(`${BASE}/favoritos/ids`, { headers: headers(token) }).then(r => r.json()),

  favoritarRegiao: (token, regiao_id) =>
    fetch(`${BASE}/favoritos/${regiao_id}`, { method: 'POST', headers: headers(token) }).then(r => r.json()),

  desfavoritarRegiao: (token, regiao_id) =>
    fetch(`${BASE}/favoritos/${regiao_id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),

  // ── Avaliações ────────────────────────────────────────────────────────────
  getAvaliacoes: (token) =>
    fetch(`${BASE}/avaliacoes`, { headers: headers(token) }).then(r => r.json()),

  getAvaliacoesPendentes: (token) =>
    fetch(`${BASE}/avaliacoes/pendentes`, { headers: headers(token) }).then(r => r.json()),

  salvarAvaliacao: (token, dados) =>
    fetch(`${BASE}/avaliacoes`, { method: 'POST', headers: headers(token), body: JSON.stringify(dados) }).then(r => r.json()),

  deletarAvaliacao: (token, roteiro_id) =>
    fetch(`${BASE}/avaliacoes/${roteiro_id}`, { method: 'DELETE', headers: headers(token) }).then(r => r.json()),
};