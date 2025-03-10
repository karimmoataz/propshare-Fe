import React, { useState } from "react";
import {View,Text,ScrollView,Image,StatusBar,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard,Alert} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import { API_BASE_URL } from "@env";


const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          username: email,
          phone,
          password,
        }),
      });
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed!");
      }
  
      const data = await response.json();
      Alert.alert("Success", data.message);
      router.push("/congrats");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong! Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View className="bg-white h-full w-full">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerClassName="flex-grow">
            <LinearGradient
              colors={["rgba(189, 231, 249, 0.3)", "rgba(189, 231, 249, 0)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 0.3 }}
              className="absolute bottom-0 w-full h-full"
            />

            <View className="w-full mt-28 px-5">
              <Image source={require("../assets/images/logo.png")} className="w-60 h-16 mb-6 mx-auto" />
              <Text className="text-2xl font-bold text-black mb-3">Create New Account</Text>
            </View>

            <View className="justify-center px-6 bg-white">
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Full Name"
                keyboardType="default"
                autoCapitalize="none"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter Your Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <View className="border border-gray-300 rounded-lg px-4 py-1 flex-row items-center mb-4">
                <Text className="text-gray-500">+2</Text>
                <TextInput
                  className="flex-1"
                  placeholder="Your Phone Number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              <View className="border border-gray-300 rounded-lg px-4 py-1 flex-row items-center mb-4">
                <TextInput
                  className="flex-1"
                  placeholder="Password"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="gray" />
                </TouchableOpacity>
              </View>
              <View className="border border-gray-300 rounded-lg px-4 py-1 flex-row items-center mb-4">
                <TextInput
                  className="flex-1"
                  placeholder="Confirm Password"
                  secureTextEntry={!isPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
              <CustomButton text="Sign Up" onPress={handleSignUp} />
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
                Already have an account?{" "}
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

export default SignUp;