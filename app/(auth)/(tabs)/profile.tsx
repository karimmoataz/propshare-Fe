import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Image, ImageBackground } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect, Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Feather } from "@expo/vector-icons";
import api from "../../api/axios";
import ShareCard from "@/components/ShareCard";
import SectionHeader from "@/components/ui/SectionHeader";
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';

const OFFICE_DATA = [
  { id: "1", name: "Zamalek Office", percentage: 20 },
  { id: "2", name: "Downtown Branch", percentage: 10 },
  { id: "3", name: "Nasr City Hub", percentage: 30 },
  { id: "4", name: "6 October City", percentage: 5 },
];

type User = {
  fullName: string;
  email: string;
  phone: string;
  idVerification: { status?: string },
  balance?: number;
  pendingIncome?: number;
  outcome?: number;
};

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isRTL } = useLanguage();
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      const response = await api.get("/get-user", {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        setUserData(response.data.user);
      } else {
        await AsyncStorage.removeItem("token");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      await AsyncStorage.removeItem("token");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("/");
  }

  const handleContentSizeChange = () => {
    if (isRTL && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="bg-[#f5f6f9] flex-1 pt-14 px-5" 
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {userData ? (
        <ScrollView className="flex-1 pb-36" showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Image 
                source={require("../../../assets/images/user.jpg")} 
                className="h-14 w-14 rounded-full me-4"
              />
              <View className="justify-center">
                <Text className="text-sm text-[#242424]">{I18n.t('goodMorning')}</Text>
                <Text className="text-2xl font-bold text-[#242424]">
                  {userData.fullName}
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Link href={"/notification"}>
                <Feather name="bell" size={24} color="#005DA0" />
              </Link>
            </TouchableOpacity>
          </View>

          {!userData?.idVerification?.status || userData.idVerification.status !== "verified" ? (
            <View className="bg-[#005DA0] p-4 border-[1px] border-[#e9ecef] mb-4 rounded-xl flex-row justify-between items-center">
              <Text className="text-lg font-black text-white">{I18n.t('idVerification')}</Text>
              <Link href={"/verification"}>
                <AntDesign name={isRTL ? "left" : "right"} size={24} color="white" />
              </Link>
            </View>
          ) : null}

          <ImageBackground 
            source={require("../../../assets/images/profileCard.png")} 
            imageStyle={{ borderRadius: 10 }} 
            className="bg-[#005da0] text-white p-6 rounded-xl mb-4"
          >
            <View>
              <Text className="text-lg text-white">{I18n.t('totalBalance')}</Text>
              <Text className="text-3xl font-bold text-white">
                EGP {Number(userData.balance || 0).toLocaleString("en-US")}
              </Text>
            </View>
            <View className="flex-row justify-end items-center">
              <Text className="text-white">{I18n.t('myWallet')}</Text>
              <TouchableOpacity className="bg-white p-2 rounded-full ms-2">
                <Link href="/wallet">
                  <AntDesign name={isRTL ? "left" : "right"} size={24} color="#005DA0" />
                </Link>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <ImageBackground 
            source={require("../../../assets/images/profileBalance.png")} 
            imageStyle={{ borderRadius: 10 }} 
            className="flex-row bg-[#005da0] rounded-xl justify-between mb-4"
          >
            <View className="p-4 flex-row items-center rounded-lg w-1/2 me-2">
              <AntDesign name="arrowdown" size={32} color="#53D258" />
              <View>
                <Text className="text-white">{I18n.t('pendingIncome')}</Text>
                <Text className="font-bold text-white">
                  EGP {Number(userData.pendingIncome).toLocaleString("en-US")}
                </Text>
              </View>
            </View>
            <View className="border-l-[1px] my-3 border-white"/>
            <View className="p-4 flex-row items-center rounded-lg w-1/2 ms-2">
              <AntDesign name="arrowup" size={32} color="#E25C5C" />
              <View>
                <Text className="text-white">{I18n.t('outcome')}</Text>
                <Text className="font-bold text-white">
                  EGP {Number(userData.outcome).toLocaleString("en-US")}
                </Text>
              </View>
            </View>
          </ImageBackground>

          <View className="bg-white bor p-4 shadow-slate-300 border-[1px] border-[#e9ecef] mb-4">
            <Text className="text-lg font-bold mb-2">{I18n.t('investmentOverview')}</Text>
            <View className="flex-row justify-between border-b-[1px] py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">{I18n.t('activeInvestment')}</Text>
              <Text>EGP 0.00</Text>
            </View>
            <View className="flex-row justify-between border-b-[1px] py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">{I18n.t('pendingInvestment')}</Text>
              <Text>EGP 0.00</Text>
            </View>
            <View className="flex-row justify-between border-b-[1px] py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">{I18n.t('egBalance')}</Text>
              <Text>EGP 0.00</Text>
            </View>
            <View className="flex-row justify-between py-3 border-[#BEBEBEBE]">
              <Text className="text-gray-600">{I18n.t('pendingRentalIncome')}</Text>
              <Text>EGP 0.00</Text>
            </View>
          </View>

          <View>
            <SectionHeader title={I18n.t('yourShare')} link="/shares" />
            <ScrollView 
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="my-2"
              onContentSizeChange={handleContentSizeChange}
              contentContainerStyle={[
                { 
                  paddingEnd: 16,
                  paddingStart: 16,
                  flexDirection: isRTL ? 'row-reverse' : 'row'
                }
              ]}
            >
              {OFFICE_DATA.map((office) => (
                <ShareCard
                  key={office.id}
                  id={office.id}
                  name={office.name}
                  percentage={office.percentage}
                  isRTL={isRTL}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">{I18n.t('noUserData')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Profile;