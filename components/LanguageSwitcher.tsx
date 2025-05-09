import { View, Text, Pressable, LayoutAnimation } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import I18n from '../lib/i18n';

const LanguageSwitcher = () => {
  const { locale, toggleLocale, isRTL } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', nameKey: 'English' },
    { code: 'ar', nameKey: 'العربية' },
  ];

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDropdown(!showDropdown);
  };

  const handleLanguageChange = (code: string) => {
    if (code !== locale) toggleLocale();
    setShowDropdown(false);
  };

  return (
    <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Pressable
        onPress={handlePress}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <View className="bg-[#e6f0f7] p-2 rounded-lg me-3">
            <MaterialIcons name="language" size={24} color="#005DA0" />
          </View>
          <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
            <Text className="text-[16px] font-bold text-[#242424]">
              {I18n.t('language')}
            </Text>
            <Text className="text-[14px] text-gray-500">
                {I18n.t(locale === 'en' ? 'english' : 'arabic')}
            </Text>
          </View>
        </View>
        <MaterialIcons 
          name={showDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color="#242424" 
        />
      </Pressable>

      {showDropdown && (
        <View className="pb-2">
          {languages.map((lang, index) => (
            <Pressable
              key={lang.code}
              onPress={() => handleLanguageChange(lang.code)}
              className={`flex-row items-center justify-between px-4 py-3 ${
                index !== languages.length - 1 ? 'border-b border-[#e9ecef]' : ''
              }`}
            >
              <View className="flex-row items-center">
                <View className="bg-[#e6f0f7] p-2 rounded-lg me-3">
                  <MaterialIcons 
                    name="translate" 
                    size={24} 
                    color="#005DA0" 
                  />
                </View>
                <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                  <Text className="text-[16px] font-bold text-[#242424]">
                    {lang.nameKey}
                  </Text>
                </View>
              </View>
              {locale === lang.code && (
                <MaterialIcons name="check" size={24} color="#005DA0" />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default LanguageSwitcher;