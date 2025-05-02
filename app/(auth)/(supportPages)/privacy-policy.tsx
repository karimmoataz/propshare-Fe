import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/Header";

const PrivacyPolicy = () => {
  return (
    <View className="bg-white h-full py-5 w-full flex-1">
        <Header />
        <View className="flex-1 p-5">
            <Text className="text-2xl font-bold text-[#005DA0] mb-4">Privacy Policy</Text>
            <Text className="text-base text-gray-700 mb-4">
                At PropShare, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information.
            </Text>
            <Text className="text-lg font-semibold text-[#242424] mb-2">1. Information Collection</Text>
            <Text className="text-base text-gray-700 mb-4">
                We collect personal details such as name, email, phone, and investment activity. This data is used solely for account management and investment operations.
            </Text>
            <Text className="text-lg font-semibold text-[#242424] mb-2">2. Data Security</Text>
            <Text className="text-base text-gray-700 mb-4">
                Your data is encrypted and stored securely. We implement best practices to ensure confidentiality, integrity, and availability.
            </Text>
            <Text className="text-lg font-semibold text-[#242424] mb-2">3. Sharing Information</Text>
            <Text className="text-base text-gray-700 mb-4">
                We never share your personal information with third parties without your consent unless required by law.
            </Text>
        </View>
    </View>
  );
};

export default PrivacyPolicy;
