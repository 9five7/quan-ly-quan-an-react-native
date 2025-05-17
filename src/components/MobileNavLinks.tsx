import { Package2, PanelLeft } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { sharedMenuItems } from "src/constants/menuItems";
import { PrivateStackParamList } from "src/navigation/PrivateStack";
import tw from "src/utils/tw";
import { PublicStackParamList } from "src/navigation/PublicStack";

export default function MobileNavLinks() {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation =useNavigation<NativeStackNavigationProp<PublicStackParamList>>();

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
        <Pressable
          style={tw`flex-1 bg-black/30`}
          onPress={() => setModalVisible(false)}
        >
          <View style={tw`bg-black w-64 h-full p-6`}>
            {/* <Pressable
              style={tw`flex-row items-center mb-6`}
              onPress={() => navigation.navigate("Home")}
            >
              <Package2 size={24} color="#2563EB" />
              <Text style={tw`ml-2 text-lg font-bold text-blue-500`}>
                Menu
              </Text>
            </Pressable> */}
            {sharedMenuItems.map((Item, index) => (
              <Pressable
                key={index}
                style={tw`flex-row items-center mb-4`}
                onPress={() => navigation.navigate(Item.href as never)}
              >
                <Item.Icon  size={24} color="#6B7280" />
                <Text style={tw`ml-2 text-base text-gray-700`}>
                  {Item.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
