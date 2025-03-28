import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import ProgressBar from "./ProgressBar";

interface ShareCardProps {
  id: string;
  name: string;
  percentage: number;
}

const ShareCard = ({ id, name, percentage }: ShareCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="me-10 max-w-[200px]"
      onPress={() => router.push(`/properties/${id}`)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-[#707070]">{name}</Text>
        <AntDesign name="right" size={24} color="#242424" />
      </View>
      <Text className="text-2xl font-bold my-2">{percentage}%</Text>
      <ProgressBar
        percent={percentage}
        color="#2C8BB9"
        height={8}
        backgroundColor="#92BFFF"
      />
    </TouchableOpacity>
  );
};

export default ShareCard;