import React from "react";
import { Image, Text, TouchableOpacity, View, Alert } from "react-native";

import { OrderStatus } from "src/constants/type";
import { usePayGuestOrderMutation } from "src/queries/useOrder";
import {
  GetOrdersResType,
  PayGuestOrdersResType,
} from "src/schemaValidations/order.schema";
import tw from "src/utils/tw";
import {
  formatCurrency,
  formatDateTimeToLocaleString,
  formatDateTimeToTimeString,
  getValidImageUrl,
  getVietnameseOrderStatus,
} from "src/utils/utils";

type Guest = GetOrdersResType["data"][0]["guest"];
type Orders = GetOrdersResType["data"];

interface OrderGuestDetailProps {
  guest: Guest;
  orders: Orders;
  onPaySuccess?: (data: PayGuestOrdersResType) => void;
}

// Status Icon Component cho React Native
const StatusIcon: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case OrderStatus.Pending:
        return "text-yellow-500";
      case OrderStatus.Processing:
        return "text-blue-500";
      case OrderStatus.Rejected:
        return "text-red-500";
      case OrderStatus.Delivered:
        return "text-green-500";
      case OrderStatus.Paid:
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusSymbol = () => {
    switch (status) {
      case OrderStatus.Pending:
        return "⏳";
      case OrderStatus.Processing:
        return "🔄";
      case OrderStatus.Rejected:
        return "❌";
      case OrderStatus.Delivered:
        return "✅";
      case OrderStatus.Paid:
        return "💰";
      default:
        return "❓";
    }
  };

  return (
    <Text style={tw`${getStatusColor()} text-base`}>
      {getStatusSymbol()}
    </Text>
  );
};

const OrderGuestDetail: React.FC<OrderGuestDetailProps> = ({
  guest,
  orders,
  onPaySuccess,
}) => {
  const ordersFilterToPurchase = guest
    ? orders.filter(
        (order) =>
          order.status !== OrderStatus.Paid &&
          order.status !== OrderStatus.Rejected
      )
    : [];
  
  const purchasedOrderFilter = guest
    ? orders.filter((order) => order.status === OrderStatus.Paid)
    : [];
  
  const payForGuestMutation = usePayGuestOrderMutation();

  const pay = async () => {
    if (payForGuestMutation.isPending || !guest) return;
    
    try {
      console.log("Starting payment for guest:", guest.id);
      
      const result = await payForGuestMutation.mutateAsync({
        guestId: guest.id,
      });
      
      console.log("Payment successful:", result);
      
      if (onPaySuccess) {
        onPaySuccess(result.payload);
      }
      
      Alert.alert("Thành công", "Thanh toán thành công!");
      
    } catch (error) {
      console.error("Payment error:", error);
      
      // Hiển thị lỗi cho người dùng
      Alert.alert(
        "Lỗi thanh toán", 
        error?.message || "Có lỗi xảy ra khi thanh toán. Vui lòng thử lại."
      );
    }
  };

  if (!guest) {
    return (
      <View style={tw`p-4`}>
        <Text style={tw`text-center text-gray-500`}>
          Không có thông tin khách hàng
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`p-4`}>
      {/* Guest Info */}
      <View style={tw`mb-4`}>
        <View style={tw`flex-row flex-wrap items-center mb-2`}>
          <Text style={tw`font-semibold mr-1`}>Tên:</Text>
          <Text style={tw`mr-2`}>{guest.name}</Text>
          <Text style={tw`font-semibold mr-1`}>(#{guest.id})</Text>
          <Text style={tw`mx-2`}>|</Text>
          <Text style={tw`font-semibold mr-1`}>Bàn:</Text>
          <Text>{guest.tableNumber}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`font-semibold mr-1`}>Ngày đăng ký:</Text>
          <Text>{formatDateTimeToLocaleString(guest.createdAt)}</Text>
        </View>
      </View>

      {/* Orders List */}
      <View style={tw`mb-4`}>
        <Text style={tw`font-semibold mb-2`}>Đơn hàng:</Text>
        {orders.map((order, index) => (
          <View key={order.id} style={tw`flex-row items-center mb-2 p-2 bg-gray-50 rounded`}>
            <Text style={tw`w-6 text-xs`}>{index + 1}</Text>
            
            <View style={tw`w-8 items-center`}>
              <StatusIcon status={order.status} />
            </View>
            
            <Image
              source={{
                uri: getValidImageUrl(order.dishSnapshot.image) || order.dishSnapshot.image,
              }}
              style={tw`h-8 w-8 rounded mr-2`}
              resizeMode="cover"
            />
            
            <View style={tw`flex-1 mr-2`}>
              <Text style={tw`text-xs`} numberOfLines={1}>
                {order.dishSnapshot.name}
              </Text>
            </View>
            
            <Text style={tw`font-semibold text-xs mr-2`}>
              x{order.quantity}
            </Text>
            
            <Text style={tw`italic text-xs mr-2`}>
              {formatCurrency(order.quantity * order.dishSnapshot.price)}
            </Text>
            
            <Text style={tw`text-xs text-gray-500`}>
              {formatDateTimeToTimeString(order.createdAt)}
            </Text>
          </View>
        ))}
      </View>

      {/* Payment Summary */}
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`font-semibold mr-2`}>Chưa thanh toán:</Text>
          <View style={tw`bg-red-100 rounded-full px-3 py-1`}>
            <Text style={tw`text-red-800 font-semibold`}>
              {formatCurrency(
                ordersFilterToPurchase.reduce((acc, order) => {
                  return acc + order.quantity * order.dishSnapshot.price;
                }, 0)
              )}
            </Text>
          </View>
        </View>
        
        <View style={tw`flex-row items-center`}>
          <Text style={tw`font-semibold mr-2`}>Đã thanh toán:</Text>
          <View style={tw`border border-green-400 rounded-full px-3 py-1`}>
            <Text style={tw`text-green-600 font-semibold`}>
              {formatCurrency(
                purchasedOrderFilter.reduce((acc, order) => {
                  return acc + order.quantity * order.dishSnapshot.price;
                }, 0)
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Button */}
      <TouchableOpacity
        onPress={pay}
        style={tw`w-full rounded py-3 items-center ${
          ordersFilterToPurchase.length === 0 || payForGuestMutation.isPending
            ? "bg-gray-400" 
            : "bg-blue-500"
        }`}
        disabled={ordersFilterToPurchase.length === 0 || payForGuestMutation.isPending}
      >
        <Text style={tw`text-white font-semibold`}>
          {payForGuestMutation.isPending 
            ? "Đang xử lý..." 
            : `Thanh toán tất cả (${ordersFilterToPurchase.length} đơn)`
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderGuestDetail;