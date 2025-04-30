import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginForm from "src/components/LoginForm";
import { useAuth } from "src/contexts/AuthContext"; // mình giả sử AuthContext nằm ở đây nha
import HomeScreen from "src/screens/Home";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { isAuth } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {isAuth ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Trang chủ" }}
          />
          {/* Có thể thêm Menu, Order, Settings ở đây */}
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginForm}
            options={{ title: "Đăng nhập" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
