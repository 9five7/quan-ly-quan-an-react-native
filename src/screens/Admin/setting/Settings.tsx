// src/screens/SettingScreen.tsx
import { ScrollView, Text, View } from "react-native";
import tw from "src/utils/tw";

import { Badge } from "lucide-react-native";
import ChangePasswordForm from "src/screens/Admin/setting/change-password-form";
import UpdateProfileForm from "src/screens/Admin/setting/update-profile-form";

export default function SettingScreen() {
  return (
    <ScrollView contentContainerStyle={tw`p-4 gap-6`}>
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <Text style={tw`text-xl font-semibold`}>Cài đặt</Text>
      </View>

      <View style={tw`gap-6`}>
        <UpdateProfileForm />
        <ChangePasswordForm />
      </View>
    </ScrollView>
  );
}
