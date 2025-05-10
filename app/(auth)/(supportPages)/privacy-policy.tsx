import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "@/components/Header";
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';

const PrivacyPolicy = () => {
  const { isRTL } = useLanguage();
  const sections = ['privacy1', 'privacy2', 'privacy3']; // Add these in translation files

  return (
    <View className="bg-white h-full py-5 w-full flex-1" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Header isRTL={isRTL}/>
        <View className="flex-1 p-5">
            <Text className="text-2xl font-bold text-[#005DA0] mb-4">{I18n.t('privacyPolicy')}</Text>
            <Text className="text-base text-gray-700 mb-4">
                {I18n.t('privacyIntro')}
            </Text>
            
            {sections.map((key) => (
              <React.Fragment key={key}>
                <Text className="text-lg font-semibold text-[#242424] mb-2">
                  {I18n.t(`${key}.title`)}
                </Text>
                <Text className="text-base text-gray-700 mb-4">
                  {I18n.t(`${key}.body`)}
                </Text>
              </React.Fragment>
            ))}
        </View>
    </View>
  );
};

export default PrivacyPolicy;
