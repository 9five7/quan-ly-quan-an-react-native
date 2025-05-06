import { View } from 'react-native';
import LoginForm from 'src/components/Login/LoginForm';
import tw from 'src/utils/tw';


export default function LoginScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <LoginForm />
    </View>
  );
}
