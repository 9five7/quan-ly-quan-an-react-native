// src/components/Quantity.tsx
import { Minus, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import tw from "src/utils/tw";

export default function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [internalValue, setInternalValue] = useState(value.toString());

  useEffect(() => {
    setInternalValue(value.toString());
  }, [value]);

  const handleInputChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setInternalValue(text);
      const number = parseInt(text || "0", 10);
      onChange(number);
    }
  };

  const decrease = () => {
    const newValue = Math.max(0, value - 1);
    onChange(newValue);
  };

  const increase = () => {
    onChange(value + 1);
  };

  return (
    <View style={tw`flex-row items-center gap-2`}>
      <TouchableOpacity
        onPress={decrease}
        disabled={value === 0}
        style={tw`px-2 py-1 bg-gray-200 rounded`}
      >
        <Minus size={16} color={value === 0 ? "#9ca3af" : "#000"} />
      </TouchableOpacity>
      <TextInput
        keyboardType="numeric"
        value={internalValue}
        onChangeText={handleInputChange}
        style={tw`border border-gray-300 rounded px-2 py-1 w-12 text-center`}
      />
      <TouchableOpacity
        onPress={increase}
        style={tw`px-2 py-1 bg-gray-200 rounded`}
      >
        <Plus size={16} color={value === 0 ? "#9CA3AF" : "#000"} />
      </TouchableOpacity>
    </View>
  );
}
