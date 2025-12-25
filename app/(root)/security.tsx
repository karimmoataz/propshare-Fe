import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import api from "../api/axios";

const Security = () => {
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const router = useRouter();

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      const { data } = await api.post("/forgot-password", { email });
      Alert.alert("Success", data.message);
      setIsCodeSent(true);
    } catch (error: any) {
      console.error("Send code error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to send reset code. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const { data } = await api.post("/reset-password", {
        token: resetToken,
        newPassword,
        confirmPassword,
      });
      Alert.alert("Success", data.message);
      router.push("/sign-in");
    } catch (error: any) {
      console.error("Reset password error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

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
            <View className="w-full">
                <View className="">
                <Text className="text-2xl font-bold text-black mb-3">Reset Your Password</Text>
                </View>
            </View>
            <View className="">
                <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter Your Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isCodeSent}
                />
                {isCodeSent && (
                <>
                    <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                    placeholder="Enter Reset Code"
                    value={resetToken}
                    onChangeText={setResetToken}
                    />
                    <View className="border border-gray-300 rounded-lg px-4 py-1 flex-row items-center mb-4">
                    <TextInput
                        className="flex-1 placeholder:text-gray-500"
                        placeholder="New Password"
                        secureTextEntry={!isPasswordVisible}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Ionicons
                        name={isPasswordVisible ? "eye" : "eye-off"}
                        size={20}
                        color="gray"
                        />
                    </TouchableOpacity>
                    </View>
                    <View className="border border-gray-300 rounded-lg px-4 py-1 flex-row items-center mb-4">
                    <TextInput
                        className="flex-1 placeholder:text-gray-500"
                        placeholder="Confirm New Password"
                        secureTextEntry={!isConfirmPasswordVisible}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                        <Ionicons
                        name={isConfirmPasswordVisible ? "eye" : "eye-off"}
                        size={20}
                        color="gray"
                        />
                    </TouchableOpacity>
                    </View>
                </>
                )}
                {!isCodeSent ? (
                <CustomButton text="Send Code" onPress={handleSendCode} />
                ) : (
                <CustomButton text="Reset Password" onPress={handleResetPassword} />
                )}
            </View>
        </ScrollView>
    </View>
  );
};

export default Security;