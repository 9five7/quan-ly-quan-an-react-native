// src/components/Button.tsx
import { TouchableOpacity, Text } from 'react-native';
import tw from '../utils/tw';

export default function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={tw`bg-blue-500 p-3 rounded-xl`}>
      <Text style={tw`text-white font-bold text-center`}>{title}</Text>
    </TouchableOpacity>
  );
}
