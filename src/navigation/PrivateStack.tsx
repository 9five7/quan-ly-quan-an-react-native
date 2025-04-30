import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from 'src/screens/Home';

export type PrivateStackParamList = {
  Home: undefined;
  Orders: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<PrivateStackParamList>();

export default function PrivateStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Trang chủ' }} />
      {/* <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerTitle: 'Đơn hàng' }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerTitle: 'Quản lý' }} /> */}
    </Stack.Navigator>
  );
}
