import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Pressable } from 'react-native';

const notifications = [
  { id: 1, title: 'Palm Hills', message: 'Your order has been executed at 4,000 EGP/Share', time: '1 day ago' },
  { id: 2, title: 'Ora', message: 'Your order has been executed at 6,000 EGP/Share', time: '2 weeks ago' },
  { id: 3, title: 'PropShare', message: 'EGP 1,000 are on their way to your wallet from TMG rent', time: '3 weeks ago' },
  { id: 4, title: 'TMG', message: 'Your order has been executed at 5,500 EGP/Share', time: '3 weeks ago' },
  { id: 5, title: 'PropShare', message: 'EGP 15,000 added to your wallet from a top-up', time: '3 weeks ago' },
];

export default function NotificationsScreen() {
    const router = useRouter();
      const { isRTL } = useLanguage();
    
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View className="bg-[#005DA0] pt-12 pb-4 px-4">
              <View className="flex-row items-center text-white text-xl font-semibold pt-2">
                <TouchableOpacity 
                  onPress={ () => router.back()
                  } 
                  className="items-center justify-center me-5"
                >
                  <Feather name={isRTL? "arrow-right" : "arrow-left"} size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="flex-row items-center justify-center text-white text-xl font-semibold ">
                  Notifications
                </Text>
              </View>
            </View>
      {/* Notifications */}
      <ScrollView style={{ padding: 16 }}>
        {notifications.map((item) => (
          <View key={item.id} style={{ backgroundColor: '#fff', padding: 12, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Text style={{ fontWeight: '600', fontSize: 16 , color:'#828282' }}>{item.title}</Text>
            <Text style={{ marginTop: 4 }}>{item.message}</Text>
            <Text style={{ marginTop: 6, color: '#6b7280', fontSize: 12 }}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
