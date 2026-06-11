const fetch = require('node-fetch');

const RAPID_KEY = process.env.RAPIDAPI_KEY;
const RAPID_HOST = 'skyscanner50.p.rapidapi.com';

// CT-61: Buscar preços de voos via Skyscanner/RapidAPI
// Retorna opções de voo de uma cidade de origem para a região de destino
async function buscarVoos({ origem, destino, dataIda, dataVolta }) {
  if (!RAPID_KEY) {
    console.warn('[Skyscanner] RAPIDAPI_KEY não configurada');
    return null;
  }

  try {
    // 1. Buscar IATA code do aeroporto de origem
    const searchRes = await fetch(
      `https://${RAPID_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(origem)}&locale=pt-BR`,
      {
        headers: {
          'X-RapidAPI-Key': RAPID_KEY,
          'X-RapidAPI-Host': RAPID_HOST,
        },
      }
    );
    const searchData = await searchRes.json();
    const aeroportos = searchData?.data || [];
    if (!aeroportos.length) return null;
    const originId = aeroportos[0]?.skyId;
    const originEntityId = aeroportos[0]?.entityId;

    // 2. Buscar IATA code do destino (POA como hub do RS)
    const destRes = await fetch(
      `https://${RAPID_HOST}/api/v1/flights/searchAirport?query=${encodeURIComponent(destino)}&locale=pt-BR`,
      {
        headers: {
          'X-RapidAPI-Key': RAPID_KEY,
          'X-RapidAPI-Host': RAPID_HOST,
        },
      }
    );
    const destData = await destRes.json();
    const destAeroportos = destData?.data || [];
    if (!destAeroportos.length) return null;
    const destId = destAeroportos[0]?.skyId;
    const destEntityId = destAeroportos[0]?.entityId;

    // 3. Buscar voos
    const flightsRes = await fetch(
      `https://${RAPID_HOST}/api/v1/flights/searchFlights?` +
      new URLSearchParams({
        originSkyId: originId,
        destinationSkyId: destId,
        originEntityId,
        destinationEntityId: destEntityId,
        date: dataIda,
        returnDate: dataVolta || '',
        cabinClass: 'economy',
        adults: '1',
        currency: 'BRL',
        market: 'BR',
        countryCode: 'BR',
        locale: 'pt-BR',
      }),
      {
        headers: {
          'X-RapidAPI-Key': RAPID_KEY,
          'X-RapidAPI-Host': RAPID_HOST,
        },
      }
    );
    const flightsData = await flightsRes.json();
    const itineraries = flightsData?.data?.itineraries || [];

    // Retorna as 3 melhores opções formatadas
    return itineraries.slice(0, 3).map((it) => ({
      preco: it.price?.raw || 0,
      preco_formatado: it.price?.formatted || 'N/D',
      duracao_minutos: it.legs?.[0]?.durationInMinutes || 0,
      paradas: it.legs?.[0]?.stopCount || 0,
      companhia: it.legs?.[0]?.carriers?.marketing?.[0]?.name || 'N/D',
      logo: it.legs?.[0]?.carriers?.marketing?.[0]?.logoUrl || null,
      partida: it.legs?.[0]?.departure || null,
      chegada: it.legs?.[0]?.arrival || null,
      link_reserva: `https://www.skyscanner.com.br/transporte/passagens-aereas/${originId}/${destId}/${dataIda}/`,
    }));
  } catch (err) {
    console.error('[Skyscanner] Erro:', err.message);
    return null;
  }
}

module.exports = { buscarVoos };
