import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <Text className='text-center text-2xl font-bold mt-10'>Sign Up</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp