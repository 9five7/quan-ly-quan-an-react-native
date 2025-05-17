import { View, Text } from 'react-native';
import TableTable from 'src/screens/Admin/tables/table-table';
import tw from 'src/utils/tw';

export default function TablesScreen() {
  return (
   <View style={tw`flex-1`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Bàn ăn</Text>
      <Text style={tw`text-gray-500 mb-4`}>Quản lý Bàn ăn</Text>
      <TableTable />
    </View>
  );
}
