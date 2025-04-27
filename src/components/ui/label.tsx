import React from 'react';
import { Text } from 'react-native';
import tw from '../../utils/tw';

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export default function Label({ children, className = '', required = false }: LabelProps) {
  return (
    <Text style={tw`block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300 ${className}`}>
      {children}
      {required && <Text style={tw`text-red-500`}> *</Text>}
    </Text>
  );
}