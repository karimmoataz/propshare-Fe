import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const Icon = ({focused, icon}:{focused:boolean; icon:any;}) => {
    return (
        <View>
            {icon ? <Image source={icon} tintColor={focused? '#fff' : '#000'}/> : <Text>Icon</Text>}
        </View>
    );
}

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: 'white',position: 'absolute', borderTopColor: 'black', borderTopWidth: 1,minWidth: 70},
        }}>
        <Tabs.Screen 
            name="home"
            options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <Icon icon={null} focused={focused} />
                )
            }}
        />
        <Tabs.Screen 
            name="wallet"
            options={{
                title: 'Wallet',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <Icon icon={null} focused={focused} />
                )
            }}
        />
        <Tabs.Screen 
            name="profile"
            options={{
                title: 'profile',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <Icon icon={null} focused={focused} />
                )
            }}
        />
        <Tabs.Screen 
            name="explore"
            options={{
                title: 'Explore',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <Icon icon={null} focused={focused} />
                )
            }}
        />
        <Tabs.Screen 
            name="insights"
            options={{
                title: 'Insights',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <Icon icon={null} focused={focused} />
                )
            }}
        />
    </Tabs>
  )
}

export default TabsLayout