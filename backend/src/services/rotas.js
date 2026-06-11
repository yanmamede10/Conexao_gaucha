const fetch = require('node-fetch');

const ORS_KEY = process.env.ORS_API_KEY;
const ORS_URL = 'https://api.openrouteservice.org/v2/directions/driving-car';

// CT-97: Calcular distância total (km) entre pontos do roteiro via OpenRouteService
// coords: array de { latitude, longitude }
async function calcularDistanciaRota(coords) {
  if (!ORS_KEY) {
    console.warn('[ORS] ORS_API_KEY não configurada');
    return null;
  }
  if (!coords || coords.length < 2) return { km: 0, duracao_minutos: 0, pontos: coords.length };

  try {
    // ORS espera [longitude, latitude]
    const coordinates = coords.map(c => [parseFloat(c.longitude), parseFloat(c.latitude)]);

    const res = await fetch(ORS_URL, {
      method: 'POST',
      headers: {
        'Authorization': ORS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordinates }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[ORS] Erro na resposta:', err);
      return null;
    }

    const data = await res.json();
    const summary = data?.routes?.[0]?.summary;
    if (!summary) return null;

    return {
      km: Math.round((summary.distance / 1000) * 10) / 10, // metros → km com 1 decimal
      duracao_minutos: Math.round(summary.duration / 60),   // segundos → minutos
      pontos: coords.length,
    };
  } catch (err) {
    console.error('[ORS] Erro:', err.message);
    return null;
  }
}

module.exports = { calcularDistanciaRota };
