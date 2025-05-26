import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { clsx } from "clsx";

interface CustomButtonProps {
  text: string;
  color?: string;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  onPress,
  className = "",
  textClassName = "",
}) => {
  return (
    <View className="flex-1 h-full items-center" >
      <TouchableOpacity
        onPress={onPress}
        className={clsx(`px-5 py-4 rounded-lg bg-[#1067a6] min-h-14 items-center`, className)}
      >
        <Text className={clsx("text-white font-bold text-center", textClassName)}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
