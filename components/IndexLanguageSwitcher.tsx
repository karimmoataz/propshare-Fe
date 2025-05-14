import { View, Text, Pressable, LayoutAnimation } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const IndexLanguageSwitcher = () => {
  const { locale, toggleLocale } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDropdown(!showDropdown);
  };

  const handleLanguageChange = (code: string) => {
    if (code !== locale) toggleLocale();
    setShowDropdown(false);
  };

  return (
    <View className="absolute right-4 top-10 z-50" style={{ direction:'ltr' }}>
      <Pressable
        onPress={handleToggle}
        className="flex-row items-center px-3 py-2 rounded-lg"
      >
        <MaterialIcons name="language" size={20} color="#6b7280" />
        <Text className="text-gray-600 ml-2 font-medium">{locale.toUpperCase()}</Text>
        <MaterialIcons 
          name={showDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={20} 
          color="#6b7280" 
        />
      </Pressable>

      {showDropdown && (
        <View className="absolute right-0 top-12 bg-white rounded-lg shadow-lg min-w-[120px]">
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => handleLanguageChange(lang.code)}
              className="flex-row items-center justify-between px-4 py-2"
            >
              <Text className={`text-gray-600 ${locale === lang.code ? 'font-bold' : ''}`}>
                {lang.name}
              </Text>
              {locale === lang.code && (
                <MaterialIcons name="check" size={16} color="#4b5563" />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default IndexLanguageSwitcher;