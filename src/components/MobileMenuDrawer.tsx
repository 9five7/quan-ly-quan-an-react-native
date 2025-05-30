import { View, Text, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import { PanelLeft, X } from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from 'src/contexts/AuthContext';
import tw from 'src/utils/tw';
import { menuItems, sharedMenuItems } from 'src/constants/menuItems';
import { PrivateStackParamList } from 'src/navigation/PrivateStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export default function MobileMenuDrawer() {
  const [open, setOpen] = useState(false);
 const navigation =useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();
  const { isAuth } = useAuth();

  const close = () => setOpen(false);

  const handleNavigate = (href: string) => {
    navigation.navigate(href as never);
    close();
  };

  return (
    <View>
      <Pressable onPress={() => setOpen(true)} style={tw`p-2`}>
        <PanelLeft size={24} color="white" />
      </Pressable>

      <Modal transparent animationType="fade" visible={open} onRequestClose={close}>
        <Pressable onPress={close} style={tw`flex-1 bg-black/60`}>
          <View style={tw`bg-[#0c0f1a] h-full w-3/4 p-6`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-white text-xl font-semibold`}>Menu</Text>
              <Pressable onPress={close}>
                <X size={24} color="white" />
              </Pressable>
            </View>

            {menuItems.map((item, index) => {
              if ((item.authRequired === true && !isAuth) || (item.authRequired === false && isAuth)) return null;//
              // không hiển thị menu nếu không có quyền truy cập
              return (
                <Pressable
                  key={index}
                  onPress={() => navigation.navigate(item.href as never)}
                  style={tw`mb-4 flex-row items-center`}
                >
                  <item.Icon size={20} color="white" />
                  <Text style={tw`ml-3 text-base text-white`}>{item.title}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}