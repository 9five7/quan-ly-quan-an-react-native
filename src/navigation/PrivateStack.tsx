// src/stacks/PrivateStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageLayout from "src/layouts/ManageLayout";
import PublicLayout from "src/layouts/PublicLayout";
import AccountsScreen from "src/screens/Admin/accounts/AccountsScreen";
import DashboardScreen from "src/screens/Admin/DashboardScreen";
import DishesScreen from "src/screens/Admin/dishes/DishesScreen";
import OrderScreen from "src/screens/Admin/orders/Order";
import SettingScreen from "src/screens/Admin/setting/Settings";
import TablesScreen from "src/screens/Admin/tables/TablesScreen";
import HomeScreen from "src/screens/Home";

export type PrivateStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Setting: undefined;
  Home: undefined;
  Accounts: undefined;
  Tables: undefined;
  Dishes: undefined;
  Analytics: undefined;
};

const Stack = createNativeStackNavigator<PrivateStackParamList>();
const HomeScreenWrapper = () => (
  <PublicLayout>
    <HomeScreen />
  </PublicLayout>
);

const DashboardScreenWrapper = () => (
  <ManageLayout>
    <DashboardScreen />
  </ManageLayout>
);
const DishesScreenWrapper = () => (
  <ManageLayout>
    <DishesScreen />
  </ManageLayout>
);

const SettingScreenWrapper = () => (
  <ManageLayout>
    <SettingScreen />
  </ManageLayout>
);

const OrdersScreenWrapper = () => (
  <ManageLayout>
    <OrderScreen />
  </ManageLayout>
);
const TablesScreenWrapper = () => (
  <ManageLayout>
    <TablesScreen/>
  </ManageLayout>
);
const AccountsScreenWrapper = () => (
  <ManageLayout>
    <AccountsScreen />
  </ManageLayout>
);
export default function PrivateStack() {
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>
       <Stack.Screen
              name="Home"
              component={HomeScreenWrapper}
              options={{ headerTitle: "Trang chủ" }}
            />
      <Stack.Screen
        name="Dashboard"
        options={{ headerTitle: "Quản lý" }}
        component={DashboardScreenWrapper}
      />
      <Stack.Screen
        name="Setting"
        options={{ headerTitle: "cài đặt" }}
        component={SettingScreenWrapper}
      />
      <Stack.Screen
        name="Orders"
        options={{ headerTitle: "Đơn hàng" }}
         component={OrdersScreenWrapper}
      />
      <Stack.Screen
        name="Dishes"
        options={{ headerTitle: "Món ăn" }}
         component={DishesScreenWrapper}
      />
      <Stack.Screen
        name="Tables"
        options={{ headerTitle: "Bàn ăn" }}
        
         component={TablesScreenWrapper}
      />
      <Stack.Screen
        name="Accounts"
        options={{ headerTitle: "Tài khoản" }}
        component={AccountsScreenWrapper}
      />
    </Stack.Navigator>
  );
}
