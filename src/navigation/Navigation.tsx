import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from 'src/screens/Home';
import LoginScreen from 'src/screens/Auth/Login';
import RegisterScreen from 'src/screens/Auth/Register';
import { useAuth } from 'src/contexts/AuthContext'; // mình giả sử AuthContext nằm ở đây nha

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      {user ? (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Trang chủ' }} 
          />
          {/* Có thể thêm Menu, Order, Settings ở đây */}
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Đăng nhập' }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Đăng ký' }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}
