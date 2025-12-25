import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert, BackHandler, Modal, Dimensions, RefreshControl, ScrollView, Keyboard, ImageBackground} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter, useFocusEffect } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import api from "../../api/axios";
import TransactionCard from "@/components/TransactionsCard";
import I18n from "../../../lib/i18n";
import { useLanguage } from '../../../context/LanguageContext';
import CustomButton from "@/components/CustomButton";

const Wallet = () => {
  const router = useRouter();
  interface WalletData {
    balance: number;
    pendingIncome: number;
    outcome: number;
  }
  
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [amount, setAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [verified, setVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { isRTL } = useLanguage();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  

  interface Transaction {
    type: 'Deposit' | 'Withdraw';
    amount: number;
    date: string;
    source?: string;
    userName: string;
    description?: string;
    createdAt?: string;
  }

  useEffect(() => {
    if (showPayment) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          setShowPayment(false);
          return true;
        }
      );
      return () => backHandler.remove();
    }
  }, [showPayment]);

  const fetchWalletData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return;
      }
      
      const userResponse = await api.get("/get-user", {
        headers: { Authorization: token },
      });
  
      const transactionsResponse = await api.get("/payment/transactions", {
        headers: { Authorization: token },
      });
  
      if (userResponse.data?.user) {
        setWalletData({
          balance: userResponse.data.user.balance || 0,
          pendingIncome: userResponse.data.user.pendingIncome || 0,
          outcome: userResponse.data.user.outcome || 0
        });
        setVerified(userResponse.data.user.verified || false);
        setIdVerified(userResponse.data.user.idVerification.status || "not_submitted");
      }
  
      if (transactionsResponse.data) {
        setTransactions(transactionsResponse.data.map((tx: Transaction) => ({
          ...tx,
          date: tx.createdAt || tx.date
        })));
      }
    } catch (error) {
      console.error("Wallet data error:", error);
      Alert.alert("Error", "Failed to load wallet data");
    } finally {
      setLoading(false);
      // setRefreshing(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchWalletData();
    }, [])
  );

  useEffect(() => {
    fetchWalletData();
  }, [walletData]);

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   fetchWalletData();
  // }, []);

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
        setShowTopUpModal(false);
        setShowPayment(true);
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Payment error:', (error as any).response?.data || error.message);
      } else {
        console.error('Payment error:', error);
      }
      Alert.alert(
        "Payment Failed",
        (error as any).response?.data?.message || "Could not initiate payment. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleWebViewNavigation = (navState: any) => {
  const { url } = navState;

  if (
    url.startsWith('https://accept.paymobsolutions.com/api/acceptance/post_pay') ||
    url.includes('/success') ||
    url.includes('payment-success') ||
    url === 'https://accept.paymobsolutions.com/api/acceptance/post_pay'
  ) {
    setShowPayment(false);
    fetchWalletData();
    return true;
  }

  if (
    url.includes('/fail') ||
    url.includes('payment-failed')
  ) {
    setShowPayment(false);
    Alert.alert("Failed", "Payment cancelled/failed");
    return true;
  }

  return false;
};

   useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
        <ActivityIndicator size="large" color="#005DA0" />
      </View>
    );
  }

  if (
    (!verified ||
    ['not_submitted', 'pending', 'rejected'].includes(String(idVerified))) && walletData
  ) {
    return (
      <View className="flex-1 justify-center px-5 h-full items-center bg-[#f7f7fa]">
        <View className="w-full max-w-md">
          <Text className="text-gray-500">
          You need a verified account to access the wallet.
        </Text>
        <CustomButton
          text={I18n.t('verify')}
          onPress={() => router.push('/verification')}
          className="mt-4 bg-[#005DA0] w-full"/>
        </View>
      </View>
    );
  }

  

  if (showPayment) {
  return (
    <View className={`flex-1 bg-white ${!isKeyboardVisible ? "pb-20" : ""}`}>
      <TouchableOpacity
        className="z-10 absolute top-12 right-4 rounded-full"
        onPress={() => setShowPayment(false)}
      >
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      <WebView
        source={{ uri: paymentUrl }}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url.startsWith('propshare://payment-complete')) {
            return false;
          }
          return true;
        }}
        onNavigationStateChange={handleWebViewNavigation}
        onError={(syntheticEvent) => {
          console.error('WebView error:', syntheticEvent.nativeEvent);
          setShowPayment(false);
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

  return (
    <View 
      className="bg-[#f5f6f9] flex-1 py-14 px-5 pb-24" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {walletData ? (
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">{I18n.t('walletBalance')}</Text>
            <TouchableOpacity>
              <Link href="/notification">
                <Feather name="bell" size={24} color="black" />
              </Link>
            </TouchableOpacity>
          </View>

          <ImageBackground source={require("../../../assets/images/walletbg.png")} imageStyle={{ borderRadius: 10 }} className="bg-[#005DA0] items-center rounded-2xl p-6" >
            <Text className="text-base text-[#E1E3E6] mb-2">{I18n.t('mainBalance')}</Text>
            <Text className="text-4xl font-bold text-white py-1">{I18n.t('currency.code')} {walletData.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
            <View className="flex-row justify-between w-full mt-4 px-16">
              <TouchableOpacity onPress={() => setShowTopUpModal(true)}>
                <View className="width-1/2 items-center">
                  <AntDesign name="arrowdown" className="border-b-[1px] mb-3 border-white" size={18} color="white" />
                  <Text className="text-white">{I18n.t('deposit')}</Text>
                </View>
              </TouchableOpacity>
              <View className="border-l-[1px] my-3 border-white"/>
              <TouchableOpacity>
                <Link href="/withdraw">
                  <View className="width-1/2 items-center">
                    <AntDesign name="arrowup" className="border-b-[1px] mb-3 border-white" size={18} color="white" />
                    <Text className="text-white"> {I18n.t('withdraw')}</Text>
                  </View>
                </Link>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View className="flex-row justify-between mb-6 mt-6">
              <Text className="text-xl font-bold">{I18n.t('recentTransactions')}</Text>
          </View>
          <View className="bg-white rounded-xl flex-1">
            <ScrollView>
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <TransactionCard
                    key={index}
                    type={tx.type}
                    discription={tx.description}
                    amount={tx.amount}
                    time={new Date(tx.date).toLocaleDateString("en-GB")}
                    source={tx.source}
                  />
                ))
              ) : (
                <Text className="text-gray-500 p-5">No recent transactions</Text>
              )}
            </ScrollView>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showTopUpModal}
            onRequestClose={() => setShowTopUpModal(false)}
          >
            <View className="flex-1 justify-center items-center bg-white/30 backdrop-blur-md">
              <View className="bg-white w-5/6 p-6 rounded-xl">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold">{I18n.t('topUpWallet')}</Text>
                  <TouchableOpacity onPress={() => setShowTopUpModal(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  className="border border-gray-300 rounded-lg p-4 mb-4"
                  placeholder={I18n.t('enterAmountInEGP')}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />

                <TouchableOpacity
                  className="bg-[#1067a6] p-4 rounded-lg items-center"
                  onPress={handleTopUp}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      {I18n.t('proceedToPayment')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View className="flex-1 justify-center px-5 h-full items-center bg-[#f7f7fa]">
          <View className="w-full max-w-md">
            <Text className="text-gray-500">
            You need to login to access the wallet.
          </Text>
          <CustomButton
            text={I18n.t('login')}
            onPress={() => router.push('/sign-in')}
            className="mt-4 bg-[#005DA0] w-full"/>
          </View>
      </View>
      )}
    </View>
  );
};

export default Wallet;