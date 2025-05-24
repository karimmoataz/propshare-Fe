// usePushNotifications.tsx
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../app/api/axios';

// Configure the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const sendTokenToServer = async (token: string) => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      if (authToken) {
        await api.post('/notifications/update-push-token', { expoPushToken: token }, { headers: { Authorization: authToken } });
      }
    } catch (error) {
      console.error('Error sending push token to server:', error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        sendTokenToServer(token);
      }
    });

    // This listener is called when a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      setNotification(notification);
    });

    // This listener is called when a user taps on or interacts with a notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      console.log(response);
      // Handle notification tap, e.g., navigate to a specific screen
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Create notification channels for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#005DA0',
      });
       await Notifications.setNotificationChannelAsync('chat-messages', { // Add this
        name: 'Chat Messages',
        importance: Notifications.AndroidImportance.HIGH, // Use HIGH for instant alerts
        vibrationPattern: [0, 500],
        lightColor: '#00FF00',
        sound: 'default', // Play a sound
      });
    }

    // Get the token that uniquely identifies this device
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
  } else {
    console.log('Must use physical device for Push Notifications');
    //  return;  // Remove this line.  We need it to work in the simulator.
    token = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"; // Add this line for the simulator
  }

  return token;
}
