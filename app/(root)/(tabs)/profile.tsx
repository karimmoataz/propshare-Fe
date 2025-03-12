import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../../api/axios"; // Use your custom Axios instance

type User = {
  fullName: string;
  email: string;
  phone: string;
  balance?: number;
  pendingIncome?: number;
  outcome?: number;
};

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
        // Call the endpoint using your Axios instance (domain is set in the instance)
        const response = await api.get("/verify-token", {
          headers: { Authorization: token },
        });
        if (response.status === 200) {
          setUserData(response.data.user);
        } else {
          await AsyncStorage.removeItem("token");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        await AsyncStorage.removeItem("token");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  return (
    <View className="bg-[#f7f7fa] h-full p-6">
      {userData ? (
        <>
          <Text className="text-lg font-bold">Good Morning!</Text>
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            {userData.fullName}
          </Text>
          <Text className="text-sm font-bold text-gray-400 mb-4">
            {userData.phone}
          </Text>

          <View className="bg-blue-500 text-white p-6 rounded-2xl mb-4">
            <Text className="text-lg text-white">Total Balance</Text>
            <Text className="text-3xl font-bold text-white">
              EG {userData.balance}
            </Text>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="bg-green-100 p-4 rounded-lg w-1/2 mr-2">
              <Text className="text-green-600">Pending Income</Text>
              <Text className="font-bold">EG {userData.pendingIncome}</Text>
            </View>
            <View className="bg-red-100 p-4 rounded-lg w-1/2 ml-2">
              <Text className="text-red-600">Outcome</Text>
              <Text className="font-bold">EG {userData.outcome}</Text>
            </View>
          </View>

          <View className="bg-white bor p-4 shadow-slate-300 mb-4">
            <Text className="text-lg font-bold mb-2">Investment Overview</Text>
            <View className="flex-row justify-between border-b-[1px] py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">Active Investment:</Text>
              <Text>EG 0.00</Text>
            </View>
            <View className="flex-row justify-between border-b-[1px] py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">Pending Investment:</Text>
              <Text>EG 0.00</Text>
            </View>
            <View className="flex-row justify-between border-b-[1px] py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">EG Balance:</Text>
              <Text>EG 0.00</Text>
            </View>
            <View className="flex-row justify-between border-b-[1px] py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">Pending Rental Income:</Text>
              <Text>EG 0.00</Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-red-500 p-4 rounded-xl items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-bold text-base">Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No user data available</Text>
        </View>
      )}
    </View>
  );
};

export default Profile;
