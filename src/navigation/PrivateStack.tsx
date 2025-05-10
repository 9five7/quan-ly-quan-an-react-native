// src/stacks/PrivateStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageLayout from "src/layouts/ManageLayout";
import PublicLayout from "src/layouts/PublicLayout";
import AccountsScreen from "src/screens/Admin/accounts/AccountsScreen";
import DashboardScreen from "src/screens/Admin/DashboardScreen";
import SettingScreen from "src/screens/Admin/setting/Settings";
import HomeScreen from "src/screens/Home";

export type PrivateStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Setting: undefined;
  Home: undefined;
  Accounts: undefined;
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

const SettingScreenWrapper = () => (
  <ManageLayout>
    <SettingScreen />
  </ManageLayout>
);

const OrdersScreenWrapper = () => (
  <ManageLayout>
    <HomeScreen />
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
        name="Accounts"
        options={{ headerTitle: "Tài khoản" }}
        component={AccountsScreenWrapper}
      />
    </Stack.Navigator>
  );
}
