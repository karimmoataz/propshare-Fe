import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const ChatBot = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // HTML content with the iframe embedded
  const chatbotHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
            }
            iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
            .text-zinc-500 {
                display: none;
            }
        </style>
      </head>
      <body>
        <iframe
          src="https://www.chatbase.co/chatbot-iframe/7MLZBKpo2zei3krTc3XfV"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </body>
    </html>
  `;

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View className="bg-[#f5f6f9] flex-1 pt-14 px-5">
      <StatusBar style="dark" />
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#242424" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-[#242424]">Support Chat</Text>
        </View>
      </View>

      <View className="bg-white rounded-xl shadow-sm border-[1px] border-[#e9ecef] flex-1 mb-5 overflow-hidden">
        {isLoading && (
          <View className="absolute z-10 w-full h-full items-center justify-center bg-white">
            <Text className="text-gray-500">Loading chatbot...</Text>
          </View>
        )}
        <WebView
          source={{ html: chatbotHTML }}
          onLoad={handleLoadEnd}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          onError={(error) => console.error("WebView error:", error)}
        />
      </View>
    </View>
  );
};

export default ChatBot;