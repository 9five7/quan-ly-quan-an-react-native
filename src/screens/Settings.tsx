import { View, Text } from 'react-native';
import tw from 'src/utils/tw';
export default function SettingsScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Text style={tw`text-lg font-bold`}>Welcome to HomeScreen!</Text>
    </View>
  );
}
