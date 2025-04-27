import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "src/screens/Home";
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
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
      {/* <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ManageDashboard" component={ManageDashboardScreen} /> */}
    </Stack.Navigator>
  );
};
