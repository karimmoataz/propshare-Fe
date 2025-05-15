import { View, Text, ScrollView, ActivityIndicator, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import api from "../../api/axios";
import I18n from "../../../lib/i18n";
import SectionHeader from "../../../components/ui/SectionHeader";
import Header from "../../../components/Header";
import { MaterialIcons } from "@expo/vector-icons";

type Property = {
  id: string;
  name: string;
  price: number;
  priceDate: Date;
  sharePrice: number;
  numberOfShares: number;
  availableShares: number;
  area: number;
  floors: number;
  rooms: number;
  location: string;
  previousPrices: Array<{ price: number; date: Date }>;
  images: string[];
  monthlyRent?: number;
};

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [soldPercentage, setSoldPercentage] = useState(0);
  const [userShares, setUserShares] = useState(0);
  const [percentageOwned, setPercentageOwned] = useState(0);
  const [shareValue, setShareValue] = useState(0);
  const [myRent, setMyRent] = useState(0);

   const fetchProperty = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push("/");
        return;
      }

      // Fetch property data
      const response = await api.get(`/properties/${id}`, {
        headers: { Authorization: token }
      });

      if (response.status === 200) {
        const propertyData = response.data;
        
        // Fetch user data to get owned shares
        const userResponse = await api.get("/get-user", {
          headers: { Authorization: token }
        });

        const ownedShares = userResponse.data.user?.ownedShares || [];
        const userShare = ownedShares.find((s: any) => s.propertyId === id);

        // Calculate user-specific metrics
        const shares = userShare?.shares || 0;
        const totalShares = propertyData.numberOfShares;
        const calculatedRent = (propertyData.monthlyRent / totalShares) * shares;

        setUserShares(shares);
        setPercentageOwned((shares / totalShares) * 100);
        setShareValue(shares * propertyData.sharePrice);
        setMyRent(calculatedRent);

        // Set property data
        setProperty({
          id: propertyData._id,
          name: propertyData.name,
          price: propertyData.currentPrice,
          priceDate: new Date(propertyData.updatedAt),
          sharePrice: propertyData.sharePrice,
          numberOfShares: propertyData.numberOfShares,
          availableShares: propertyData.availableShares,
          area: propertyData.area,
          floors: propertyData.floors,
          rooms: propertyData.rooms,
          location: propertyData.location,
          previousPrices: [
            ...(propertyData.previousPrices || []), 
            { 
              price: propertyData.currentPrice, 
              date: new Date(propertyData.updatedAt)
            }
          ],
          images: propertyData.images || [],
          monthlyRent: propertyData.monthlyRent
        });
        
        setSoldPercentage(
          ((propertyData.numberOfShares - propertyData.availableShares) / 
          propertyData.numberOfShares) * 100
        );
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <ScrollView className="bg-[#f5f6f9] flex-1 pt-5">
      <Header />

      <View className="px-5 pt-5">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {property.name}
        </Text>
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text className="text-gray-600 ml-1">{property.location}</Text>
        </View>

        {/* Price Chart */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <SectionHeader title={I18n.t('priceHistory')} />
          <LineChart
            data={{
              labels: property.previousPrices
                .map(pr => 
                  new Date(pr.date).toLocaleDateString('en-GB', {
                    month: '2-digit',
                    year: 'numeric'
                  })
                ),
              datasets: [{
                data: property.previousPrices.map(pr => pr.price * percentageOwned / 100),
              }],
            }}
            width={Dimensions.get('window').width - 60}
            height={220}
            yAxisLabel=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(36, 36, 36, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffffff',
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        {/* Property Details */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <SectionHeader title={I18n.t('shareDetails')} />
          
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{I18n.t('price')}:</Text>
            <Text className="font-semibold">
              {I18n.t('currency.code')} {property.price.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{I18n.t('availableShares')}:</Text>
            <Text className="font-semibold">
              {property.availableShares.toLocaleString()}
            </Text>
          </View>

          {/* User-specific shares data */}
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{I18n.t('yourShares')}:</Text>
            <Text className="font-semibold">
              {userShares.toLocaleString()}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{I18n.t('percentageOwned')}:</Text>
            <Text className="font-semibold">
              {percentageOwned.toFixed(1)}%
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{I18n.t('shareValue')}:</Text>
            <Text className="font-semibold">
              {I18n.t('currency.code')} {shareValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600">{I18n.t('monthlyRent')}:</Text>
            <Text className="font-semibold text-[#53D258]">
              {I18n.t('currency.code')} {myRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          </View>
        </View>

        <View className="h-20" />
      </View>
    </ScrollView>
  );
}