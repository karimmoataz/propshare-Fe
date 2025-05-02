import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Header from "@/components/Header";
import { router } from "expo-router";

const faqs = [
  {
    question: "How do I invest in a property?",
    answer:
      "Simply browse the properties, select one that fits your goals, and buy fractional shares using your wallet balance.",
  },
  {
    question: "What is fractional ownership?",
    answer:
      "Fractional ownership allows you to invest in a portion of a high-value property, earning returns proportionally.",
  },
  {
    question: "Can I sell my shares?",
    answer:
      "Yes, you can resell your shares anytime via the in-app secondary market for liquidity.",
  },
  {
    question: "How do I receive rental income?",
    answer:
      "Rental profits are distributed automatically to your PropShare wallet on a monthly basis.",
  },
];

const HelpCenter = () => {
  return (
    <View className="bg-white h-full py-5 w-full flex-1">
        <Header />
            <ScrollView className="bg-white p-6 flex-1">
            <Text className="text-2xl font-bold text-[#005DA0] mb-6">Help Center</Text>

            <Text className="text-lg font-semibold text-[#242424] mb-3">Frequently Asked Questions</Text>

            {faqs.map((faq, index) => (
                <View key={index} className="mb-4">
                <Text className="text-base font-bold text-[#005DA0] mb-1">{faq.question}</Text>
                <Text className="text-base text-gray-700">{faq.answer}</Text>
                </View>
            ))}

            <View className="my-8">
                <Text className="text-lg font-semibold text-[#242424] mb-2">Still need help?</Text>
                <Text className="text-base text-gray-700 mb-4">
                If you can't find what you're looking for, reach out to our support team.
                </Text>

                
                <TouchableOpacity
                    onPress={() => router.push("/chat-bot")}
                    className="bg-[#005DA0] p-4 rounded-lg w-full flex-row items-center justify-center mt-2"
                >
                    <Feather name="mail" size={20} color="#ffffff" />
                    <Text className="text-white text-base font-bold ml-2">Contact Support</Text>
                </TouchableOpacity>
            
            </View>
            </ScrollView>
        </View>
  );
};

export default HelpCenter;
