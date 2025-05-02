import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import api from "../api/axios";

type User = {
  fullName: string;
  email: string;
  phone: string;
  verified: boolean;
};

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);

  const handleResendVerification = async (userEmail: string) => {
    setLoading(true);
    try {
      await api.post("/resend-verification", { email: userEmail });
      Alert.alert("Success", "Verification email has been resent. Please check your inbox.");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to resend verification email.");
    } finally {
        setLoading(false);
    }
  };


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
        const userData = response.data.user;
        setFullName(userData.fullName);
        setEmail(userData.email);
        setPhone(userData.phone);
        setVerified(userData.verified);
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
  }, []);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    
    if (!email.trim()) {
      Alert.alert("Error", "Email cannot be empty");
      return;
    }
    
    if (!phone.trim()) {
      Alert.alert("Error", "Phone cannot be empty");
      return;
    }
    
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      
      const response = await api.post("/update-profile", {
        fullName,
        email,
        phone
      }, {
        headers: { Authorization: token },
      });
      
      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (
    label: string, 
    value: string, 
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: React.ReactNode,
    keyboardType: "default" | "email-address" | "numeric" | "phone-pad" = "default",
    editable: boolean = true
  ) => (
    <View className="mb-4">
      <Text className="text-gray-600 mb-1">{label}</Text>
      <View className="flex-row items-center bg-white border border-[#e9ecef] rounded-lg py-3 px-4">
        {icon}
        <TextInput
          className="flex-1 text-[16px] ml-2 text-[#242424]"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  return (
    <View className="bg-[#f5f6f9] flex-1 pt-14 px-5">
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#242424" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#242424]">Edit Profile</Text>
        </View>
      </View>

      <ScrollView className="flex-1 pb-36">
        <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
            <Text className="text-lg font-bold mb-4">Personal Information</Text>
            
            {renderInput(
            "Full Name",
            fullName,
            setFullName,
            "Enter your full name",
            <Feather name="user" size={20} color="#BEBEBEBE" />
            )}
            
            {renderInput(
            "Email",
            email,
            setEmail,
            "Enter your email",
            <MaterialIcons name="email" size={20} color="#BEBEBEBE" />,
            "email-address"
            )}

            {!verified ? 
                <View className="mb-4">
                    <Text className="text-red-500 text-sm mb-2">Your email is not verified</Text>
                    <TouchableOpacity onPress={() => handleResendVerification(email)} className="bg-[#005DA0] py-2 px-4 rounded-lg">
                        <Text className="text-white text-center">Verify Email</Text>
                    </TouchableOpacity>
                </View>  : <View></View>
            }
            
            {renderInput(
            "Phone Number",
            phone,
            setPhone,
            "Enter your phone number",
            <Feather name="phone" size={20} color="#BEBEBEBE" />,
            "phone-pad"
            )}
        </View>

        <View className="flex-row justify-between mb-10">
            <TouchableOpacity 
            onPress={() => router.back()}
            className="bg-white py-3 px-8 rounded-lg border border-[#e9ecef] w-[48%]"
            >
            <Text className="text-center font-bold text-[#242424]">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
            onPress={handleSave}
            disabled={saving}
            className="bg-[#005DA0] py-3 px-8 rounded-lg w-[48%]"
            >
            {saving ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <Text className="text-center font-bold text-white">Save Changes</Text>
            )}
            </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;