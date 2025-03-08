import { View, Image, Pressable } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { clsx } from "clsx";
import Ionicons from '@expo/vector-icons/Ionicons';


const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: 'white',
                borderTopWidth: 0,
                position: 'absolute',
                height: 70,
                elevation: 0,
                shadowOpacity: 0,
            },
            tabBarItemStyle: {
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 15,
            },
            tabBarButton: (props) => (
                <Pressable
                    {...props}
                    android_ripple={{ borderless: true, color: 'transparent' }}
                />
            )
            
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View className={clsx("h-10 w-16 justify-center items-center rounded-full", focused ? "bg-[#005DA0]" : "bg-white")}>
                            <Ionicons name="home-outline" size={24} color={focused ? "#fff" : "#005DA0"} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Wallet',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View className={clsx("h-10 w-16 justify-center items-center rounded-full", focused ? "bg-[#005DA0]" : "bg-white")}>
                            <Ionicons name="wallet-outline" size={24} color={focused ? "#fff" : "#005DA0"} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 60,
                            width: 80,
                            backgroundColor: "#f7f7fa",
                            borderRadius: '50%',
                            justifyContent: "center",
                            paddingTop: 10,
                            alignItems: "center",
                            position: "absolute",
                            top: -50,

                        }}>
                            <View className='h-32 w-32 bg-[#f7f7fa] absolute bottom-1 rounded-full'></View>
                            <Ionicons name="person" size={30} color="#005DA0" />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View className={clsx("h-10 w-16 justify-center items-center rounded-full", focused ? "bg-[#005DA0]" : "bg-white")}>
                            <Ionicons name="compass-outline" size={24} color={focused ? "#fff" : "#005DA0"} />
                        </View>
                    )
                }}
            />
            <Tabs.Screen
                name="insights"
                options={{
                    title: 'Insights',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View className={clsx("h-10 w-16 justify-center items-center rounded-full", focused ? "bg-[#005DA0]" : "bg-white")}>
                            <Ionicons name="bar-chart-outline" size={24} color={focused ? "#fff" : "#005DA0"} />
                        </View>
                    )
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
