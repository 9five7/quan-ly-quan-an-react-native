// src/screens/Setting/UpdateProfileForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "src/schemaValidations/account.schema";

import { useEffect, useState } from "react";
import { Button } from "src/components/Button";
import { useAccountQuery, useUpdateMeMutation } from "src/queries/useAccount";
import { useUploadImageMutation } from "src/queries/useMedia";
import tw from "src/utils/tw";

export default function UpdateProfileForm() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { data, refetch } = useAccountQuery();
  const uploadImageMutation = useUploadImageMutation();
  const updateMeMutation = useUpdateMeMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: { name: "", avatar: undefined },
  });

  const avatar = watch("avatar");

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data;
      reset({ name, avatar: avatar ?? undefined });
    }
  }, [data]);

  const onSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (values: UpdateMeBodyType) => {
    try {
      let body = values;
      if (imageUri) {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);

        const uploadResult = await uploadImageMutation.mutateAsync(formData);
        body = { ...body, avatar: uploadResult.payload.data };
      }

      const result = await updateMeMutation.mutateAsync(body);
      Alert.alert("Thành công", result.payload.message);
      refetch();
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật thất bại");
    }
  };
  return (
    <View style={tw`p-4 gap-4`}>
      <Text style={tw`text-xl font-bold`}>Thông tin cá nhân</Text>
      <View style={tw`flex-row items-center gap-4`}>
        {imageUri || avatar ? (
          <Image
            source={{ uri: imageUri || avatar }}
            style={tw`w-24 h-24 rounded-md`}
            resizeMode="cover"
          />
        ) : null}
        <Button onPress={onSelectImage}>Chọn ảnh</Button>
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <View>
            <Text style={tw`text-sm font-medium mb-1`}>Tên</Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-2`}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && (
              <Text style={tw`text-red-500 text-xs`}>
                {errors.name.message}
              </Text>
            )}
          </View>
        )}
      />

      <View style={tw`flex-row justify-between mt-4`}>
        <Pressable
          onPress={() => {
            setImageUri(null);
            reset();
          }}
          style={tw`border border-gray-400 px-4 py-2 rounded`}
        >
          <Text>Huỷ</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={tw`bg-blue-500 px-4 py-2 rounded`}
        >
          <Text style={tw`text-white`}>Lưu thông tin</Text>
        </Pressable>
      </View>
    </View>
  );
}
