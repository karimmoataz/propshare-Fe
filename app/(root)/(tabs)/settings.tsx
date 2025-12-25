import { View, Text, TouchableOpacity, ScrollView, Image, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import api from "../../api/axios";
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';
import Header from "@/components/Header";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BiometricToggle from "@/components/BiometricToggle";

type User = {
  fullName: string;
  email: string;
  phone: string;
};

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  // const [biometricEnabled, setBiometricEnabled] = useState(false);
  const { locale, isRTL } = useLanguage();

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      const response = await api.get("/get-user", {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        setUserData(response.data.user);
      } else {
        await AsyncStorage.removeItem("token");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("bioUseToken");
    router.push("/");
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    titleKey: string,
    subtitleKey: string,
    onPress: () => void,
    showArrow: boolean = true
  ) => (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center justify-between py-4 border-b border-[#e9ecef]"
    >
      <View className="flex-row items-center">
        <View className="bg-[#e6f0f7] p-2 rounded-lg me-3">
          {icon}
        </View>
        <View>
          <Text className="text-[16px] font-bold text-[#242424]">
            {I18n.t(titleKey)}
          </Text>
          <Text className="text-[14px] text-gray-500">
            {I18n.t(subtitleKey)}
          </Text>
        </View>
      </View>
      {showArrow && <AntDesign name={isRTL ? "left" : "right"} size={20} color="#BEBEBEBE" />}
    </TouchableOpacity>
  );

  const renderSwitchItem = (
  icon: React.ReactNode,
  titleKey: string,
  subtitleKey: string,
  value: boolean,
  onValueChange: (value: boolean) => void
) => (
  <View className="flex-row items-center justify-between py-4 border-b border-[#e9ecef]">
    <View className="flex-row items-center">
      <View className="bg-[#e6f0f7] p-2 rounded-lg me-3">
        {icon}
      </View>
      <View>
        <Text className="text-[16px] font-bold text-[#242424]">
          {I18n.t(titleKey)}
        </Text>
        <Text className="text-[14px] text-gray-500">
          {I18n.t(subtitleKey)}
        </Text>
      </View>
    </View>
    <Switch
      trackColor={{ false: "#BEBEBEBE", true: "#005DA0" }}
      thumbColor={value ? "#ffffff" : "#ffffff"}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

  return (
    <View className="bg-[#f5f6f9] flex-1 pt-5 pb-24" style={{ direction: isRTL ? 'rtl' : 'ltr' }} >
      <Header backBtn={false}/>

      <ScrollView className="px-5">
      <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
        <View className="flex-row items-center">
          <Image source={require("../../../assets/images/user.jpg")} className="h-16 w-16 rounded-full me-4"/>
          <View>
            <Text className="text-lg font-bold text-[#242424]">
              {userData?.fullName || I18n.t('loading')}
            </Text>
            <Text className="text-sm text-gray-500">
              {userData?.email || I18n.t('loading')}
            </Text>
          </View>
        </View>
      </View>

      {userData?(
        <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
        <Text className="text-lg font-bold mb-2">{I18n.t('accountSettings')}</Text>
        
        {renderSettingItem(
          <Feather name="user" size={22} color="#005DA0" />,
          'personalInformation',
          'updatePersonalDetails',
          () => router.push("/editProfile")
        )}
        
        {renderSettingItem(
          <MaterialIcons name="security" size={22} color="#005DA0" />,
          'security',
          'passwordAuth',
          () => router.push("/security")
        )}

      </View>
      ): null}

      <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
        <Text className="text-lg font-bold mb-2">{I18n.t('appSettings')}</Text>
        <View className=" border-b pb-4 border-[#e9ecef]">
          <LanguageSwitcher />
        </View>
        <View className="">
          <BiometricToggle />
        </View>
      </View>

      <View className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] mb-5">
        <Text className="text-lg font-bold mb-2">{I18n.t('support')}</Text>
        
        {renderSettingItem(
          <Feather name="help-circle" size={22} color="#005DA0" />,
          'helpCenter',
          'getHelp',
          () => router.push("/help-center")
        )}
        
        {renderSettingItem(
          <Feather name="info" size={22} color="#005DA0" />,
          'aboutUs',
          'learnMore',
          () => router.push("/about-us")
        )}
        
        {renderSettingItem(
          <Feather name="file-text" size={22} color="#005DA0" />,
          'termsConditions',
          'readTerms',
          () => router.push("/terms-conditions")
        )}
        
        {renderSettingItem(
          <Feather name="shield" size={22} color="#005DA0" />,
          'privacyPolicy',
          'readPrivacy',
          () => router.push("/privacy-policy")
        )}
      </View>

      {userData? (
        <TouchableOpacity 
        onPress={handleLogout}
        className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] flex-row items-center"
        >
          <Feather name="log-out" size={22} color="#E25C5C" />
          <Text className="text-[#E25C5C] font-bold ms-3">{I18n.t('logout')}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
        onPress={handleLogout}
        className="bg-white rounded-xl p-5 shadow-sm border-[1px] border-[#e9ecef] flex-row items-center"
        >
          <Feather name="log-in" size={22} color="#5CE27C" />
          <Text className="text-[#5CE27C] font-bold ms-3">{I18n.t('login')}</Text>
        </TouchableOpacity>
      )}

      </ScrollView>
    </View>
  );
};

export default Settings;