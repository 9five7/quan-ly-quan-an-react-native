import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/Avatar";
import { useAuth } from "src/contexts/AuthContext";
import { PrivateStackParamList } from "src/navigation/PrivateStack";
import { PublicStackParamList } from "src/navigation/PublicStack";
import { useAccountQuery, useLogoutMutation } from "src/queries/useAccount";
import tw from "src/utils/tw";
import { getValidImageUrl } from "src/utils/utils";

export default function AvatarMenu() {
  const [modalVisible, setModalVisible] = useState(false);
  const { logout, isAuth } = useAuth();
  const logoutMutation = useLogoutMutation();
  const { data,refetch } = useAccountQuery();
  const account = data?.payload?.data;
  const navigationPublic =
    useNavigation<NativeStackNavigationProp<PublicStackParamList>>();
  const navigationPrivate =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();

  useEffect(() => {
    const checkToken = async () => {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) {
        navigationPublic.navigate("Login");
      }
    };
    checkToken();
    refetch();
  }, [isAuth,refetch]);

  const handleLogout = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) throw new Error("Missing tokens");

      await logoutMutation.mutateAsync({ accessToken, refreshToken });
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      logout();
      navigationPublic.navigate("Home");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Đăng xuất thất bại", "Vui lòng thử lại.");
    }
  };

  if (!account) return null;

  return (
    <View>
      <Pressable onPress={() => setModalVisible(true)}>
        <Avatar>
          {account.avatar ? (
            <AvatarImage source={{ uri: getValidImageUrl(account.avatar) }} />
          ) : (
            <AvatarFallback>
              {account.name?.slice(0, 2)?.toUpperCase() || "NA"}
            </AvatarFallback>
          )}
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

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigationPrivate.navigate("Setting");
              }}
            >
              <Text style={tw`text-blue-500 text-base`}>Cài đặt</Text>
            </Pressable>
            {/* 
            <Pressable onPress={() => {}}>
              <Text style={tw`text-blue-500 text-base`}>Hỗ trợ</Text>
            </Pressable> */}

            <Pressable onPress={handleLogout}>
              <Text style={tw`text-red-500 text-base`}>Đăng xuất</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
