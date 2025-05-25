import { View, Text, ScrollView, Image, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from "react-native";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/CustomButton";
import api from "./api/axios";
import { authenticateWithBiometrics, isBiometricsEnabled, checkBiometricAvailability } from "../utility/biometrics";
import I18n from "../lib/i18n";
import { useLanguage } from '../context/LanguageContext';

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isRTL } = useLanguage();

  const handleBiometricAuth = async () => {
    try {
      const biometricsEnabled = await isBiometricsEnabled();
      if (!biometricsEnabled) return;

      const biometricStatus = await checkBiometricAvailability();
      if (!biometricStatus.available) {
        Alert.alert(
          "Biometric Authentication Unavailable",
          "Your device doesn't support biometric authentication or you haven't set it up. Using password authentication instead.",
          [{ text: "OK" }]
        );
        return;
      }

      const bioUseToken = await AsyncStorage.getItem("bioUseToken");
      if (bioUseToken) {
        const isAuthenticated = await authenticateWithBiometrics();
        if (isAuthenticated) {
          await AsyncStorage.setItem("token", bioUseToken);
          router.replace("/home");
        }
      }
    } catch (error) {
      console.error("Biometric auth error:", error);
    }
  }


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

  const handleResendVerification = async (userEmail: string) => {
    setIsLoading(true);
    try {
      await api.post("/resend-verification", { email: userEmail });
      Alert.alert(I18n.t('common.success'), I18n.t('signIn.verification_resent'));
    } catch (error: any) {
      Alert.alert(I18n.t('common.error'), error.response?.data?.message || I18n.t('signIn.verification_resend_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert(I18n.t('common.error'), I18n.t('signIn.missing_credentials'));
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/login", { email, password });
      
      if (rememberMe) {
        await AsyncStorage.setItem("token", data.token);
      }
      router.push("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorData = error.response?.data;
      
      if (errorData?.resendAvailable) {
        Alert.alert(
          "Email Not Verified",
          errorData.message,
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            { 
              text: "Resend Email",
              onPress: () => handleResendVerification(errorData.email)
            }
          ]
        );
      } else {
        Alert.alert("Error", errorData?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
          <ScrollView className="flex-grow">
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
              <View className="my-10">
                <Text className="text-2xl font-bold text-black mb-3 text-center">
                  {I18n.t('signIn.title')}
                </Text>
                <Text className="text-base text-gray-700 text-center">
                  {I18n.t('signIn.subtitle')}
                </Text>
              </View>
            </View>
            <View className="justify-center px-6 bg-white">
              <TextInput
                className="border border-gray-300 placeholder:text-gray-500 rounded-lg px-4 py-3 mb-4"
                placeholder={I18n.t('signIn.email_placeholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                importantForAutofill="no"
              />
              <View className={`border border-gray-300 rounded-lg text-gray-500 px-4 py-3 flex-row items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TextInput
                  className="flex-1 placeholder:text-gray-500 py-0"
                  placeholder={I18n.t('signIn.password_placeholder')}
                  secureTextEntry={!isPasswordVisible}
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                  importantForAutofill="no"
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons
                    name={isPasswordVisible ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <View className={`flex-row justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Checkbox
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    color={rememberMe ? "#005DA0" : undefined}
                  />
                  <Text className={`ml-2 text-gray-500`}>
                    {I18n.t('signIn.remember_me')}
                  </Text>
                </View>
                <Link href="/forgot-password">
                  <Text className="text-blue-600 font-semibold">
                    {I18n.t('signIn.forgot_password')}
                  </Text>
                </Link>
              </View>
              <View className="flex-row justify-between items-center">
                <CustomButton className="flex-1 w-full" text={I18n.t('signIn.login_button')} onPress={handleSignIn} />
                <TouchableOpacity className="border-[1px] rounded-lg border-gray-500 bg-[#F8F8FF] p-3 ms-2" onPress={handleBiometricAuth}>
                  {Platform.OS === "android" ? (
                    <Ionicons name="finger-print" size={24} color="#005DA0" />
                  ) : Platform.OS === "ios" ? (
                    <MaterialCommunityIcons name="face-recognition" size={24} color="#005DA0" />
                  ) : (
                    <Ionicons name="shield-checkmark" size={24} color="#005DA0" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="items-center px-6 mt-10 mb-5">
              <Text className="text-gray-600">
                {I18n.t('signIn.no_account')}{" "}
                <Link href="/sign-up">
                  <Text className="text-blue-600 font-semibold">
                    {I18n.t('signIn.sign_up_link')}
                  </Text>
                </Link>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}