import { Image, Text, View } from 'react-native';
import tw from 'src/utils/tw';


export function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <View style={tw`h-10 w-10 rounded-full overflow-hidden bg-gray-200 items-center justify-center`}>
      {children}
    </View>
  );
}

export function AvatarImage({ source }: { source: { uri: string } }) {
  return (
    <Image
      source={source}
      style={tw`h-full w-full`}
      resizeMode="cover"
    />
  );
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return (
    <Text style={tw`text-gray-600 text-lg font-bold`}>{children}</Text>
  );
}
