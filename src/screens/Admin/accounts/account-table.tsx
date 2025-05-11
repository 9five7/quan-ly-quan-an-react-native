import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useAccountListQuery,
  useDeleteEmployeeMutation,
} from "src/queries/useAccount";
import { AccountType } from "src/schemaValidations/account.schema";
import tw from "src/utils/tw";
import { getValidImageUrl } from "src/utils/utils";
import AddEmployeeForm from "./add-employee";
import EditEmployeeForm from "./edit-employee";

export default function AccountTable() {
  const [search, setSearch] = useState("");
  const { data, refetch } = useAccountListQuery();
  const accounts: AccountType[] = data?.payload.data || [];
  const [editAccount, setEditAccount] = useState<AccountType | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const deleteMutation = useDeleteEmployeeMutation();
  const queryClient = useQueryClient();

  const handleDelete = async (account: AccountType) => {
    Alert.alert("Xác nhận", `Xoá tài khoản ${account.name}?`, [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(account.id);
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
          } catch {
            Alert.alert("Lỗi", "Không thể xoá tài khoản");
          }
        },
      },
    ]);
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase())
  );

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const paginatedAccounts = filteredAccounts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleEditSuccess = () => {
    setEditAccount(null);
    queryClient.invalidateQueries({ queryKey: ["accounts"] });
  };

  return (
    <ScrollView contentContainerStyle={tw`px-4 gap-4 pb-10`}>
      <Text style={tw`text-xl font-bold`}>Danh sách tài khoản</Text>

      <TextInput
        placeholder="Tìm kiếm tên hoặc email..."
        style={tw`border border-gray-300 rounded px-3 py-2`}
        value={search}
        onChangeText={setSearch}
      />

      <Pressable
        onPress={() => setShowAdd(true)}
        style={tw`self-end bg-blue-500 px-4 py-2 rounded`}
      >
        <Text style={tw`text-white font-semibold`}>+ Thêm tài khoản</Text>
      </Pressable>

      {paginatedAccounts.map((item) => (
        <View
          key={item.id}
          style={tw`flex-row items-center gap-4 py-2 border-b border-gray-200`}
        >
          <Image
            source={{
              uri: getValidImageUrl(item.avatar) || "https://i.pravatar.cc/150",
            }}
            style={tw`w-14 h-14 rounded-full`}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-semibold`}>{item.name}</Text>
            <Text style={tw`text-sm text-gray-500`}>{item.email}</Text>
            <Text style={tw`text-xs text-gray-400`}>{item.role}</Text>
          </View>
          <View style={tw`flex-row gap-2`}>
            <Pressable onPress={() => setEditAccount(item)}>
              <Text style={tw`text-blue-500 text-sm`}>Sửa</Text>
            </Pressable>
            <Pressable onPress={() => handleDelete(item)}>
              <Text style={tw`text-red-500 text-sm`}>Xoá</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <View style={tw`flex-row justify-center mt-4 gap-2`}>
        {Array.from({
          length: Math.ceil(filteredAccounts.length / PAGE_SIZE),
        }).map((_, i) => (
          <Pressable
            key={i}
            onPress={() => setPage(i + 1)}
            style={tw`
                px-3 py-1 rounded border
                ${page === i + 1 ? "bg-blue-500 border-blue-500" : "border-gray-300"}
              `}
          >
            <Text
              style={tw`
                  ${page === i + 1 ? "text-white font-semibold" : "text-gray-700"}
                `}
            >
              {i + 1}
            </Text>
          </Pressable>
        ))}
      </View>

      {showAdd && (
        <AddEmployeeForm visible={showAdd} onClose={() => setShowAdd(false)} />
      )}
      {editAccount && (
        <EditEmployeeForm
          account={editAccount}
          visible={true}
          onClose={handleEditSuccess}
        />
      )}
    </ScrollView>
  );
}
