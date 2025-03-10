import { View, Text, ScrollView, Image, StatusBar, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Checkbox from "expo-checkbox";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/CustomButton";
import { API_BASE_URL } from "@env";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          await AsyncStorage.setItem("token", data.token);
        }
        router.push("/home");
      } else {
        Alert.alert("Error", data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
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
              <View className="my-10">
                <Text className="text-2xl font-bold text-black mb-3">Sign in to your Account</Text>
                <Text className="text-base text-gray-700">
                  Enter your email and password to log in
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
              />
              <View className="border border-gray-300 rounded-lg px-4 py-1 flex-row items-center mb-4">
                <TextInput
                  className="flex-1"
                  placeholder="Password"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons
                    name={isPasswordVisible ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center">
                  <Checkbox
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    color={rememberMe ? "#005DA0" : undefined}
                  />
                  <Text className="ml-2 text-gray-500">Remember me</Text>
                </View>
                <Link href="/home">
                  <Text className="text-blue-600 font-semibold">Forgot Password?</Text>
                </Link>
              </View>
              <CustomButton text="Log in" onPress={handleSignIn} />
            </View>
            <View className="items-center px-6 mt-10 mb-5">
              <View className="flex-row items-center w-full mb-4">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-3 text-gray-500">Or</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
              </View>
              <TouchableOpacity className="flex-row items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg mb-3">
                <AntDesign name="google" size={24} color="black" />
                <View><Text className="text-base font-semibold ms-3">Continue with Google</Text></View>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg mb-6">
                <FontAwesome5 name="facebook" size={24} color="black" />
                <View><Text className="text-base font-semibold ms-3">Continue with Facebook</Text></View>
              </TouchableOpacity>
              <Text className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/sign-up">
                  <Text className="text-blue-600 font-semibold ">Sign Up</Text>
                </Link>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;