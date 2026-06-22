const fetch = require('node-fetch');

const RAPID_KEY = process.env.RAPIDAPI_KEY;
const RAPID_HOST = 'skyscanner-flights-travel-api.p.rapidapi.com';
const BASE = `https://${RAPID_HOST}`;

const HEADERS = () => ({
  'x-rapidapi-key': RAPID_KEY,
  'x-rapidapi-host': RAPID_HOST,
});

// Resolve uma cidade/aeroporto para os códigos skyId + entityId que a API exige.
// Prioriza resultado do tipo CITY; se não houver, usa o primeiro disponível.
async function resolverLocal(termo) {
  const url = `${BASE}/flights/searchAirport?market=BR&locale=pt-BR&query=${encodeURIComponent(termo)}`;
  const res = await fetch(url, { headers: HEADERS() });
  if (!res.ok) throw new Error(`searchAirport HTTP ${res.status}`);
  const data = await res.json();
  const places = data?.places || [];
  if (!places.length) return null;
  const cidade = places.find(p => p.placeType === 'CITY') || places[0];
  return { skyId: cidade.skyId, entityId: cidade.entityId, nome: cidade.name };
}

// CT-61: Buscar preços de voos via Skyscanner Flights & Travel API (RapidAPI)
async function buscarVoos({ origem, destino, dataIda, dataVolta }) {
  if (!RAPID_KEY) {
    console.warn('[Skyscanner] RAPIDAPI_KEY não configurada');
    return null;
  }

  try {
    // 1. Resolve origem e destino em paralelo
    const [orig, dest] = await Promise.all([
      resolverLocal(origem),
      resolverLocal(destino),
    ]);
    if (!orig || !dest) {
      console.warn('[Skyscanner] Origem ou destino não encontrados');
      return null;
    }

    // 2. Monta a query de busca de voos
    const params = new URLSearchParams({
      originSkyId: orig.skyId,
      destinationSkyId: dest.skyId,
      originEntityId: orig.entityId,
      destinationEntityId: dest.entityId,
      date: dataIda,
      adults: '1',
      currency: 'BRL',
      market: 'BR',
      countryCode: 'BR',
      cabinClass: 'economy',
    });
    if (dataVolta) params.set('returnDate', dataVolta);

    const res = await fetch(`${BASE}/flights/searchFlights?${params.toString()}`, {
      headers: HEADERS(),
    });
    if (!res.ok) {
      console.error('[Skyscanner] searchFlights HTTP', res.status);
      return null;
    }

    const data = await res.json();
    const itineraries = data?.itineraries || [];
    if (!itineraries.length) return null;

    // 3. Formata as 3 melhores opções (a API já devolve ordenado por preço/score)
    return itineraries.slice(0, 3).map((it) => {
      const ida = it.legs?.[0] || {};
      return {
        preco: it.price?.amount || 0,
        preco_formatado: it.price?.formatted || 'N/D',
        duracao_minutos: ida.durationMinutes || 0,
        paradas: ida.stopCount || 0,
        companhia: ida.carriers?.[0]?.name || 'N/D',
        logo: ida.carriers?.[0]?.logoUrl || null,
        partida: ida.departure || null,
        chegada: ida.arrival || null,
        link_reserva: it.bookingUrl || `https://www.skyscanner.com.br/transporte/passagens-aereas/`,
      };
    });
  } catch (err) {
    console.error('[Skyscanner] Erro:', err.message);
    return null;
  }
}

module.exports = { buscarVoos };