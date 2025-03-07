import { Link } from "expo-router";
import { View, Text, Image, TouchableOpacity, StatusBar, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-0">
      <StatusBar translucent barStyle="dark-content" />
      <View className="absolute top-0 w-full items-center justify-center h-[50%]">
      <LinearGradient
        colors={["rgba(189, 231, 249, 0.3)", "rgba(189, 231, 249, 0)"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        className="absolute bottom-0 w-full h-full"
      />
      <Image
        source={require("../assets/images/logo.png")}
        className="w-80 h-24 mb-6"
      />
      <View className="px-6">
        <Text className="text-xl font-bold text-left text-[#3D3F33]">
          Redefining the way you invest in property
        </Text>
        <Text className="text-base text-left text-[#88898F] mt-3">
          Start with Propshare to transform your financial future through simple, 
          accessible real estate investments.
        </Text>
      </View>
    </View>
    <View className="bg-[#bde7f94d] w-full h-[50%] absolute bottom-0">
      <ImageBackground
        source={require("../assets/images/welcome.png")}
        className="w-full h-full rounded-s-[73px] overflow-hidden justify-center items-center"
        resizeMode="cover"
      >
        <TouchableOpacity className="bg-white flex-row items-center px-6 py-3 rounded-xl shadow-lg absolute bottom-20">
          <Link href="/sign-in" className="">
            <Ionicons name="paper-plane" size={20} color="#005DA0" />
            <View><Text className="text-[#005DA0] font-bold ms-2">Get Started</Text></View>
          </Link>
        </TouchableOpacity>
      </ImageBackground>
    </View>

    </View>
  );
}
