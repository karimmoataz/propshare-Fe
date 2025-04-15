import { SafeAreaView, StatusBar, Text, View, TouchableOpacity, Alert } from "react-native";
import { Link, router } from "expo-router";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {

  const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem("token");
        router.push("/");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

  return (
    <SafeAreaView className="bg-[#f5f6f9] h-full flex flex-col items-center justify-center">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Text className="font-bold text-lg my-10">Welcome to Propshare</Text>
      
      <Link href="/" className="text-blue-500 mb-2">Welcome</Link>
      <Link href="/sign-in" className="text-blue-500 mb-2">Sign In</Link>
      <Link href="/explore" className="text-blue-500 mb-2">Explore</Link>
      <Link href="/profile" className="text-blue-500 mb-2">Profile</Link>
      <Link href="/properties/1" className="text-blue-500 mb-2">Property</Link>
      <TouchableOpacity
        className="bg-red-500 p-4 mt-5 rounded-xl items-center"
        onPress={handleLogout}
      >
        <Text className="text-white font-bold text-base">Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
