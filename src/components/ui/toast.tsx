import React from 'react';
import { View, Text } from 'react-native';
import tw from '../../utils/tw';

interface ToastProps {
  message: string;
  variant?: 'default' | 'success' | 'destructive';
  className?: string;
}

export default function Toast({ message, variant = 'default', className = '' }: ToastProps) {
  const variantClasses = {
    default: 'bg-slate-800',
    success: 'bg-green-600',
    destructive: 'bg-red-600'
  };

  return (
    <View style={tw`fixed bottom-4 left-0 right-0 items-center`}>
      <View style={tw`${variantClasses[variant]} rounded-md px-4 py-2 shadow-lg ${className}`}>
        <Text style={tw`text-white`}>{message}</Text>
      </View>
    </View>
  );
}