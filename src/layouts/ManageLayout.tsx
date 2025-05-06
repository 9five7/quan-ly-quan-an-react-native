import { View } from 'react-native';
import AvatarMenu from 'src/components/AvatarMenu';
import MobileNavLinks from 'src/components/MobileNavLinks';
import NavLinks from 'src/components/NavLinks';
import tw from 'src/utils/tw';

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <View style={tw`flex-1 bg-gray-50`}> 
      <View style={tw`flex-row h-14 items-center justify-between px-4 border-b bg-black`}>
        <MobileNavLinks />
        <AvatarMenu />
      </View>

      <View style={tw`flex-1 flex-row`}>
        {/* Sidebar for tablet/desktop size - optional if needed */}
        <View style={tw`hidden sm:flex w-16 bg-gray-100 border-r`}>
          <NavLinks />
        </View>

        {/* Main content */}
        <View style={tw`flex-1 p-4`}>
          {children}
        </View>
      </View>
    </View>
  );
}