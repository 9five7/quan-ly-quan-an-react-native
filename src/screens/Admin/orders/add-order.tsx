import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Quantity from "src/components/Quantity";
import { DishStatus } from "src/constants/type";
import { useCreateGuestMutation } from "src/queries/useAccount";
import { useDishListQuery } from "src/queries/useDish";
import { useCreateOrderMutation } from "src/queries/useOrder";
import { GetListGuestsResType } from "src/schemaValidations/account.schema";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "src/schemaValidations/guest.schema";
import { CreateOrdersBodyType } from "src/schemaValidations/order.schema";
import GuestsDialog from "src/screens/Admin/orders/guests-dialog";
import { TablesDialog } from "src/screens/Admin/orders/tables-dialog";
import tw from "src/utils/tw";
import { formatCurrency, getValidImageUrl } from "src/utils/utils";

export default function AddOrder() {
  const [visible, setVisible] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<
    GetListGuestsResType["data"][0] | null
  >(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrdersBodyType["orders"]>([]);

  const addOrderMutation = useCreateOrderMutation();
  const createGuestMutation = useCreateGuestMutation();
  const { data: dishesData, isLoading: isLoadingDishes } = useDishListQuery();
  const dishes = useMemo(() => dishesData?.payload.data || [], [dishesData]);

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const {
    control,
    handleSubmit,
    watch,
    reset: resetForm,
    setError,
    formState: { errors },
  } = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      tableNumber: 0,
    },
  });

  const name = watch("name");
  const tableNumber = watch("tableNumber");

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async (data: GuestLoginBodyType) => {
    console.log('=== DEBUG ORDER ===');
    console.log('isNewGuest:', isNewGuest);
    console.log('selectedGuest:', selectedGuest);
    console.log('form data:', data);
    console.log('orders:', orders);

    try {
      // Kiểm tra có món nào được chọn không
      if (orders.length === 0) {
        Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một món');
        return;
      }

      let guestId = selectedGuest?.id;

      if (isNewGuest) {
        // Kiểm tra validation cho khách hàng mới
        if (!data.name || !data.name.trim()) {
          setError('name', { message: 'Vui lòng nhập tên khách hàng' });
          Alert.alert('Thông báo', 'Vui lòng nhập tên khách hàng');
          return;
        }
        
        if (!data.tableNumber || data.tableNumber === 0) {
          setError('tableNumber', { message: 'Vui lòng chọn bàn' });
          Alert.alert('Thông báo', 'Vui lòng chọn bàn');
          return;
        }

        console.log('Creating new guest...');
        const guestRes = await createGuestMutation.mutateAsync({
          name: data.name.trim(),
          tableNumber: data.tableNumber,
        });
        guestId = guestRes.payload.data.id;
        console.log('New guest created with ID:', guestId);
      } else {
        // Kiểm tra đã chọn guest chưa
        if (!selectedGuest) {
          Alert.alert('Thông báo', 'Vui lòng chọn khách hàng');
          return;
        }
        guestId = selectedGuest.id;
        console.log('Using existing guest ID:', guestId);
      }

      if (!guestId) {
        Alert.alert('Lỗi', 'Không thể xác định khách hàng');
        return;
      }

      console.log('Creating order for guest:', guestId);
      console.log('Orders to create:', orders);

      const result = await addOrderMutation.mutateAsync({
        guestId,
        orders,
      });

      console.log('Order created successfully:', result);
      Alert.alert('Thành công', 'Đặt hàng thành công!');
      reset();
    } catch (error) {
      console.log('Full error object:', JSON.stringify(error, null, 2));
      console.error('Lỗi khi đặt hàng:', error);
      
      // Xử lý lỗi cụ thể
      let errorMessage = 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Lỗi', errorMessage);
    }
  };

  const reset = () => {
    resetForm();
    setIsNewGuest(true);
    setSelectedGuest(null);
    setOrders([]);
    setVisible(false);
  };

  const isSubmitDisabled = useMemo(() => {
    return (
      orders.length === 0 || 
      addOrderMutation.isPending || 
      createGuestMutation.isPending ||
      (isNewGuest && (!name?.trim() || !tableNumber)) ||
      (!isNewGuest && !selectedGuest)
    );
  }, [orders.length, addOrderMutation.isPending, createGuestMutation.isPending, isNewGuest, name, tableNumber, selectedGuest]);

  if (isLoadingDishes) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={tw`mt-2 text-gray-600`}>Đang tải danh sách món ăn...</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={tw`flex-row items-center bg-primary px-3 py-2 rounded-lg gap-2`}
        onPress={() => setVisible(true)}
      >
        <PlusCircle size={18} color="white" />
        <Text style={tw`text-white font-medium`}>Tạo đơn hàng</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={reset}
      >
        <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
          <View style={tw`bg-white rounded-lg max-h-[90%]`}>
            <View style={tw`p-4 border-b border-gray-200`}>
              <Text style={tw`text-lg font-bold`}>Tạo đơn hàng</Text>
            </View>

            <ScrollView
              contentContainerStyle={tw`p-4`}
              showsVerticalScrollIndicator={false}
            >
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <Text style={tw`text-gray-700`}>Khách hàng mới</Text>
                <Switch
                  value={isNewGuest}
                  onValueChange={(value) => {
                    setIsNewGuest(value);
                    if (value) {
                      setSelectedGuest(null);
                    } else {
                      resetForm();
                    }
                  }}
                  thumbColor={isNewGuest ? "#3b82f6" : "#9ca3af"}
                  trackColor={{ true: "#bfdbfe", false: "#e5e7eb" }}
                />
              </View>

              {isNewGuest ? (
                <View style={tw`mb-4`}>
                  <Controller
                    control={control}
                    name="name"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <View style={tw`mb-4`}>
                        <Text style={tw`mb-1 text-gray-700`}>
                          Tên khách hàng *
                        </Text>
                        <TextInput
                          style={tw`border p-3 rounded-lg ${error ? "border-red-500" : "border-gray-300"}`}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Nhập tên khách hàng"
                          placeholderTextColor="#9ca3af"
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
                    name="tableNumber"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <View style={tw`mb-4`}>
                        <Text style={tw`mb-1 text-gray-700`}>Chọn bàn *</Text>
                        <View style={tw`flex-row items-center gap-2`}>
                          <Text
                            style={tw`border ${error ? "border-red-500" : "border-gray-300"} p-3 rounded-lg flex-1 ${value ? "text-gray-900" : "text-gray-400"}`}
                          >
                            {value ? `Bàn ${value}` : "Chưa chọn bàn"}
                          </Text>
                          <TablesDialog
                            onChoose={(table) => {
                              onChange(table.number);
                            }}
                          />
                        </View>
                        {error && (
                          <Text style={tw`text-red-500 text-xs mt-1`}>
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
              ) : (
                <>
                  <View style={tw`mb-4`}>
                    <Text style={tw`mb-2 text-gray-700`}>Chọn khách hàng *</Text>
                    <GuestsDialog
                      onChoose={(guest) => {
                        setSelectedGuest(guest);
                      }}
                    />
                  </View>
                  {selectedGuest && (
                    <View style={tw`mb-4 p-3 bg-gray-100 rounded-lg`}>
                      <Text style={tw`font-medium`}>
                        {selectedGuest.name} (#{selectedGuest.id})
                      </Text>
                      <Text style={tw`text-gray-600`}>
                        Bàn: {selectedGuest.tableNumber}
                      </Text>
                    </View>
                  )}
                </>
              )}

              <Text style={tw`text-lg font-bold mb-3`}>Danh sách món ăn</Text>

              {dishes
                .filter((dish) => dish.status !== DishStatus.Hidden)
                .map((dish) => (
                  <View
                    key={dish.id}
                    style={tw`flex-row mb-4 p-3 rounded-lg ${
                      dish.status === DishStatus.Unavailable
                        ? "opacity-60 bg-gray-100"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <View style={tw`mr-3 relative`}>
                      {dish.status === DishStatus.Unavailable && (
                        <View
                          style={tw`absolute inset-0 justify-center items-center z-10 bg-black/30 rounded-md`}
                        >
                          <Text style={tw`text-white text-sm font-medium`}>
                            Hết hàng
                          </Text>
                        </View>
                      )}
                      <Image
                        source={{ 
                          uri: getValidImageUrl(dish.image) || dish.image 
                        }}
                        style={tw`w-20 h-20 rounded-md`}
                        resizeMode="cover"
                        onError={() => {
                          console.log('Image load error for dish:', dish.name);
                        }}
                      />
                    </View>
                    <View style={tw`flex-1 justify-between`}>
                      <View>
                        <Text style={tw`font-medium text-gray-900`}>
                          {dish.name}
                        </Text>
                        <Text
                          style={tw`text-sm text-gray-500`}
                          numberOfLines={2}
                        >
                          {dish.description}
                        </Text>
                      </View>
                      <Text style={tw`font-medium text-primary`}>
                        {formatCurrency(dish.price)}
                      </Text>
                    </View>
                    <View style={tw`justify-center`}>
                      <Quantity
                        onChange={(value) =>
                          handleQuantityChange(dish.id, value)
                        }
                        value={
                          orders.find((order) => order.dishId === dish.id)
                            ?.quantity ?? 0
                        }
                        // disabled={dish.status === DishStatus.Unavailable}
                      />
                    </View>
                  </View>
                ))}

              {dishes.filter((dish) => dish.status !== DishStatus.Hidden).length === 0 && (
                <View style={tw`py-8 items-center`}>
                  <Text style={tw`text-gray-500`}>Không có món ăn nào</Text>
                </View>
              )}
            </ScrollView>

            <View style={tw`p-4 border-t border-gray-200`}>
              <TouchableOpacity
                style={tw`bg-primary p-4 rounded-lg flex-row justify-between items-center ${
                  isSubmitDisabled ? "opacity-50" : ""
                }`}
                onPress={handleSubmit(handleOrder)}
                disabled={isSubmitDisabled}
              >
                {(addOrderMutation.isPending || createGuestMutation.isPending) ? (
                  <View style={tw`flex-row items-center justify-center flex-1`}>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={tw`text-white font-medium ml-2`}>
                      Đang xử lý...
                    </Text>
                  </View>
                ) : (
                  <>
                    <Text style={tw`text-white font-medium`}>
                      Đặt hàng · {orders.length} món
                    </Text>
                    <Text style={tw`text-white font-medium`}>
                      {formatCurrency(totalPrice)}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`mt-3 p-4 rounded-lg border border-gray-300 justify-center items-center`}
                onPress={reset}
                disabled={addOrderMutation.isPending || createGuestMutation.isPending}
              >
                <Text style={tw`text-gray-700 font-medium`}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}