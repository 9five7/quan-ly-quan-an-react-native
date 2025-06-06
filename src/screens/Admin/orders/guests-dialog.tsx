import { endOfDay, format, startOfDay } from "date-fns";
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DatePicker from 'react-native-date-picker';
import { useGuestListQuery } from "src/queries/useAccount";
import { GetListGuestsResType } from "src/schemaValidations/account.schema";
import tw from "src/utils/tw";
import { formatDateTimeToLocaleString, simpleMatchText } from "src/utils/utils";

type GuestItem = GetListGuestsResType["data"][0];

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

interface GuestsDialogProps {
  onChoose: (guest: GuestItem) => void;
  visible?: boolean;
  onClose?: () => void;
}

export default function GuestsDialog({
  onChoose,
  visible: externalVisible,
  onClose,
}: GuestsDialogProps) {
  const [internalVisible, setInternalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [searchText, setSearchText] = useState("");
  const [tableFilter, setTableFilter] = useState("");
  const [openDatePicker, setOpenDatePicker] = useState<null | "from" | "to">(null);
  const [page, setPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState<null | "from" | "to">(null);

  // Use external visible prop if provided, otherwise use internal state
  const visible = externalVisible !== undefined ? externalVisible : internalVisible;
  const setVisible = externalVisible !== undefined ? 
    (value: boolean) => !value && onClose?.() : 
    setInternalVisible;

  const guestListQuery = useGuestListQuery({
    fromDate,
    toDate,
  });

  const data = guestListQuery.data?.payload.data ?? [];

  // Filter guests based on search criteria
  const filteredGuests = data.filter((guest) => {
    const matchesSearch = searchText
      ? simpleMatchText(guest.name + " " + guest.id, searchText)
      : true;
    const matchesTable = tableFilter
      ? simpleMatchText(guest.tableNumber.toString(), tableFilter)
      : true;

    return matchesSearch && matchesTable;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / PAGE_SIZE);
  const paginatedGuests = filteredGuests.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchText, tableFilter, fromDate, toDate]);

  const chooseGuest = (guest: GuestItem) => {
    try {
      onChoose(guest);
      setVisible(false);
      // Reset filters after selection
      setSearchText("");
      setTableFilter("");
      setPage(1);
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn khách hàng");
    }
  };

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
    setPage(1);
  };

  const handleDateChange = (selectedDate: Date) => {
    if (showDatePicker === "from") {
      setFromDate(selectedDate);
    } else if (showDatePicker === "to") {
      setToDate(selectedDate);
    }
    setShowDatePicker(null);
  };

  const clearFilters = () => {
    setSearchText("");
    setTableFilter("");
    resetDateFilter();
  };

  const renderPaginationButton = (pageNum: number, isActive: boolean) => (
    <TouchableOpacity
      key={pageNum}
      style={tw`w-10 h-10 items-center justify-center rounded mx-1 ${
        isActive ? "bg-blue-500" : "bg-gray-200"
      }`}
      onPress={() => setPage(pageNum)}
    >
      <Text style={isActive ? tw`text-white font-semibold` : tw`text-gray-700`}>
        {pageNum}
      </Text>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <TouchableOpacity
        key="prev"
        style={tw`px-3 py-2 rounded mx-1 ${
          page === 1 ? "bg-gray-200" : "bg-blue-500"
        }`}
        disabled={page === 1}
        onPress={() => setPage(page - 1)}
      >
        <Text style={page === 1 ? tw`text-gray-500` : tw`text-white`}>
          Trước
        </Text>
      </TouchableOpacity>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(renderPaginationButton(i, i === page));
    }

    // Next button
    buttons.push(
      <TouchableOpacity
        key="next"
        style={tw`px-3 py-2 rounded mx-1 ${
          page === totalPages ? "bg-gray-200" : "bg-blue-500"
        }`}
        disabled={page === totalPages}
        onPress={() => setPage(page + 1)}
      >
        <Text style={page === totalPages ? tw`text-gray-500` : tw`text-white`}>
          Sau
        </Text>
      </TouchableOpacity>
    );

    return <View style={tw`flex-row items-center justify-center`}>{buttons}</View>;
  };

  const renderGuestItem = ({ item }: { item: GuestItem }) => (
    <TouchableOpacity
      style={tw`p-4 border-b border-gray-100 active:bg-gray-50`}
      onPress={() => chooseGuest(item)}
      activeOpacity={0.7}
    >
      <View style={tw`flex-row justify-between items-start mb-1`}>
        <Text style={tw`font-semibold text-base flex-1`} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={tw`text-blue-600 font-medium ml-2`}>
          Bàn {item.tableNumber}
        </Text>
      </View>
      <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-gray-600 text-sm`}>ID: #{item.id}</Text>
        <Text style={tw`text-gray-500 text-xs`}>
          {formatDateTimeToLocaleString(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Only render trigger button if no external visible prop is provided
  const TriggerButton = externalVisible === undefined ? (
    <TouchableOpacity
      style={tw`border border-gray-300 p-3 rounded-lg bg-white active:bg-gray-50`}
      onPress={() => setVisible(true)}
      activeOpacity={0.7}
    >
      <Text style={tw`text-center text-gray-700`}>Chọn khách</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <>
      {TriggerButton}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={tw`flex-1 bg-black/50`}>
          <KeyboardAvoidingView
            style={tw`flex-1 justify-center p-4`}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={tw`bg-white rounded-lg max-h-[90%] flex-1`}>
              {/* Header */}
              <View style={tw`p-4 border-b border-gray-200 flex-row justify-between items-center`}>
                <Text style={tw`text-lg font-bold`}>Chọn khách hàng</Text>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={tw`p-2`}
                >
                  <Text style={tw`text-gray-500 text-lg`}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={tw`flex-1`}>
                {/* Date Filters */}
                <View style={tw`p-4 border-b border-gray-100`}>
                  <View style={tw`flex-row gap-2 mb-3`}>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-sm font-medium mb-1`}>Từ ngày:</Text>
                      <TouchableOpacity
                        style={tw`border border-gray-300 p-2 rounded`}
                        onPress={() => setShowDatePicker("from")}
                      >
                        <Text style={tw`text-sm`}>
                          {format(fromDate, "dd/MM/yyyy HH:mm")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-sm font-medium mb-1`}>Đến ngày:</Text>
                      <TouchableOpacity
                        style={tw`border border-gray-300 p-2 rounded`}
                        onPress={() => setShowDatePicker("to")}
                      >
                        <Text style={tw`text-sm`}>
                          {format(toDate, "dd/MM/yyyy HH:mm")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={tw`flex-row gap-2`}>
                    <TouchableOpacity
                      style={tw`bg-gray-200 px-3 py-2 rounded`}
                      onPress={resetDateFilter}
                    >
                      <Text style={tw`text-sm`}>Reset ngày</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-red-100 px-3 py-2 rounded`}
                      onPress={clearFilters}
                    >
                      <Text style={tw`text-sm text-red-600`}>Xóa bộ lọc</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Search Filters */}
                <View style={tw`p-4 border-b border-gray-100`}>
                  <View style={tw`flex-row gap-2`}>
                    <TextInput
                      style={tw`border border-gray-300 p-2 rounded flex-1`}
                      placeholder="Tìm theo tên hoặc ID"
                      value={searchText}
                      onChangeText={setSearchText}
                      clearButtonMode="while-editing"
                    />
                    <TextInput
                      style={tw`border border-gray-300 p-2 rounded w-20`}
                      placeholder="Bàn"
                      value={tableFilter}
                      onChangeText={setTableFilter}
                      keyboardType="numeric"
                      clearButtonMode="while-editing"
                    />
                  </View>
                </View>

                {/* Loading State */}
                {guestListQuery.isLoading && (
                  <View style={tw`p-8 items-center`}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={tw`mt-2 text-gray-500`}>Đang tải...</Text>
                  </View>
                )}

                {/* Error State */}
                {guestListQuery.isError && (
                  <View style={tw`p-8 items-center`}>
                    <Text style={tw`text-red-500 text-center mb-4`}>
                      Có lỗi xảy ra khi tải dữ liệu
                    </Text>
                    <TouchableOpacity
                      style={tw`bg-blue-500 px-4 py-2 rounded`}
                      onPress={() => guestListQuery.refetch()}
                    >
                      <Text style={tw`text-white`}>Thử lại</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Guests List */}
                {!guestListQuery.isLoading && !guestListQuery.isError && (
                  <FlatList
                    data={paginatedGuests}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderGuestItem}
                    style={tw`flex-1`}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                      <View style={tw`p-8 items-center`}>
                        <Text style={tw`text-gray-500 text-center`}>
                          {filteredGuests.length === 0
                            ? "Không tìm thấy khách hàng phù hợp"
                            : "Không có dữ liệu"}
                        </Text>
                      </View>
                    }
                  />
                )}

                {/* Footer with pagination */}
                {!guestListQuery.isLoading && filteredGuests.length > 0 && (
                  <View style={tw`p-4 border-t border-gray-200`}>
                    <View style={tw`flex-row justify-between items-center mb-3`}>
                      <Text style={tw`text-sm text-gray-500`}>
                        Hiển thị {paginatedGuests.length} / {filteredGuests.length} kết quả
                      </Text>
                      <Text style={tw`text-sm text-gray-500`}>
                        Trang {page} / {totalPages}
                      </Text>
                    </View>
                    {renderPagination()}
                  </View>
                )}
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        <View style={tw`p-4 border-b border-gray-100`}>
  <View style={tw`flex-row gap-2 mb-3`}>
    <View style={tw`flex-1`}>
      <Text style={tw`text-sm font-medium mb-1`}>Từ ngày:</Text>
      <TouchableOpacity
        style={tw`border border-gray-300 p-2 rounded`}
        onPress={() => setOpenDatePicker("from")}
      >
        <Text style={tw`text-sm`}>
          {format(fromDate, "dd/MM/yyyy HH:mm")}
        </Text>
      </TouchableOpacity>
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-sm font-medium mb-1`}>Đến ngày:</Text>
      <TouchableOpacity
        style={tw`border border-gray-300 p-2 rounded`}
        onPress={() => setOpenDatePicker("to")}
      >
        <Text style={tw`text-sm`}>
          {format(toDate, "dd/MM/yyyy HH:mm")}
        </Text>
      </TouchableOpacity>
    </View>
  </View>

  {/* Date picker modals */}
  <DatePicker
    modal
    mode="datetime"
    open={openDatePicker === "from"}
    date={fromDate}
    onConfirm={(date) => {
      setOpenDatePicker(null);
      setFromDate(date);
    }}
    onCancel={() => setOpenDatePicker(null)}
    locale="vi"
  />

  <DatePicker
    modal
    mode="datetime"
    open={openDatePicker === "to"}
    date={toDate}
    onConfirm={(date) => {
      setOpenDatePicker(null);
      setToDate(date);
    }}
    onCancel={() => setOpenDatePicker(null)}
    locale="vi"
  />
</View>
      </Modal>
    </>
  );
}