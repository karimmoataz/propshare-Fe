import { Link } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className='bg-white h-full flex flex-col items-center justify-center'>
      <Text className="font-bold text-lg my-10">Welcome to Propshare</Text>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/properties/1">Property</Link>
    </SafeAreaView>
  );
}
