import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Header from '@/components/Header';
import { Link } from 'expo-router';
import SectionHeader from '@/components/ui/SectionHeader';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PropertyCard from '@/components/PropertyCard';
import FeaturedCard from '@/components/FeaturedCard';

const properties = [
  {
    id: '1',
    type: 'Apartment',
    price: 45000,
    area: 120,
    floors: 2,
    rooms: 3,
    imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/579141574.jpg?k=d21c7c290d5a91c87239819ca6ad89790b26f85260e888ca1cd236ff71648f79&o=&hp=1',
  },
  {
    id: '2',
    type: 'Store',
    price: 100000,
    area: 300,
    floors: 3,
    rooms: 5,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mon_Ami_Boulangerie_%288119944759%29.jpg/1280px-Mon_Ami_Boulangerie_%288119944759%29.jpg',
  },
  {
    id: '3',
    type: 'Studio',
    price: 75000,
    area: 45,
    floors: 1,
    rooms: 1,
  },
];

const featuredProperties = [
  {
    id: '1',
    name: 'Dub Apartment',
    price: 75000,
    area: 200,
    floors: 2,
    rooms: 3,
    location: 'District 5, Cairo',
    imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/579141574.jpg?k=d21c7c290d5a91c87239819ca6ad89790b26f85260e888ca1cd236ff71648f79&o=&hp=1',
  },
  {
    id: '2',
    name: 'Luxury Villa',
    price: 250000,
    area: 500,
    floors: 3,
    rooms: 6,
    location: 'New Cairo, Egypt',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mon_Ami_Boulangerie_%288119944759%29.jpg/1280px-Mon_Ami_Boulangerie_%288119944759%29.jpg',
  },
  {
    id: '3',
    name: 'Modern Studio',
    price: 45000,
    area: 80,
    floors: 1,
    rooms: 1,
    location: 'Zamalek, Cairo',
    imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/579141574.jpg?k=d21c7c290d5a91c87239819ca6ad89790b26f85260e888ca1cd236ff71648f79&o=&hp=1',
  },
  {
    id: '4',
    name: 'Luxury Villa',
    price: 250000,
    area: 500,
    floors: 3,
    rooms: 6,
    location: 'New Cairo, Egypt',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mon_Ami_Boulangerie_%288119944759%29.jpg/1280px-Mon_Ami_Boulangerie_%288119944759%29.jpg',
  },
  {
    id: '5',
    name: 'Modern Studio',
    price: 45000,
    area: 80,
    floors: 1,
    rooms: 1,
    location: 'Zamalek, Cairo',
  },
];

const Explore = () => {
  return (
    <View className='bg-[#f5f6f9] h-full pb-20 pt-5'>
      <Header/>
      <View>
        <SectionHeader title="All Properties" link="/properties" className='mx-5' />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="my-2"
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {properties.map((property) => (
            <View key={property.id} >
              <PropertyCard
              id={property.id}
              type={property.type}
              price={property.price}
              area={property.area}
              floors={property.floors}
              rooms={property.rooms}
              imageUrl={property.imageUrl}
            />
            </View>
          ))}
        </ScrollView>
      </View>
      <View className="flex-1">
        <SectionHeader title="Featured Properties" link="/properties" className='mx-5' />
        <ScrollView>
          {featuredProperties.map((property) => (
            <View key={property.id} className="mb-4">
              <FeaturedCard
                id={property.id}
                name={property.name}
                price={property.price}
                area={property.area}
                floors={property.floors}
                rooms={property.rooms}
                location={property.location}
                imageUrl={property.imageUrl}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default Explore