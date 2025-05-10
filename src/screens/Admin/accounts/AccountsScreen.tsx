// src/screens/Admin/AccountsScreen.tsx
import { ScrollView, Text, View } from 'react-native';
import AccountTable from 'src/screens/Admin/accounts/account-table';

import tw from 'src/utils/tw';

export default function AccountsScreen() {
  return (
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-2`}>Tài khoản</Text>
      <Text style={tw`text-gray-500 mb-4`}>Quản lý tài khoản nhân viên</Text>
      <AccountTable />
    </View>
  );
}
