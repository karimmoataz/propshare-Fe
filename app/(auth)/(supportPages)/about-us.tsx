import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/Header";

const AboutUs = () => {
  return (
    <View className="bg-white h-full py-5 w-full flex-1">
        <Header />
        <View className="flex-1 p-5">

            <Text className="text-2xl font-bold text-[#005DA0] mb-4">About PropShare</Text>
            <Text className="text-base text-gray-700 mb-4">
            PropShare is a fintech startup committed to democratizing real estate investment. We help people invest in high-value properties through fractional ownership.
            </Text>
            <Text className="text-lg font-semibold text-[#242424] mb-2">Our Mission</Text>
            <Text className="text-base text-gray-700 mb-4">
            To make real estate investment accessible, affordable, and profitable for everyone — especially young and low-income individuals.
            </Text>
            <Text className="text-lg font-semibold text-[#242424] mb-2">Why Choose Us?</Text>
            <Text className="text-base text-gray-700 mb-4">
            • Minimal capital requirement{"\n"}
            • Transparent investments{"\n"}
            • Real-time portfolio tracking{"\n"}
            • Rental income returns
            </Text>
        </View>
    </View>
  );
};

export default AboutUs;
