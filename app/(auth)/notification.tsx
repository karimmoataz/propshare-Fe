import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Platform,
  Alert
} from 'react-native';
import api from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Define notification interface
interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  propertyId?: {
    _id: string;
    name: string;
  };
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { isRTL } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/');
        return;
      }
      
      const response = await api.get('/notifications', {
        headers: { Authorization: token }
      });
      
      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert(
        I18n.t('error'),
        I18n.t('errorFetchingNotifications')
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Register for push notifications
  const registerForPushNotifications = async () => {
    try {
      // Check if we already have a token stored
      const existingToken = await AsyncStorage.getItem('expoPushToken');
      if (existingToken) {
        return;
      }
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          Alert.alert(
            I18n.t('notification'),
            I18n.t('notificationPermissionDenied')
          );
          return;
        }
        
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });
        
        // Store token locally
        await AsyncStorage.setItem('expoPushToken', token.data);
        
        // Send token to server
        const authToken = await AsyncStorage.getItem('token');
        if (authToken) {
          await api.post('/notifications/update-push-token', {
            expoPushToken: token.data
          }, {
            headers: { Authorization: authToken }
          });
        }
      } else {
        console.log('Must use physical device for Push Notifications');
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    registerForPushNotifications();
    
    // Set up notification handler
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      fetchNotifications(); // Refresh notifications when a new one is received
    });
    
    return () => {
      notificationListener.remove();
    };
  }, []);

  // Handle refreshing
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  // Handle notification item click
  const handleNotificationPress = async (notification: Notification) => {
    // Mark notification as read
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      
      await api.put(`/notifications/${notification._id}/read`, {}, {
        headers: { Authorization: token }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(item => 
          item._id === notification._id ? { ...item, isRead: true } : item
        )
      );
      
      // Navigate to property if propertyId exists
      if (notification.propertyId) {
        router.push(`/properties/${notification.propertyId._id}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return I18n.t('today');
    } else if (diffDays === 1) {
      return I18n.t('yesterday');
    } else if (diffDays < 7) {
      return `${diffDays} ${I18n.t('daysAgo')}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? I18n.t('weekAgo') : I18n.t('weeksAgo')}`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? I18n.t('monthAgo') : I18n.t('monthsAgo')}`;
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      
      await api.put('/notifications/mark-all-read', {}, {
        headers: { Authorization: token }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(item => ({ ...item, isRead: true }))
      );
      
      Alert.alert(
        I18n.t('notification'),
        I18n.t('allNotificationsMarkedAsRead')
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View className="bg-[#005DA0] pt-12 pb-4 px-4" >
        <View className="flex-row items-center justify-between text-white text-xl font-semibold pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="items-center justify-center me-5"
            >
              <Feather name={"arrow-left"} size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold">
              {I18n.t('notifications')}
            </Text>
          </View>
          
          {notifications.length > 0 && (
            <TouchableOpacity 
              onPress={handleMarkAllAsRead}
              className="py-1 px-3 rounded-full bg-white"
            >
              <Text className="text-xs text-[#005DA0] font-medium">
                {I18n.t('markAllAsRead')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Notifications */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#005DA0" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-4"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#005DA0']}
            />
          }
        >
          {notifications.length === 0 ? (
            <View className="flex-1 justify-center items-center py-10">
              <Feather name="bell-off" size={48} color="#CCCCCC" />
              <Text className="text-gray-400 mt-4 text-center">
                {I18n.t('noNotifications')}
              </Text>
            </View>
          ) : (
            notifications.map((item) => (
              <TouchableOpacity
                key={item._id}
                onPress={item.propertyId && item.propertyId._id ? (() => router.push(`/properties/${item.propertyId!._id}`)) : undefined}
                className={`bg-white p-4 my-2 rounded-xl border-[1px] ${
                  item.isRead ? 'border-[#e5e7eb]' : 'border-[#005DA0]'
                }`}
                style={{ 
                  backgroundColor: item.isRead ? '#fff' : 'rgba(0, 93, 160, 0.05)'
                }}
              >
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-base text-[#005DA0]">
                    {item.title}
                    {item.propertyId && (
                      <Text className="text-sm font-normal text-gray-600"> • {item.propertyId.name}</Text>
                    )}
                  </Text>
                  {!item.isRead && (
                    <View className="w-2 h-2 rounded-full bg-[#005DA0]" />
                  )}
                </View>
                <Text className="mt-2 text-gray-700">{item.message}</Text>
                <Text className="mt-2 text-gray-500 text-xs">
                  {formatDate(item.createdAt)}
                </Text>
              </TouchableOpacity>
            ))
          )}
          
          {/* Add some bottom padding */}
          <View className="h-4" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}