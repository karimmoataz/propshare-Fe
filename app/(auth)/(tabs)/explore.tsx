import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import Header from '@/components/Header';
import SectionHeader from '@/components/ui/SectionHeader';
import PropertyCard from '@/components/PropertyCard';
import FeaturedCard from '@/components/FeaturedCard';
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';
import api from '../../api/axios';

interface Property {
  id: string;
  name: string;
  sharePrice: number;
  area: number;
  floors: number;
  rooms: number;
  location: string;
  images?: Array<{ url: string }>;
  contentType?: string;
}

const Explore = () => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isRTL } = useLanguage();
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchProperties = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      // Use the correct endpoint path based on backend code
      const response = await api.get("/properties", {
        headers: { Authorization: token },
      });

      if (response.status === 200) {
        const transformed = response.data.map((prop: any) => ({
          id: prop._id,
          name: prop.name,
          sharePrice: prop.sharePrice,
          area: prop.area,
          floors: prop.floors,
          rooms: prop.rooms,
          location: prop.location,
          images: prop.images,
          contentType: prop.contentType
        }));

        setProperties(transformed);
        setFeaturedProperties(transformed.slice(0, 5)); // Take first 5 as featured
        setError(null);
      } else {
        setError("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(`An error occurred while fetching properties: ${errorMessage}`);
      
      // If the error is due to authentication, redirect to login
      if (error instanceof Error && (error as any).response?.status === 401) {
        await AsyncStorage.removeItem("token");
        router.push("/");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties();
  }, []);

  const handleContentSizeChange = () => {
      if (isRTL && scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f6f9]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  return (
    <View className="bg-[#f5f6f9] flex-1 pb-24 pt-5" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Header backBtn={false} style={{ direction: isRTL ? 'rtl' : 'ltr' }}/>
      
      {error ? (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-[#005DA0] p-3 rounded-lg" 
            onPress={onRefresh}
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View>
            <SectionHeader title={I18n.t('allProperties')} link="/properties" className="mx-5"/>
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false}
              onContentSizeChange={handleContentSizeChange}
              className="my-2 px-5"
            >
              {properties.length > 0 ? (
                properties.map((property) => (
                  <View key={property.id}>
                    <PropertyCard
                      id={property.id}
                      name={property.name}
                      price={property.sharePrice}
                      area={property.area}
                      floors={property.floors}
                      rooms={property.rooms}
                      imageUrl={property.images?.[0]?.url}
                    />
                  </View>
                ))
              ) : (
                <View className="flex-1 justify-center items-center p-5 w-full">
                  <Text className="text-gray-500">No properties available</Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View className="flex-1">
            <SectionHeader title={I18n.t('featuredProperties')} link="/properties" className="mx-5"/>
            <View className="flex-1">
              <ScrollView>
                {featuredProperties.length > 0 ? (
                  featuredProperties.map((property) => (
                    <View key={property.id} className="mb-4">
                      <FeaturedCard
                        id={property.id}
                        name={property.name}
                        price={property.sharePrice}
                        area={property.area}
                        floors={property.floors}
                        rooms={property.rooms}
                        location={property.location}
                        imageUrl={property.images?.[0]?.url}
                      />
                    </View>
                  ))
                ) : (
                  <View className="flex-1 justify-center items-center p-5">
                    <Text className="text-gray-500">No featured properties available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Explore;