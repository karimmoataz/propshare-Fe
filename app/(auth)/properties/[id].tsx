import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import api from '../../api/axios'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Header from '@/components/Header'
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

type PreviousPrice = {
  price: number;
  date: Date;
};

interface PropertyDetails {
  id: string
  name: string
  price: number
  priceDate: Date
  sharePrice: number
  availableShares: number
  area: number
  floors: number
  rooms: number
  location: string
  image?: string
  previousPrices: PreviousPrice[];
}

const Property = () => {
  const { id } = useLocalSearchParams()
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperty = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) throw new Error('Authentication required')

      const response = await api.get(`/properties/${id}`, {
        headers: { Authorization: token }
      })

      if (response.status === 200) {
        setProperty({
          id: response.data._id,
          name: response.data.name,
          price: response.data.currentPrice,
          priceDate: response.data.currentPriceDate,
          sharePrice: response.data.sharePrice,
          availableShares: response.data.availableShares,
          area: response.data.area,
          floors: response.data.floors,
          rooms: response.data.rooms,
          location: response.data.location,
          previousPrices: response.data.previousPrices, 
          image:`https://admin.propshare.site/api/properties/image/${response.data._id}`,
        })
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
        <Text className="text-gray-500">Property not found</Text>
      </View>
    )
  }

  return (
    <View className='flex-1 bg-[#f5f6f9] pt-4 '>
      <Header/>
      <ScrollView className="flex-1 p-4">
        {/* Main Image */}
        <View className="bg-white rounded-xl shadow-sm mb-4">
          {property.image ? (
            <Image
              source={{ uri: property.image }}
              className="w-full h-64 rounded-t-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-64 bg-gray-200 rounded-t-xl flex items-center justify-center">
              <MaterialCommunityIcons name="image-off" size={40} color="#6b7280" />
            </View>
          )}
        </View>

        {/* Basic Info Section */}
        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-2xl font-bold text-[#242424] mb-2">
            {property.name}
          </Text>
          <Text className="text-[#005DA0] text-xl font-bold mb-4">
            EGP {property.price.toLocaleString()}
          </Text>

          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Entypo name='ruler' size={24} color='#2C8BB9' />
              <Text className="text-gray-600 mt-1">{property.area}m²</Text>
            </View>
            <View className="items-center">
              <MaterialCommunityIcons name="office-building" size={24} color="#2C8BB9" />
              <Text className="text-gray-600 mt-1">{property.floors} Floors</Text>
            </View>
            <View className="items-center">
              <Entypo name='key' size={24} color='#2C8BB9' />
              <Text className="text-gray-600 mt-1">{property.rooms} Rooms</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Entypo name="location-pin" size={24} color="#005DA0" />
            <Text className="text-gray-600 ml-2">{property.location}</Text>
          </View>
        </View>

        {/* Price History Section */}
        <View className="bg-white p-4 rounded-xl mb-4">
          <Text className="text-lg font-bold text-[#242424] mb-3">Price History</Text>

          {/* Chart Section */}
          {property.previousPrices && property.previousPrices.length > 0 ? (
            <>
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
                width={Dimensions.get('window').width - 32} // Subtract padding
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
            </>
          ) : (
            <Text className="text-gray-400 py-2">No previous price history</Text>
          )}
        </View>

        {/* Share Info Section */}
        <View className="bg-white p-4 rounded-xl mb-10">
          <Text className="text-lg font-bold text-[#242424] mb-3">Share Details</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Share Price</Text>
            <Text className="text-[#005DA0] font-mono">{Math.floor(property.sharePrice).toLocaleString("en-US")}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Total Shares</Text>
            <Text className="text-[#005DA0] font-mono">{property.availableShares}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Property