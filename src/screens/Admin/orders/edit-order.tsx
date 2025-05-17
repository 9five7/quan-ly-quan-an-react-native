import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { OrderStatus, OrderStatusValues } from "src/constants/type";
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from "src/schemaValidations/order.schema";
import tw from "src/utils/tw";
import { getVietnameseOrderStatus } from "src/utils/utils";

import { Picker } from "@react-native-picker/picker";
import { Image } from "react-native";
import {
  useGetOrderDetailQuery,
  useUpdateOrderMutation,
} from "src/queries/useOrder";
import { DishListResType } from "src/schemaValidations/dish.schema";
import { DishesDialog } from "src/screens/Admin/orders/dishes-dialog";

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [selectedDish, setSelectedDish] = useState<
    DishListResType["data"][0] | null
  >(null);
  const [isVisible, setIsVisible] = useState(false);
  const updateOrderMutation = useUpdateOrderMutation();
  const { data } = useGetOrderDetailQuery({
    id: id as number,
    enabled: Boolean(id),
  });
  useEffect(() => {
    if (id) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [id]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });
  useEffect(() => {
    if (data) {
      const {
        status,
        dishSnapshot: { dishId },
        quantity,
      } = data.payload.data;

      reset({
        status,
        dishId: dishId ?? 0,
        quantity,
      });

      setSelectedDish(data.payload.data.dishSnapshot);
    }
  }, [data, reset]);
  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (updateOrderMutation.isPending) return;
    
    try {
      const body: UpdateOrderBodyType & { orderId: number } = { 
        orderId: id as number, 
        ...values 
      };
      
      const result = await updateOrderMutation.mutateAsync(body);
      
    
      
      onSubmitSuccess && onSubmitSuccess();
      closeModal();
    } catch (error) {
      error
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    setId(undefined);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
    >
      <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
        <View style={tw`bg-white rounded-lg max-h-[90%]`}>
          <View style={tw`p-4 border-b border-gray-200`}>
            <Text style={tw`text-lg font-bold`}>Cập nhật đơn hàng</Text>
          </View>

          <ScrollView contentContainerStyle={tw`p-4`}>
            <Controller
              control={control}
              name="dishId"
              render={({ field: { onChange } }) => (
                <View style={tw`mb-4`}>
                  <Text style={tw`mb-2`}>Món ăn</Text>
                  <View style={tw`flex-row items-center gap-4`}>
                    <Image
                      source={{ uri: selectedDish?.image }}
                      style={tw`w-16 h-16 rounded-md`}
                      resizeMode="cover"
                    />
                    <Text style={tw`flex-1`}>{selectedDish?.name}</Text>
                    <DishesDialog
                      onChoose={(dish) => {
                        onChange(dish.id);
                        setSelectedDish(dish);
                      }}
                    />
                  </View>
                </View>
              )}
            />

            <Controller
              control={control}
              name="quantity"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View style={tw`mb-4`}>
                  <Text style={tw`mb-2`}>Số lượng</Text>
                  <TextInput
                    style={tw`border p-2 rounded w-16 text-center ${error ? "border-red-500" : "border-gray-300"}`}
                    value={value?.toString()}
                    onChangeText={(text) => {
                      const numberValue = Number(text);
                      if (!isNaN(numberValue)) {
                        onChange(numberValue);
                      }
                    }}
                    keyboardType="numeric"
                  />
                  {error && (
                    <Text style={tw`text-red-500 text-xs mt-1`}>
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View style={tw`mb-4`}>
                  <Text style={tw`mb-2`}>Trạng thái</Text>
                  <View style={tw`border rounded`}>
                    <Picker selectedValue={value} onValueChange={onChange}>
                      {OrderStatusValues.map((status) => (
                        <Picker.Item
                          key={status}
                          label={getVietnameseOrderStatus(status)}
                          value={status}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            />
          </ScrollView>

          <View style={tw`p-4 border-t border-gray-200`}>
            <TouchableOpacity
              style={tw`bg-blue-500 p-3 rounded items-center`}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={tw`text-white`}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
