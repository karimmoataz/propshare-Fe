import React, { useState } from "react";
import { View, Text, ScrollView, Image, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import api from "../api/axios";
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { isRTL } = useLanguage();

  const handleSendCode = async () => {
    setIsLoading(true);
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.post("/forgot-password", { email });
      Alert.alert("Success", data.message);
      setIsCodeSent(true);
    } catch (error: any) {
      console.error("Send code error:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");;
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
    <View className="bg-white h-full w-full" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
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
                <Text className="text-2xl font-bold text-black mb-3 text-center">
                  {I18n.t('forgotPassword.title')}
                </Text>
                <Text className="text-base text-gray-700 text-center">
                  {I18n.t('forgotPassword.subtitle')}
                </Text>
              </View>
            </View>
            <View className="justify-center px-6 bg-white">
              <TextInput
                className="border border-gray-300 placeholder:text-gray-500 rounded-lg px-4 py-3 mb-4"
                placeholder={I18n.t('forgotPassword.email_placeholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!isCodeSent}
              />
              {isCodeSent && (
                <>
                  <TextInput
                    className="border border-gray-300 placeholder:text-gray-500 rounded-lg px-4 py-3 mb-4"
                    placeholder={I18n.t('forgotPassword.code_placeholder')}
                    value={resetToken}
                    onChangeText={setResetToken}
                  />
                  <View className={`border border-gray-300 rounded-lg px-4 py-3 flex-row items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TextInput
                      className="flex-1 placeholder:text-gray-500 py-0"
                      placeholder={I18n.t('forgotPassword.new_password_placeholder')}
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
                  <View className="border border-gray-300 rounded-lg px-4 py-3 flex-row items-center mb-4">
                    <TextInput
                      className="flex-1 placeholder:text-gray-500 py-0"
                      placeholder={I18n.t('forgotPassword.confirm_password_placeholder')}
                      secureTextEntry={!isPasswordVisible}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>
                </>
              )}
              {isLoading ? (
                  <CustomButton text={I18n.t('common.loading')} />
                ) : !isCodeSent ? (
                  <CustomButton text={I18n.t('forgotPassword.send_code_button')} onPress={handleSendCode} />
                ) : (
                  <CustomButton text={I18n.t('forgotPassword.reset_button')} onPress={handleResetPassword} />
                )}
            </View>
            <View className="items-center px-6 mt-10 mb-5">
              <Text className="text-gray-600">
                {I18n.t('forgotPassword.remember_password')}{" "}
                <Link href="/sign-in">
                  <Text className="text-blue-600 font-semibold">
                    {I18n.t('forgotPassword.sign_in_link')}
                  </Text>
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