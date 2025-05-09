import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { ChangePasswordBody, ChangePasswordBodyType } from 'src/schemaValidations/account.schema';
import tw from 'src/utils/tw';
import { Button } from 'src/components/Button';


export default function ChangePasswordForm() {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: ChangePasswordBodyType) => {
    Alert.alert('Thành công', 'Đã đổi mật khẩu');
    // TODO: call API to change password
  };

  return (
    <View style={tw`gap-4 p-4 bg-white rounded-lg shadow`}> 
      <Text style={tw`text-xl font-bold`}>Đổi mật khẩu</Text>

      <View>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Mật khẩu cũ</Text>
        <TextInput
          secureTextEntry
          style={tw`border border-gray-300 p-2 rounded`}
          onChangeText={(text) => setValue('oldPassword', text)}
        />
        {errors.oldPassword && <Text style={tw`text-red-500 text-xs`}>{errors.oldPassword.message}</Text>}
      </View>

      <View>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Mật khẩu mới</Text>
        <TextInput
          secureTextEntry
          style={tw`border border-gray-300 p-2 rounded`}
          onChangeText={(text) => setValue('password', text)}
        />
        {errors.password && <Text style={tw`text-red-500 text-xs`}>{errors.password.message}</Text>}
      </View>

      <View>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Nhập lại mật khẩu mới</Text>
        <TextInput
          secureTextEntry
          style={tw`border border-gray-300 p-2 rounded`}
          onChangeText={(text) => setValue('confirmPassword', text)}
        />
        {errors.confirmPassword && <Text style={tw`text-red-500 text-xs`}>{errors.confirmPassword.message}</Text>}
      </View>

      <View style={tw`flex-row justify-end gap-2 mt-4`}>
        <Button variant='outline'  onPress={() => null} >Hủy</Button>
        <Button onPress={handleSubmit(onSubmit)} >Lưu thông tin</Button>
      </View>
    </View>
  );
}
