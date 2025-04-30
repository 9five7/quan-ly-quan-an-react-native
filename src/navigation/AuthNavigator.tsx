import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginForm from "src/components/LoginForm";

export type AuthStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginForm} />
    </Stack.Navigator>
  );
}
