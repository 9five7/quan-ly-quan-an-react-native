import { Picker } from "@react-native-picker/picker";
import { endOfDay, format, startOfDay } from "date-fns";
import React, { createContext, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { OrderStatusValues } from "src/constants/type";
import {
  useGetOrderListQuery,
  useUpdateOrderMutation,
} from "src/queries/useOrder";
import { useTableListQuery } from "src/queries/useTable";
import { GetOrdersResType } from "src/schemaValidations/order.schema";
// import AddOrder from "src/screens/Admin/orders/add-order";
import EditOrder from "src/screens/Admin/orders/edit-order";
import OrderStatics from "src/screens/Admin/orders/order-statics";
import TableSkeleton from "src/screens/Admin/orders/TableSkeleton";
import { useOrderService } from "src/services/orderService";
import tw from "src/utils/tw";
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
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

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

  // Custom Date Picker Component
  const CustomDatePicker = ({
    visible,
    date,
    onClose,
    onDateSelect,
    title,
  }: {
    visible: boolean;
    date: Date;
    onClose: () => void;
    onDateSelect: (date: Date) => void;
    title: string;
  }) => {
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
    const [selectedDay, setSelectedDay] = useState(date.getDate());

    // Tạo danh sách năm (từ 2020 đến 2030)
    const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

    // Tạo danh sách tháng
    const months = [
      { value: 0, label: "Tháng 1" },
      { value: 1, label: "Tháng 2" },
      { value: 2, label: "Tháng 3" },
      { value: 3, label: "Tháng 4" },
      { value: 4, label: "Tháng 5" },
      { value: 5, label: "Tháng 6" },
      { value: 6, label: "Tháng 7" },
      { value: 7, label: "Tháng 8" },
      { value: 8, label: "Tháng 9" },
      { value: 9, label: "Tháng 10" },
      { value: 10, label: "Tháng 11" },
      { value: 11, label: "Tháng 12" },
    ];

    // Tính số ngày trong tháng được chọn
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);// Tạo danh sách ngày

    // Đảm bảo ngày được chọn không vượt quá số ngày trong tháng
    React.useEffect(() => {
      if (selectedDay > daysInMonth) {
        setSelectedDay(daysInMonth);
      }
    }, [selectedYear, selectedMonth, daysInMonth]);

    const handleConfirm = () => {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay);
      onDateSelect(newDate);
      onClose();
    };

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white rounded-lg p-4 w-80`}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>{title}</Text>

            {/* Picker cho Năm */}
            <View style={tw`mb-4`}>
              <Text style={tw`font-semibold mb-2`}>Năm:</Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
                style={tw`border border-gray-300 rounded`}
              >
                {years.map((year) => (
                  <Picker.Item
                    key={year}
                    label={year.toString()}
                    value={year}
                  />
                ))}
              </Picker>
            </View>

            {/* Picker cho Tháng */}
            <View style={tw`mb-4`}>
              <Text style={tw`font-semibold mb-2`}>Tháng:</Text>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
                style={tw`border border-gray-300 rounded`}
              >
                {months.map((month) => (
                  <Picker.Item
                    key={month.value}
                    label={month.label}
                    value={month.value}
                  />
                ))}
              </Picker>
            </View>

            {/* Picker cho Ngày */}
            <View style={tw`mb-4`}>
              <Text style={tw`font-semibold mb-2`}>Ngày:</Text>
              <Picker
                selectedValue={selectedDay}
                onValueChange={setSelectedDay}
                style={tw`border border-gray-300 rounded`}
              >
                {days.map((day) => (
                  <Picker.Item key={day} label={day.toString()} value={day} />
                ))}
              </Picker>
            </View>

            {/* Hiển thị ngày được chọn */}
            <View style={tw`bg-gray-100 p-3 rounded mb-4`}>
              <Text style={tw`text-center font-semibold`}>
                Ngày được chọn: {selectedDay}/{selectedMonth + 1}/{selectedYear}
              </Text>
            </View>

            <View style={tw`flex-row justify-between`}>
              <Button onPress={onClose} mode="outlined">
                Hủy
              </Button>
              <Button onPress={handleConfirm} mode="contained">
                Chọn
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

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

  const renderItem = ({ item }: { item: GetOrdersResType["data"][0] }) => (
    <View style={tw`flex-row py-3 border-b border-gray-200 items-center`}>
      <Text style={tw`flex-1 text-center`}>{item.tableNumber}</Text>
      <Text style={tw`flex-1 text-center`}>
        {item.guest?.name || "Đã bị xóa"}
        {item.guest && <Text style={tw`font-bold`}> (#{item.guest.id})</Text>}
      </Text>
      <View style={tw`flex-1 items-center`}>
        <Text>{item.dishSnapshot.name}</Text>
        <Text style={tw`bg-gray-200 px-2 my-1 rounded`}>x{item.quantity}</Text>
        <Text style={tw`italic`}>
          {formatCurrency(item.dishSnapshot.price * item.quantity)}
        </Text>
      </View>
      <Picker
        selectedValue={item.status}
        style={tw`flex-1 h-10`}
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
      <Text style={tw`flex-1 text-center`}>
        {item.orderHandler?.name || ""}
      </Text>
      <View style={tw`flex-1 items-center`}>
        <Text>{formatDateTimeToLocaleString(item.createdAt)}</Text>
        <Text>{formatDateTimeToLocaleString(item.updatedAt)}</Text>
      </View>
      <View style={tw`flex-1 items-center`}>
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
      <View style={tw`flex-1`}>
        <EditOrder
          id={orderIdEdit}
          setId={setOrderIdEdit}
          onSubmitSuccess={() => {}}
        />

        <View style={tw`p-4 pb-0`}>
          <View style={tw`flex-row justify-between mb-4`}>
            <View style={tw`flex-row items-center space-x-2`}>
              <Text>Từ</Text>
              <TouchableOpacity
                style={tw`border border-gray-300 px-3 py-2 rounded min-w-[150px] bg-white`}
                onPress={() => setShowFromPicker(true)}
              >
                <Text style={tw`text-gray-700`}>
                  {format(fromDate, "dd/MM/yyyy")}
                </Text>
              </TouchableOpacity>

              <Text>Đến</Text>
              <TouchableOpacity
                style={tw`border border-gray-300 px-3 py-2 rounded min-w-[150px] bg-white`}
                onPress={() => setShowToPicker(true)}
              >
                <Text style={tw`text-gray-700`}>
                  {format(toDate, "dd/MM/yyyy")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Custom Date Pickers */}
          <CustomDatePicker
            visible={showFromPicker}
            date={fromDate}
            title="Chọn ngày bắt đầu"
            onClose={() => setShowFromPicker(false)}
            onDateSelect={(date) => setFromDate(startOfDay(date))}
          />

          <CustomDatePicker
            visible={showToPicker}
            date={toDate}
            title="Chọn ngày kết thúc"
            onClose={() => setShowToPicker(false)}
            onDateSelect={(date) => setToDate(endOfDay(date))}
          />

          {/* <View style={tw`flex-row  mb-4`}>
            <Button onPress={resetDateFilter}>Reset</Button>
            <View style={tw`self-end`}>
              <AddOrder />
            </View>
          </View> */}
          <View style={tw`flex-row  mb-4`}>
            <TextInput
              placeholder="Tên khách"
              value={guestNameFilter}
              onChangeText={setGuestNameFilter}
              style={tw`flex-1 border border-gray-300  px-2 py-1 rounded`}
            />
            <TextInput
              placeholder="Số bàn"
              value={tableNumberFilter}
              onChangeText={setTableNumberFilter}
              keyboardType="numeric"
              style={tw`flex-1 border border-gray-300 px-2 py-1 rounded`}
            />
            <Picker
              selectedValue={statusFilter}
              onValueChange={setStatusFilter}
              style={tw`flex-1 h-10`}
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
        </View>

        {orderListQuery.isLoading ? (
          <TableSkeleton />
        ) : (
          <View style={tw`border border-gray-300 rounded mb-4 flex-1 mx-4`}>
            <View style={tw`flex-row bg-gray-100 p-3 border-b border-gray-300`}>
              <Text style={tw`flex-1 font-bold text-center`}>Bàn</Text>
              <Text style={tw`flex-1 font-bold text-center`}>Khách hàng</Text>
              <Text style={tw`flex-1 font-bold text-center`}>Món ăn</Text>
              <Text style={tw`flex-1 font-bold text-center`}>Trạng thái</Text>
              <Text style={tw`flex-1 font-bold text-center`}>Người xử lý</Text>
              <Text style={tw`flex-1 font-bold text-center`}>Tạo/Cập nhật</Text>
              <Text style={tw`flex-1 font-bold text-center`}>Actions</Text>
            </View>
            <FlatList
              data={paginatedOrders}
              renderItem={renderItem}
              scrollEnabled={false} // Tắt cuộn của FlatList
              nestedScrollEnabled={true}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <View style={tw`p-5 items-center`}>
                  <Text>Không có kết quả.</Text>
                </View>
              }
              ListFooterComponent={
                <View
                  style={tw`flex-row justify-between items-center py-4 px-4`}
                >
                  <Text style={tw`text-xs text-gray-500`}>
                    Hiển thị {paginatedOrders.length} trong{" "}
                    {filteredOrders.length} kết quả
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </View>
    </OrderTableContext.Provider>
  );
}
