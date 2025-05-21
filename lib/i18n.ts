// lib/i18n.ts
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../assets/i18n/en';
import ar from '../assets/i18n/ar';

// Initialize I18n instance
const i18n = new I18n({
  en,
  ar,
});

// Global fallback handler for missing translations
i18n.missingTranslation = (scope) => {
  console.warn(`Translation missing for key: "${scope[0]}"`);
  return scope[0]; // Return the key itself instead of undefined
};

// Set configuration with fallbacks
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Get device locale safely
const deviceLocale = Localization.locale?.split('-')[0] || 'en';
i18n.locale = deviceLocale;

// Dynamic RTL check based on current locale
export const isRTL = () => i18n.locale === 'ar';

export default i18n;