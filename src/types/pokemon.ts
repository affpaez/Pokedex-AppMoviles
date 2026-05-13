export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonSprite {
  front_default: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: PokemonSprite;
  types: PokemonType[];
}