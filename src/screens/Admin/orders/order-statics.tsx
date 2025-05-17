import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import tw from 'src/utils/tw';
import { Users } from 'lucide-react-native';
import { OrderStatus, OrderStatusValues } from 'src/constants/type';
import { getVietnameseOrderStatus } from 'src/utils/utils';

import { TableListResType } from 'src/schemaValidations/table.schema';
import OrderGuestDetail from 'src/screens/Admin/orders/order-guest-detail';

type StatusCountObject = Partial<Record<typeof OrderStatusValues[number], number>>;
type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};
type ServingGuestByTableNumber = Record<number, Record<number, any[]>>;

const OrderStatusIcon = {
  Pending: () => <Text style={tw`text-yellow-500`}>⏱</Text>,
  Processing: () => <Text style={tw`text-blue-500`}>👨‍🍳</Text>,
  Delivered: () => <Text style={tw`text-green-500`}>✓</Text>,
};

export default function OrderStatics({
  statics,
  tableList,
  servingGuestByTableNumber
}: {
  statics: Statics;
  tableList: TableListResType['data'];
  servingGuestByTableNumber: ServingGuestByTableNumber;
}) {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);
  const selectedServingGuest = selectedTableNumber ? servingGuestByTableNumber[selectedTableNumber] : null;

  return (
    <View style={tw`mb-4`}>
      {/* Modal for table detail */}
      <Modal
        visible={!!selectedTableNumber}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedTableNumber(null)}
      >
        <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
          <View style={tw`bg-white rounded-lg p-4 max-h-[80%]`}>
            {selectedServingGuest && (
              <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-bold`}>
                  Khách đang ngồi tại bàn {selectedTableNumber}
                </Text>
              </View>
            )}

            <FlatList
              data={selectedServingGuest ? Object.entries(selectedServingGuest) : []}
              keyExtractor={([guestId]) => guestId}
              renderItem={({ item: [guestId, orders] }) => (
                <View style={tw`mb-4`}>
                  <OrderGuestDetail guest={orders[0].guest} orders={orders} />
                </View>
              )}
              ItemSeparatorComponent={() => <View style={tw`h-px bg-gray-200 my-2`} />}
            />

            <TouchableOpacity
              style={tw`mt-4 bg-blue-500 p-2 rounded items-center`}
              onPress={() => setSelectedTableNumber(null)}
            >
              <Text style={tw`text-white`}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Table status cards */}
      <View style={tw`flex-row flex-wrap gap-2 py-2`}>
        {tableList.map((table) => {
          const tableNumber = table.number;
          const tableStatics = statics.table[tableNumber];
          let isEmptyTable = true;
          let countObject: StatusCountObject = {
            Pending: 0,
            Processing: 0,
            Delivered: 0,
            Paid: 0,
            Rejected: 0
          };
          
          const servingGuestCount = Object.values(servingGuestByTableNumber[tableNumber] ?? {}).length;

          if (tableStatics) {
            for (const guestId in tableStatics) {
              const guestStatics = tableStatics[Number(guestId)];
              if ([guestStatics.Pending, guestStatics.Processing, guestStatics.Delivered].some(
                status => status !== 0 && status !== undefined
              )) {
                isEmptyTable = false;
              }
              countObject = {
                Pending: countObject.Pending + (guestStatics.Pending ?? 0),
                Processing: countObject.Processing + (guestStatics.Processing ?? 0),
                Delivered: countObject.Delivered + (guestStatics.Delivered ?? 0),
                Paid: countObject.Paid + (guestStatics.Paid ?? 0),
                Rejected: countObject.Rejected + (guestStatics.Rejected ?? 0)
              };
            }
          }

          return (
            <TouchableOpacity
              key={tableNumber}
              style={tw`border p-2 rounded-md flex-row items-center gap-2 ${
                !isEmptyTable ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
              }`}
              onPress={() => !isEmptyTable && setSelectedTableNumber(tableNumber)}
            >
              <View style={tw`items-center`}>
                <Text style={tw`font-bold text-lg`}>{tableNumber}</Text>
                <View style={tw`flex-row items-center gap-1`}>
                  <Users size={16} color="gray" />
                  <Text>{servingGuestCount}</Text>
                </View>
              </View>

              <View style={tw`h-8 w-px bg-gray-300`} />

              {isEmptyTable ? (
                <Text style={tw`text-sm`}>Trống</Text>
              ) : (
                <View style={tw`gap-1`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <OrderStatusIcon.Pending />
                    <Text>{countObject[OrderStatus.Pending] ?? 0}</Text>
                  </View>
                  <View style={tw`flex-row items-center gap-2`}>
                    <OrderStatusIcon.Processing />
                    <Text>{countObject[OrderStatus.Processing] ?? 0}</Text>
                  </View>
                  <View style={tw`flex-row items-center gap-2`}>
                    <OrderStatusIcon.Delivered />
                    <Text>{countObject[OrderStatus.Delivered] ?? 0}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Order status summary */}
      <View style={tw`flex-row flex-wrap gap-2 py-2`}>
        {OrderStatusValues.map((status) => (
          <View key={status} style={tw`bg-gray-100 px-3 py-1 rounded-full`}>
            <Text>
              {getVietnameseOrderStatus(status)}: {statics.status[status] ?? 0}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}