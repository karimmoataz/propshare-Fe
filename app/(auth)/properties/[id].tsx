import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, FlatList, Dimensions, TextInput } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import api from '../../api/axios'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '@/components/Header'
import { LineChart } from 'react-native-chart-kit';
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';
import ProgressBar from '@/components/ProgressBar'

const { width } = Dimensions.get('window');

type PreviousPrice = {
  price: number;
  date: Date;
};

type PropertyImage = {
  url: string;
  publicId: string;
  _id: string;
};

interface PropertyDetails {
  id: string
  name: string
  price: number
  priceDate: Date
  sharePrice: number
  numberOfShares: number
  availableShares: number
  area: number
  floors: number
  rooms: number
  location: string
  images: PropertyImage[]
  previousPrices: PreviousPrice[];
}
type User = {
  _id: string;
  balance?: number;
};

const Property = () => {
  const { id } = useLocalSearchParams()
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const carouselRef = useRef<FlatList>(null)
  const { isRTL } = useLanguage();
  const [sharesToBuy, setSharesToBuy] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [sold, setSold] = useState(0)

  const fetchProperty = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      

      const response = await api.get(`/properties/${id}`, {
        headers: { Authorization: token }
      })

      if (response.status === 200) {
        
        const combinedPreviousPrices = [
          ...(response.data.previousPrices || []), 
          { 
            price: response.data.currentPrice, 
            date: response.data.currentPriceDate
          }
        ];

        setProperty({
          id: response.data._id,
          name: response.data.name,
          price: response.data.currentPrice,
          priceDate: response.data.currentPriceDate,
          sharePrice: response.data.sharePrice,
          numberOfShares: response.data.numberOfShares,
          availableShares: response.data.availableShares,
          area: response.data.area,
          floors: response.data.floors,
          rooms: response.data.rooms,
          location: response.data.location,
          previousPrices: combinedPreviousPrices,
          images: response.data.images || [],
        })
        
        setSold((response.data.numberOfShares - response.data.availableShares) / response.data.numberOfShares * 100)
        setError(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await api.get("/get-user", {
        headers: { Authorization: token },
      });
      if (response.status === 200) {
        setUserData(response.data.user);
      } else {
        await AsyncStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      await AsyncStorage.removeItem("token");
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

  const handleBuyShares = async () => {
    if (!userData || !property) return
    
    const shares = parseInt(sharesToBuy)
    if (isNaN(shares)) {
      setErrorMessage(I18n.t('invalidShareNumber'))
      return
    }

    if (shares > property.availableShares) {
      setErrorMessage(I18n.t('notEnoughShares'))
      return
    }

    const totalCost = shares * property.sharePrice
    if (userData.balance === undefined || userData.balance < totalCost) {
      setErrorMessage(I18n.t('insufficientBalance'))
      return
    }

    setIsProcessing(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) throw new Error('Authentication required')

      const response = await api.post(`/shares/buy/${property.id}`, {
        userId: userData._id,
        sharesToBuy: shares
      }, {
        headers: { Authorization: token }
      })

      if (response.status === 200) {
        setSuccessMessage(I18n.t('purchaseSuccess'))
        await fetchUserData()
        await fetchProperty()
        setSharesToBuy('')
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : I18n.t('purchaseError'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageSelect = (index: number) => {
    setActiveImageIndex(index);
    carouselRef.current?.scrollToIndex({ index, animated: true });
  };

  const truncateNumber = (num: number, decimalPlaces: number): number => {
    const factor: number = Math.pow(10, decimalPlaces);
    return Math.floor(num * factor) / factor;
  };

  // Function to render dots for pagination
  const renderPagination = () => {
    if (!property || !property.images || property.images.length <= 1) return null;
    
    return (
      <View className="flex-row justify-center mt-2">
        {property.images.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              activeImageIndex === index ? 'bg-[#005DA0]' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f6f9]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f6f9] p-4">
        <Text className="text-red-500 text-lg mb-4">{error}</Text>
        <Entypo
          name="cycle"
          size={24}
          color="#005DA0"
          onPress={fetchProperty}
          className="p-2 bg-gray-200 rounded-full"
        />
      </View>
    )
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f6f9]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#f5f6f9] pt-4" 
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <Header isRTL={isRTL}/>
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <View>
              <FlatList
                ref={carouselRef}
                data={property.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / (width - 32)
                  );
                  setActiveImageIndex(newIndex);
                }}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: width - 32, height: 240 }}
                    resizeMode="cover"
                  />
                )}
                className="rounded-t-xl"
              />
              {renderPagination()}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="px-2 py-3 bg-white"
                contentContainerStyle={{
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                }}
              >
                {property.images.map((img, index) => (
                  <TouchableOpacity
                    key={img._id}
                    onPress={() => handleImageSelect(index)}
                    className={`mx-2 ${
                      activeImageIndex === (isRTL ? property.images.length - 1 - index : index) ? 'border-2 border-[#005DA0]' : 'border border-gray-200'
                    } rounded-md overflow-hidden`}
                    style={{
                      transform: [{ scaleX: isRTL ? -1 : 1 }]
                    }}
                  >
                    <Image
                      source={{ uri: img.url }}
                      style={{ 
                        width: 70, 
                        height: 70,
                        transform: [{ scaleX: isRTL ? -1 : 1 }] // Fix image mirroring
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View className="w-full h-64 bg-gray-200 rounded-t-xl flex items-center justify-center">
              <MaterialCommunityIcons name="image-off" size={40} color="#6b7280" />
            </View>
          )}
        </View>

        <View className="bg-white p-4 rounded-xl mb-4">
          <View className="mb-2">
            <Text className='mb-1'>{truncateNumber(sold, 1)}% {I18n.t('ofThisPropertyIsSoldOut')}</Text>
            <ProgressBar percent={sold}/>
          </View>
          <Text className="text-2xl font-bold text-[#242424] mb-2">
            {property.name}
          </Text>
          <Text className="text-[#005DA0] text-xl font-bold mb-4">
            EGP {property.price.toLocaleString()}
          </Text>

          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Entypo name="ruler" size={24} color="#2C8BB9" />
              <Text className="text-gray-600 mt-1">{property.area}m²</Text>
            </View>
            <View className="items-center">
              <MaterialCommunityIcons name="office-building" size={24} color="#2C8BB9" />
              <Text className="text-gray-600 mt-1">{property.floors} {I18n.t('floors')}</Text>
            </View>
            <View className="items-center">
              <Entypo name="key" size={24} color="#2C8BB9" />
              <Text className="text-gray-600 mt-1">{property.rooms} {I18n.t('rooms')}</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Entypo name="location-pin" size={24} color="#005DA0" />
            <Text className="text-gray-600 me-2">{property.location}</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-lg font-bold text-[#242424] mb-3">{I18n.t('priceHistory')}</Text>
          {property.previousPrices && property.previousPrices.length > 0 ? (
            <View>
              <LineChart
                data={{
                  labels: property.previousPrices
                    .map(pr => 
                      typeof pr === 'object' && pr.date 
                        ? new Date(pr.date).toLocaleDateString('en-GB', {
                          month: '2-digit',
                          year: 'numeric'
                        })
                        : ''
                    ),
                  datasets: [
                    {
                      data: property.previousPrices.map(pr => 
                        typeof pr === 'object' ? pr.price : pr
                      ),
                    },
                  ],
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
                  style: {
                    borderRadius: 16,
                  },
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
          ) : (
            <Text className="text-gray-400 py-2">{I18n.t('noPreviousPriceHistory')}</Text>
          )}
        </View>

        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-lg font-bold text-[#242424] mb-3">{I18n.t('shareDetails')}</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">{I18n.t('sharePrice')}</Text>
            <Text className="text-[#005DA0] font-mono">{Math.floor(property.sharePrice).toLocaleString("en-US")}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">{I18n.t('totalShares')}</Text>
            <Text className="text-[#005DA0] font-mono">{property.numberOfShares}</Text>
          </View>
        </View>

        <View className="bg-white p-4 rounded-xl mb-10">
          <View>
            <Text className="text-lg font-bold text-[#242424] mb-3">{I18n.t('buyShares')}</Text>
            <Text className="text-[#242424] mb-3">{I18n.t('availableShares')}: {property.availableShares}</Text>
          </View>
        
        {userData ? (
          <>
            <TextInput
              className="border border-gray-300 p-3 rounded-lg mb-4"
              placeholder={I18n.t('sharesToBuy')}
              keyboardType="numeric"
              value={sharesToBuy}
              onChangeText={setSharesToBuy}
              editable={!isProcessing}
            />

            {errorMessage ? (
              <Text className="text-red-500 mb-2">{errorMessage}</Text>
            ) : null}

            {successMessage ? (
              <Text className="text-green-500 mb-2">{successMessage}</Text>
            ) : null}

            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-600">
                {I18n.t('totalCost')}: 
              </Text>
              <Text className="text-[#005DA0] font-bold">
                EGP {(parseInt(sharesToBuy) * property.sharePrice || 0).toLocaleString()}
              </Text>
            </View>

            <View className="flex-row justify-between mb-6">
              <Text className="text-gray-600">
                {I18n.t('yourBalance')}: 
              </Text>
              <Text className="text-[#005DA0] font-bold">
                EGP {userData.balance?.toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-[#005DA0] p-4 rounded-lg items-center"
              onPress={handleBuyShares}
              disabled={isProcessing || !sharesToBuy}
            >
              <Text className="text-white font-bold">
                {isProcessing ? I18n.t('processing') : I18n.t('confirmPurchase')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text className="text-gray-500">{I18n.t('loginToBuy')}</Text>
        )}
      </View>

      </ScrollView>
    </View>
  )
}

export default Property