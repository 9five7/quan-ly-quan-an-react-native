// src/screens/Auth/Login.tsx
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import tw from 'src/utils/tw';

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    // Giả lập login
    login('fake-token');
  };

  return (
    <View style={tw `flex-1 items-center justify-center p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={tw`border p-2 w-full mb-4`}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={tw `border p-2 w-full mb-4`}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
