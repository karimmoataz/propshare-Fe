import { View, Text, TouchableOpacity, ScrollView, Image, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Link } from "expo-router";
import { Feather, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import api from "../../api/axios";
import Header from "@/components/Header";

type User = {
  fullName: string;
  email: string;
  phone: string;
};

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      const response = await api.get("/get-user", {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // loadSettings();
  }, []);

  // const loadSettings = async () => {
  //   try {
  //     const notifications = await AsyncStorage.getItem("notificationsEnabled");
  //     const darkMode = await AsyncStorage.getItem("darkModeEnabled");
  //     const biometric = await AsyncStorage.getItem("biometricEnabled");
      
  //     setNotificationsEnabled(notifications === "true");
  //     setDarkModeEnabled(darkMode === "true");
  //     setBiometricEnabled(biometric === "true");
  //   } catch (error) {
  //     console.error("Error loading settings:", error);
  //   }
  // };

  // const saveSettings = async (key: string, value: boolean) => {
  //   try {
  //     await AsyncStorage.setItem(key, value.toString());
  //   } catch (error) {
  //     console.error("Error saving settings:", error);
  //   }
  // };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("/");
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    onPress: () => void,
    showArrow: boolean = true
  ) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-[#e9ecef]"
    >
      <View className="flex-row items-center">
        <View className="bg-[#e6f0f7] p-2 rounded-lg mr-3">
          {icon}
        </View>
        <View>
          <Text className="text-[16px] font-bold text-[#242424]">{title}</Text>
          <Text className="text-[14px] text-gray-500">{subtitle}</Text>
        </View>
      </View>
      {showArrow && <AntDesign name="right" size={20} color="#BEBEBEBE" />}
    </TouchableOpacity>
  );

  const renderSwitchItem = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View className="flex-row items-center justify-between py-4 border-b border-[#e9ecef]">
      <View className="flex-row items-center">
        <View className="bg-[#e6f0f7] p-2 rounded-lg mr-3">
          {icon}
        </View>
        <View>
          <Text className="text-[16px] font-bold text-[#242424]">{title}</Text>
          <Text className="text-[14px] text-gray-500">{subtitle}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: "#BEBEBEBE", true: "#005DA0" }}
        thumbColor={value ? "#ffffff" : "#ffffff"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <View className="bg-[#f5f6f9] flex-1 pt-5 pb-24">
      <Header backBtn={false}/>

      <ScrollView className="px-5">
      <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
        <View className="flex-row items-center">
          <Image source={require("../../../assets/images/user.jpg")} className="h-16 w-16 rounded-full mr-4"/>
          <View>
            <Text className="text-lg font-bold text-[#242424]">
              {userData?.fullName || "Loading..."}
            </Text>
            <Text className="text-sm text-gray-500">
              {userData?.email || "Loading..."}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
        <Text className="text-lg font-bold mb-2">Account Settings</Text>
        
        {renderSettingItem(
          <Feather name="user" size={22} color="#005DA0" />,
          "Personal Information",
          "Update your personal details",
          () => router.push("/editProfile")
        )}
        
        {renderSettingItem(
          <MaterialIcons name="security" size={22} color="#005DA0" />,
          "Security",
          "Password and authentication",
          () => router.push("/security")
        )}
        
        {renderSettingItem(
          <Feather name="credit-card" size={22} color="#005DA0" />,
          "Withdraw Methods",
          "Manage your Withdraw options",
          () => router.push("/")
        )}
      </View>
      <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
        <Text className="text-lg font-bold mb-2">Support</Text>
        
        {renderSettingItem(
          <Feather name="help-circle" size={22} color="#005DA0" />,
          "Help Center",
          "Get help with the app",
          () => router.push("/help-center")
        )}
        
        {renderSettingItem(
          <Feather name="info" size={22} color="#005DA0" />,
          "About Us",
          "Learn more about our company",
          () => router.push("/about-us")
        )}
        
        {renderSettingItem(
          <Feather name="file-text" size={22} color="#005DA0" />,
          "Terms & Conditions",
          "Read our terms and conditions",
          () => router.push("/terms-conditions")
        )}
        
        {renderSettingItem(
          <Feather name="shield" size={22} color="#005DA0" />,
          "Privacy Policy",
          "Read our privacy policy",
          () => router.push("/privacy-policy")
        )}
      </View>

      <TouchableOpacity 
        onPress={handleLogout}
        className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] flex-row items-center"
      >
        <Feather name="log-out" size={22} color="#E25C5C" />
        <Text className="text-[#E25C5C] font-bold ml-3">Logout</Text>
      </TouchableOpacity>
      </ScrollView>

    </View>
  );
};

export default Settings;