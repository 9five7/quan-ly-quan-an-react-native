// src/components/LoginForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "src/contexts/AuthContext";
import { PrivateStackParamList } from "src/navigation/PrivateStack";

import { useLoginMutation } from "src/queries/useAccount";
import { LoginBody, LoginBodyType } from "src/schemaValidations/auth.schema";
import tw from "src/utils/tw";

export default function LoginForm() {
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();
  const { mutate, isPending } = useLoginMutation();

  const onSubmit = (data: LoginBodyType) => {
    mutate(data, {
      onSuccess: async (res) => {
        const { accessToken, refreshToken } = res.payload.data;
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        login();
        Alert.alert("Đăng nhập thành công");
        navigation.navigate("Dashboard");
      },
      onError: (error: any) => {
        console.log("Login error:", error); // <- THÊM DÒNG NÀY
        Alert.alert("Đăng nhập thất bại", error?.message || "Có lỗi xảy ra");
      },
    });
  };

  return (
    <View style={tw`bg-white rounded-xl p-6 w-80 shadow-md`}>
      <Text style={tw`text-2xl font-bold text-center mb-4`}>Đăng nhập</Text>
      <View style={tw`gap-4`}>
        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={tw`text-sm font-medium mb-1`}>Email</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-2`}
                placeholder="m@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.email && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={tw`text-sm font-medium mb-1`}>Mật khẩu</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-2`}
                placeholder="Mật khẩu"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.password && (
                <Text style={tw`text-red-500 text-xs mt-1`}>
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        {/* Submit Button */}
        <Pressable
          style={tw`bg-blue-500 py-3 rounded-lg`}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          <Text style={tw`text-center text-white font-bold`}>
            {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Text>
        </Pressable>

        {/* Login with Google Button */}
        <Pressable
          style={tw`border border-blue-500 py-3 rounded-lg`}
          onPress={() => Alert.alert("Google Login")}
        >
          <Text style={tw`text-center text-blue-500 font-bold`}>
            Đăng nhập bằng Google
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
