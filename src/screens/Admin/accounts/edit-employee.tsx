import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "src/schemaValidations/account.schema";
import { Role, RoleValues } from "src/constants/type";
import { useUploadImageMutation } from "src/queries/useMedia";
import { useUpdateEmployeeMutation } from "src/queries/useAccount";
import tw from "src/utils/tw";
import { AccountType } from "src/schemaValidations/account.schema";
import { MaterialIcons } from "@expo/vector-icons";

export default function EditEmployeeForm({
  account,
  visible,
  onClose,
  onSubmitSuccess,
}: {
  account: AccountType;
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const uploadImageMutation = useUploadImageMutation();
  const updateEmployeeMutation = useUpdateEmployeeMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    defaultValues: {
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      password: undefined,
      confirmPassword: undefined,
      changePassword: false,
      role: account.role,
    },
  });

  const changePassword = watch("changePassword");
  const name = watch("name");

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
    if (updateEmployeeMutation.isPending) return;
    setIsLoading(true);

    try {
      let body = { id: account.id, ...values };

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

      const result = await updateEmployeeMutation.mutateAsync(body);
      Alert.alert("Thành công", result.payload.message);
      reset();
      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật tài khoản");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white rounded-lg w-full max-w-md max-h-[90%]`}>
          <ScrollView contentContainerStyle={tw`p-6`}>
            <Text style={tw`text-xl font-bold mb-4`}>Cập nhật tài khoản</Text>
            <Text style={tw`text-gray-600 mb-6`}>
              Các trường tên, email, mật khẩu là bắt buộc
            </Text>

            {/* Avatar Section */}
            <View style={tw`items-center mb-6`}>
              <TouchableOpacity onPress={handleImagePick}>
                <View style={tw`w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2`}>
                  {imageUri || account.avatar ? (
                    <Image
                      source={{ uri: imageUri || account.avatar || undefined }}
                      style={tw`w-full h-full`}
                    />
                  ) : (
                    <View style={tw`flex-1 items-center justify-center`}>
                      <Text style={tw`text-lg font-bold text-gray-600`}>
                        {name?.charAt(0)?.toUpperCase() || "A"}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={tw`flex-row items-center justify-center`}>
                  <MaterialIcons name="camera-alt" size={16} color="blue" />
                  <Text style={tw`text-blue-500 ml-1`}>Đổi ảnh</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={tw`space-y-4`}>
              {/* Name Field */}
              <View>
                <Text style={tw`text-sm font-medium mb-1`}>Tên</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={tw`border border-gray-300 rounded px-3 py-2`}
                      placeholder="Nhập tên"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.name && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>{errors.name.message}</Text>
                )}
              </View>

              {/* Email Field */}
              <View>
                <Text style={tw`text-sm font-medium mb-1`}>Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={tw`border border-gray-300 rounded px-3 py-2`}
                      placeholder="Nhập email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                    />
                  )}
                />
                {errors.email && (
                  <Text style={tw`text-red-500 text-xs mt-1`}>{errors.email.message}</Text>
                )}
              </View>

              {/* Role Field */}
              <View style={tw`mb-4`}>
              <Text style={tw`text-sm  mb-1`}>Chức vụ</Text>
              <View style={tw`border border-gray-300 rounded`}>
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={tw`text-black`}
                      dropdownIconColor="#000"
                    >
                      {RoleValues.filter((role) => role !== Role.Guest).map((role) => (
                        <Picker.Item
                          key={role}
                          label={role}
                          value={role}
                          style={tw`text-black`}
                        />
                      ))}
                    </Picker>
                  )}
                />
              </View>
             
            </View>

              {/* Change Password Switch */}
              <View style={tw`flex-row items-center justify-between py-2`}>
                <Text style={tw`text-sm font-medium`}>Đổi mật khẩu</Text>
                <Controller
                  control={control}
                  name="changePassword"
                  render={({ field: { onChange, value } }) => (
                    <Pressable
                      onPress={() => onChange(!value)}
                      style={tw`w-12 h-6 rounded-full ${
                        value ? "bg-blue-500" : "bg-gray-300"
                      } justify-center`}
                    >
                      <View
                        style={tw`w-5 h-5 bg-white rounded-full ${
                          value ? "ml-6" : "ml-1"
                        }`}
                      />
                    </Pressable>
                  )}
                />
              </View>

              {/* Password Fields (conditionally rendered) */}
              {changePassword && (
                <>
                  <View>
                    <Text style={tw`text-sm font-medium mb-1`}>Mật khẩu mới</Text>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={tw`border border-gray-300 rounded px-3 py-2`}
                          placeholder="Nhập mật khẩu mới"
                          secureTextEntry
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      )}
                    />
                    {errors.password && (
                      <Text style={tw`text-red-500 text-xs mt-1`}>
                        {errors.password.message}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={tw`text-sm font-medium mb-1`}>Xác nhận mật khẩu mới</Text>
                    <Controller
                      control={control}
                      name="confirmPassword"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          style={tw`border border-gray-300 rounded px-3 py-2`}
                          placeholder="Xác nhận mật khẩu mới"
                          secureTextEntry
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      )}
                    />
                    {errors.confirmPassword && (
                      <Text style={tw`text-red-500 text-xs mt-1`}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={tw`flex-row justify-end p-4 border-t border-gray-200`}>
            <Pressable
              onPress={onClose}
              style={tw`px-4 py-2 mr-2`}
              disabled={isLoading}
            >
              <Text style={tw`text-gray-600`}>Huỷ</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={tw`bg-blue-500 px-4 py-2 rounded flex-row items-center`}
              disabled={isLoading}
            >
              {isLoading && (
                <ActivityIndicator color="white" size="small" style={tw`mr-2`} />
              )}
              <Text style={tw`text-white`}>Lưu</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}