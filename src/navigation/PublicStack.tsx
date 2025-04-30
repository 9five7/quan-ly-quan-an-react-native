import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from 'src/screens/LoginScreen';

export type PublicStackParamList = {
  Login: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamList>();

export default function PublicStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
