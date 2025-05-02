import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/Header";

const TermsConditions = () => {
  return (
    <View className="bg-white h-full py-5 w-full flex-1">
        <Header />
            <View className="flex-1 p-5">
                <Text className="text-2xl font-bold text-[#005DA0] mb-4">Terms & Conditions</Text>
                <Text className="text-base text-gray-700 mb-4">
                    Welcome to PropShare. By using our app, you agree to the following terms.
                </Text>
                <Text className="text-lg font-semibold text-[#242424] mb-2">1. Account Responsibility</Text>
                <Text className="text-base text-gray-700 mb-4">
                    You are responsible for safeguarding your account credentials and ensuring all activity under your account complies with our terms.
                </Text>
                <Text className="text-lg font-semibold text-[#242424] mb-2">2. Investment Risks</Text>
                <Text className="text-base text-gray-700 mb-4">
                    Investments in real estate carry risk. Past performance is not indicative of future results.
                </Text>
                <Text className="text-lg font-semibold text-[#242424] mb-2">3. Platform Usage</Text>
                <Text className="text-base text-gray-700 mb-4">
                    You must not use the platform for illegal activities, spamming, or attempting to breach security measures.
                </Text>
            </View>
    </View>
  );
};

export default TermsConditions;
