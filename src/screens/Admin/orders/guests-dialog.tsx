import { endOfDay, format, startOfDay } from "date-fns";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useGuestListQuery } from "src/queries/useAccount";
import { GetListGuestsResType } from "src/schemaValidations/account.schema";
import tw from "src/utils/tw";
import { formatDateTimeToLocaleString } from "src/utils/utils";

type GuestItem = GetListGuestsResType["data"][0];

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function GuestsDialog({
  onChoose,
}: {
  onChoose: (guest: GuestItem) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [searchText, setSearchText] = useState("");
  const [tableFilter, setTableFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState<null | "from" | "to">(
    null
  );
  const guestListQuery = useGuestListQuery({
    fromDate,
    toDate,
  });
  // TODO: Replace with actual data fetching
  const data = guestListQuery.data?.payload.data ?? [];

  // Filter guests based on search criteria
  const filteredGuests = data.filter((guest) => {
    const matchesSearch = searchText
      ? (guest.name + guest.id).toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesTable = tableFilter
      ? guest.tableNumber.toString().includes(tableFilter)
      : true;
    const matchesDate = true; // Add date filtering logic if needed

    return matchesSearch && matchesTable && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / PAGE_SIZE);
  const paginatedGuests = filteredGuests.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const chooseGuest = (guest: GuestItem) => {
    onChoose(guest);
    setVisible(false);
  };

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  const handleDateChange = (selectedDate: Date) => {
    if (showDatePicker === "from") {
      setFromDate(selectedDate);
    } else if (showDatePicker === "to") {
      setToDate(selectedDate);
    }
    setShowDatePicker(null);
  };

  return (
    <>
      <TouchableOpacity
        style={tw`border p-2 rounded`}
        onPress={() => setVisible(true)}
      >
        <Text>Chọn khách</Text>
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
              <Text style={tw`text-lg font-bold`}>Chọn khách hàng</Text>
            </View>

            <ScrollView contentContainerStyle={tw`p-4`}>
              {/* Date Filters */}
              <View style={tw`flex-row flex-wrap gap-2 mb-4`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`mr-2`}>Từ:</Text>
                  <TouchableOpacity
                    style={tw`border p-2 rounded flex-1`}
                    onPress={() => setShowDatePicker("from")}
                  >
                    <Text>{format(fromDate, "dd/MM/yyyy HH:mm")}</Text>
                  </TouchableOpacity>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`mr-2`}>Đến:</Text>
                  <TouchableOpacity
                    style={tw`border p-2 rounded flex-1`}
                    onPress={() => setShowDatePicker("to")}
                  >
                    <Text>{format(toDate, "dd/MM/yyyy HH:mm")}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={tw`bg-gray-200 p-2 rounded`}
                  onPress={resetDateFilter}
                >
                  <Text>Reset</Text>
                </TouchableOpacity>
              </View>

              {/* Search Filters */}
              <View style={tw`flex-row gap-2 mb-4`}>
                <TextInput
                  style={tw`border p-2 rounded flex-1`}
                  placeholder="Tên hoặc ID"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <TextInput
                  style={tw`border p-2 rounded w-20`}
                  placeholder="Bàn"
                  value={tableFilter}
                  onChangeText={setTableFilter}
                  keyboardType="numeric"
                />
              </View>

              {/* Guests List */}
              <FlatList
                data={paginatedGuests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`p-3 border-b border-gray-100`}
                    onPress={() => chooseGuest(item)}
                  >
                    <View style={tw`flex-row justify-between`}>
                      <Text style={tw`font-medium`}>
                        {item.name} (#{item.id})
                      </Text>
                      <Text>Bàn: {item.tableNumber}</Text>
                    </View>
                    <Text style={tw`text-sm text-gray-500`}>
                      {formatDateTimeToLocaleString(item.createdAt)}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={tw`p-4 items-center`}>
                    <Text>Không tìm thấy khách hàng</Text>
                  </View>
                }
              />
            </ScrollView>

            {/* Pagination */}
            <View
              style={tw`flex-row justify-between items-center p-4 border-t border-gray-200`}
            >
              <Text style={tw`text-sm text-gray-500`}>
                Hiển thị {paginatedGuests.length}/{filteredGuests.length} kết
                quả
              </Text>

              <View style={tw`flex-row gap-1`}>
                <TouchableOpacity
                  style={tw`p-1 ${page === 1 ? "bg-gray-200" : "bg-blue-500"}`}
                  disabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Text style={page === 1 ? tw`text-gray-500` : tw`text-white`}>
                    Trước
                  </Text>
                </TouchableOpacity>

                {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={tw`w-8 h-8 items-center justify-center rounded ${
                      page === i + 1 ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    onPress={() => setPage(i + 1)}
                  >
                    <Text
                      style={
                        page === i + 1 ? tw`text-white` : tw`text-gray-700`
                      }
                    >
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={tw`p-1 ${page === totalPages ? "bg-gray-200" : "bg-blue-500"}`}
                  disabled={page === totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <Text
                    style={
                      page === totalPages ? tw`text-gray-500` : tw`text-white`
                    }
                  >
                    Sau
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Date Picker */}
        {/* <DateTimePickerModal
          isVisible={showDatePicker !== null}
          mode="datetime"
          date={showDatePicker === "from" ? fromDate : toDate}
          onConfirm={handleDateChange}
          onCancel={() => setShowDatePicker(null)}
          locale="vi" // nếu muốn hiển thị tiếng Việt
        /> */}
      </Modal>
    </>
  );
}
