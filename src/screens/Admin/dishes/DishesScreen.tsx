import { View, Text, ScrollView } from 'react-native';
import tw from 'src/utils/tw';

import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import DishTable from 'src/screens/Admin/dishes/dish-table';

export default function DishesScreen() {
return (
    <View style={tw`flex-1`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Món ăn</Text>
      <Text style={tw`text-gray-500 mb-4`}>Quản lý món ăn</Text>
      <DishTable />
    </View>
  );
}
 