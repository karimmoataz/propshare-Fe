import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';

interface SectionHeaderProps {
  title: string;
  link: string;
  className?: string;
  style?: any;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, link, className, style }) => {
  const { locale, isRTL } = useLanguage();
  return (
    <View className={`flex-row justify-between items-center ${className}`} style={style}>
      <Text className="text-xl font-bold mb-2">{title}</Text>
      <TouchableOpacity>
        <Link href={link as any}>
          <Text className="text-base font-bold mb-2">{I18n.t('seeAll')}</Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
