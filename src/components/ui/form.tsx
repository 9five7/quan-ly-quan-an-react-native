import React from 'react';
import { View } from 'react-native';
import tw from '../../utils/tw';

interface FormProps {
  children: React.ReactNode;
  className?: string;
}

export default function Form({ children, className = '' }: FormProps) {
  return (
    <View style={tw`space-y-4 ${className}`}>
      {children}
    </View>
  );
}