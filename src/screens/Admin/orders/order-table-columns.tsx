import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Menu, Divider, Button } from 'react-native-paper';
import { GetOrdersResType } from 'src/schemaValidations/order.schema';
import { formatCurrency, formatDateTimeToLocaleString, getVietnameseOrderStatus } from 'src/utils/utils';
import { OrderStatusValues } from 'src/constants/type';
import { OrderTableContext } from 'src/screens/Admin/orders/order-table';
import { Picker } from '@react-native-picker/picker';


type OrderItem = GetOrdersResType['data'][0];

export const orderTableColumns = [
  {
    id: 'tableNumber',
    header: 'Bàn',
    render: (row: OrderItem) => <Text>{row.tableNumber}</Text>,
    filter: (row: OrderItem, filterValue: string) => {
      if (!filterValue) return true;
      return String(row.tableNumber).includes(filterValue);
    }
  },
  {
    id: 'guestName',
    header: 'Khách hàng',
    render: function Cell(row: OrderItem) {
      const { orderObjectByGuestId } = useContext(OrderTableContext);
      const guest = row.guest;
      
      return (
        <View>
          {!guest ? (
            <Text>Đã bị xóa</Text>
          ) : (
            <TouchableOpacity onPress={() => {/* Implement modal for guest details */}}>
              <View>
                <Text>{guest.name}</Text>
                <Text style={styles.bold}>(#{guest.id})</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    filter: (row: OrderItem, filterValue: string) => {
      if (!filterValue) return true;
      return (row.guest?.name ?? 'Đã bị xóa').includes(filterValue);
    }
  },
  {
    id: 'dishName',
    header: 'Món ăn',
    render: (row: OrderItem) => (
      <View style={styles.dishContainer}>
        <TouchableOpacity onPress={() => {/* Implement image modal */}}>
          <Image
            source={{ uri: row.dishSnapshot.image }}
            style={styles.dishImage}
          />
        </TouchableOpacity>

        <View style={styles.dishInfo}>
          <View style={styles.quantityRow}>
            <Text>{row.dishSnapshot.name}</Text>
            <View style={styles.quantityBadge}>
              <Text>x{row.quantity}</Text>
            </View>
          </View>
          <Text style={styles.italic}>
            {formatCurrency(row.dishSnapshot.price * row.quantity)}
          </Text>
        </View>
      </View>
    )
  },
  {
    id: 'status',
    header: 'Trạng thái',
    render: function StatusCell(row: OrderItem) {
      const { changeStatus } = useContext(OrderTableContext);
      
      const changeOrderStatus = (status: typeof OrderStatusValues[number]) => {
        changeStatus({
          orderId: row.id,
          dishId: row.dishSnapshot.dishId!,
          status: status,
          quantity: row.quantity
        });
      };

      return (
        <Picker
          selectedValue={row.status}
          style={styles.picker}
          onValueChange={changeOrderStatus}
        >
          {OrderStatusValues.map((status) => (
            <Picker.Item 
              key={status} 
              label={getVietnameseOrderStatus(status)} 
              value={status} 
            />
          ))}
        </Picker>
      );
    }
  },
  {
    id: 'orderHandlerName',
    header: 'Người xử lý',
    render: (row: OrderItem) => <Text>{row.orderHandler?.name ?? ''}</Text>
  },
  {
    id: 'createdAt',
    header: 'Tạo/Cập nhật',
    render: (row: OrderItem) => (
      <View style={styles.dateContainer}>
        <Text>{formatDateTimeToLocaleString(row.createdAt)}</Text>
        <Text>{formatDateTimeToLocaleString(row.updatedAt)}</Text>
      </View>
    )
  },
  {
    id: 'actions',
    render: function Actions(row: OrderItem) {
      const { setOrderIdEdit } = useContext(OrderTableContext);
      const [visible, setVisible] = React.useState(false);
      
      const openEditOrder = () => {
        setOrderIdEdit(row.id);
        setVisible(false);
      };

      return (
        <Menu
          visible={visible}
          onDismiss={() => setVisible(false)}
          anchor={
            <Button onPress={() => setVisible(true)}>
              ⋮
            </Button>
          }
        >
          <Menu.Item onPress={openEditOrder} title="Sửa" />
          <Divider />
        </Menu>
      );
    }
  }
];

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold'
  },
  dishContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dishImage: {
    width: 50,
    height: 50,
    borderRadius: 4
  },
  dishInfo: {
    gap: 4
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  quantityBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    borderRadius: 4
  },
  italic: {
    fontStyle: 'italic'
  },
  dateContainer: {
    gap: 4
  },
  picker: {
    width: 140,
    height: 40
  }
});