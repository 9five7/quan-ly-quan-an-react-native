import { View, Text } from 'react-native';
import tw from 'src/utils/tw';

export default function AnalyticsScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Text style={tw`text-2xl font-bold`}>Chào mừng bạn đã AnalyticsScreen!</Text>
    </View>
  );
}
