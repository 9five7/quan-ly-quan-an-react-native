import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "src/schemaValidations/guest.schema";
import { CreateOrdersBodyType } from "src/schemaValidations/order.schema";
import GuestsDialog from "src/screens/Admin/orders/guests-dialog";
import { TablesDialog } from "src/screens/Admin/orders/tables-dialog";
import tw from "src/utils/tw";
import { formatCurrency } from "src/utils/utils";

export default function AddOrder() {
  const [visible, setVisible] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrdersBodyType["orders"]>([]);
  const [dishes, setDishes] = useState<any[]>([]); // TODO: Replace with actual dishes data

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const { control, handleSubmit, watch } = useForm<GuestLoginBodyType>({
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

  const handleOrder = () => {
    // Handle order submission
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={tw`flex-row items-center bg-blue-500 px-3 py-1 rounded gap-1`}
        onPress={() => setVisible(true)}
      >
        <PlusCircle size={14} color="white" />
        <Text style={tw`text-white`}>Tạo đơn hàng</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
          <View style={tw`bg-white rounded-lg max-h-[90%]`}>
            <View style={tw`p-4 border-b border-gray-200`}>
              <Text style={tw`text-lg font-bold`}>Tạo đơn hàng</Text>
            </View>

            <ScrollView contentContainerStyle={tw`p-4`}>
              <View style={tw`flex-row items-center justify-between mb-4`}>
                <Text>Khách hàng mới</Text>
                <Switch value={isNewGuest} onValueChange={setIsNewGuest} />
              </View>

              {isNewGuest && (
                <View style={tw`mb-4`}>
                  <Controller
                    control={control}
                    name="name"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <View style={tw`mb-4`}>
                        <Text style={tw`mb-1`}>Tên khách hàng</Text>
                        <TextInput
                          style={tw`border p-2 rounded ${error ? "border-red-500" : "border-gray-300"}`}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          placeholder="Nhập tên khách hàng"
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
                    render={({ field: { onChange, value } }) => (
                      <View style={tw`mb-4`}>
                        <Text style={tw`mb-1`}>Chọn bàn</Text>
                        <View style={tw`flex-row items-center gap-2`}>
                          <Text style={tw`border p-2 rounded flex-1`}>
                            {value || "Chưa chọn bàn"}
                          </Text>
                          <TablesDialog
                            onChoose={(table) => {
                              onChange(table.number);
                            }}
                          />
                        </View>
                      </View>
                    )}
                  />
                </View>
              )}

              {!isNewGuest && (
                <GuestsDialog
                  onChoose={(guest) => {
                    setSelectedGuest(guest);
                  }}
                />
              )}

              {!isNewGuest && selectedGuest && (
                <View style={tw`mb-4 p-3 bg-gray-100 rounded`}>
                  <Text>
                    Khách đã chọn: {selectedGuest.name} (#{selectedGuest.id})
                  </Text>
                  <Text>Bàn: {selectedGuest.tableNumber}</Text>
                </View>
              )}

              {dishes
                .filter((dish) => dish.status !== DishStatus.Hidden)
                .map((dish) => (
                  <View
                    key={dish.id}
                    style={tw`flex-row mb-4 p-2 ${dish.status === DishStatus.Unavailable ? "opacity-50" : ""}`}
                  >
                    <View style={tw`mr-3`}>
                      {dish.status === DishStatus.Unavailable && (
                        <View
                          style={tw`absolute inset-0 justify-center items-center z-10`}
                        >
                          <Text style={tw`text-sm bg-white p-1 rounded`}>
                            Hết hàng
                          </Text>
                        </View>
                      )}
                      <Image
                        source={{ uri: dish.image }}
                        style={tw`w-20 h-20 rounded-md`}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-medium`}>{dish.name}</Text>
                      <Text style={tw`text-sm text-gray-600`}>
                        {dish.description}
                      </Text>
                      <Text style={tw`font-medium`}>
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
                        disabled={dish.status === DishStatus.Unavailable}
                      />
                    </View>
                  </View>
                ))}
            </ScrollView>

            <TouchableOpacity
              style={tw`bg-blue-500 p-3 m-4 rounded flex-row justify-between items-center ${orders.length === 0 ? "opacity-50" : ""}`}
              onPress={handleOrder}
              disabled={orders.length === 0}
            >
              <Text style={tw`text-white`}>Đặt hàng · {orders.length} món</Text>
              <Text style={tw`text-white`}>{formatCurrency(totalPrice)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
