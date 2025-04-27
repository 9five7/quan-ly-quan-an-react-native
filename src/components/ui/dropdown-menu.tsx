import React, { useState } from 'react';
import { View, Pressable, Text, Modal, TouchableOpacity } from 'react-native';
import tw from '../../utils/tw';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
  }>;
  align?: 'start' | 'center' | 'end';
}

export default function DropdownMenu({ trigger, items, align = 'start' }: DropdownMenuProps) {
  const [visible, setVisible] = useState(false);

  const alignmentClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  };

  return (
    <View style={tw`relative`}>
      <Pressable onPress={() => setVisible(!visible)}>
        {trigger}
      </Pressable>

      <Modal
        transparent
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={tw`flex-1`}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={tw`absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${alignmentClasses[align]}`}>
            {items.map((item, index) => (
              <Pressable
                key={index}
                style={tw`px-4 py-2 flex-row items-center w-full`}
                onPress={() => {
                  item.onPress();
                  setVisible(false);
                }}
              >
                {item.icon && <View style={tw`mr-2`}>{item.icon}</View>}
                <Text style={tw`text-slate-800 dark:text-slate-100`}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}