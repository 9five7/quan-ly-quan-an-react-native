import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StatusBar } from "react-native";
import DarkModeToggle from "src/components/dark-mode-toggle";
import { AuthProvider } from "src/contexts/AuthContext";
import AppNavigator from "src/navigation/AppNavigator";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle="dark-content" />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
        {/* <DarkModeToggle /> */}
      </QueryClientProvider>
    </NavigationContainer>
  );
}