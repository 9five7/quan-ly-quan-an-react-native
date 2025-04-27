import { NavigationContainer } from "@react-navigation/native";

import { StatusBar } from "react-native";
import DarkModeToggle from "src/components/dark-mode-toggle";
import { AppNavigator } from "src/navigation";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
      <DarkModeToggle />
    </NavigationContainer>
  );
}
