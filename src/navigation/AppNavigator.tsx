import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "src/screens/Home";
import LoginScreen from "src/screens/LoginScreen";
import MenuScreen from "src/screens/Menu";
import OrderScreen from "src/screens/Order";

export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  Orders: undefined;
  Login: undefined;
  ManageDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: "Trang chủ" }}
      />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
      {/* <Stack.Screen name="Login" component={LoginForm} /> */}
      {/* <Stack.Screen name="ManageDashboard" component={ManageDashboardScreen} /> */}
    </Stack.Navigator>
  );
};
