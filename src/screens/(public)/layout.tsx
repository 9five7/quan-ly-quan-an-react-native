import React, { useState } from 'react';
import { View, Pressable, Text, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from '../../utils/tw';
import { Menu, Package } from 'lucide-react-native';

import { RootStackParamList } from 'src/navigation';
import DarkModeToggle from 'src/components/dark-mode-toggle';

type NavItem = {
  title: string;
  screen: keyof RootStackParamList;
  authRequired?: boolean;
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const menuItems: NavItem[] = [
    { title: 'Món ăn', screen: 'Menu' },
    { title: 'Đơn hàng', screen: 'Orders' },
    { title: 'Đăng nhập', screen: 'Login', authRequired: false },
    { title: 'Quản lý', screen: 'ManageDashboard', authRequired: true }
  ];

  const handleNavigate = (screen:keyof RootStackParamList) => {
    navigation.navigate(screen);
    setMenuVisible(false);
  };

  return (
    <View style={tw`flex-1 bg-background dark:bg-background-dark`}>
      {/* Header */}
      <View style={tw`flex-row items-center h-16 px-4 border-b border-border dark:border-border-dark`}>
        {/* Menu Button */}
        <Pressable 
          onPress={() => setMenuVisible(true)}
          style={tw`p-2 rounded-md`}
          android_ripple={{ color: tw.color('primary/20') }}
        >
          <Menu size={24}  />
        </Pressable>

        {/* Logo */}
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={tw`ml-4`}
        >
          <Package size={24}  />
        </Pressable>

        {/* Dark Mode Toggle */}
        <View style={tw`ml-auto`}>
          <DarkModeToggle />
        </View>
      </View>

      {/* Mobile Menu */}
      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={tw`flex-1 bg-background dark:bg-background-dark pt-8`}>
          {/* Menu Items */}
          {menuItems.map((item) => (
            <Pressable
              key={item.screen}
              onPress={() => handleNavigate(item.screen)}
              style={tw`px-6 py-4 border-b border-border dark:border-border-dark`}
              android_ripple={{ color: tw.color('primary/10') }}
            >
              <Text style={tw`text-lg text-foreground dark:text-foreground-dark`}>
                {item.title}
              </Text>
            </Pressable>
          ))}

          {/* Close Button */}
          <Pressable
            onPress={() => setMenuVisible(false)}
            style={tw`mt-8 mx-6 p-3 bg-primary rounded-lg items-center`}
          >
            <Text style={tw`text-white font-medium`}>Đóng menu</Text>
          </Pressable>
        </View>
      </Modal>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={tw`flex-grow p-4`}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}