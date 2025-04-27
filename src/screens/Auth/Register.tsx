import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import tw from 'src/utils/tw';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function Register({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Call API register sau
    navigation.navigate('Login');
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-white p-6`}>
      <Text style={tw `text-3xl font-bold mb-6`}>Create Account</Text>
      <TextInput
        placeholder="Email"
        style={tw`border border-gray-300 w-full p-3 rounded-xl mb-4`}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={tw`border border-gray-300 w-full p-3 rounded-xl mb-4`}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity  style={tw`bg-green-500 w-full p-3 rounded-xl`} onPress={handleRegister}>
        <Text  style={tw`text-white text-center text-lg`}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={tw`mt-4`} onPress={() => navigation.navigate('Login')}>
        <Text  style={tw`text-blue-500`}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
