import axios from "axios";
import { PokemonDetail, PokemonListItem } from "../types/pokemon";

const API_URL = "https://pokeapi.co/api/v2";

export const getPokemonList = async (
  limit: number = 20
): Promise<PokemonDetail[]> => {
  const response = await axios.get(`${API_URL}/pokemon?limit=${limit}`);

  const results: PokemonListItem[] = response.data.results;

  const pokemonDetails = await Promise.all(
    results.map(async (pokemon) => {
      const detailResponse = await axios.get<PokemonDetail>(pokemon.url);
      return detailResponse.data;
    })
  );

  return pokemonDetails;
};

export const getPokemonDetail = async (
  name: string
): Promise<PokemonDetail> => {
  const response = await axios.get<PokemonDetail>(
    `${API_URL}/pokemon/${name}`
  );

  return response.data;
};