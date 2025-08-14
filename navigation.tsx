import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SpaceXList from "./SpaceXList";
import DetailsScreen from "./DetailsScreen";
import { ErrorBoundary } from "./ErrorBoundary"; // <-- Add this import

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={SpaceXList}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
