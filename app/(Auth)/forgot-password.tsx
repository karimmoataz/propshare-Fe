import React, { useState } from "react";
import { View , Text , ScrollView , Image , StatusBar , TextInput , TouchableOpacity , KeyboardAvoidingView , Platform , TouchableWithoutFeedback , Keyboard , Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import api from "../api/axios";

const ForgotPassword = () => {
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
    <View className="bg-white h-full w-full">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <LinearGradient
              colors={["rgba(189, 231, 249, 0.3)", "rgba(189, 231, 249, 0)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.3 }}
              className="absolute bottom-0 w-full h-full"
            />
            <View className="w-full mt-28 px-5">
              <Image
                source={require("../../assets/images/logo.png")}
                className="w-60 h-16 mb-6 mx-auto"
              />
              <View className="my-10">
                <Text className="text-2xl font-bold text-black mb-3">Reset Your Password</Text>
                <Text className="text-base text-gray-700">
                  Enter your email and follow the instructions to reset your password
                </Text>
              </View>
            </View>
            <View className="justify-center px-6 bg-white">
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
                      className="flex-1"
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
                      className="flex-1"
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
            <View className="items-center px-6 mt-10 mb-5">
              <Text className="text-gray-600">
                Remember your password?{" "}
                <Link href="/sign-in">
                  <Text className="text-blue-600 font-semibold">Sign In</Text>
                </Link>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;