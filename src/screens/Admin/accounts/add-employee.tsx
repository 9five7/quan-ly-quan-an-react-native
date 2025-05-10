import { useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEmployeeAccountBody, CreateEmployeeAccountBodyType } from "src/schemaValidations/account.schema";

import { useUploadImageMutation } from "src/queries/useMedia";
import tw from "src/utils/tw";
import { useAddEmployeeMutation } from "src/queries/useAccount";

export default function AddEmployeeForm({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const addEmployeeMutation = useAddEmployeeMutation();
  const uploadImageMutation = useUploadImageMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateEmployeeAccountBodyType>({
    resolver: zodResolver(CreateEmployeeAccountBody),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined
    }
  });

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (values: CreateEmployeeAccountBodyType) => {
    try {
      let body = values;
      if (imageUri) {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          name: "avatar.jpg",
          type: "image/jpeg"
        } as any);
        const uploadRes = await uploadImageMutation.mutateAsync(formData);
        body = { ...values, avatar: uploadRes.payload.data };
      }
      const result = await addEmployeeMutation.mutateAsync(body);
      Alert.alert("Thành công", result.payload.message);
      reset();
      setImageUri(null);
      onClose();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo tài khoản mới");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={tw`flex-1 justify-center items-center bg-black/40`}>
        <View style={tw`bg-white p-4 rounded-lg w-80`}>
          <Text style={tw`text-lg font-bold mb-4`}>Tạo tài khoản</Text>

          <Pressable onPress={onPickImage} style={tw`mb-4 items-center`}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={tw`w-24 h-24 rounded-md`} />
            ) : (
              <View style={tw`w-24 h-24 rounded-md border border-dashed justify-center items-center`}>
                <Text>Chọn ảnh</Text>
              </View>
            )}
          </Pressable>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-2`}
                placeholder="Tên"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && <Text style={tw`text-red-500 text-xs`}>{errors.name.message}</Text>}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-2`}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && <Text style={tw`text-red-500 text-xs`}>{errors.email.message}</Text>}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-2`}
                placeholder="Mật khẩu"
                value={value}
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && <Text style={tw`text-red-500 text-xs`}>{errors.password.message}</Text>}

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={tw`border border-gray-300 rounded p-2 mb-2`}
                placeholder="Xác nhận mật khẩu"
                value={value}
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmPassword && <Text style={tw`text-red-500 text-xs`}>{errors.confirmPassword.message}</Text>}

          <View style={tw`flex-row justify-between mt-4`}>
            <Pressable onPress={onClose} style={tw`border px-4 py-2 rounded`}>
              <Text>Huỷ</Text>
            </Pressable>
            <Pressable onPress={handleSubmit(onSubmit)} style={tw`bg-blue-500 px-4 py-2 rounded`}>
              <Text style={tw`text-white`}>Tạo</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
