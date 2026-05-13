import React, { useEffect, useState } from "react";
import { Text, StyleSheet, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PokemonCard from "../components/PokemonCard";
import { PokemonDetail } from "../types/pokemon";
import { getPokemonList } from "../services/pokeapi";

const HomeScreen = () => {
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);

  const loadPokemon = async () => {
    const data = await getPokemonList(20);
    setPokemonList(data);
  };

  useEffect(() => {
    loadPokemon();
  }, []);

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>

      <FlatList
        data={pokemonList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
});
