import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/Avatar";
import { useAuth } from "src/contexts/AuthContext";
import tw from "src/utils/tw";

const account = {
  name: "Nguyễn Văn A",
  avatar: "https://i.pravatar.cc/150",
};

export default function AvatarMenu() {
  const [modalVisible, setModalVisible] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setModalVisible(false);
  };

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)}>
        <Avatar>
          <AvatarImage source={{ uri: account.avatar }} />
          <AvatarFallback>
            {account.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Pressable>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={tw`flex-1 bg-black/30 justify-center items-center`}
          onPress={() => setModalVisible(false)}
        >
          <View style={tw`bg-white p-6 rounded-lg w-64 gap-4`}>
            <Text style={tw`text-lg font-bold`}>{account.name}</Text>
            <Pressable onPress={() => {}}>
              <Text style={tw`text-blue-500 text-base`}>Cài đặt</Text>
            </Pressable>
            <Pressable onPress={() => {}}>
              <Text style={tw`text-blue-500 text-base`}>Hỗ trợ</Text>
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Text style={tw`text-red-500 text-base`}>Đăng xuất</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
