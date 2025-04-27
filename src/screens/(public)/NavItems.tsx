import React from 'react';
import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import tw from '../../utils/tw';

const menuItems = [
  {
    title: 'Món ăn',
    route: 'Menu',
    authRequired: false
  },
  {
    title: 'Đơn hàng',
    route: 'Orders',
    authRequired: false
  },
  {
    title: 'Đăng nhập',
    route: 'Login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    route: 'ManageDashboard',
    authRequired: true
  }
] as const;

interface NavItemsProps {
  itemStyle?: string;
  textStyle?: string;
}

export const NavItems = ({ itemStyle = '', textStyle = '' }: NavItemsProps) => {
  const navigation = useNavigation();
  
  return (
    <>
      {menuItems.map((item) => (
        <Pressable
          key={item.route}
          style={tw`${itemStyle}`}
          onPress={() => navigation.navigate(item.route as any)}
        >
          <Text style={tw`${textStyle}`}>{item.title}</Text>
        </Pressable>
      ))}
    </>
  );
};