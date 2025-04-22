import { View, Text, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';


interface PropertyCardProps {
    id: string;
    name: string;
    price: number;
    area: number;
    floors: number;
    rooms: number;
    imageUrl?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    id,
    name,
    price,
    area,
    floors,
    rooms,
    imageUrl,
}) => {
  return (
    <Link href={`/properties/${id}`} className='me-4'>
        <View className='bg-white rounded-2xl items p-4 m-0'>
          <View className='items-center'>
            <Image
              source={
                imageUrl ? { uri: imageUrl } : require('../assets/images/property.png')
              }
              className='h-40 w-40 rounded-lg'
            />
          </View>
          <View className='flex-row justify-between my-4'>
            <Text className='font-black text-sm me-2'>{name}</Text>
            <Text className='text-[#3EBBD1] text-sm'>EG {Math.floor(price)}</Text>
          </View>
          <View className='flex-row justify-between'>
            <View className='flex-row items-center'>
              <Entypo name='ruler' size={16} color='#2C8BB9' />
              <Text className='text-sm text-[#828282]'>{area} m²</Text>
            </View>
            <View className='flex-row items-center'>
              <MaterialCommunityIcons name="office-building" size={16} color="#2C8BB9" />
              <Text className='text-sm text-[#828282]'>{floors}</Text>
            </View>
            <View className='flex-row items-center'>
              <Entypo name='key' size={16} color='#2C8BB9' />
              <Text className='text-sm text-[#828282]'>{rooms}</Text>
            </View>
          </View>
        </View>
      </Link>
  );
};

export default PropertyCard;
