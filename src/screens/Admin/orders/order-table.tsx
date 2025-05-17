import { Picker } from "@react-native-picker/picker";
import React, { createContext, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "react-native-paper";

import { endOfDay, format, startOfDay } from "date-fns";
import { OrderStatusValues } from "src/constants/type";
import {
  useGetOrderListQuery,
  useUpdateOrderMutation,
} from "src/queries/useOrder";
import { useTableListQuery } from "src/queries/useTable";
import { GetOrdersResType } from "src/schemaValidations/order.schema";
import AddOrder from "src/screens/Admin/orders/add-order";
import EditOrder from "src/screens/Admin/orders/edit-order";
import OrderStatics from "src/screens/Admin/orders/order-statics";
import TableSkeleton from "src/screens/Admin/orders/TableSkeleton";
import { useOrderService } from "src/services/orderService";
import {
  formatCurrency,
  formatDateTimeToLocaleString,
  getVietnameseOrderStatus,
} from "src/utils/utils";

export const OrderTableContext = createContext({
  setOrderIdEdit: (value: number | undefined) => {},
  orderIdEdit: undefined as number | undefined,
  changeStatus: (payload: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => {},
  orderObjectByGuestId: {} as OrderObjectByGuestID,
});
const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());
export type StatusCountObject = Record<
  (typeof OrderStatusValues)[number],
  number
>;
export type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};
export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;
export default function OrderTable() {
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [guestNameFilter, setGuestNameFilter] = useState("");
  const [tableNumberFilter, setTableNumberFilter] = useState("");

  const orderListQuery = useGetOrderListQuery({ fromDate, toDate });

  const orderList = orderListQuery.data?.payload.data ?? [];
  const tableListQuery = useTableListQuery();
  const tableList = tableListQuery.data?.payload.data ?? [];
  const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number);

  const { statics, orderObjectByGuestId, servingGuestByTableNumber } =
    useOrderService(orderList);
  const updateOrderMutation = useUpdateOrderMutation();

  const changeStatus = async (body: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => {
    try {
      await updateOrderMutation.mutateAsync(body);
    } catch (error) {
      error;
    }
  };

  // Filter orders based on search criteria
  const filteredOrders = orderList.filter((order) => {
    const matchesGuestName =
      guestNameFilter === "" ||
      (order.guest?.name
        ?.toLowerCase()
        .includes(guestNameFilter.toLowerCase()) ??
        false);
    const matchesTableNumber =
      tableNumberFilter === "" ||
      String(order.tableNumber).includes(tableNumberFilter);
    const matchesStatus = statusFilter === "" || order.status === statusFilter;

    return matchesGuestName && matchesTableNumber && matchesStatus;
  });

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  // useEffect(() => {
  //   if (socket?.connected) {
  //     onConnect();
  //   }

  //   function onConnect() {}
  //   function onDisconnect() {}
  //   function refetch() {
  //     const now = new Date();
  //     if (now >= fromDate && now <= toDate) {
  //       refetchOrderList();
  //     }
  //   }
  //   function onUpdateOrder(data: UpdateOrderResType['data']) {
  //     const { dishSnapshot: { name }, quantity } = data;
  //     // Show toast notification
  //     console.log(`Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(data.status)}"`);
  //     refetch();
  //   }
  //   function onNewOrder(data: GuestCreateOrdersResType['data']) {
  //     const { guest } = data[0];
  //     // Show toast notification
  //     console.log(`${guest?.name} tại bàn ${guest?.tableNumber} vừa đặt ${data.length} đơn`);
  //     refetchOrderList();
  //   }
  //   function onPay(data: GuestCreateOrdersResType['data']) {
  //     const { guest } = data[0];
  //     // Show toast notification
  //     console.log(`${guest?.name} tại bàn ${guest?.tableNumber} vừa thanh toán ${data.length} đơn`);
  //     refetch();
  //   }

  //   socket?.on('update-order', onUpdateOrder);
  //   socket?.on('new-order', onNewOrder);
  //   socket?.on('connect', onConnect);
  //   socket?.on('disconnect', onDisconnect);
  //   socket?.on('payment', onPay);

  //   return () => {
  //     socket?.off('connect', onConnect);
  //     socket?.off('disconnect', onDisconnect);
  //     socket?.off('update-order', onUpdateOrder);
  //     socket?.off('new-order', onNewOrder);
  //     socket?.off('payment', onPay);
  //   };
  // }, [refetchOrderList, fromDate, toDate, socket]);

  const renderItem = ({ item }: { item: GetOrdersResType["data"][0] }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.tableNumber}</Text>
      <Text style={styles.cell}>
        {item.guest?.name || "Đã bị xóa"}
        {item.guest && <Text style={styles.bold}> (#{item.guest.id})</Text>}
      </Text>
      <View style={styles.dishCell}>
        <Text>{item.dishSnapshot.name}</Text>
        <Text style={styles.quantity}>x{item.quantity}</Text>
        <Text style={styles.price}>
          {formatCurrency(item.dishSnapshot.price * item.quantity)}
        </Text>
      </View>
      <Picker
        selectedValue={item.status}
        style={styles.picker}
        onValueChange={(status) =>
          changeStatus({
            orderId: item.id,
            dishId: item.dishSnapshot.dishId!,
            status,
            quantity: item.quantity,
          })
        }
      >
        {OrderStatusValues.map((status) => (
          <Picker.Item
            key={status}
            label={getVietnameseOrderStatus(status)}
            value={status}
          />
        ))}
      </Picker>
      <Text style={styles.cell}>{item.orderHandler?.name || ""}</Text>
      <View style={styles.dateCell}>
        <Text>{formatDateTimeToLocaleString(item.createdAt)}</Text>
        <Text>{formatDateTimeToLocaleString(item.updatedAt)}</Text>
      </View>
      <View style={styles.actionsCell}>
        <Button onPress={() => setOrderIdEdit(item.id)}>Sửa</Button>
      </View>
    </View>
  );

  return (
    <OrderTableContext.Provider
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId,
      }}
    >
      <View style={styles.container}>
        <EditOrder
          id={orderIdEdit}
          setId={setOrderIdEdit}
          onSubmitSuccess={() => {}}
        />

        <View style={styles.filterContainer}>
          <View style={styles.dateFilter}>
            <Text>Từ</Text>
            <TextInput
              style={styles.dateInput}
              value={format(fromDate, "yyyy-MM-dd HH:mm")}
              onChangeText={(text) => setFromDate(new Date(text))}
            />
            <Text>Đến</Text>
            <TextInput
              style={styles.dateInput}
              value={format(toDate, "yyyy-MM-dd HH:mm")}
              onChangeText={(text) => setToDate(new Date(text))}
            />
            <Button onPress={resetDateFilter}>Reset</Button>
          </View>

          <View style={styles.addButton}>
            <AddOrder />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Tên khách"
            value={guestNameFilter}
            onChangeText={setGuestNameFilter}
            style={styles.searchInput}
          />
          <TextInput
            placeholder="Số bàn"
            value={tableNumberFilter}
            onChangeText={setTableNumberFilter}
            style={styles.searchInput}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={statusFilter}
            onValueChange={setStatusFilter}
            style={styles.statusPicker}
          >
            <Picker.Item label="Trạng thái" value="" />
            {OrderStatusValues.map((status) => (
              <Picker.Item
                key={status}
                label={getVietnameseOrderStatus(status)}
                value={status}
              />
            ))}
          </Picker>
        </View>

        <OrderStatics
          statics={statics}
          tableList={tableListSortedByNumber}
          servingGuestByTableNumber={servingGuestByTableNumber}
        />

        {orderListQuery.isLoading ? (
          <TableSkeleton />
        ) : (
          <View style={styles.tableContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.headerCell}>Bàn</Text>
              <Text style={styles.headerCell}>Khách hàng</Text>
              <Text style={styles.headerCell}>Món ăn</Text>
              <Text style={styles.headerCell}>Trạng thái</Text>
              <Text style={styles.headerCell}>Người xử lý</Text>
              <Text style={styles.headerCell}>Tạo/Cập nhật</Text>
              <Text style={styles.headerCell}>Actions</Text>
            </View>

            <FlatList
              data={paginatedOrders}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text>No results.</Text>
                </View>
              }
            />
          </View>
        )}

        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>
            Hiển thị {paginatedOrders.length} trong {filteredOrders.length} kết
            quả
          </Text>
          {/* <AutoPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          /> */}
        </View>
      </View>
    </OrderTableContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateFilter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    minWidth: 150,
  },
  addButton: {
    alignSelf: "flex-end",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  statusPicker: {
    flex: 1,
    height: 40,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  dishCell: {
    flex: 1,
    alignItems: "center",
  },
  quantity: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 4,
    borderRadius: 4,
    marginVertical: 4,
  },
  price: {
    fontStyle: "italic",
  },
  picker: {
    flex: 1,
    height: 40,
  },
  dateCell: {
    flex: 1,
    alignItems: "center",
  },
  actionsCell: {
    flex: 1,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  paginationText: {
    fontSize: 12,
    color: "#666",
  },
  bold: {
    fontWeight: "bold",
  },
});
