import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navegation";
import { PokemonDetail } from "../types/pokemon";
import { getPokemonDetail } from "../services/pokeapi";

type Props = NativeStackScreenProps<RootStackParamList, "Compare">;

const STATS_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Atq. Esp.",
  "special-defense": "Def. Esp.",
  speed: "Velocidad",
};

const CompareScreen = ({}: Props) => {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [pokemonA, setPokemonA] = useState<PokemonDetail | null>(null);
  const [pokemonB, setPokemonB] = useState<PokemonDetail | null>(null);
  const [isLoadingA, setIsLoadingA] = useState(false);
  const [isLoadingB, setIsLoadingB] = useState(false);
  const [errorA, setErrorA] = useState<string | null>(null);
  const [errorB, setErrorB] = useState<string | null>(null);

  const loadPokemonA = async () => {
    if (!nameA.trim()) return;

    setIsLoadingA(true);
    setErrorA(null);
    setPokemonA(null);
    try {
      const data = await getPokemonDetail(nameA.trim().toLowerCase());
      setPokemonA(data);
    } catch {
      setErrorA("Pokémon no encontrado.");
    } finally {
      setIsLoadingA(false);
    }
  };

  const loadPokemonB = async () => {
    if (!nameB.trim()) return;

    setIsLoadingB(true);
    setErrorB(null);
    setPokemonB(null);
    try {
      const data = await getPokemonDetail(nameB.trim().toLowerCase());
      setPokemonB(data);
    } catch {
      setErrorB("Pokémon no encontrado.");
    } finally {
      setIsLoadingB(false);
    }
  };

  const getStatColor = (statA: number, statB: number, isA: boolean) => {
    if (isA) return statA >= statB ? "#4caf50" : "#e63946";
    return statB >= statA ? "#4caf50" : "#e63946";
  };

  const getImageUrl = (pokemon: PokemonDetail) =>
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  const renderPokemonColumn = (
    pokemon: PokemonDetail | null,
    isLoading: boolean,
    error: string | null,
    name: string,
    setName: (v: string) => void,
    onSearch: () => void,
    side: "A" | "B"
  ) => (
    <View style={styles.column}>
      <TextInput
        style={styles.input}
        placeholder={`Pokémon ${side}...`}
        value={name}
        onChangeText={setName}
        onSubmitEditing={onSearch}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>

      {isLoading && <ActivityIndicator style={styles.loader} color="#e63946" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {pokemon && (
        <View style={styles.pokemonInfo}>
          <Image
            source={{ uri: getImageUrl(pokemon) ?? undefined }}
            style={styles.image}
          />
          <Text style={styles.pokemonName}>{pokemon.name}</Text>
          <View style={styles.typesRow}>
            {pokemon.types.map((t) => (
              <View key={t.type.name} style={styles.typeBadge}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Comparador</Text>

      <View style={styles.columnsContainer}>
        {renderPokemonColumn(
          pokemonA, isLoadingA, errorA,
          nameA, setNameA, loadPokemonA, "A"
        )}
        <View style={styles.divider} />
        {renderPokemonColumn(
          pokemonB, isLoadingB, errorB,
          nameB, setNameB, loadPokemonB, "B"
        )}
      </View>

      {pokemonA && pokemonB && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas base</Text>

          {pokemonA.stats.map((statA) => {
            const statB = pokemonB.stats.find(
              (s) => s.stat.name === statA.stat.name
            );
            if (!statB) return null;

            const label = STATS_LABELS[statA.stat.name] || statA.stat.name;
            const maxVal = Math.max(statA.base_stat, statB.base_stat, 1);

            return (
              <View key={statA.stat.name} style={styles.statRow}>
                <Text style={styles.statLabel}>{label}</Text>

                <View style={styles.barsContainer}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${(statA.base_stat / maxVal) * 100}%`,
                          backgroundColor: getStatColor(
                            statA.base_stat, statB.base_stat, true
                          ),
                        },
                      ]}
                    />
                    <Text style={styles.statValue}>{statA.base_stat}</Text>
                  </View>

                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${(statB.base_stat / maxVal) * 100}%`,
                          backgroundColor: getStatColor(
                            statA.base_stat, statB.base_stat, false
                          ),
                        },
                      ]}
                    />
                    <Text style={styles.statValue}>{statB.base_stat}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default CompareScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  columnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#e63946",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  loader: {
    marginTop: 12,
  },
  errorText: {
    color: "#e63946",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  pokemonInfo: {
    alignItems: "center",
    marginTop: 8,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginTop: 6,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
    marginTop: 4,
  },
  typeBadge: {
    backgroundColor: "#eeeeee",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 11,
    textTransform: "capitalize",
    color: "#333",
  },
  statsContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
  },
  statRow: {
    marginBottom: 14,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  barsContainer: {
    gap: 4,
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bar: {
    height: 14,
    borderRadius: 7,
    minWidth: 4,
  },
  statValue: {
    fontSize: 13,
    color: "#444",
    fontWeight: "600",
    width: 30,
  },
});