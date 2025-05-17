import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { OrderStatus } from 'src/constants/type';
import {
  formatCurrency,
  formatDateTimeToLocaleString,
  formatDateTimeToTimeString,
  getVietnameseOrderStatus,
  // Renamed to avoid conflict
} from 'src/utils/utils'; // Adjust import path
import { usePayGuestOrderMutation } from 'src/queries/useOrder'; // Mock or implement this
import { GetOrdersResType, PayGuestOrdersResType } from 'src/schemaValidations/order.schema'; // Adjust import path
import tw from 'src/utils/tw';

type Guest = GetOrdersResType['data'][0]['guest'];
type Orders = GetOrdersResType['data'];

interface OrderGuestDetailProps {
  guest: Guest;
  orders: Orders;
  onPaySuccess?: (data: PayGuestOrdersResType) => void;
}

const OrderGuestDetail: React.FC<OrderGuestDetailProps> = ({ guest, orders, onPaySuccess }) => {
  const ordersFilterToPurchase = guest
    ? orders.filter((order) => order.status !== OrderStatus.Paid && order.status !== OrderStatus.Rejected)
    : [];
  const purchasedOrderFilter = guest ? orders.filter((order) => order.status === OrderStatus.Paid) : [];
  const payForGuestMutation = usePayGuestOrderMutation(); // You'll need to implement this hook for React Native

  const pay = async () => {
    if (payForGuestMutation.isPending || !guest) return;
    try {
      const result = await payForGuestMutation.mutateAsync({
        guestId: guest.id,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onPaySuccess && onPaySuccess(result.payload);
    } catch (error) {
     error
    }
  };

  return (
    <View style={tw`space-y-2 text-sm`}>
      {guest && (
        <>
          <View style={tw`flex-row space-x-1`}>
            <Text style={tw`font-semibold`}>Tên:</Text>
            <Text>{guest.name}</Text>
            <Text style={tw`font-semibold`}>(#{guest.id})</Text>
            <Text>|</Text>
            <Text style={tw`font-semibold`}>Bàn:</Text>
            <Text>{guest.tableNumber}</Text>
          </View>
          <View style={tw`flex-row space-x-1`}>
            <Text style={tw`font-semibold`}>Ngày đăng ký:</Text>
            <Text>{formatDateTimeToLocaleString(guest.createdAt)}</Text>
          </View>
        </>
      )}

      <View style={tw`space-y-1`}>
        <Text style={tw`font-semibold`}>Đơn hàng:</Text>
        {orders.map((order, index) => (
          <View key={order.id} style={tw`flex-row gap-2 items-center text-xs`}>
            <Text style={tw`w-3`}>{index + 1}</Text>
            <Text >
              {order.status === OrderStatus.Pending}
              {order.status === OrderStatus.Processing}
              {order.status === OrderStatus.Rejected }
              {order.status === OrderStatus.Delivered }
              {order.status === OrderStatus.Paid  }
            </Text>
            <Image
              source={{ uri: order.dishSnapshot.image }}
              alt={order.dishSnapshot.name}
             
              style={tw`h-8 w-8 rounded object-cover`}
            />
            <Text style={tw`truncate w-[70px] sm:w-[100px]`} >
              {order.dishSnapshot.name}
            </Text>
            <Text style={tw`font-semibold`} >
              x{order.quantity}
            </Text>
            <Text style={tw`italic`}>{formatCurrency(order.quantity * order.dishSnapshot.price)}</Text>
            <Text
              style={tw`hidden sm:inline`}
            >
              {formatDateTimeToLocaleString(order.createdAt)}
            </Text>
            <Text
              style={tw`sm:hidden`}
             
            >
              {formatDateTimeToTimeString(order.createdAt)}
            </Text>
          </View>
        ))}
      </View>

      <View style={tw`flex-row space-x-1 items-center`}>
        <Text style={tw`font-semibold`}>Chưa thanh toán:</Text>
        <View style={tw`bg-gray-200 rounded-full px-2 py-1`}>
          <Text>
            {formatCurrency(
              ordersFilterToPurchase.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0)
            )}
          </Text>
        </View>
      </View>
      <View style={tw`flex-row space-x-1 items-center`}>
        <Text style={tw`font-semibold`}>Đã thanh toán:</Text>
        <View style={tw`border border-gray-400 rounded-full px-2 py-1`}>
          <Text>
            {formatCurrency(
              purchasedOrderFilter.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0)
            )}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={pay}
        style={tw`w-full bg-blue-500 rounded py-2 items-center ${ordersFilterToPurchase.length === 0 ? 'bg-gray-400' : ''}`}
        disabled={ordersFilterToPurchase.length === 0}
      >
        <Text style={tw`text-white text-sm`}>
          Thanh toán tất cả ({ordersFilterToPurchase.length} đơn)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderGuestDetail;