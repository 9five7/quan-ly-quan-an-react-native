// src/screens/HomeScreen.tsx
import { View, Text } from 'react-native';
import tw from '../utils/tw';

export default function HomeScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Text style={tw`text-lg font-bold`}>Welcome to HomeScreen!</Text>
    </View>
  );
}
