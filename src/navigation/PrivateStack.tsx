// src/stacks/PrivateStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageLayout from "src/layouts/ManageLayout";
import PublicLayout from "src/layouts/PublicLayout";
import DashboardScreen from "src/screens/Admin/DashboardScreen";
import SettingScreen from "src/screens/Admin/setting/Settings";
import HomeScreen from "src/screens/Home";

export type PrivateStackParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Setting: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<PrivateStackParamList>();

export default function PrivateStack() {
  return (
    <Stack.Navigator  screenOptions={{ headerShown: false }}>
       <Stack.Screen
              name="Home"
              component={() => (
                <PublicLayout>
                  <HomeScreen />
                </PublicLayout>
              )}
              options={{ headerTitle: "Trang chủ" }}
            />
      <Stack.Screen
        name="Dashboard"
        options={{ headerTitle: "Quản lý" }}
        component={() => (
          <ManageLayout>
            <DashboardScreen />
          </ManageLayout>
        )}
      />
      <Stack.Screen
        name="Setting"
        options={{ headerTitle: "cài đặt" }}
        component={() => (
          <ManageLayout>
            <SettingScreen />
          </ManageLayout>
        )}
      />
    </Stack.Navigator>
  );
}
