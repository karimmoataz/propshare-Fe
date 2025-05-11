import { Link, useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, StatusBar, ImageBackground, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api/axios";
import { authenticateWithBiometrics, isBiometricsEnabled, checkBiometricAvailability } from "../utility/biometrics";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
    <View className="flex-1 bg-white">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
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
            Redefining the way you invest in property
          </Text>
          <Text className="text-base text-left text-[#88898F] mt-3">
            Start with Propshare to transform your financial future through simple,
            accessible real estate investments.
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
          <TouchableOpacity
            className="bg-white flex-row items-center px-6 py-3 rounded-xl shadow-lg absolute bottom-20"
            onPress={() => router.push("/sign-in")}
          >
            <Ionicons name="paper-plane" size={20} color="#005DA0" />
            <View>
              <Text className="text-[#005DA0] font-bold ms-2">Get Started</Text>
            </View>
          </TouchableOpacity>
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