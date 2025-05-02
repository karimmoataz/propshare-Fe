import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Header from '@/components/Header'

const Insights = () => {
  return (
    <View className="bg-[#f7f7fa] h-full py-5 w-full flex-1">
      <Header />
        <ScrollView className="px-6 flex-1">
          <Text>Insights will be here</Text>
        </ScrollView>
      </View>
  )
}

export default Insights