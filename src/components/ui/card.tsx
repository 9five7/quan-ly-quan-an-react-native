import React from 'react';
import { View, Pressable, Text } from 'react-native';
import tw from '../../utils/tw';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  title?: string;
  description?: string;
}

export default function Card({
  children,
  className = '',
  onPress,
  title,
  description,
}: CardProps) {
  const CardComponent = onPress ? Pressable : View;

  return (
    <CardComponent
      style={tw`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}
      onPress={onPress}
    >
      {title && (
        <Text style={tw`px-4 pt-4 text-lg font-semibold text-slate-800 dark:text-slate-100`}>
          {title}
        </Text>
      )}
      {description && (
        <Text style={tw`px-4 text-sm text-slate-600 dark:text-slate-400`}>
          {description}
        </Text>
      )}
      <View style={tw`p-4`}>
        {children}
      </View>
    </CardComponent>
  );
}