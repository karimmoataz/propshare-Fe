// lib/i18n.ts
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js'; // Correct import
import en from '../assets/i18n/en';
import ar from '../assets/i18n/ar';

// Initialize I18n instance
const i18n = new I18n({
  en,
  ar,
});

// Set configuration
i18n.locale = Localization.locale.split('-')[0];
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const isRTL = Localization.isRTL;
export default i18n;