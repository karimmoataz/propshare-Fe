import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'expo-router';

    

const Congrats = () => {
    const router = useRouter();
    const goHome = async () => {
        router.push("/home");
    };
  return (
    <View className='h-full w-full justify-center items-center bg-white'>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <LinearGradient
            colors={["rgba(189, 231, 249, 0.8)", "rgba(189, 231, 249, 0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 0.7 }}
            className="absolute bottom-0 w-full h-full"
        />
        <View>
            <View className='h-4 w-4 rounded-full bg-[#85bcdb]'/>
            <View className='h-64 w-64 rounded-full bg-[#2C8BB9] items-center justify-center'>
                <AntDesign name="check" size={180} color="#FFF" />
            </View>
            <View className='h-3 w-3 rounded-full bg-[#85bcdb] absolute top-64 left-0'/>
            <View className='h-3 w-3 rounded-full bg-[#85bcdb] absolute top-72 right-0'/>
        </View>
        <View className='py-10 items-center'>
            <Text className='text-6xl text-center text-[#005DA0] font-extrabold py-5'>Congrats!</Text>
            <Text className='text-xl text-center text-[#5d96c5] py-5'>Account Registed {'\n'} Successfully</Text>
            <CustomButton text='Great!' className={'rounded-full w-40'} textClassName='text-2xl' onPress={goHome} />
        </View>
    </View>
  )
}

export default Congrats