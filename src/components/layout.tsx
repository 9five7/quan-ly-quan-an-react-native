// src/components/Layout.tsx
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Package2 } from 'lucide-react-native';
import tw from 'src/utils/tw';
import NavItems from 'src/components/NavItems';
import DarkModeToggle from 'src/components/dark-mode-toggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`h-16 flex-row items-center justify-between px-4 border-b border-gray-200 bg-gray-50`}>
        {/* Logo + Nav */}
        <View style={tw`flex-row items-center gap-4`}>
          <Pressable onPress={() => navigation.navigate('Home')}> 
            <Package2 size={24} color="black" />
          </Pressable>
          <NavItems />
        </View>

        {/* Dark Mode Toggle */}
        <DarkModeToggle />
      </View>

      {/* Main Content */}
      <ScrollView style={tw`flex-1 p-4`}>
        {children}
      </ScrollView>
    </View>
  );
}
