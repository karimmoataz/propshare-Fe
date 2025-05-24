import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";


const withdrawalMethods = [
  {
    title: I18n.t('localBankTransfer'),
    description: I18n.t('usuallyUpTo1WorkingDayToWithdraw'),
  },
  {
    title: I18n.t('eWallet'),
    description: I18n.t('usuallyUpTo1WorkingDayToWithdraw'),
  },
  {
    title: I18n.t('instaPay'),
    description: I18n.t('coupleOfHoursToTransfer'),
  },
];

const egyptianBanks = [
  "Banque Misr",
  "National Bank of Egypt",
  "Commercial International Bank (CIB)",
  "QNB Al Ahli",
  "HSBC Egypt",
  "AlexBank",
  "Banque du Caire",
  "Faisal Islamic Bank of Egypt",
  "Arab African International Bank",
  "Credit Agricole Egypt",
  "Suez Canal Bank",
  "Housing and Development Bank",
  "Industrial Development Bank",
  "United Bank of Egypt",
  "Abu Dhabi Islamic Bank Egypt",
];

export default function WithdrawalScreen() {
  const [selectedMethod, setSelectedMethod] = useState<"Local Bank Transfer" | "E-Wallet" | "InstaPay" | null>(null);
  const [selectedBank, setSelectedBank] = useState("");
  const [amount, setAmount] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [provider, setProvider] = useState("");
  const [instapayId, setInstapayId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [withdrawalId, setWithdrawalId] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const { isRTL } = useLanguage();
  const router = useRouter();

  // Fetch user balance when component mounts
  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Authentication Error", "Please login to continue");
        router.push("/sign-in");
        return;
      }

      const response = await api.get(`/get-user`, {
        headers: { Authorization: token }
      });

      if (response.data && response.data.user) {
        setUserBalance(response.data.user.balance);
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
      Alert.alert("Error", "Failed to fetch your balance. Please try again later.");
    }
  };

  const getHeaderTitle = () => {
    switch (selectedMethod) {
      case "Local Bank Transfer":
        return I18n.t('bankInformation');
      case "E-Wallet":
        return I18n.t('eWalletInformation');
      case "InstaPay":
        return I18n.t('instaPayInformation');
      default:
        return I18n.t('chooseWithdrawalMethod');
    }
  };

  const validateForm = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert(I18n.t('invalidAmount'), I18n.t('pleaseEnterAValidAmount'));
      return false;
    }

    if (parseFloat(amount) > userBalance) {
      Alert.alert(I18n.t('insufficientBalance'), I18n.t('youDontHaveEnoughBalanceForThisWithdrawal'));
      return false;
    }

    if (selectedMethod === "Local Bank Transfer") {
      if (!selectedBank) {
        Alert.alert(I18n.t('missingInformation'), I18n.t('pleaseSelectYourBank'));
        return false;
      }
      if (!receiverName) {
        Alert.alert(I18n.t('missingInformation'), I18n.t('pleaseEnterReceiverName'));
        return false;
      }
      if (!accountNumber) {
        Alert.alert(I18n.t('missingInformation'), I18n.t('pleaseRnterYourIBAN'));
        return false;
      }
    } else if (selectedMethod === "E-Wallet") {
      if (!provider) {
        Alert.alert(I18n.t('missingInformation'), I18n.t('pleaseRnterYourEwalletProvider'));
        return false;
      }
      if (!accountNumber) {
        Alert.alert(I18n.t('missingInformation'), I18n.t('pleaseRnterYourAccountNumber'));
        return false;
      }
    } else if (selectedMethod === "InstaPay") {
      if (!instapayId) {
        Alert.alert(I18n.t('missingInformation'), I18n.t('pleaseRnterYourInstaPayID'));
        return false;
      }
      if (!mobileNumber) {
        Alert.alert(I18n.t('missingInformation'), I18n.t('pleaseRnterYourRegisteredMobileNumber'));
        return false;
      }
    }

    return true;
  };

  const handleSubmitWithdrawal = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert("Authentication Error", "Please login to continue");
        router.push("/sign-in");
        return;
      }

      let withdrawalDetails = {};
      
      if (selectedMethod === "Local Bank Transfer") {
        withdrawalDetails = {
          bankName: selectedBank,
          receiverName,
          accountNumber
        };
      } else if (selectedMethod === "E-Wallet") {
        withdrawalDetails = {
          provider,
          accountNumber
        };
      } else if (selectedMethod === "InstaPay") {
        withdrawalDetails = {
          instapayId,
          mobileNumber
        };
      }

      const response = await api.post(
        `/withdrawal/request`,
        {
          amount: parseFloat(amount),
          method: selectedMethod,
          ...withdrawalDetails
        },
        {
          headers: { Authorization: token }
        }
      );

      if (response.data && response.data.withdrawal) {
        setWithdrawalId(response.data.withdrawal.id);
        setSuccessModalVisible(true);
        // Update user balance
        setUserBalance(prev => prev - parseFloat(amount));
      }
    } catch (error) {
      console.error("Withdrawal request error:", error);
      
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMethod(null);
    setSelectedBank("");
    setAmount("");
    setReceiverName("");
    setAccountNumber("");
    setProvider("");
    setInstapayId("");
    setMobileNumber("");
    setSuccessModalVisible(false);
  };

  const handleGoBack = () => {
    if (selectedMethod) {
      setSelectedMethod(null);
    } else {
      router.back();
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <View className="bg-[#005DA0] pt-12 pb-4 px-4">
        <View className="flex-row items-center text-white text-xl font-semibold pt-2">
          <TouchableOpacity 
            onPress={handleGoBack} 
            className="items-center justify-center me-5"
          >
            <Feather name={isRTL? "arrow-right" : "arrow-left"} size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="flex-row items-center justify-center text-white text-xl font-semibold ">
            {getHeaderTitle()}
          </Text>
        </View>
      </View>

      {!selectedMethod && (
        <View className="p-4">
          <View className="bg-gray-100 p-4 rounded-lg mb-6">
            <Text className="text-gray-500">{I18n.t('availableBalance')}</Text>
            <Text className="text-xl font-bold">EGP {userBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          </View>
          
          <Text className="text-gray-700 text-xl mb-4 font-bold">{I18n.t('amountYouWantToWithdraw')}</Text>
          <TextInput
            className="border-[2px] border-gray-100 placeholder:text-gray-500 rounded-lg px-4 py-3 mb-4"
            placeholder={I18n.t('enterAmount')}
            keyboardType="numeric"
            autoCapitalize="none"
            value={amount}
            onChangeText={setAmount}
          />
          <Text className="text-gray-700 mb-4">{I18n.t('pleaseSelectAWithdrawalMethod')}.</Text>
          {withdrawalMethods.map((method, index) => (
            <View key={index} className="mb-6">
              <Pressable
                onPress={() => setSelectedMethod(method.title as "Local Bank Transfer" | "E-Wallet" | "InstaPay")}
                className="border-[2px] border-gray-100 p-5 rounded-xl"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="font-semibold text-base text-[#828282]">
                      {I18n.t('feesApply')}
                    </Text>
                    <Text className="text-black text-lg">{method.title}</Text>
                    <Text className="text-gray-500 text-sm">
                      {method.description}
                    </Text>
                  </View>
                  <Text className="text-xl text-gray-500"><AntDesign name={isRTL ? "left" : "right"} size={20} color="grey" /></Text>
                </View>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {selectedMethod === "Local Bank Transfer" && (
        <View className="p-4 space-y-6">
          <Text className="text-gray-700 text-lg mb-2">{I18n.t('inCaseYouForgotAnyRequiredDetailsContactYourBankForAssistance')}</Text>

          <View>
            <Text className="text-black font-bold mb-1">{I18n.t('bankName')}</Text>
            <Pressable
              onPress={() => setBankModalVisible(true)}
              className="border border-gray-100 rounded-xl p-3 flex-row justify-between items-center"
            >
              <Text className="text-[#828282]">
                {selectedBank || "Select your bank"}
              </Text>
              <Text className="text-[#828282]">⌄</Text>
            </Pressable>

            <Modal
                visible={bankModalVisible}
                transparent={true}
                animationType="slide"
                >
                <Pressable 
                    className="flex-1 justify-center items-center bg-black/30" 
                    onPress={() => setBankModalVisible(false)}
                >
                    <Pressable className="bg-white p-6 rounded-xl w-4/5 max-h-[80%]">
                    {/* Search Input */}
                    <TextInput
                        placeholder={I18n.t('searchBanks')}
                        className="border border-gray-300 p-2 rounded mb-4"
                        onChangeText={(text) => setSearchQuery(text)}
                        value={searchQuery}
                    />
                    
                    <ScrollView>
                        {egyptianBanks
                        .filter(bank => 
                            bank.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((bank, index) => (
                            <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setSelectedBank(bank);
                                setBankModalVisible(false);
                            }}
                            className="py-2 border-b border-gray-200"
                            >
                            <Text className="text-black">{bank}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    
                    <Pressable
                        onPress={() => setBankModalVisible(false)}
                        className="mt-4"
                    >
                        <Text className="text-center text-[#005DA0] font-semibold">
                        {I18n.t('cancel')}
                        </Text>
                    </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
          </View>

          <View>
            <Text className="text-black font-bold mb-1">{I18n.t('receiverName')}</Text>
            <TextInput
              placeholder={I18n.t('enterNameOfBankAccountHolder')}
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
              value={receiverName}
              onChangeText={setReceiverName}
            />
          </View>

          <View>
            <Text className="text-black font-bold mb-1">IBAN</Text>
            <TextInput
              placeholder={I18n.t('exampleEG210900020202kddosjf')}
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>

          <View className="mt-6 flex-row space-x-4">
            <Pressable
              onPress={() => setSelectedMethod(null)}
              className="flex-1 border border-[#005DA0] py-3 me-2 rounded-xl"
            >
              <Text className="text-[#005DA0] text-center font-semibold">{I18n.t('back')}</Text>
            </Pressable>
            
            <Pressable
              onPress={handleSubmitWithdrawal}
              disabled={isLoading}
              className="flex-1 bg-[#005DA0] py-3 ms-2 rounded-xl"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold">{I18n.t('submit')}</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {selectedMethod === "E-Wallet" && (
        <View className="p-4 space-y-6">
          <Text className="text-gray-700 text-lg mb-2">{I18n.t('pleaseProvideYourEWalletInformationForWithdrawal')}.</Text>

          <View>
            <Text className="text-black font-bold mb-1">
              {I18n.t('eWalletProvider')}
            </Text>
            <TextInput
              placeholder={I18n.t('enterYourEWalletProvider')}
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
              value={provider}
              onChangeText={setProvider}
            />
          </View>

          <View>
            <Text className="text-black font-bold mb-1">{I18n.t('accountNumber')}</Text>
            <TextInput
              placeholder={I18n.t('enterYourEWalletAccountNumber')}
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>

          <View className="mt-6 flex-row space-x-4">
            <Pressable
              onPress={() => setSelectedMethod(null)}
              className="flex-1 border border-[#005DA0] py-3 me-2 rounded-xl"
            >
              <Text className="text-[#005DA0] text-center font-semibold">{I18n.t('back')}</Text>
            </Pressable>
            
            <Pressable
              onPress={handleSubmitWithdrawal}
              disabled={isLoading}
              className="flex-1 bg-[#005DA0] py-3 ms-2 rounded-xl"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold">{I18n.t('submit')}</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {selectedMethod === "InstaPay" && (
        <View className="p-4 space-y-6">
          <Text className="text-gray-700 text-lg mb-2">
            {I18n.t('pleaseProvideYourInstaPayInformationForWithdrawal')}
          </Text>

          <View>
            <Text className="text-black font-bold mb-1">{I18n.t('instaPayID')}</Text>
            <TextInput
              placeholder={I18n.t('enterYourInstaPayID')}
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
              value={instapayId}
              onChangeText={setInstapayId}
            />
          </View>

          <View>
            <Text className="text-black font-bold mb-1">
              {I18n.t('registeredMobileNumber')}
            </Text>
            <TextInput
              placeholder={I18n.t('enterYourRegisteredMobileNumber')}
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>

          <View className="mt-6 flex-row space-x-4">
            <Pressable
              onPress={() => setSelectedMethod(null)}
              className="flex-1 border border-[#005DA0] py-3 me-3 rounded-xl"
            >
              <Text className="text-[#005DA0] text-center font-semibold">{I18n.t('back')}</Text>
            </Pressable>
            
            <Pressable
              onPress={handleSubmitWithdrawal}
              disabled={isLoading}
              className="flex-1 bg-[#005DA0] py-3 ms-2 rounded-xl"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold">{I18n.t('submit')}</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}

      {/* Success Modal */}
        <Modal
            visible={successModalVisible}
            transparent={true}
            animationType="fade"
        >
            <Pressable className="flex-1 justify-center items-center bg-black/30" onPress={() => setSuccessModalVisible(false)}>
                <Pressable className="bg-white p-6 rounded-xl w-4/5">
                    <AntDesign name="checkcircle" size={60} color="#4CAF50" style={{ alignSelf: 'center', marginBottom: 20 }} />
                    <Text className="text-xl font-bold text-center mb-4">{I18n.t('withdrawalRequestSubmitted')}</Text>
                    <Text className="text-gray-600 text-center mb-6">
                    {I18n.t('yourWithdrawalRequestHasBeenSubmittedSuccessfullyYouCanTrackTheStatusInYourWithdrawalHistory')}
                    </Text>
                    <View className="border-t border-gray-200 pt-4">
                    <Text className="text-gray-600 mb-2">{I18n.t('amount')}: EGP {parseFloat(amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                    <Text className="text-gray-600 mb-2">{I18n.t('method')}: {selectedMethod}</Text>
                    <Text className="text-gray-600 mb-2">{I18n.t('status')}: {I18n.t('pending')}</Text>
                    <Text className="text-gray-600 mb-6">{I18n.t('referenceID')}: {withdrawalId}</Text>
                    </View>
                    <Pressable
                    onPress={() => {
                        resetForm();
                        router.push("/withdraw-history");
                    }}
                    className="bg-[#005DA0] py-3 rounded-xl mb-3"
                    >
                    <Text className="text-white text-center font-semibold">{I18n.t('viewWithdrawalHistory')}</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
        {!selectedMethod && (
        <Pressable
            onPress={() => {
            resetForm();
            router.push("/withdraw-history");
            }}
            className="bg-[#005DA0] py-3 rounded-xl mb-3 mx-5"
            >
        <Text className="text-white text-center font-semibold">{I18n.t('viewWithdrawalHistory')}</Text>
        </Pressable>)}
    </ScrollView>
  );
}