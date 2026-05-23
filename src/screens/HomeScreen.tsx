import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import PokemonCard from "../components/PokemonCard";
import { PokemonDetail } from "../types/pokemon";
import { getPokemonList, getPokemonTypes } from "../services/pokeapi";
import { getFavorites } from "../storage/favorites";
import { RootStackParamList } from "../types/navegation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPokemon = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPokemonList(30);
      setPokemonList(data);
    } catch {
      setError("No se pudo cargar la lista de Pokémon. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTypes = async () => {
    try {
      const data = await getPokemonTypes();
      setTypes(data);
    } catch {
      // Los filtros no cargan, pero no bloquea la app
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch {
      // Si no cargan favoritos, simplemente no se marcan
    }
  };

  useEffect(() => {
    loadPokemon();
    loadTypes();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const filteredPokemon = pokemonList.filter((pokemon) => {
    const matchesSearch = pokemon.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      selectedType === "" ||
      pokemon.types.some((type) => type.type.name === selectedType);

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={styles.loadingText}>Cargando Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPokemon}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Pokédex</Text>

        <TextInput
          style={styles.input}
          placeholder="Buscar Pokémon..."
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSelectedType("")}
          >
            <Text>Todos</Text>
          </TouchableOpacity>

          {types.map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.filterButton}
              onPress={() => setSelectedType(type)}
            >
              <Text style={{ textTransform: "capitalize" }}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredPokemon.length === 0 && (
          <Text style={styles.emptyText}>No se encontraron Pokémon.</Text>
        )}

        <FlatList
          data={filteredPokemon}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              isFavorite={favorites.includes(item.name)}
              onPress={() =>
                navigation.navigate("PokemonDetail", {
                  pokemonName: item.name,
                })
              }
            />
          )}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.compareButton}
              onPress={() => navigation.navigate("Compare")}
            >
              <Text style={styles.compareButtonText}>⚔️ Comparar Pokémon</Text>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 44,
  },
  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    alignSelf: "flex-start",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#e63946",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#e63946",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  compareButton: {
    backgroundColor: "#e63946",
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  compareButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});