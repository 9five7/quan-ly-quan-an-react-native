import { View } from 'react-native';
import tw from 'src/utils/tw';

export default function TableSkeleton() {
  return (
    <View style={tw`w-full`}>
      {/* Table header */}
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
        <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
        <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
        <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
      </View>

      {/* Table rows */}
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={tw`flex-row justify-between items-center mb-2`}>
          <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
          <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
          <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
          <View style={tw`w-1/4 h-5 bg-gray-200 rounded-md`} />
        </View>
      ))}
    </View>
  );
}