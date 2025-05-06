// src/components/NavItems.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { PrivateStackParamList } from "src/navigation/PrivateStack";

import tw from "src/utils/tw";

const menuItems = [
  { title: "Món ăn", href: "Menu" },
  { title: "Đơn hàng", href: "Orders", authRequired: true },
  { title: "Đăng nhập", href: "Login", authRequired: false },
  { title: "Quản lý", href: "Dashboard", authRequired: true },
];

export default function NavItems({ className }: { className?: string }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setIsAuth(Boolean(token));
    };
    checkAuth();
  }, []);

  return (
    <View style={tw`${className || ""}`}>
      {menuItems.map((item) => {
        if (
          (item.authRequired === false && isAuth) ||
          (item.authRequired === true && !isAuth)
        ) {
          return null;
        }
        return (
          <Pressable
            key={item.href}
            style={tw`py-2`}
            onPress={() =>
              navigation.navigate(item.href as keyof PrivateStackParamList)
            }
          >
            <Text style={tw`text-lg font-medium text-blue-500`}>
              {item.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
