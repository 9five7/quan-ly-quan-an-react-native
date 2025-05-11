import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DishStatus, DishStatusValues } from "src/constants/type";
import { useAddDishMutation } from "src/queries/useDish";
import { useUploadImageMutation } from "src/queries/useMedia";
import {
  CreateDishBody,
  CreateDishBodyType,
} from "src/schemaValidations/dish.schema";
import tw from "src/utils/tw";
import { getVietnameseDishStatus } from "src/utils/utils";

export default function AddDish({
  onAddSuccess,
}: {
  onAddSuccess?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const addDishMutation = useAddDishMutation();
  const uploadImageMutation = useUploadImageMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: undefined,
      status: DishStatus.Unavailable,
    },
  });

  const name = watch("name");
  const status = watch("status");

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      setValue("image", result.assets[0].uri);
    }
  };

  const onSubmit = async (values: CreateDishBodyType) => {
    if (addDishMutation.isPending) return;
    setIsLoading(true);

    try {
      let body = values;

      if (imageUri) {
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        } as any);
        const uploadResult = await uploadImageMutation.mutateAsync(formData);
        body = { ...values, image: uploadResult.payload.data };
      }

      const result = await addDishMutation.mutateAsync(body);
      Alert.alert("Thành công", result.payload.message);
      resetForm();
      onAddSuccess?.();
    } catch (error) {
      Alert.alert("Lỗi", "Hãy điền đầy đủ dữ liệu khi thêm món ăn");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setImageUri(null);
    setVisible(false);
  };

  return (
    <>
      {/* Add Button */}
      <Pressable
        onPress={() => setVisible(true)}
        style={tw`flex-row items-center bg-blue-500 px-3 py-1 rounded`}
      >
        <MaterialIcons name="add-circle" size={16} color="white" />
        <Text style={tw`text-white ml-1`}>Thêm món ăn</Text>
      </Pressable>

      {/* Add Dish Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={resetForm}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-lg w-full max-w-md max-h-[90%]`}>
            <ScrollView contentContainerStyle={tw`p-6`}>
              <Text style={tw`text-xl font-bold mb-4`}>Thêm món ăn</Text>

              {/* Image Upload */}
              <View style={tw`items-center mb-6`}>
                <TouchableOpacity onPress={handleImagePick}>
                  <View
                    style={tw`w-24 h-24 rounded-md bg-gray-200 overflow-hidden mb-2`}
                  >
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        style={tw`w-full h-full`}
                      />
                    ) : (
                      <View style={tw`flex-1 items-center justify-center`}>
                        <Text style={tw`text-lg font-bold text-gray-600`}>
                          {name?.charAt(0)?.toUpperCase() || "Ảnh"}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={tw`flex-row items-center justify-center`}>
                    <MaterialIcons name="camera-alt" size={16} color="blue" />
                    <Text style={tw`text-blue-500 ml-1`}>Tải ảnh lên</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={tw`mb-4`}>
                {/* Name Field */}
                <View>
                  <Text style={tw`text-sm font-medium mb-1`}>Tên món ăn</Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={tw`border border-gray-300 rounded px-3 py-2`}
                        placeholder="Nhập tên món ăn"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {errors.name && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.name.message}
                    </Text>
                  )}
                </View>

                {/* Price Field */}
                <View>
                  <Text style={tw`text-sm font-medium mb-1`}>Giá</Text>
                  <Controller
                    control={control}
                    name="price"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={tw`border border-gray-300 rounded px-3 py-2`}
                        placeholder="Nhập giá"
                        value={value?.toString()}
                        onChangeText={(text) => onChange(Number(text))}
                        onBlur={onBlur}
                        keyboardType="numeric"
                      />
                    )}
                  />
                  {errors.price && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.price.message}
                    </Text>
                  )}
                </View>

                {/* Description Field */}
                <View>
                  <Text style={tw`text-sm font-medium mb-1`}>Mô tả</Text>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={tw`border border-gray-300 rounded px-3 py-2 h-24`}
                        placeholder="Nhập mô tả"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                      />
                    )}
                  />
                  {errors.description && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.description.message}
                    </Text>
                  )}
                </View>

                {/* Status Field */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-medium mb-1 text-gray-700`}>
                    Trạng thái
                  </Text>

                  <TouchableOpacity
                    style={tw`border ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 flex-row justify-between items-center`}
                    onPress={() => setShowStatusPicker(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={tw`text-gray-800`}>
                      {getVietnameseDishStatus(status)}
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={20}
                      color={tw.color("gray-500")}
                    />
                  </TouchableOpacity>

                  {errors.status && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {errors.status.message}
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={tw`flex-row justify-end p-4 border-t border-gray-200`}>
              <Pressable
                onPress={resetForm}
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
                  <ActivityIndicator
                    color="white"
                    size="small"
                    style={tw`mr-2`}
                  />
                )}
                <Text style={tw`text-white`}>Thêm</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Status Picker Modal */}
        <Modal visible={showStatusPicker} transparent animationType="fade">
          <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
            <View style={tw`bg-white rounded-lg w-full max-w-xs`}>
              <ScrollView>
                {DishStatusValues.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={tw`p-4 border-b border-gray-200`}
                    onPress={() => {
                      setValue("status", item);
                      setShowStatusPicker(false);
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={tw`p-4 border-t border-gray-200 items-center`}
                onPress={() => setShowStatusPicker(false)}
              >
                <Text style={tw`text-blue-500`}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>
    </>
  );
}
