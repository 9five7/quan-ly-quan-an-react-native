import React, { useEffect, useState } from "react";
import { Appearance, Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import tw from "../utils/tw";

// Tạo custom SunIcon component
function SunIcon({ size, color, style }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      <Path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    </Svg>
  );
}

// Tạo custom MoonIcon component
function MoonIcon({ size, color, style }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
  );
}

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(
    Appearance.getColorScheme() === "dark"
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === "dark");
    });
    return () => subscription.remove();
  }, []);

  const toggleColorScheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Lưu preference vào AsyncStorage nếu cần
  };

  return (
    <Pressable
      onPress={toggleColorScheme}
      style={tw`h-10 w-10 items-center justify-center rounded-full border border-gray-300 dark:border-gray-600`}
      android_ripple={{ color: tw.color("gray-200"), radius: 20 }}
    >
      <View style={tw`relative h-5 w-5`}>
        <SunIcon
          size={20}
          color={tw.color("gray-800 dark:gray-200")}
          style={tw`absolute ${darkMode ? "opacity-0" : "opacity-100"}`}
        />
        <MoonIcon
          size={20}
          color={tw.color("gray-800 dark:gray-200")}
          style={tw`absolute ${darkMode ? "opacity-100" : "opacity-0"}`}
        />
      </View>
    </Pressable>
  );
}
