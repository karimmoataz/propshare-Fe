import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const HomeScreen = () => {
  return (
    <ScrollView className="bg-white">
      {/* background image with Logo */}
      <View className="items-center">
        <ImageBackground
          source={require("../../../assets/images/home1.jpg")}
          className='contain w-full h-80 justify-center items-center'
          
        >
          <Image
            source={require("../../../assets/images/logo1.png")}
            style={{ width: 600, height: 250 }}
            resizeMode="contain"
          />
        </ImageBackground>
      </View>

      {/*Buttons */}
      <View className="flex-row justify-center space-x-2 mt-[-75px]">
  <Pressable className="bg-[#2C8BB9] hover:bg-[#005DA0] w-[107px] h-[36px] rounded-[16px] px-4 py-2 flex-row items-center justify-center mx-1">
    <Ionicons name="home" size={16} color="white" />
    <Text className="text-white font-bold text-sm ml-1">Buy</Text>
  </Pressable>

  <Pressable className="bg-[#2C8BB9] hover:bg-[#005DA0] w-[107px] h-[36px] rounded-[16px] px-4 py-2 flex-row items-center justify-center mx-1">
    <Ionicons name="key" size={16} color="white" />
    <Text className="text-white font-bold text-sm ml-1">Rent</Text>
  </Pressable>

  <Pressable className="bg-[#2C8BB9] hover:bg-[#005DA0] w-[107px] h-[36px] rounded-[16px] px-4 py-2 flex-row items-center justify-center mx-1">
    <Ionicons name="people" size={16} color="white" />
    <Text className="text-white font-bold text-sm ml-1">Agents</Text>
  </Pressable>
</View>

      {/* Section 1 Title */}
  <View style={{backgroundColor:"#fff", borderTopEndRadius:30, borderTopStartRadius:30, marginTop: 15}}>
  <Text className="text-gray-500 text-lg text-center my-6">
        Find your property in your preferred city
      </Text>
  </View>

      {/* City Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-6 mb-6">
  {[
    { name: 'Cairo', image: require("../../../assets/images/cairo.jpg") },
    { name: 'Alexandria', image: require("../../../assets/images/alexandria.jpg") },
    { name: 'Alamain', image: require("../../../assets/images/alamain.jpg") },
  ].map((city, idx) => (
    <TouchableOpacity key={idx} className="rounded-xl overflow-hidden shadow-sm mx-2">
      <Image source={city.image} className="w-40 h-40" resizeMode="cover" />
      <Text className="text-white text-center font-bold -mt-10 py-1">{city.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      {/* Top Localities Title */}
      <View style={{backgroundColor:"#6A738014"}}>
      <Text className="text-black font-bold text-lg text-center my-2">
        Top Localities To Buy/Rent Properties
      </Text>

      {/* Locality Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-4 py-6 mb-6">
        <View className="bg-white p-4 rounded-xl shadow-sm mx-2"style={{width:192, height:251}}>
          <Image source={require("../../../assets/images/palmhills.jpg")} className="w-full h-24 rounded-lg" style={{width:160, height:160}} />   
          <Text className="font-bold mt-2">Palm Hills</Text>
          <Text className="text-gray-500">Alexandria</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm mx-2"style={{width:192, height:251}}>
          <Image source={require("../../../assets/images/silversands.jpg")} className="w-full h-24 rounded-lg" style={{width:160, height:160}}/>
          <Text className="font-bold mt-2">Silver Sands</Text>
          <Text className="text-gray-500">Ras ElHekma</Text>
        </View>
      </ScrollView>
      </View>
      

    </ScrollView>
  );
};

export default HomeScreen;