import { FC } from 'react';
import { View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

interface HeaderProps {
  backBtn?: boolean;
  isRTL?: boolean;
}

const Header: FC<HeaderProps> = ({ backBtn = true, isRTL = false }) => {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center px-4 pt-5">
      {backBtn ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name={isRTL? "arrow-right" : "arrow-left"} size={24} color="#005DA0" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
      <Image
        source={require("../assets/images/logo.png")}
        className="w-60 h-16 mx-auto"
      />
      <TouchableOpacity>
        <Link href="/notification">
          <Feather name="bell" size={24} color="#005DA0" />
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
