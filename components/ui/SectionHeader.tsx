import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

interface SectionHeaderProps {
  title: string;
  link: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, link, className }) => {
  return (
    <View className={`flex-row justify-between items-center ${className}`}>
      <Text className="text-xl font-bold mb-2">{title}</Text>
      <TouchableOpacity>
        <Link href={link as any}>
          <Text className="text-base font-bold mb-2">See All</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
