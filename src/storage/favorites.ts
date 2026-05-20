import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorite_pokemon";

export const getFavorites = async (): Promise<string[]> => {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFavorites = async (favorites: string[]) => {
  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites)
  );
};

export const toggleFavorite = async (name: string) => {
  const favorites = await getFavorites();

  let updatedFavorites: string[];

  if (favorites.includes(name)) {
    updatedFavorites = favorites.filter(
      (favorite) => favorite !== name
    );
  } else {
    updatedFavorites = [...favorites, name];
  }

  await saveFavorites(updatedFavorites);

  return updatedFavorites;
};

export const isFavorite = async (name: string) => {
  const favorites = await getFavorites();
  return favorites.includes(name);
};