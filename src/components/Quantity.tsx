import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import tw from 'src/utils/tw';

type QuantityProps = {
  onChange: (value: number) => void;
  value: number;
  disabled?: boolean;
};

export default function Quantity({ onChange, value, disabled = false }: QuantityProps) {
  const handleTextChange = (text: string) => {
    const numberValue = Number(text);
    if (!isNaN(numberValue)) {
      onChange(numberValue);
    }
  };

  const opacityStyle = disabled ? 'opacity-50' : 'opacity-100';
  const bgColor = disabled ? 'bg-gray-200' : 'bg-white';

  return (
    <View style={tw`flex-row items-center gap-1 ${opacityStyle}`}>
      {/* Nút giảm */}
      <TouchableOpacity
        style={tw`h-6 w-6 items-center justify-center rounded border border-gray-300 ${bgColor}`}
        disabled={disabled || value === 0}
        onPress={() => onChange(value - 1)}
      >
        <Minus size={12} color={disabled || value === 0 ? '#9CA3AF' : '#000'} />
      </TouchableOpacity>

      {/* Ô nhập số */}
      <TextInput
        style={tw`h-6 w-8 border border-gray-300 text-center ${bgColor}`}
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={handleTextChange}
        editable={!disabled}
      />

      {/* Nút tăng */}
      <TouchableOpacity
        style={tw`h-6 w-6 items-center justify-center rounded border border-gray-300 ${bgColor}`}
        onPress={() => onChange(value + 1)}
        disabled={disabled}
      >
        <Plus size={12} color={disabled ? '#9CA3AF' : '#000'} />
      </TouchableOpacity>
    </View>
  );
}