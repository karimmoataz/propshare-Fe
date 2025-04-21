import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, Pressable, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';


const HomeScreen = () => {
  return (
    <View className="flex-1 bg-[#f5f6f9] pb-24">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
        {/* background image with Logo */}
        <ImageBackground
          source={require("../../../assets/images/home1.jpg")}
          className='contain w-full h-80 justify-center items-center'
          
        >
          <Image
            source={require("../../../assets/images/logo1.png")}
            className="w-60 h-16 mb-6 mx-auto"
          />
        

          {/*Buttons */}
          <Link href="/properties" asChild>
            <TouchableOpacity className="bg-[#2C8BB9] focus:bg-[#005DA0] w-[150px] h-[50px] rounded-[16px] px-4 py-2 flex-row items-center justify-center mx-1">
              <View className="flex-row items-center">
                <Ionicons name="home" size={16} color="white" className='me-1' />
                <Text className="text-white font-bold text-lg">Properties</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </ImageBackground>


        {/* Section 1 Title */}
        <View  className='rounded-t-[30px] bg-white -mt-10 px-4'>
          <Text className="text-gray-500 text-lg my-6">Find your property in your preferred city</Text>
          {/* City Cards */}
          <View className="flex-row justify-around items-center mb-6 w-full">
  {[
    { name: 'Cairo', image: require("../../../assets/images/cairo.jpg") },
    { name: 'Alexandria', image: require("../../../assets/images/alexandria.jpg") },
    { name: 'Alamain', image: require("../../../assets/images/alamain.jpg") },
  ].map((city, idx) => (
    <Link href={`/properties?search=${city.name}`} key={idx} className=''>
      <ImageBackground source={city.image} className="shadow-sm w-32 h-32 justify-end rounded-xl overflow-hidden">
        <Text className="text-white text-center font-bold py-1">{city.name}</Text>
      </ImageBackground>
    </Link>
  ))}
</View>
        </View>

        

        {/* Top Localities Title */}
        <View className=''>
        <Text className="text-black font-bold text-lg my-3 px-4">Top Localities To Buy/Rent Properties</Text>
        {/* Locality Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-6">
          <View className="bg-white p-4 rounded-xl shadow-sm ms-4"style={{width:192, height:251}}>
            <Image source={require("../../../assets/images/palmhills.jpg")} className="w-full h-24 rounded-lg" style={{width:160, height:160}} />   
            <Text className="font-bold mt-2">Palm Hills</Text>
            <Text className="text-gray-500">Alexandria</Text>
          </View>
          <View className="bg-white p-4 rounded-xl shadow-sm ms-4"style={{width:192, height:251}}>
            <Image source={require("../../../assets/images/silversands.jpg")} className="w-full h-24 rounded-lg" style={{width:160, height:160}}/>
            <Text className="font-bold mt-2">Silver Sands</Text>
            <Text className="text-gray-500">Ras ElHekma</Text>
          </View>
        </ScrollView>
        </View>
        

      </ScrollView>
    </View>
  );
};

export default HomeScreen;