import { SafeAreaView, StatusBar, Text, View, TouchableOpacity, Alert } from "react-native";
import { Link } from "expo-router";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const handleDeleteToken = async () => {
    Alert.alert("Delete Token", "Are you sure you want to delete the token?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          Alert.alert("Success", "Token deleted successfully.");
        },
        style: "destructive"
      }
    ]);
  };

  return (
    <SafeAreaView className="bg-[#f7f7fa] h-full flex flex-col items-center justify-center">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Text className="font-bold text-lg my-10">Welcome to Propshare</Text>
      
      <Link href="/" className="text-blue-500 mb-2">Welcome</Link>
      <Link href="/sign-in" className="text-blue-500 mb-2">Sign In</Link>
      <Link href="/explore" className="text-blue-500 mb-2">Explore</Link>
      <Link href="/profile" className="text-blue-500 mb-2">Profile</Link>
      <Link href="/properties/1" className="text-blue-500 mb-2">Property</Link>
    </SafeAreaView>
  );
};

export default Home;
