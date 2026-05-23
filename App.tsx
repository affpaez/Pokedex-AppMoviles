import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./src/screens/HomeScreen";
import PokemonDetailScreen from "./src/screens/PokemonDetailScreen";
import CompareScreen from "./src/screens/CompareScreen";
import { RootStackParamList } from "./src/types/navegation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={{ title: "Detalle del Pokémon" }}
        />

        <Stack.Screen
          name="Compare"
          component={CompareScreen}
          options={{ title: "Comparador" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}