import { ScrollView, Text, View } from "react-native";
import OrderTable from "src/screens/Admin/orders/order-table";
import tw from "src/utils/tw";
export default function OrderScreen() {
  return (
    <View style={tw`flex-1 `}>
      <Text style={tw`text-2xl font-bold mb-2`}>Đơn hàng</Text>
      <Text style={tw`text-gray-500 mb-4`}>Quản lý đơn hàng</Text>
      <ScrollView nestedScrollEnabled={true}>
        <OrderTable />
      </ScrollView>
    </View>
  );
}
