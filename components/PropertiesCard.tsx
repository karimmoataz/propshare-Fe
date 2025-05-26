import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import ProgressBar from './ProgressBar';

interface PropertiesCardProps {
    id: string;
    name: string;
    price: number;
    area: number;
    floors: number;
    rooms: number;
    location: string;
    developer?: string;
    imageUrl?: string;
    fundingPercentage?: number;
    estimatedReturn?: number;
    createdAt?: string;
    isFullyFunded?: boolean;
    developerImage?: any;
}

const PropertiesCard: React.FC<PropertiesCardProps> = ({
    id,
    name,
    price,
    area,
    floors,
    rooms,
    location,
    developer,
    imageUrl,
    fundingPercentage = 0,
    createdAt,
}) => {

    let developerImage: string | null = null;

    const truncateNumber = (num: number, decimalPlaces: number): number => {
    const factor: number = Math.pow(10, decimalPlaces);
    return Math.floor(num * factor) / factor;
  };

   const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('');
    };

    switch (developer) {
        case "talaat moustafa":
            developerImage = require('../assets/images/TMG.png');
            break;
        case "palm hills":
            developerImage = require('../assets/images/palmhills.jpg');
            break;
        case "orascom":
            developerImage = require('../assets/images/orascom.png');
            break;
        case "silver sands":
            developerImage = require('../assets/images/silversands.jpg');
            break;
        default:
            developerImage = null;
            break;
    }

    return (
        <View className='mx-5 mb-6 bg-white rounded-2xl shadow-lg overflow-hidden'>
            {/* Header with Logo and Status */}
            <View className='flex-row justify-between items-center p-4 pb-2'>
                <View className='flex-row items-center'>
                    <View className='w-12 h-12 bg-gray-100 border-[1px] border-gray-200 rounded-full items-center justify-center mr-3'>
                        <Image
                            source={developerImage || require('../assets/images/property.png')}
                            className='w-full h-full rounded-full'
                            resizeMode="cover"
                        />
                    </View>
                    <View>
                        <Text className='text-lg font-bold text-gray-800'>{developer}</Text>
                        <Text className='text-sm text-gray-500'>Listed: {createdAt}</Text>
                    </View>
                </View>
                {fundingPercentage == 100 && (
                    <View className='bg-green-100 px-3 py-1 rounded-full'>
                        <Text className='text-green-600 font-semibold text-sm'>Funded</Text>
                    </View>
                )}
            </View>

            {/* Property Image */}
            <Link href={`/properties/${id}`} asChild>
                <TouchableOpacity>
                    <Image
                        source={imageUrl ? { uri: imageUrl } : require('../assets/images/property.png')}
                        className='h-48 w-full'
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </Link>

            {/* Funding Progress and Return */}
            <View className='p-4'>
                <View className='flex-row justify-between items-center mb-4'>
                    <View className='flex-row items-center'>
                        <MaterialCommunityIcons name="cash" size={20} color="#2C8BB9" />
                        <Text className='text-lg font-bold text-gray-800 ml-2'>{truncateNumber(fundingPercentage, 1)}% Funded!</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <ProgressBar percent={fundingPercentage}/>

                {/* Property Title */}
                <Text className='text-xl font-bold text-gray-900 my-2'>{name}</Text>

                {/* Property Details */}
                <View className='border-t border-gray-200 pt-4'>
                    <View className='flex-row items-center mb-2'>
                        <Entypo name="location-pin" size={16} color="#828282" />
                        <Text className='text-[#828282] text-sm ml-2' numberOfLines={1} ellipsizeMode="tail">
                            {location}
                        </Text>
                    </View>
                    
                    <View className='flex-row justify-between items-center'>
                        <Text className='text-2xl font-bold text-[#2C8BB9]'>
                            EGP {Math.floor(price).toLocaleString("en-US")}
                        </Text>
                        
                        <View className='flex-row space-x-4'>
                            <View className='flex-row items-center'>
                                <Entypo name='ruler' size={14} color='#2C8BB9' />
                                <Text className='text-sm text-[#828282] ml-1'>{area} m²</Text>
                            </View>
                            <View className='flex-row items-center'>
                                <MaterialCommunityIcons name="office-building" size={14} color="#2C8BB9" />
                                <Text className='text-sm text-[#828282] ml-1'>{floors}</Text>
                            </View>
                            <View className='flex-row items-center'>
                                <Entypo name='key' size={14} color='#2C8BB9' />
                                <Text className='text-sm text-[#828282] ml-1'>{rooms}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PropertiesCard;