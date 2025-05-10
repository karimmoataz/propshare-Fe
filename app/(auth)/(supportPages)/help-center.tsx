import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import Header from "@/components/Header";
import { router } from "expo-router";
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';

const HelpCenter = () => {
  const { isRTL } = useLanguage();
  const faqKeys = ['faq1', 'faq2', 'faq3', 'faq4']; // Add these in translation files

  return (
    <View className="bg-white h-full py-5 w-full flex-1" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Header isRTL={isRTL} />
        <ScrollView className="bg-white p-6 flex-1">
            <Text className="text-2xl font-bold text-[#005DA0] mb-6">{I18n.t('helpCenter')}</Text>

            <Text className="text-lg font-semibold text-[#242424] mb-3">{I18n.t('faq')}</Text>

            {faqKeys.map((key, index) => (
                <View key={index} className="mb-4">
                <Text className="text-base font-bold text-[#005DA0] mb-1">
                  {I18n.t(`${key}.question`)}
                </Text>
                <Text className="text-base text-gray-700">
                  {I18n.t(`${key}.answer`)}
                </Text>
                </View>
            ))}

            <View className="my-8">
                <Text className="text-lg font-semibold text-[#242424] mb-2">{I18n.t('needHelp')}</Text>
                <Text className="text-base text-gray-700 mb-4">
                  {I18n.t('contactSupportDesc')}
                </Text>
                
                <TouchableOpacity
                    onPress={() => router.push("/chat-bot")}
                    className="bg-[#005DA0] p-4 rounded-lg w-full flex-row items-center justify-center mt-2"
                >
                    <Feather name="mail" size={20} color="#ffffff" />
                    <Text className="text-white text-base font-bold ml-2">{I18n.t('contactSupport')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  );
};

export default HelpCenter;
