import { NavigationContainer } from "@react-navigation/native";

import { StatusBar } from "react-native";
import AppProvider from "src/components/AppProvider";
import DarkModeToggle from "src/components/dark-mode-toggle";
import { AppNavigator } from "src/navigation";

export default function App() {
  return (
    <NavigationContainer>
      <AppProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator />
        <DarkModeToggle />
      </AppProvider>
    </NavigationContainer>
  );
}
