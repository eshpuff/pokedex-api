const BASE_URL = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

class PokeApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'PokeApiError';
    this.status = status;
  }
}

function mapPokemon(data) {
  return {
    pokeId: data.id,
    name: data.name,
    types: data.types.map((item) => item.type.name),
    height: data.height,
    weight: data.weight,
    sprite: data.sprites?.front_default || undefined,
    abilities: data.abilities.map((item) => item.ability.name),
  };
}

async function fetchPokemon(nameOrId) {
  const query = String(nameOrId ?? '').trim().toLowerCase();

  if (!query) {
    throw new PokeApiError('Informe o nome ou o ID do Pokémon', 400);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    throw new PokeApiError('PokéAPI indisponível no momento', 502);
  }

  if (response.status === 404) {
    throw new PokeApiError(`Pokémon "${query}" não encontrado na PokéAPI`, 404);
  }

  if (!response.ok) {
    throw new PokeApiError('Erro ao consultar a PokéAPI', 502);
  }

  const data = await response.json();
  return mapPokemon(data);
}

module.exports = { fetchPokemon, PokeApiError };