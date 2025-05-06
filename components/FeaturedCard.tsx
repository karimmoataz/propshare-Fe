import { View, Text, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface FeaturedCardProps {
    id: string;
    name: string;
    price: number;
    area: number;
    floors: number;
    rooms: number;
    location: string;
    imageUrl?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
    id,
    name,
    price,
    area,
    floors,
    rooms,
    location,
    imageUrl,
}) => {
  return (
    
    <View className='flex-row mx-5 bg-white rounded-xl shadow-sm p-4'>
        <Link href={`/properties/${id}`} className='justify-center items-center'>
            <Image
            source={imageUrl ? { uri: imageUrl } : require('../assets/images/property.png')}
            className='h-20 w-40 rounded-2xl'
            />
        </Link>
        <View className='mx-4 flex-1'>  
            <View>
                <View className='flex-row justify-between'>
                    <Text className='font-black text-sm'>{name}</Text>
                    <Text className='text-[#3EBBD1] text-sm'>EGP {Math.floor(price).toLocaleString("en-US")}</Text>
                </View>
                <View className='flex-row items-center my-1'>
                    <Entypo name="location-pin" size={16} color="#828282" />
                    <Text className='text-[#828282] text-xs'>{location}</Text>
                </View>
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
        </View>
  );
};

export default FeaturedCard;
