import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface CustomButtonProps {
  text: string;
  color?: string;
  onPress?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, color = "#1067a6", onPress }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={{ backgroundColor: color }}
        className="px-5 py-5 rounded-lg"
      >
        <Text className="text-white font-bold text-center">{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
