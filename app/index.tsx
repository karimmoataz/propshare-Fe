import { Link, useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, StatusBar, ImageBackground, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api/axios";
import { authenticateWithBiometrics, isBiometricsEnabled, checkBiometricAvailability } from "../utility/biometrics";
import IndexLanguageSwitcher from "../components/IndexLanguageSwitcher";
import I18n from "../lib/i18n";
import { useLanguage } from '../context/LanguageContext';



export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { locale, isRTL } = useLanguage();
  

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem("token");
        
        if (!userToken) {
          setIsLoading(false);
          return;
        }
        
        await handleBiometricAuth(userToken);
      } catch (error) {
        console.error("Auth check error:", error);
        await AsyncStorage.removeItem("token");
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const handleBiometricAuth = async (token: string) => {
    try {
      const biometricsEnabled = await isBiometricsEnabled();
      
      if (!biometricsEnabled) {
        validateTokenAndNavigate(token);
        return;
      }
      
      const biometricStatus = await checkBiometricAvailability();
      
      if (!biometricStatus.available) {
        Alert.alert(
          "Biometric Authentication Unavailable",
          "Your device doesn't support biometric authentication or you haven't set it up. Using password authentication instead.",
          [{ text: "OK" }]
        );
        validateTokenAndNavigate(token);
        return;
      }
      const authResult = await authenticateWithBiometrics("Verify your identity to continue");
      
      if (authResult.success) {
        validateTokenAndNavigate(token);
      } else {

        await AsyncStorage.removeItem("token");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Biometric auth error:", error);

      await AsyncStorage.removeItem("token");
      setIsLoading(false);
    }
  };

  const validateTokenAndNavigate = async (token: string) => {
    try {
      const response = await api.get("/get-user", {
        headers: { Authorization: token },
      });
      
      if (response.status === 200) {
        router.replace("/home");
      } else {
        await AsyncStorage.removeItem("token");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Token validation error:", error);
      await AsyncStorage.removeItem("token");
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
    <View className="flex-1 bg-white" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <IndexLanguageSwitcher />
      {/* Top half with content and gradient */}
      <View className="h-[50%] items-center justify-center">
        <LinearGradient
          colors={["rgba(189, 231, 249, 0.3)", "rgba(189, 231, 249, 0)"]}
          style={styles.gradient}
          start={[0.5, 1]}
          end={[0.5, 0]}
        />
        <Image
          source={require("../assets/images/logo.png")}
          className="w-80 h-24 mb-6"
        />
        <View className="px-6">
          <Text className="text-xl font-bold text-left text-[#3D3F33]">
            {I18n.t('welcome_title')}
          </Text>
          <Text className="text-base text-left text-[#88898F] mt-3">
            {I18n.t('welcome_subtitle')}
          </Text>
        </View>
      </View>
      
      {/* Bottom half with image background */}
      <View className="bg-[#bde7f94d] h-[50%]">
        <ImageBackground
          source={require("../assets/images/welcome.png")}
          className=" h-full rounded-t-[73px] overflow-hidden justify-center items-center"
          resizeMode="cover"
        >
          <View className="absolute bottom-20 items-center">
            <TouchableOpacity onPress={() => router.push("/home")}>
              <Text className="text-gray-800 mb-5 underline">{I18n.t('continue_as_guest')}</Text>
            </TouchableOpacity>
            <View className="flex-row justify-around w-full px-5">
              <TouchableOpacity
              className="bg-white flex-row items-center justify-center px-6 py-3 rounded-xl shadow-lg "
              onPress={() => router.push("/sign-in")}
              >
                
                <View>
                  <Text className="text-[#005DA0] font-bold ms-2 text-center w-28">{I18n.t('login')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white flex-row items-center justify-center px-6 py-3 rounded-xl shadow-lg"
                onPress={() => router.push("/sign-up")}
              >
                
                <View>
                  <Text className="text-[#005DA0] font-bold ms-2 text-center w-28">{I18n.t('sign_up')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  }
});