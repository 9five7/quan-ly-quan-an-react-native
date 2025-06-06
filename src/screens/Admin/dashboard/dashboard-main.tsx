import { Picker } from "@react-native-picker/picker";
import { endOfDay, format, startOfDay } from "date-fns";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { useIndicatorQuery } from "src/queries/useIndicator";
import DishBarChart from "src/screens/Admin/dashboard/dish-bar-chart";
import { RevenueLineChart } from "src/screens/Admin/dashboard/line-chart";

import tw from "src/utils/tw";
import { formatCurrency } from "src/utils/utils";

const { width } = Dimensions.get("window");

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

// Custom Date Picker Component (same as your enhanced version)
const CustomDatePicker = ({ visible, date, onClose, onDateSelect, title }) => {
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedDay, setSelectedDay] = useState(date.getDate());
  const [selectedHour, setSelectedHour] = useState(date.getHours());
  const [selectedMinute, setSelectedMinute] = useState(date.getMinutes());

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);
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

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const newDate = new Date(
      selectedYear,
      selectedMonth,
      selectedDay,
      selectedHour,
      selectedMinute
    );
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
        <View style={tw`bg-white rounded-lg p-4 w-11/12 max-h-5/6`}>
          <Text style={tw`text-lg font-bold text-center mb-4`}>{title}</Text>

          <ScrollView style={tw`max-h-80`}>
            {/* Year Picker */}
            <View style={tw`mb-3`}>
              <Text style={tw`font-semibold mb-2`}>Năm:</Text>
              <Picker
                selectedValue={selectedYear}
                onValueChange={setSelectedYear}
                style={tw`border border-gray-300 rounded h-12`}
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

            {/* Month Picker */}
            <View style={tw`mb-3`}>
              <Text style={tw`font-semibold mb-2`}>Tháng:</Text>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={setSelectedMonth}
                style={tw`border border-gray-300 rounded h-12`}
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

            {/* Day Picker */}
            <View style={tw`mb-3`}>
              <Text style={tw`font-semibold mb-2`}>Ngày:</Text>
              <Picker
                selectedValue={selectedDay}
                onValueChange={setSelectedDay}
                style={tw`border border-gray-300 rounded h-12`}
              >
                {days.map((day) => (
                  <Picker.Item key={day} label={day.toString()} value={day} />
                ))}
              </Picker>
            </View>

            {/* Hour Picker */}
            <View style={tw`mb-3`}>
              <Text style={tw`font-semibold mb-2`}>Giờ:</Text>
              <Picker
                selectedValue={selectedHour}
                onValueChange={setSelectedHour}
                style={tw`border border-gray-300 rounded h-12`}
              >
                {hours.map((hour) => (
                  <Picker.Item
                    key={hour}
                    label={hour.toString().padStart(2, "0")}
                    value={hour}
                  />
                ))}
              </Picker>
            </View>

            {/* Minute Picker */}
            <View style={tw`mb-3`}>
              <Text style={tw`font-semibold mb-2`}>Phút:</Text>
              <Picker
                selectedValue={selectedMinute}
                onValueChange={setSelectedMinute}
                style={tw`border border-gray-300 rounded h-12`}
              >
                {minutes.map((minute) => (
                  <Picker.Item
                    key={minute}
                    label={minute.toString().padStart(2, "0")}
                    value={minute}
                  />
                ))}
              </Picker>
            </View>
          </ScrollView>

          <View style={tw`bg-gray-100 p-3 rounded mb-4`}>
            <Text style={tw`text-center font-semibold`}>
              {selectedDay}/{selectedMonth + 1}/{selectedYear}{" "}
              {selectedHour.toString().padStart(2, "0")}:
              {selectedMinute.toString().padStart(2, "0")}
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

// Statistics Card Component
const StatCard = ({ title, value, subtitle, icon }) => (
  <View
    style={tw`bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-1 min-w-40 m-1`}
  >
    <View style={tw`flex-row justify-between items-center mb-2`}>
      <Text style={tw`text-sm font-medium text-gray-600`}>{title}</Text>
      {icon}
    </View>
    <Text style={tw`text-2xl font-bold text-gray-900`}>{value}</Text>
    {subtitle && <Text style={tw`text-xs text-gray-500 mt-1`}>{subtitle}</Text>}
  </View>
);

// Chart Container Component
const ChartContainer = ({ title, children, style }) => (
  <View
    style={[
      tw`bg-white rounded-lg p-4 shadow-sm border border-gray-200`,
      style,
    ]}
  >
    <Text style={tw`text-lg font-semibold mb-4`}>{title}</Text>
    {children}
  </View>
);

export default function DashboardMain() {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const { data } = useIndicatorQuery({ fromDate, toDate });
  const revenue = data?.payload.data.revenue ?? 0;
  const guestCount = data?.payload.data.guestCount ?? 0;
  const orderCount = data?.payload.data.orderCount ?? 0;
  const tableCount = data?.payload.data.servingTableCount ?? 0;
  const revenueByDate = data?.payload.data.revenueByDate ?? [];
  const dishIndicator = data?.payload.data.dishIndicator ?? [];

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  return (
    <ScrollView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`p-4`}>
        {/* Date Filter Section */}
        <View
          style={tw`bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200`}
        >
          <Text style={tw`text-lg font-semibold mb-3`}>Bộ lọc thời gian</Text>

          <View style={tw`flex-row flex-wrap gap-2 items-center mb-3`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`mr-2 text-gray-700`}>Từ:</Text>
              <TouchableOpacity
                style={tw`border border-gray-300 px-3 py-2 rounded-lg bg-white min-w-40`}
                onPress={() => setShowFromPicker(true)}
              >
                <Text style={tw`text-gray-700`}>
                  {format(fromDate, "dd/MM/yyyy HH:mm")}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-row items-center`}>
              <Text style={tw`mr-2 text-gray-700`}>Đến:</Text>
              <TouchableOpacity
                style={tw`border border-gray-300 px-3 py-2 rounded-lg bg-white min-w-40`}
                onPress={() => setShowToPicker(true)}
              >
                <Text style={tw`text-gray-700`}>
                  {format(toDate, "dd/MM/yyyy HH:mm")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            mode="outlined"
            onPress={resetDateFilter}
            style={tw`self-start`}
          >
            Reset
          </Button>
        </View>

        {/* Statistics Cards */}
        <View style={tw`flex-row flex-wrap justify-between mb-4`}>
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(revenue)}
            icon={<View style={tw`w-4 h-4 bg-green-100 rounded p-1`}>
              <Text style={tw`text-green-600 text-xs`}>₫</Text>
            </View>} subtitle={undefined}          />

          <StatCard
            title="Khách"
            value={guestCount.toString()}
            subtitle="Gọi món"
            icon={
              <View style={tw`w-4 h-4 bg-blue-100 rounded p-1`}>
                <Text style={tw`text-blue-600 text-xs`}>👥</Text>
              </View>
            }
          />
        </View>

        <View style={tw`flex-row flex-wrap justify-between mb-4`}>
          <StatCard
            title="Đơn hàng"
            value={orderCount.toString()}
            subtitle="Đã thanh toán"
            icon={
              <View style={tw`w-4 h-4 bg-orange-100 rounded p-1`}>
                <Text style={tw`text-orange-600 text-xs`}>📋</Text>
              </View>
            }
          />

          <StatCard
            title="Bàn đang phục vụ"
            value={tableCount.toString()}
            icon={<View style={tw`w-4 h-4 bg-purple-100 rounded p-1`}>
              <Text style={tw`text-purple-600 text-xs`}>🍽️</Text>
            </View>} subtitle={undefined}          />
        </View>

        {/* Charts Section */}
        <View style={tw`space-y-4`}>
          <ChartContainer
            title="Biểu đồ doanh thu theo ngày"
            style={{ minHeight: 250 }}
          >
            <RevenueLineChart revenueByDate={revenueByDate} />
          </ChartContainer>

          <ChartContainer
            title="Biểu đồ món ăn bán chạy"
            style={{ minHeight: 200 }}
          >
            <DishBarChart chartData={dishIndicator} />
          </ChartContainer>
        </View>

        {/* Date Pickers */}
        <CustomDatePicker
          visible={showFromPicker}
          date={fromDate}
          title="Chọn ngày bắt đầu"
          onClose={() => setShowFromPicker(false)}
          onDateSelect={(date) => setFromDate(date)}
        />

        <CustomDatePicker
          visible={showToPicker}
          date={toDate}
          title="Chọn ngày kết thúc"
          onClose={() => setShowToPicker(false)}
          onDateSelect={(date) => setToDate(date)}
        />
      </View>
    </ScrollView>
  );
}
