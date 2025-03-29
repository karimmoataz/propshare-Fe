import { View, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";

const Header = () => {
  return (
    <View className="flex-row justify-between items-center px-4 py-2">
      <TouchableOpacity>
        <Feather name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Image
        source={require("../assets/images/logo.png")}
        className="w-60 h-16 mx-auto"
      />
      <TouchableOpacity>
        <Link href={"/notification"}>
          <Feather name="bell" size={24} color="black" />
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
