import { View, Pressable, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import tw from 'src/utils/tw';
import { sharedMenuItems } from 'src/constants/menuItems';


export default function NavLinks({ className }: { className?: string }) {
  const navigation = useNavigation();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setIsAuth(!!token);
    };
    check();
  }, []);

  return (
    <View style={tw`${className || ''}`}> 
      {sharedMenuItems.map((item, i) => {
        if ((item.authRequired === true && !isAuth) || (item.authRequired === false && isAuth)) return null;
        return (
          <Pressable
            key={i}
            style={tw`py-2`}
            onPress={() => navigation.navigate(item.href as never)}
          >
            <Text style={tw`text-lg font-medium text-blue-500`}>{item.title}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
