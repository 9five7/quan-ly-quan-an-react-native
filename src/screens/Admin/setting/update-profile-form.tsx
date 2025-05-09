// src/screens/Setting/UpdateProfileForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { UpdateMeBody, UpdateMeBodyType } from 'src/schemaValidations/account.schema';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from 'src/components/ui/use-toast';
import { useAccountQuery, useUpdateMeMutation } from 'src/queries/useAccount';
import tw from 'src/utils/tw';
import { useUploadImageMutation } from 'src/queries/useMedia';

export default function UpdateProfileForm() {
    const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const { toast } = useToast();
    const { data } = useAccountQuery();
    const updateMeMutation = useUpdateMeMutation();
    const uploadImageMutation = useUploadImageMutation();
    const {
      control,
      handleSubmit,
      setValue,
      watch,
      reset,
    } = useForm<UpdateMeBodyType>({
      resolver: zodResolver(UpdateMeBody),
      defaultValues: {
        name: '',
        avatar: ''
      }
    });
  
    const avatar = watch('avatar');
    const name = watch('name');
  
    useEffect(() => {
      if (data) {
        const { name, avatar } = data.payload.data;
        reset({ name, avatar: avatar ?? '' });
      }
    }, [data]);
  
    const previewAvatar = useMemo(() => {
      if (file) return file.uri;
      return avatar;
    }, [file, avatar]);
  
    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setFile(result.assets[0]);
      }
    };
  
    const onSubmit = async (values: UpdateMeBodyType) => {
      try {
        let avatarUrl = values.avatar;
        if (file) {
          const uploadResult = await uploadSingleFile({ uri: file.uri, name: file.fileName || 'avatar.jpg', type: file.type });
          avatarUrl = uploadResult.url;
        }
        await updateMeMutation.mutateAsync({ ...values, avatar: avatarUrl });
        toast.success  ('Cập nhật thành công');
      } catch (err) {
        toast.error('Cập nhật thất bại');
      }
    };
  return (
    <View style={tw`gap-4 p-4`}>
    <TouchableOpacity onPress={pickImage} style={tw`self-center mb-4`}>
      {previewAvatar ? (
        <Image source={{ uri: previewAvatar }} style={tw`w-24 h-24 rounded-full`} />
      ) : (
        <View style={tw`w-24 h-24 rounded-full bg-gray-200 items-center justify-center`}>
          <Text>Upload</Text>
        </View>
      )}
    </TouchableOpacity>

    <Text style={tw`text-base font-semibold mb-1`}>Tên</Text>
    <Controller
      control={control}
      name="name"
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextInput
            style={tw`border rounded p-2 border-gray-300`}
            placeholder="Nhập tên"
            value={value}
            onChangeText={onChange}
          />
          {error && <Text style={tw`text-red-500`}>{error.message}</Text>}
        </>
      )}
    />

    <View style={tw`flex-row gap-2 mt-4 justify-end`}>
      <TouchableOpacity
        onPress={() => reset()}
        style={tw`px-4 py-2 border rounded border-gray-400`}
      >
        <Text>Huỷ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        style={tw`px-4 py-2 bg-blue-500 rounded`}
      >
        <Text style={tw`text-white`}>Lưu thông tin</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}


