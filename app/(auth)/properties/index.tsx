import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, Modal, StatusBar, Pressable } from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import Header from '@/components/Header';
import FeaturedCard from '@/components/FeaturedCard';
import api from '../../api/axios';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

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

const Properties = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const initializedRef = useRef(false);
  
  // Filter modal state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 100000]); // New temporary state for the slider
  const [priceRangeEnabled, setPriceRangeEnabled] = useState(false);

  const fetchProperties = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

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
        setFilteredProperties(transformed);
        
        // Set initial price range based on data
        if (transformed.length > 0) {
          const prices = transformed.map((p: Property) => p.sharePrice);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setMinPrice(min);
          setMaxPrice(max);
          setPriceRange([min, max]);
          setTempPriceRange([min, max]); // Initialize temp range too
        }
        
        setError(null);
      } else {
        setError("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(`An error occurred while fetching properties: ${errorMessage}`);
      
      if (error instanceof Error && (error as any).response?.status === 401) {
        await AsyncStorage.removeItem("token");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  // One-time initialization from URL parameters
  useEffect(() => {
    if (!initializedRef.current && searchParams && searchParams.search) {
      setSearchQuery(searchParams.search as string);
      initializedRef.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  // Apply all filters - fixed to prevent infinite loops
  useEffect(() => {
    let result = [...properties];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(property => 
        property.name.toLowerCase().includes(query) || 
        property.id.toLowerCase().includes(query) || 
        property.location.toLowerCase().includes(query)
      );
    }
    
    // Apply price range filter
    if (priceRangeEnabled) {
      result = result.filter(property => 
        property.sharePrice >= priceRange[0] && 
        property.sharePrice <= priceRange[1]
      );
    }
    
    // Apply sort
    if (sortOrder) {
      result = [...result].sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.sharePrice - b.sharePrice 
          : b.sharePrice - a.sharePrice;
      });
    }
    
    setFilteredProperties(result);
  }, [searchQuery, properties, sortOrder, priceRange, priceRangeEnabled]);

  // Define the setSortOption function for the modal
  const setSortOption = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setFilterModalVisible(false);
  };
  
  const applyFilters = () => {
    // Only update the actual price range when applying filters
    setPriceRange([...tempPriceRange]); // Create a new array to ensure state update
    setPriceRangeEnabled(true);
    setFilterModalVisible(false);
  };
  
  const resetFilters = () => {
    setSortOrder(null);
    setPriceRangeEnabled(false);
    // Reset both ranges
    setPriceRange([minPrice, maxPrice]);
    setTempPriceRange([minPrice, maxPrice]);
    setFilterModalVisible(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f5f6f9]">
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  return (
    <View className="bg-[#f5f6f9] flex-1 pt-5">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Header />
      
      <View className="px-5 my-4">
        <Text className="text-2xl font-bold mb-4">Properties</Text>
        
        {/* Search and Filter Bar */}
        <View className="flex-row mb-4">
          <View className="flex-row items-center bg-white rounded-lg px-3 flex-1 mr-2 shadow-sm">
            <Ionicons name="search" size={20} color="#005DA0" />
            <TextInput
              className="flex-1 p-3 placeholder:text-gray-500"
              placeholder="Search by name, ID or location"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <TouchableOpacity 
            className="bg-[#005DA0] rounded-lg justify-center items-center px-3"
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Filter indicators */}
        {(sortOrder || priceRangeEnabled) && (
          <View className="flex-row flex-wrap mb-2">
            {sortOrder && (
              <View className="bg-[#E1ECF4] rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
                <Text className="text-[#005DA0] mr-1">
                  Price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
                </Text>
                <TouchableOpacity onPress={() => setSortOrder(null)}>
                  <Ionicons name="close-circle" size={16} color="#005DA0" />
                </TouchableOpacity>
              </View>
            )}
            
            {priceRangeEnabled && (
              <View className="bg-[#E1ECF4] rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
                <Text className="text-[#005DA0] mr-1">
                  Price: ${Math.round(priceRange[0])} - ${Math.round(priceRange[1])}
                </Text>
                <TouchableOpacity onPress={() => setPriceRangeEnabled(false)}>
                  <Ionicons name="close-circle" size={16} color="#005DA0" />
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity onPress={resetFilters} className="bg-[#FFE4E1] rounded-full px-3 py-1 mb-2 flex-row items-center">
              <Text className="text-[#FF6347]">Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error ? (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-center">{error}</Text>
          <TouchableOpacity 
            className="mt-4 bg-[#005DA0] p-3 rounded-lg" 
            onPress={fetchProperties}
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
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
            <View className="flex-1 justify-center items-center py-10">
              <Text className="text-gray-500">No properties found</Text>
            </View>
          )}
        </ScrollView>
      )}
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable className="flex-1 justify-end bg-black/30 bg-opacity-50" onPress={() => setFilterModalVisible(false)}>
          <Pressable className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            {/* Sort Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">Sort by Price</Text>
              <View className="flex-row">
                <TouchableOpacity 
                  className={`flex-1 p-3 rounded-lg mr-2 ${sortOrder === 'asc' ? 'bg-[#005DA0]' : 'bg-gray-200'}`}
                  onPress={() => setSortOption('asc')}
                >
                  <Text className={`text-center ${sortOrder === 'asc' ? 'text-white' : 'text-gray-700'}`}>
                    Low to High
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  className={`flex-1 p-3 rounded-lg ${sortOrder === 'desc' ? 'bg-[#005DA0]' : 'bg-gray-200'}`}
                  onPress={() => setSortOption('desc')}
                >
                  <Text className={`text-center ${sortOrder === 'desc' ? 'text-white' : 'text-gray-700'}`}>
                    High to Low
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Price Range Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">Price Range</Text>
              <View className="items-center my-4">
                <MultiSlider
                  values={[tempPriceRange[0], tempPriceRange[1]]} // Use temporary range state
                  sliderLength={280}
                  min={minPrice}
                  max={maxPrice}
                  step={100}
                  allowOverlap={false}
                  snapped
                  minMarkerOverlapDistance={10}
                  onValuesChange={(values) => setTempPriceRange(values)} // Update temporary range only
                  selectedStyle={{
                    backgroundColor: '#005DA0',
                  }}
                  unselectedStyle={{
                    backgroundColor: '#D3D3D3',
                  }}
                  containerStyle={{
                    height: 40,
                  }}
                  markerStyle={{
                    backgroundColor: '#005DA0',
                    height: 20,
                    width: 20,
                  }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text>${Math.round(tempPriceRange[0])}</Text>
                <Text>${Math.round(tempPriceRange[1])}</Text>
              </View>
            </View>
            
            {/* Button row */}
            <View className="flex-row mt-4">
              <TouchableOpacity 
                className="flex-1 p-4 bg-gray-200 rounded-lg mr-2"
                onPress={resetFilters}
              >
                <Text className="text-center font-medium">Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 p-4 bg-[#005DA0] rounded-lg"
                onPress={applyFilters}
              >
                <Text className="text-center text-white font-medium">Apply</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Properties;