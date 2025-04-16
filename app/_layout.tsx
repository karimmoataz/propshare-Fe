import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SessionProvider } from "./ctx";
import "./global.css"
import api from "./api/axios";


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
          const response = await api.get("/verify-token", {
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
import { router, Slot } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function RootLayoutNav() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
