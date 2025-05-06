import { View } from "react-native";
import MobileMenuDrawer from "src/components/MobileMenuDrawer";
import tw from "src/utils/tw";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={tw`flex-1 bg-black`}>
      <View
        style={tw`h-14 flex-row items-center justify-between px-4 border-b`}
      >
        <MobileMenuDrawer />
      </View>
      <View style={tw`flex-1`}>{children}</View>
    </View>
  );
}
