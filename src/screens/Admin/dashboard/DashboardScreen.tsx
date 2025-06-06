import { Text, View } from "react-native";
import DashboardMain from "src/screens/Admin/dashboard/dashboard-main";
import tw from "src/utils/tw";
export default function DashboardScreen() {
  return (
    <View style={tw`flex-1`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Dasshboard</Text>
      <Text style={tw`text-gray-500 mb-4`}>phân tích thống kê</Text>
      <DashboardMain/>
    </View>
  );
}
 