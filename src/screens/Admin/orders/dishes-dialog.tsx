import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDishListQuery } from "src/queries/useDish";
import { DishListResType } from "src/schemaValidations/dish.schema";
import tw from "src/utils/tw";
import {
  formatCurrency,
  getValidImageUrl,
  getVietnameseDishStatus,
} from "src/utils/utils";

type DishItem = DishListResType["data"][0];

const PAGE_SIZE = 10;

export function DishesDialog({
  onChoose,
}: {
  onChoose: (dish: DishItem) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const dishListQuery = useDishListQuery();
  const data = dishListQuery.data?.payload.data || [];
  const isLoading = dishListQuery.isLoading;

  // Reset page when search text changes
  useEffect(() => {
    setPage(1);
  }, [searchText]);

  // Filter dishes based on search text - using useMemo for better performance
  const filteredDishes = useMemo(() => {
    return data.filter((dish) =>
      dish.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  // Pagination
  const totalPages = Math.ceil(filteredDishes.length / PAGE_SIZE);
  const paginatedDishes = useMemo(() => {
    return filteredDishes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filteredDishes, page]);

  const chooseDish = (dish: DishItem) => {
    onChoose(dish);
    setVisible(false);
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    // For small number of pages, show all
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }).map((_, i) => (
        <TouchableOpacity
          key={i}
          style={tw`w-8 h-8 items-center justify-center rounded ${
            page === i + 1 ? "bg-blue-500" : "bg-gray-200"
          }`}
          onPress={() => setPage(i + 1)}
        >
          <Text style={page === i + 1 ? tw`text-white` : tw`text-gray-700`}>
            {i + 1}
          </Text>
        </TouchableOpacity>
      ));
    }

    // For larger number of pages, show current, previous, next and first/last
    const buttons = [];

    // First page
    buttons.push(
      <TouchableOpacity
        key="first"
        style={tw`w-8 h-8 items-center justify-center rounded ${
          page === 1 ? "bg-blue-500" : "bg-gray-200"
        }`}
        onPress={() => setPage(1)}
      >
        <Text style={page === 1 ? tw`text-white` : tw`text-gray-700`}>1</Text>
      </TouchableOpacity>
    );

    // Ellipsis before current
    if (page > 3) {
      buttons.push(
        <Text key="ellipsis1" style={tw`text-gray-700 px-1`}>
          ...
        </Text>
      );
    }

    // Page before current
    if (page > 2) {
      buttons.push(
        <TouchableOpacity
          key={page - 1}
          style={tw`w-8 h-8 items-center justify-center rounded bg-gray-200`}
          onPress={() => setPage(page - 1)}
        >
          <Text style={tw`text-gray-700`}>{page - 1}</Text>
        </TouchableOpacity>
      );
    }

    // Current page (if not first or last)
    if (page !== 1 && page !== totalPages) {
      buttons.push(
        <TouchableOpacity
          key={page}
          style={tw`w-8 h-8 items-center justify-center rounded bg-blue-500`}
          onPress={() => setPage(page)}
        >
          <Text style={tw`text-white`}>{page}</Text>
        </TouchableOpacity>
      );
    }

    // Page after current
    if (page < totalPages - 1) {
      buttons.push(
        <TouchableOpacity
          key={page + 1}
          style={tw`w-8 h-8 items-center justify-center rounded bg-gray-200`}
          onPress={() => setPage(page + 1)}
        >
          <Text style={tw`text-gray-700`}>{page + 1}</Text>
        </TouchableOpacity>
      );
    }

    // Ellipsis after current
    if (page < totalPages - 2) {
      buttons.push(
        <Text key="ellipsis2" style={tw`text-gray-700 px-1`}>
          ...
        </Text>
      );
    }

    // Last page
    if (totalPages > 1) {
      buttons.push(
        <TouchableOpacity
          key="last"
          style={tw`w-8 h-8 items-center justify-center rounded ${
            page === totalPages ? "bg-blue-500" : "bg-gray-200"
          }`}
          onPress={() => setPage(totalPages)}
        >
          <Text
            style={page === totalPages ? tw`text-white` : tw`text-gray-700`}
          >
            {totalPages}
          </Text>
        </TouchableOpacity>
      );
    }

    return buttons;
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
            {/* Header */}
            <View
              style={tw`p-4 border-b border-gray-200 flex-row justify-between items-center`}
            >
              <Text style={tw`text-lg font-bold`}>Chọn món ăn</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={tw`text-gray-500`}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <View style={tw`p-4`}>
              {/* Search input */}
              <TextInput
                style={tw`border p-2 rounded mb-4`}
                placeholder="Tìm kiếm món ăn"
                value={searchText}
                onChangeText={setSearchText}
              />

              {isLoading ? (
                <View style={tw`p-10 items-center justify-center`}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : (
                <FlatList
                  data={paginatedDishes}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={tw`flex-row items-center p-3 border-b border-gray-100`}
                      onPress={() => chooseDish(item)}
                    >
                      <Image
                        source={{
                          uri: getValidImageUrl(item.image) || item.image,
                        }}
                        style={tw`w-12 h-12 rounded-md mr-3`}
                        resizeMode="cover"
                      />
                      <View style={tw`flex-1`}>
                        <Text style={tw`font-medium`}>{item.name}</Text>
                        <Text>{formatCurrency(item.price)}</Text>
                      </View>
                      <Text style={tw`ml-2`}>
                        {getVietnameseDishStatus(item.status)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={tw`p-4 items-center`}>
                      <Text>Không tìm thấy món ăn</Text>
                    </View>
                  }
                />
              )}
            </View>

            {/* Pagination footer */}
            <View style={tw`p-4 border-t border-gray-200`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-sm text-gray-500`}>
                  Hiển thị{" "}
                  <Text style={tw`font-bold`}>{paginatedDishes.length}</Text>{" "}
                  trong{" "}
                  <Text style={tw`font-bold`}>{filteredDishes.length}</Text> kết
                  quả
                </Text>

                <View style={tw`flex-row gap-2 items-center`}>
                  {/* Previous button */}
                  <TouchableOpacity
                    style={tw`px-2 py-1 rounded ${page === 1 ? "bg-gray-200" : "bg-blue-500"}`}
                    disabled={page === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <Text
                      style={page === 1 ? tw`text-gray-500` : tw`text-white`}
                    >
                      Trước
                    </Text>
                  </TouchableOpacity>

                  {/* Page buttons */}
                  <View style={tw`flex-row gap-1`}>
                    {renderPaginationButtons()}
                  </View>

                  {/* Next button */}
                  <TouchableOpacity
                    style={tw`px-2 py-1 rounded ${page === totalPages || totalPages === 0 ? "bg-gray-200" : "bg-blue-500"}`}
                    disabled={page === totalPages || totalPages === 0}
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <Text
                      style={
                        page === totalPages || totalPages === 0
                          ? tw`text-gray-500`
                          : tw`text-white`
                      }
                    >
                      Sau
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
