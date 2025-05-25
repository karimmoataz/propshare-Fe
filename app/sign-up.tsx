import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import api from "./api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import I18n from "../lib/i18n";
import { useLanguage } from '../context/LanguageContext';

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { isRTL } = useLanguage();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("token");
        if (userToken) {
          router.replace("/home");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert(I18n.t('common.error'), I18n.t('signUp.password_mismatch'));
      return;
    }

    try {
      const { data } = await api.post("/register", {
        fullName,
        email,
        phone,
        password,
      });
      
       Alert.alert("Success", data.message);
      router.push("/congrats");
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || "Registration failed! Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  return (
    <View className="bg-white h-full w-full" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerClassName="flex-grow">
            <LinearGradient
              colors={["rgba(189, 231, 249, 0.3)", "rgba(189, 231, 249, 0)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.3 }}
              className="absolute bottom-0 w-full h-full"
            />

            <View className="w-full mt-28 px-5">
              <Image
                source={require("../assets/images/logo.png")}
                className="w-60 h-16 mb-6 mx-auto"
              />
              <Text className="text-2xl font-bold text-black mb-3 text-center">
                {I18n.t('signUp.title')}
              </Text>
            </View>

            <View className="justify-center px-6 bg-white">
              <TextInput
                className="border border-gray-300 placeholder:text-gray-500 rounded-lg px-4 py-3 mb-4"
                placeholder={I18n.t('signUp.fullname_placeholder')}
                keyboardType="default"
                autoCapitalize="words"
                value={fullName}
                onChangeText={setFullName}
                autoComplete="off"
              />
              <TextInput
                className="border border-gray-300 placeholder:text-gray-500 rounded-lg px-4 py-3 mb-4"
                placeholder={I18n.t('signUp.email_placeholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <View className={`border border-gray-300 rounded-lg px-4 py-3 flex-row items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className="text-gray-500">+2</Text>
                <TextInput
                  className="flex-1 placeholder:text-gray-500 py-0 mx-2"
                  placeholder={I18n.t('signUp.phone_placeholder')}
                  keyboardType="phone-pad"
                  value={phone}
                  maxLength={11}
                  onChangeText={setPhone}
                />
              </View>
              <View className={`border border-gray-300 rounded-lg text-gray-500 px-4 py-3 flex-row items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TextInput
                  className="flex-1 placeholder:text-gray-500 py-0"
                  placeholder={I18n.t('signUp.password_placeholder')}
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  autoCorrect={false}
                  autoComplete="off"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <View className={`border border-gray-300 rounded-lg px-4 py-3 flex-row items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TextInput
                  className="flex-1 placeholder:text-gray-500 py-0"
                  placeholder={I18n.t('signUp.confirm_password_placeholder')}
                  secureTextEntry={!isPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCorrect={false}
                  autoComplete="off"
                />
              </View>
              <CustomButton text={I18n.t('signUp.signup_button')} onPress={handleSignUp} />
            </View>
            <View className="items-center px-6 mt-10 mb-5">
              <Text className="text-gray-600">
                {I18n.t('signUp.have_account')}{" "}
                <Link href="/sign-in">
                  <Text className="text-blue-600 font-semibold">
                    {I18n.t('signUp.sign_in_link')}
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

export default SignUp;