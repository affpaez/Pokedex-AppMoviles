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

export interface PokemonAbility {
  ability: {
    name: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprite;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}