import React from 'react';
import { Modal, View, Pressable, Text } from 'react-native';
import tw from '../../utils/tw';

interface SheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Sheet({ isVisible, onClose, title, children, className = '' }: SheetProps) {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={tw`flex-1 bg-black/50`}
        onPress={onClose}
      >
        <View style={tw`flex-1 justify-end`}>
          <Pressable
            style={tw`bg-white dark:bg-slate-800 rounded-t-lg p-4 ${className}`}
            onPress={(e) => e.stopPropagation()}
          >
            {title && (
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-lg font-semibold text-slate-900 dark:text-slate-100`}>
                  {title}
                </Text>
                <Pressable onPress={onClose}>
                  <Text style={tw`text-lg`}>×</Text>
                </Pressable>
              </View>
            )}
            {children}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}