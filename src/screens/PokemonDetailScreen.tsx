import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  StyleSheet,
  ScrollView,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { PokemonDetail } from "../types/pokemon";
import { getPokemonDetail } from "../services/pokeapi";

type Props = NativeStackScreenProps<RootStackParamList, "PokemonDetail">;

const PokemonDetailScreen = ({ route }: Props) => {
  const { pokemonName } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);

  const loadPokemonDetail = async () => {
    const data = await getPokemonDetail(pokemonName);
    setPokemon(data);
  };

  useEffect(() => {
    loadPokemonDetail();
  }, []);

  if (!pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text>Cargando detalle...</Text>
      </View>
    );
  }

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.number}>#{pokemon.id}</Text>

      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}

      <Text style={styles.name}>{pokemon.name}</Text>

      <Text style={styles.sectionTitle}>Tipos</Text>
      <View style={styles.row}>
        {pokemon.types.map((item) => (
          <View key={item.type.name} style={styles.badge}>
            <Text style={styles.badgeText}>{item.type.name}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Información</Text>
      <Text style={styles.text}>Peso: {pokemon.weight / 10} kg</Text>
      <Text style={styles.text}>Altura: {pokemon.height / 10} m</Text>

      <Text style={styles.sectionTitle}>Habilidades</Text>
      {pokemon.abilities.map((item) => (
        <Text key={item.ability.name} style={styles.text}>
          {item.ability.name}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Estadísticas base</Text>
      {pokemon.stats.map((item) => (
        <Text key={item.stat.name} style={styles.text}>
          {item.stat.name}: {item.base_stat}
        </Text>
      ))}
    </ScrollView>
  );
};

export default PokemonDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: 18,
    fontWeight: "600",
    color: "#777",
    textAlign: "right",
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    alignSelf: "center",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  badge: {
    backgroundColor: "#eeeeee",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    textTransform: "capitalize",
    color: "#333",
  },
  text: {
    fontSize: 16,
    textTransform: "capitalize",
    marginBottom: 4,
  },
});