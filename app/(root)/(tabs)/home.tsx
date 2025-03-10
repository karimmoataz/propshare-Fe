import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { Link } from "expo-router";
import React from 'react'


const Home = () => {
  return (
    <SafeAreaView className='bg-[#f7f7fa] h-full flex flex-col items-center justify-center'>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Text className="font-bold text-lg my-10">Welcome to Propshare</Text>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/properties/1">Property</Link>
    </SafeAreaView>
  )
}

export default Home