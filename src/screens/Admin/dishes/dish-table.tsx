import { MaterialIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react-native";
import React, { createContext, useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDeleteDishMutation, useDishListQuery } from "src/queries/useDish";
import { DishListResType } from "src/schemaValidations/dish.schema";
import tw from "src/utils/tw";
import { getValidImageUrl, getVietnameseDishStatus } from "src/utils/utils";
import AddDish from "./add-dish";
import EditDish from "./edit-dish";

type DishType = DishListResType["data"][0];

const DishTableContext = createContext<{
  setDishIdEdit: (value: number) => void;
  dishIdEdit: number | undefined;
  dishDelete: DishType | null;
  setDishDelete: (value: DishType | null) => void;
}>({
  setDishIdEdit: () => {},
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: () => {},
});

const PAGE_SIZE = 10;

export default function DishTable() {
  const [searchText, setSearchText] = useState("");
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
  const [dishDelete, setDishDelete] = useState<DishType | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useDishListQuery();
  const dishes = data?.payload.data || [];
  const deleteMutation = useDeleteDishMutation();
  const queryClient = useQueryClient();

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedDishes = filteredDishes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleDelete = async (dish: DishType) => {
    Alert.alert("Xác nhận", `Bạn có chắc muốn xóa món "${dish.name}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(dish.id);
            queryClient.invalidateQueries({ queryKey: ["dishes"] });
            Alert.alert("Thành công", "Đã xóa món ăn thành công");
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa món ăn");
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
    <DishTableContext.Provider
      value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}
    >
      <View style={tw`flex-1 p-4`}>
        <EditDish
          id={dishIdEdit}
          visible={!!dishIdEdit}
          onClose={() => setDishIdEdit(undefined)}
        />

        {/* Search and Add Button */}
        <View style={tw`flex-row items-center mb-4`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 rounded px-3 py-2 mr-2`}
            placeholder="Tìm kiếm món ăn..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <AddDish
            onAddSuccess={() =>
              queryClient.invalidateQueries({ queryKey: ["dishes"] })
            }
          />
        </View>

        {/* Table Header */}
        <View style={tw`flex-row bg-gray-100 p-2 border-b border-gray-200`}>
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold`}>Ảnh</Text>
          </View>
          <View style={tw`w-8`}>
            <Text style={tw`font-bold`}></Text>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold`}>Giá</Text>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-bold`}>Trạng thái</Text>
          </View>
          <View style={tw`w-8`}>
            <Text style={tw`font-bold`}></Text>
          </View>
        </View>

        {/* Table Content */}
        <FlatList
          data={paginatedDishes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={tw`flex-row items-center py-2 border-b border-gray-100`}
            >
              {/* Image */}
              <View style={tw`w-24 h-24 rounded-md overflow-hidden`}>
                <Image
                  source={{
                    uri: getValidImageUrl(item.image) || item.image || "https://via.placeholder.com/100",
                  }}
                  style={tw`w-full h-full`}
                />
              </View>

              {/* Name */}
              <View style={tw`flex-1 ml-2`}>
                <Text style={tw`font-medium`}>{item.name}</Text>
                <Text style={tw`text-sm text-gray-500`} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {/* Price */}
              <View style={tw`w-24`}>
                <Text>{item.price.toLocaleString()}đ</Text>
              </View>

              {/* Status */}
              <View style={tw`w-12`}>
                <Text
                  style={tw`text-sm ${
                    item.status === "Available"
                      ? "text-green-500"
                      : item.status === "Unavailable"
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                >
                  {getVietnameseDishStatus(item.status)}
                </Text>
              </View>

              {/* Actions */}
              <View style={tw`w-20 items-center`}>
                <ActionMenu dish={item} onDelete={() => handleDelete(item)} />
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={tw`p-4 items-center`}>
              <Text>Không có món ăn nào</Text>
            </View>
          }
        />

        {/* Pagination */}
        <View style={tw`flex-row justify-between items-center mt-4`}>
          <Text style={tw`text-sm text-gray-500`}>
            Hiển thị {paginatedDishes.length} trong {filteredDishes.length} kết quả
          </Text>
          <View style={tw`flex-row gap-2`}>
            {Array.from({
              length: Math.ceil(filteredDishes.length / PAGE_SIZE),
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
    </DishTableContext.Provider>
  );
}

// Action Menu Component
const ActionMenu = ({ dish, onDelete }: { dish: DishType; onDelete: () => void }) => {
  const { setDishIdEdit } = useContext(DishTableContext);
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
              setDishIdEdit(dish.id);
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