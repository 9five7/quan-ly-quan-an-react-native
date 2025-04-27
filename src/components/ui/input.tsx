import React from "react";
import { Text, TextInput, View } from "react-native";
import { colors } from "src/utils/colors";
import tw from "../../utils/tw";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  className = "",
  label,
  error,
  secureTextEntry = false,
}: InputProps) {
  return (
    <View style={tw`mb-4`}>
      {label && (
        <Text style={tw`mb-1 text-slate-700 dark:text-slate-300`}>{label}</Text>
      )}
      <TextInput
        style={tw`border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${className} ${error ? "border-red-500" : ""}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.slate400}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={tw`mt-1 text-red-500 text-xs`}>{error}</Text>}
    </View>
  );
}
