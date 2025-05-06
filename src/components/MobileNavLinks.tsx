import { View, Text, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import { PanelLeft, Package2 } from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import tw from 'src/utils/tw';
import { sharedMenuItems } from 'src/constants/menuItems';



export default function MobileNavLinks() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleNavigate = (href: string) => {
    setModalVisible(false);
    navigation.navigate(href as never);
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)} style={tw`p-2`}>
        <PanelLeft size={24} color="#4B5563" />
      </Pressable>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={tw`flex-1 bg-black/30`} onPress={() => setModalVisible(false)}>
          <View style={tw`bg-white w-64 h-full p-6`}>
            <Pressable
              style={tw`flex-row items-center mb-6`}
              onPress={() => handleNavigate('Home')}
            >
              <Package2 size={24} color="#2563EB" />
              <Text style={tw`ml-2 text-lg font-bold text-blue-500`}>Trang chủ</Text>
            </Pressable>
            {sharedMenuItems.map((Item, index) => (
              <Pressable
                key={index}
                style={tw`flex-row items-center mb-4`}
                onPress={() => handleNavigate(Item.href)}
              >
                <Item.Icon size={20} color="#6B7280" />
                <Text style={tw`ml-2 text-base text-gray-700`}>{Item.title}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
