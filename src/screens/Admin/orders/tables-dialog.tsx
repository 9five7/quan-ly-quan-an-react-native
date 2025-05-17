import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TableStatus } from "src/constants/type";
import tw from "src/utils/tw";
import { getVietnameseTableStatus } from "src/utils/utils";

type TableItem = {
  number: number;
  capacity: number;
  status: string;
};

const PAGE_SIZE = 10;

export function TablesDialog({
  onChoose,
}: {
  onChoose: (table: TableItem) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  // TODO: Replace with actual data fetching
  const data: TableItem[] = [];

  // Filter tables based on search text
  const filteredTables = data.filter((table) =>
    table.number.toString().includes(searchText)
  );

  // Pagination
  const totalPages = Math.ceil(filteredTables.length / PAGE_SIZE);
  const paginatedTables = filteredTables.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const chooseTable = (table: TableItem) => {
    if (
      table.status === TableStatus.Available ||
      table.status === TableStatus.Reserved
    ) {
      onChoose(table);
      setVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={tw`border p-2 rounded`}
        onPress={() => setVisible(true)}
      >
        <Text>Thay đổi</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-center p-4`}>
          <View style={tw`bg-white rounded-lg max-h-[80%]`}>
            <View style={tw`p-4 border-b border-gray-200`}>
              <Text style={tw`text-lg font-bold`}>Chọn bàn</Text>
            </View>

            <View style={tw`p-4`}>
              <TextInput
                style={tw`border p-2 rounded mb-4 w-24`}
                placeholder="Số bàn"
                value={searchText}
                onChangeText={setSearchText}
                keyboardType="numeric"
              />

              <FlatList
                data={paginatedTables}
                keyExtractor={(item) => item.number.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={tw`flex-row justify-between p-3 border-b border-gray-100 ${
                      item.status === TableStatus.Hidden ? "opacity-50" : ""
                    }`}
                    onPress={() => chooseTable(item)}
                    disabled={item.status === TableStatus.Hidden}
                  >
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-medium`}>Bàn {item.number}</Text>
                      <Text>Sức chứa: {item.capacity}</Text>
                    </View>
                    <Text>
                      {getVietnameseTableStatus(
                        item.status as keyof typeof TableStatus
                      )}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={tw`p-4 items-center`}>
                    <Text>Không tìm thấy bàn</Text>
                  </View>
                }
              />
            </View>

            <View
              style={tw`flex-row justify-between items-center p-4 border-t border-gray-200`}
            >
              <Text style={tw`text-sm text-gray-500`}>
                Hiển thị {paginatedTables.length}/{filteredTables.length} kết
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
      </Modal>
    </>
  );
}
