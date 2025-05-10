import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageLayout from "src/layouts/ManageLayout";
import PublicLayout from "src/layouts/PublicLayout";
import DashboardScreen from "src/screens/Admin/DashboardScreen";
import HomeScreen from "src/screens/Home";
import LoginScreen from "src/screens/Login/LoginScreen";

export type PublicStackParamList = {
  Login: undefined;
  Home: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<PublicStackParamList>();
const HomeScreenWrapper = () => (
  <PublicLayout>
    <HomeScreen />
  </PublicLayout>
);
const DashboardWrapper = () => (
  <ManageLayout>
    <DashboardScreen />
  </ManageLayout>
);
const LoginWrapper = () => (
  <PublicLayout>
    <LoginScreen />
  </PublicLayout>
);

export default function PublicStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginWrapper} />
      <Stack.Screen
        name="Home"
        component={HomeScreenWrapper}
        options={{ headerTitle: "Trang chủ" }}
      />
      <Stack.Screen
        name="Dashboard"
        options={{ headerTitle: "Trang chủ" }}
        component={DashboardWrapper}
      />
    </Stack.Navigator>
  );
}
