import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useDeleteTableMutation,
  useTableListQuery,
} from "src/queries/useTable";
import tw from "src/utils/tw";

import { MaterialIcons } from "@expo/vector-icons";
import { TableListResType } from "src/schemaValidations/table.schema";
import QRCodeTable from "src/screens/Admin/tables/qrcode-table";
import { getVietnameseTableStatus } from "src/utils/utils";
import AddTable from "./add-table";
import EditTable from "./edit-table";
import { MoreHorizontal } from "lucide-react-native";

type TableType = TableListResType["data"][0];
const PAGE_SIZE = 10;

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void;
  tableIdEdit: number | undefined;
  tableDelete: TableType | null;
  setTableDelete: (value: TableType | null) => void;
}>({
  setTableIdEdit: () => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: () => {},
});

export default function TableTable() {
  const [searchText, setSearchText] = useState("");
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
  const [tableDelete, setTableDelete] = useState<TableType | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTableListQuery();
  const tables = data?.payload.data || [];
  const deleteMutation = useDeleteTableMutation();
  const queryClient = useQueryClient();

  const filteredTables = tables.filter((table) =>
    String(table.number).includes(searchText)
  );

  const paginatedTables = filteredTables.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleDelete = async (table: TableType) => {
    Alert.alert("Xác nhận", `Xóa bàn số ${table.number}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(table.number);
            queryClient.invalidateQueries({ queryKey: ["tables"] });
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa bàn ăn");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 items-center justify-center`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TableTableContext.Provider
      value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}
    >
      <View style={tw`flex-1 p-4`}>
        <EditTable
          id={tableIdEdit}
          visible={!!tableIdEdit}
          onClose={() => setTableIdEdit(undefined)}
        />

        {/* Search and Add Button */}
        <View style={tw`flex-row items-center mb-4`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 rounded px-3 py-2 mr-2`}
            placeholder="Tìm kiếm số bàn..."
            value={searchText}
            onChangeText={setSearchText}
            keyboardType="numeric"
          />
          <AddTable
            onAddSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["tables"] })
            }
          />
        </View>

        {/* Table Header */}
        <View style={tw`flex-row bg-gray-100 p-2 border-b border-gray-200`}>
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold text-start`}>Số bàn</Text>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold text-center`}>Sức chứa</Text>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold text-center`}>Trạng thái</Text>
          </View>
          <View style={tw`flex-2`}>
            <Text style={tw`font-bold text-center`}>QR Code</Text>
          </View>
          <View style={tw`w-6`}>
            <Text style={tw`font-bold text-center`}>...</Text>
          </View>
        </View>

        {/* Table Content */}
        <FlatList
          data={paginatedTables}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <View
              style={tw`flex-row items-center p-2 border-b border-gray-100`}
            >
              {/* Number */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-start`}>Bàn {item.number}</Text>
              </View>

              {/* Sức chứa */}
              <View style={tw`flex-1`}>
                <Text style={tw`text-center`}>{item.capacity}</Text>
              </View>

              {/* Trạng thái */}
              <View style={tw`flex-1`}>
                <Text style={[tw`text-center`, statusStyle(item.status)]}>
                  {getVietnameseTableStatus(item.status)}
                </Text>
              </View>

              {/* QR Code */}
              <View style={tw`flex-2 items-center`}>
                <QRCodeTable
                  token={item.token}
                  tableNumber={item.number}
                  size={100}
                />
              </View>

              {/* Actions */}
              <View style={tw`w-6 items-end`}>
                 <ActionMenu table={item} onDelete={() => handleDelete(item)} />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={tw`p-4 items-center`}>
              <Text>Không có bàn nào</Text>
            </View>
          }
        />

        {/* Pagination */}
          <View style={tw`flex-row justify-between items-center mt-4`}>
          <Text style={tw`text-sm text-gray-500`}>
            Hiển thị {paginatedTables.length} trong {filteredTables.length} kết quả
          </Text>
          <View style={tw`flex-row gap-2`}>
            {Array.from({
              length: Math.ceil(filteredTables.length / PAGE_SIZE),
            }).map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setPage(i + 1)}
                style={tw`w-8 h-8 items-center justify-center rounded ${
                  page === i + 1 ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <Text
                  style={tw`${page === i + 1 ? "text-white" : "text-gray-700"}`}
                >
                  {i + 1}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

       
      </View>
    </TableTableContext.Provider>
  );
}

const statusStyle = (status: string) => {
  switch (status) {
    case "Available":
      return tw`text-green-500`;
    case "Unavailable":
      return tw`text-red-500`;
    case "Hidden":
      return tw`text-gray-500`;
    default:
      return tw`text-blue-500`;
  }
};


const ActionMenu = ({ table, onDelete }: {  table: TableType; onDelete: () => void }) => {
  const { setTableIdEdit, setTableDelete } = useContext(TableTableContext);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={tw`relative`}>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
        <MoreHorizontal size={20} color="gray" />
      </TouchableOpacity>

      {showMenu && (
        <View
          style={tw`absolute right-0 top-6 bg-white shadow-md rounded w-32 z-10 border border-gray-200`}
        >
          <TouchableOpacity
            style={tw`p-3 border-b border-gray-100`}
            onPress={() => {
              setTableIdEdit(table.number);
              setShowMenu(false);
            }}
          >
            <Text>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`p-3`} 
            onPress={() => {
              onDelete();
              setShowMenu(false);
            }}
          >
            <Text style={tw`text-red-500`}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

