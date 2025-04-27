import React from 'react';
import { View } from 'react-native';
import Toast from './toast';
import tw from '../../utils/tw';

interface ToastType {
  id: string;
  message: string;
  variant?: 'default' | 'success' | 'destructive';
}

interface ToasterProps {
  toasts: ToastType[];
}

export default function Toaster({ toasts }: ToasterProps) {
  return (
    <View style={tw`fixed bottom-0 left-0 right-0 z-50`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          className="mb-2"
        />
      ))}
    </View>
  );
}