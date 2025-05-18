import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FinancialProvider } from '../context/FinancialContext';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
// import { SessionProvider } from "./ctx";
import { router, Slot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager, StatusBar } from 'react-native';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import "./global.css"
import api from "./api/axios";
import usePushNotifications from '../hooks/usePushNotifications';
import * as Notifications from 'expo-notifications';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "login",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
    const { expoPushToken } = usePushNotifications();

     useEffect(() => {
    // Check if app was opened from a notification
    const checkLastNotification = async () => {
      const lastNotificationData = await AsyncStorage.getItem('lastNotificationData');
      
      if (lastNotificationData) {
        try {
          const data = JSON.parse(lastNotificationData);
          
          // Navigate based on notification data
          if (data.propertyId && typeof data.propertyId === 'object' && '_id' in data.propertyId) {
            router.push(`/properties/${(data.propertyId as { _id: string })._id}`);
          }
          
          // Clear the stored notification data
          await AsyncStorage.removeItem('lastNotificationData');
        } catch (error) {
          console.error('Error parsing last notification data:', error);
        }
      }
    };
    
    checkLastNotification();
    
    // Subscribe to notification opened handler
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response: Notifications.NotificationResponse) => {
        const data = response.notification.request.content.data;
        
        if (
          data &&
          data.propertyId &&
          typeof data.propertyId === 'object' &&
          data.propertyId !== null &&
          '_id' in data.propertyId
        ) {
          router.push(`/properties/${(data.propertyId as { _id: string })._id}`);
        }
      }
    );
    
    return () => {
      subscription.remove();
    };
  }, [router]);


  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      checkAuthStatus();

    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const checkAuthStatus = async () => {
    try {
        const userToken = await AsyncStorage.getItem("token");
        if (!userToken) {
          return;
        }
          const response = await api.get("/get-user", {
          headers: { Authorization: userToken },
        });
        if (response.status === 200) {
          router.replace("/home");
        } else {
          await AsyncStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        await AsyncStorage.removeItem("token");
      } finally {

      }
  };

  return <RootLayoutNav />;
}

function LayoutWrapper() {
  const { isRTL } = useLanguage();

  useEffect(() => {
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  return <Slot />;
}

function RootLayoutNav() {
  return (
    <LanguageProvider>
      <FinancialProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <LayoutWrapper />
      </FinancialProvider>
    </LanguageProvider>
  );
}
