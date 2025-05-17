import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Modal, ScrollView, ActivityIndicator, Alert, Linking } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import tw from 'src/utils/tw';
import { UpdateTableBody, UpdateTableBodyType } from 'src/schemaValidations/table.schema';
import { TableStatus, TableStatusValues } from 'src/constants/type';
import { useTableQueryById, useUpdateTableMutation } from 'src/queries/useTable';
import { MaterialIcons } from '@expo/vector-icons';

import QRCode from 'react-native-qrcode-svg';
import { getTableLink, getVietnameseTableStatus } from 'src/utils/utils';

export default function EditTable({
  id,
  visible,
  onClose,
  onSubmitSuccess,
}: {
  id?: number;
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}) {
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const updateTableMutation = useUpdateTableMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useTableQueryById({ id: id as number, enabled: Boolean(id) });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });

  const changeToken = watch('changeToken');
  const status = watch('status');

  useEffect(() => {
    if (data) {
      const { capacity, status } = data.payload.data;
      reset({
        capacity,
        status,
        changeToken: false,
      });
    }
  }, [data, reset]);

  const onSubmit = async (values: UpdateTableBodyType) => {
    if (updateTableMutation.isPending) return;
    setIsLoading(true);
    
    try {
      const body = { id: id as number, ...values };
      const result = await updateTableMutation.mutateAsync(body);
      Alert.alert('Thành công', result.payload.message);
      reset();
      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật bàn ăn');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleOpenURL = () => {
    if (data) {
      const url = getTableLink({
        token: data.payload.data.token,
        tableNumber: data.payload.data.number,
      });
      Linking.openURL(url).catch(err => Alert.alert('Lỗi', 'Không thể mở liên kết'));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
        <View style={tw`bg-white rounded-lg w-full max-w-md max-h-[90%]`}>
          <ScrollView contentContainerStyle={tw`p-6`}>
            <Text style={tw`text-xl font-bold mb-4`}>Cập nhật bàn ăn</Text>

            {/* Table Number (Readonly) */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>Số hiệu bàn</Text>
              <TextInput
                style={tw`border border-gray-300 rounded px-3 py-2 bg-gray-100`}
                value={data?.payload.data.number?.toString() || ''}
                editable={false}
              />
            </View>

            {/* Capacity */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>Sức chứa (người)</Text>
              <Controller
                control={control}
                name="capacity"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={tw`border border-gray-300 rounded px-3 py-2`}
                    placeholder="Nhập sức chứa"
                    keyboardType="numeric"
                    value={value.toString()}
                    onChangeText={(text) => onChange(Number(text))}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.capacity && (
                <Text style={tw`text-red-500 text-xs mt-1`}>{errors.capacity.message}</Text>
              )}
            </View>

            {/* Status */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>Trạng thái</Text>
              <Pressable
                style={tw`border border-gray-300 rounded px-3 py-2`}
                onPress={() => setShowStatusPicker(true)}
              >
                <Text>{getVietnameseTableStatus(status)}</Text>
              </Pressable>
              {errors.status && (
                <Text style={tw`text-red-500 text-xs mt-1`}>{errors.status.message}</Text>
              )}
            </View>

            {/* Change QR Code */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium mb-1`}>Đổi QR Code</Text>
              <Controller
                control={control}
                name="changeToken"
                render={({ field: { onChange, value } }) => (
                  <View style={tw`flex-row items-center`}>
                    <Pressable
                      style={tw`w-12 h-6 rounded-full ${
                        value ? 'bg-blue-500' : 'bg-gray-300'
                      } justify-center`}
                      onPress={() => onChange(!value)}
                    >
                      <View
                        style={tw`w-5 h-5 bg-white rounded-full ${
                          value ? 'ml-6' : 'ml-1'
                        }`}
                      />
                    </Pressable>
                    <Text style={tw`ml-2`}>{value ? 'Có' : 'Không'}</Text>
                  </View>
                )}
              />
            </View>

            {/* QR Code */}
            {data && (
              <View style={tw`mb-4 items-center`}>
                <Text style={tw`text-sm font-medium mb-2`}>QR Code</Text>
                <QRCode
                  value={getTableLink({
                    token: data.payload.data.token,
                    tableNumber: data.payload.data.number,
                  })}
                  size={150}
                />
              </View>
            )}

            {/* Menu URL */}
            {data && (
              <View style={tw`mb-4`}>
                <Text style={tw`text-sm font-medium mb-1`}>URL gọi món</Text>
                <Pressable onPress={handleOpenURL}>
                  <Text style={tw`text-blue-500 underline`}>
                    {getTableLink({
                      token: data.payload.data.token,
                      tableNumber: data.payload.data.number,
                    })}
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>

          {/* Footer Buttons */}
          <View style={tw`flex-row justify-end p-4 border-t border-gray-200`}>
            <Pressable onPress={onClose} style={tw`px-4 py-2 mr-2`}>
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

      {/* Status Picker Modal */}
      <Modal visible={showStatusPicker} transparent animationType="fade">
        <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-lg w-full max-w-xs`}>
            <ScrollView>
              {TableStatusValues.map((statusValue) => (
                <Pressable
                  key={statusValue}
                  style={tw`p-4 border-b border-gray-200`}
                  onPress={() => {
                    setValue('status', statusValue);
                    setShowStatusPicker(false);
                  }}
                >
                  <Text>{getVietnameseTableStatus(statusValue)}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={tw`p-4 border-t border-gray-200 items-center`}
              onPress={() => setShowStatusPicker(false)}
            >
              <Text style={tw`text-blue-500`}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}