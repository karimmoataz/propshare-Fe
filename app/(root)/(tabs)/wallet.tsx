import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../../api/axios";

const Wallet = () => {
  const router = useRouter();
  const [walletData, setWalletData] = useState({
    balance: 0,
    pendingIncome: 0,
    outcome: 0
  });
  const [amount, setAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchWalletData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      
      const response = await api.get("/verify-token", {
        headers: { Authorization: token },
      });
      
      if (response.data?.user) {
        setWalletData({
          balance: response.data.user.balance || 0,
          pendingIncome: response.data.user.pendingIncome || 0,
          outcome: response.data.user.outcome || 0
        });
      }
    } catch (error) {
      console.error("Wallet data error:", error);
      Alert.alert("Error", "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTopUp = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0");
      return;
    }

    setPaymentLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await api.post(
        '/payment/create-order',
        { amount: numericAmount },
        { headers: { Authorization: token } }
      );

      if (response.data?.payment_url) {
        setPaymentUrl(response.data.payment_url);
        setShowPayment(true);
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error: any) {
      console.error('Payment error:', error.response?.data || error.message);
      Alert.alert(
        "Payment Failed",
        error.response?.data?.message || "Could not initiate payment. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  if (showPayment) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('payment-success')) {
            setShowPayment(false);
            fetchWalletData();
          }
        }}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View className="bg-[#f7f7fa] h-full p-6">
      {walletData ? (
        <>
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Wallet Balance
          </Text>

          <View className="bg-[#005DA0] text-white items-center p-6 rounded-2xl mb-6">
            <Text className="text-lg text-white">Main Balance</Text>
            <Text className="text-3xl font-bold text-white">
              EGP {walletData.balance}
            </Text>
          </View>

          <View className="bg-white p-4 rounded-xl shadow-slate-300 mb-6">
            <Text className="text-lg font-bold mb-4">Top Up Wallet</Text>
            
            <TextInput
              className="border border-gray-300 rounded-lg p-4 mb-4"
              placeholder="Enter amount in EGP"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <TouchableOpacity
              className="bg-green-500 p-4 rounded-lg items-center"
              onPress={handleTopUp}
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Proceed to Payment
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between mb-6">
            <View className="bg-green-100 p-4 rounded-lg w-1/2 mr-2">
              <Text className="text-green-600">Pending Income</Text>
              <Text className="font-bold">EGP {walletData.pendingIncome.toFixed(2)}</Text>
            </View>
            <View className="bg-red-100 p-4 rounded-lg w-1/2 ml-2">
              <Text className="text-red-600">Total Outcome</Text>
              <Text className="font-bold">EGP {walletData.outcome.toFixed(2)}</Text>
            </View>
          </View>
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">No wallet data available</Text>
        </View>
      )}
    </View>
  );
};

export default Wallet;