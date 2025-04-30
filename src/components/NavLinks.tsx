// src/components/NavLinks.tsx
import { View, Pressable, Text } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { Package2, Settings } from 'lucide-react-native';
import tw from 'src/utils/tw';

export default function NavLinks() {
  const navigation = useNavigation();
  const routes = useNavigationState(state => state.routes);
  const currentRouteName = routes[routes.length - 1]?.name;

  return (
    <View style={tw`h-full w-16 bg-gray-50 border-r items-center pt-4`}> 
      <Pressable
        style={tw`h-12 w-12 rounded-full bg-blue-500 items-center justify-center mb-6`}
        onPress={() => navigation.navigate('Home')}
      >
        <Package2 size={24} color="white" />
      </Pressable>

      {menuItems.map((Item, index) => {
        const isActive = currentRouteName === Item.href;
        return (
          <Pressable
            key={index}
            style={tw`${isActive ? 'bg-blue-100' : ''} h-12 w-12 rounded-lg items-center justify-center mb-4`}
            onPress={() => navigation.navigate(Item.href)}
          >
            <Item.Icon size={20} color={isActive ? '#2563EB' : '#9CA3AF'} />
          </Pressable>
        );
      })}

      <View style={tw`mt-auto mb-6`}>
        <Pressable
          style={tw`${currentRouteName === 'Setting' ? 'bg-blue-100' : ''} h-12 w-12 rounded-lg items-center justify-center`}
          onPress={() => navigation.navigate('Setting')}
        >
          <Settings size={20} color={currentRouteName === 'Setting' ? '#2563EB' : '#9CA3AF'} />
        </Pressable>
      </View>
    </View>
  );
}
