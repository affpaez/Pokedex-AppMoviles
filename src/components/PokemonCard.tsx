import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { PokemonDetail } from "../types/pokemon";

interface PokemonCardProps {
  pokemon: PokemonDetail;
  isFavorite?: boolean;
  onPress?: () => void;
}

const PokemonCard = ({ pokemon, isFavorite = false, onPress }: PokemonCardProps) => {
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.number}>#{pokemon.id}</Text>

      {isFavorite && (
        <Text style={styles.favoriteIcon}>⭐</Text>
      )}

      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}

      <Text style={styles.name}>{pokemon.name}</Text>

      <View style={styles.typesContainer}>
        {pokemon.types.map((item) => (
          <View key={item.type.name} style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type.name}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default PokemonCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    margin: 8,
    width: "45%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  number: {
    alignSelf: "flex-end",
    color: "#777",
    fontWeight: "600",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginTop: 8,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
    gap: 6,
  },
  typeBadge: {
    backgroundColor: "#eeeeee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    textTransform: "capitalize",
    color: "#333",
  },
});