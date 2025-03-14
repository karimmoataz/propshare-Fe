import { View, Pressable, Keyboard, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { clsx } from "clsx";
import Ionicons from '@expo/vector-icons/Ionicons';

const TabsLayout = () => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    borderTopWidth: 0,
                    position: 'absolute',
                    height: 70,
                    elevation: 0,
                    shadowOpacity: 0,
                    display: keyboardVisible ? "none" : "flex", // Hide the tab bar on keyboard open
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
            }}
        >
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
                    tabBarIcon: () => (
                        <View className="h-[60px] w-[80px] bg-[#f7f7fa] rounded-full justify-center items-center absolute -top-[50px] z-10 pt-2.5">
                            <View className="h-32 w-32 bg-[#f7f7fa] absolute bottom-1 rounded-full" />
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
