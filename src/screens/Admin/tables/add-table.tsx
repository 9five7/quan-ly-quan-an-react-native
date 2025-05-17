import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import tw from 'src/utils/tw';
import { CreateTableBody, CreateTableBodyType } from 'src/schemaValidations/table.schema';
import { TableStatus, TableStatusValues } from 'src/constants/type';
import { useAddTableMutation } from 'src/queries/useTable';
import { MaterialIcons } from '@expo/vector-icons';
import { getVietnameseTableStatus } from 'src/utils/utils';


export default function AddTable({ onAddSuccess }: { onAddSuccess?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const addTableMutation = useAddTableMutation();
  const [isLoading, setIsLoading] = useState(false);

  const {  control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue, } = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden
    }
  });
 const status = watch("status");
  const onSubmit = async (values: CreateTableBodyType) => {
    if (addTableMutation.isPending) return;
    setIsLoading(true);
    
    try {
      const result = await addTableMutation.mutateAsync(values);
      Alert.alert('Thành công', result.payload.message);
      reset();
      setVisible(false);
      onAddSuccess?.();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm bàn');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Add Button */}
      <Pressable
        onPress={() => setVisible(true)}
        style={tw`flex-row items-center bg-blue-500 px-3 py-1 rounded`}
      >
        <MaterialIcons name="add-circle" size={16} color="white" />
        <Text style={tw`text-white ml-1`}>Thêm bàn</Text>
      </Pressable>

      {/* Add Table Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-center items-center p-4`}>
          <View style={tw`bg-white rounded-lg w-full max-w-md max-h-[80%]`}>
            <ScrollView contentContainerStyle={tw`p-6`}>
              <Text style={tw`text-xl font-bold mb-4`}>Thêm bàn</Text>

              {/* Form Fields */}
              <View>
                {/* Table Number */}
                <View>
                  <Text style={tw`text-sm font-medium mb-1`}>Số hiệu bàn</Text>
                  <Controller
                    control={control}
                    name="number"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={tw`border border-gray-300 rounded px-3 py-2`}
                        placeholder="Nhập số hiệu bàn"
                        keyboardType="numeric"
                        value={value.toString()}
                         onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {errors.number && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>{errors.number.message}</Text>
                  )}
                </View>

                {/* Capacity */}
                <View>
                  <Text style={tw`text-sm font-medium mb-1`}>Lượng khách cho phép</Text>
                  <Controller
                    control={control}
                    name="capacity"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={tw`border border-gray-300 rounded px-3 py-2`}
                        placeholder="Nhập số lượng khách"
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
                <View>
                  <Text style={tw`text-sm font-medium mb-1`}>Trạng thái</Text>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Pressable
                          style={tw`border border-gray-300 rounded px-3 py-2`}
                          onPress={() => setShowStatusPicker(true)}
                        >
                          <Text>{getVietnameseTableStatus(value)}</Text>
                        </Pressable>
                        {errors.status && (
                          <Text style={tw`text-red-500 text-xs mt-1`}>{errors.status.message}</Text>
                        )}
                      </>
                    )}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={tw`flex-row justify-end p-4 border-t border-gray-200`}>
              <Pressable
                onPress={() => setVisible(false)}
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
                {TableStatusValues.map((item) => (
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