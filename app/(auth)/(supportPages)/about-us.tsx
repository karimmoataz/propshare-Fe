import { View, Text } from "react-native";
import React from "react";
import Header from "@/components/Header";
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';

const AboutUs = () => {
  const { isRTL } = useLanguage();

  return (
    <View className="bg-white h-full py-5 w-full flex-1" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <Header isRTL={isRTL}/>
        <View className="flex-1 p-5">
            <Text className="text-2xl font-bold text-[#005DA0] mb-4">{I18n.t('aboutPropShare')}</Text>
            <Text className="text-base text-gray-700 mb-4">
              {I18n.t('aboutPropShareDesc')}
            </Text>
            
            <Text className="text-lg font-semibold text-[#242424] mb-2">{I18n.t('ourMission')}</Text>
            <Text className="text-base text-gray-700 mb-4">
              {I18n.t('missionStatement')}
            </Text>
            
            <Text className="text-lg font-semibold text-[#242424] mb-2">{I18n.t('whyChooseUs')}</Text>
            <Text className="text-base text-gray-700 mb-4">
              {I18n.t('whyChooseUsPoints')}
            </Text>
        </View>
    </View>
  );
};

export default AboutUs;
