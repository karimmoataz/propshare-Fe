import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n, { isRTL } from '../lib/i18n'; // Updated import
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageContextType = {
  locale: string;
  toggleLocale: () => void;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  toggleLocale: () => {},
  isRTL: false,
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    const loadLocale = async () => {
      const savedLocale = await AsyncStorage.getItem('locale');
      if (savedLocale) {
        setLocale(savedLocale);
        i18n.locale = savedLocale;
      }
    };
    loadLocale();
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
    i18n.locale = newLocale;
    AsyncStorage.setItem('locale', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ 
      locale, 
      toggleLocale, 
      isRTL: i18n.locale === 'ar' 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);