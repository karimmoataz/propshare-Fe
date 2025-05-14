import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import api from "../api/axios";
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';
import SectionHeader from "@/components/ui/SectionHeader";
import { useFinancials } from '../../context/FinancialContext';
import Header from "@/components/Header";

type EnrichedShare = {
  propertyId: string;
  shares: number;
  propertyName: string;
  totalShares: number;
  sharePrice?: number;
  monthlyRent: number;
  myRent: number;
};

const Shares = () => {
  const router = useRouter();
  const [shares, setShares] = useState<EnrichedShare[]>([]);
  const [loading, setLoading] = useState(true);
  const { isRTL } = useLanguage();
  const { updateFinancials } = useFinancials();


  const fetchUserShares = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const userResponse = await api.get("/get-user", {
        headers: { Authorization: token },
      });

      if (userResponse.status !== 200) {
        throw new Error("Failed to fetch user data");
      }

      const ownedShares = userResponse.data.user?.ownedShares || [];
      const enrichedShares = await Promise.all(
        ownedShares.map(async (share: any) => {
          const propertyResponse = await api.get(`/properties/${share.propertyId}`, {
            headers: { Authorization: token },
          });
          const monthlyRent = propertyResponse.data.monthlyRent;
          const totalShares = propertyResponse.data.numberOfShares;
          const shares = share.shares;
          const myRent = (monthlyRent / totalShares) * shares;

          return {
            propertyId: share.propertyId,
            shares: shares,
            propertyName: propertyResponse.data.name,
            totalShares: totalShares,
            sharePrice: propertyResponse.data.sharePrice,
            monthlyRent: monthlyRent,
            myRent: myRent
          };
        })
      );

      setShares(enrichedShares);
      updateFinancials(enrichedShares);
    } catch (error) {
      console.error("Error fetching shares:", error);
      await AsyncStorage.removeItem("token");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserShares();
    }, [])
  );

  

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="bg-[#f5f6f9] flex-1 pt-5"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <Header />

      {shares.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-20">
          <Text className="text-gray-500 text-lg">{I18n.t('noSharesFound')}</Text>
        </View>
      ) : (
        shares.map((share) => (
          <View 
            key={share.propertyId} 
            className="bg-white rounded-xl p-4 mb-4 shadow-sm mx-5"
          >
            <TouchableOpacity onPress={() => router.push(`/properties/${share.propertyId}`)}>
              <Text className="text-lg font-bold text-[#005DA0] mb-2">
                {share.propertyName}
              </Text>
            </TouchableOpacity>  
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">{I18n.t('yourShares')}:</Text>
              <Text className="font-semibold">
                {share.shares.toLocaleString()} {I18n.t('shares')}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">{I18n.t('percentageOwned')}:</Text>
              <Text className="font-semibold">
                {((share.shares / share.totalShares) * 100).toFixed(1)}%
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">{I18n.t('shareValue')}:</Text>
              <Text className="font-semibold">
                {I18n.t('currency.code')} {(share.shares * (share.sharePrice || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">{I18n.t('monthlyRent')}:</Text>
              <Text className="font-semibold text-[#53D258]">
                {I18n.t('currency.code')} {share.myRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
            </View>
          </View>
          
        ))
      )}
      <View className="h-10" />
    </ScrollView>
  );
};

export default Shares;