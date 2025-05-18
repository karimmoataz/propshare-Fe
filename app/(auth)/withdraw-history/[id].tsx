import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from '../../../context/LanguageContext';
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axios";


interface WithdrawalDetails {
    bankName?: string;
    receiverName?: string;
    accountNumber?: string;
    provider?: string;
    instapayId?: string;
    mobileNumber?: string;
    [key: string]: any;
}

type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled' | string;

interface Withdrawal {
    _id: string;
    amount: number;
    status: WithdrawalStatus;
    method: string;
    details: WithdrawalDetails;
    createdAt: string;
    processedAt?: string;
    notes?: string;
}

const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
};

const getStatusColor = (status: WithdrawalStatus) => {
  switch (status) {
    case 'pending':
      return '#FF9800'; // Orange
    case 'processing':
      return '#2196F3'; // Blue
    case 'completed':
      return '#4CAF50'; // Green
    case 'rejected':
    case 'cancelled':
      return '#F44336'; // Red
    default:
      return '#757575'; // Grey
  }
};

export default function WithdrawalDetailsScreen() {
  const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchWithdrawalDetails();
    } else {
      router.back();
    }
  }, [id]);

  const fetchWithdrawalDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert("Authentication Error", "Please login to continue");
        router.push("/sign-in");
        return;
      }

      const response = await api.get(`/withdrawal/${id}`, {
        headers: { Authorization: token }
      });

      if (response.data && response.data.withdrawal) {
        setWithdrawal(response.data.withdrawal);
      }
    } catch (error) {
      console.error("Error fetching withdrawal details:", error);
      Alert.alert("Error", "Failed to fetch withdrawal details. Please try again.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCancelWithdrawal = async () => {
    if (!withdrawal || withdrawal.status !== 'pending') return;
    
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert("Authentication Error", "Please login to continue");
        router.push("/sign-in");
        return;
      }

      // Show confirmation dialog
      Alert.alert(
        "Cancel Withdrawal",
        "Are you sure you want to cancel this withdrawal request?",
        [
          { text: "No", style: "cancel" },
          { 
            text: "Yes", 
            onPress: async () => {
              setLoading(true);
              
              try {
                const response = await api.post(
                  `/withdrawal/${id}/cancel`,
                  {},
                  { headers: { Authorization: token } }
                );
                
                if (response.data) {
                  Alert.alert("Success", "Withdrawal cancelled successfully");
                  // Refresh the details
                  fetchWithdrawalDetails();
                }
              } catch (error) {
                console.error("Error cancelling withdrawal:", error);
                let errorMessage = "Failed to cancel withdrawal. Please try again.";
                if (error && typeof error === "object" && "response" in error) {
                  const err = error as { response?: { data?: { message?: string } } };
                  if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                  }
                }
                Alert.alert(
                  "Error", 
                  errorMessage
                );
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error in handleCancelWithdrawal:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const renderMethodDetails = () => {
    if (!withdrawal) return null;

    switch (withdrawal.method) {
      case 'Local Bank Transfer':
        return (
          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-gray-700 font-bold mb-3">Bank Details</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Bank Name</Text>
                <Text className="text-gray-700">{withdrawal.details.bankName}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Receiver Name</Text>
                <Text className="text-gray-700">{withdrawal.details.receiverName}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Account Number</Text>
                <Text className="text-gray-700">{withdrawal.details.accountNumber}</Text>
              </View>
            </View>
          </View>
        );
      case 'E-Wallet':
        return (
          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-gray-700 font-bold mb-3">E-Wallet Details</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Provider</Text>
                <Text className="text-gray-700">{withdrawal.details.provider}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Account Number</Text>
                <Text className="text-gray-700">{withdrawal.details.accountNumber}</Text>
              </View>
            </View>
          </View>
        );
      case 'InstaPay':
        return (
          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-gray-700 font-bold mb-3">InstaPay Details</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">InstaPay ID</Text>
                <Text className="text-gray-700">{withdrawal.details.instapayId}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Mobile Number</Text>
                <Text className="text-gray-700">{withdrawal.details.mobileNumber}</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-[#005DA0] pt-12 pb-4 px-4">
        <View className="flex-row items-center text-white text-xl font-semibold pt-2">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="items-center justify-center me-5"
          >
            <Feather name={isRTL? "arrow-right" : "arrow-left"} size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="flex-row items-center justify-center text-white text-xl font-semibold ">
            Withdrawal Details
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#005DA0" />
        </View>
      ) : withdrawal ? (
        <ScrollView className="flex-1 p-4">
          <View className="mb-6 items-center">
            <View 
              style={{ 
                backgroundColor: getStatusColor(withdrawal.status) + '20', 
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 16,
                marginBottom: 8
              }}
            >
              <Text style={{ color: getStatusColor(withdrawal.status), fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }}>
                {withdrawal.status}
              </Text>
            </View>
            <Text className="text-gray-800 text-2xl font-bold">
              EGP {withdrawal.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
            <Text className="text-gray-600 mt-1">
              {withdrawal.method}
            </Text>
          </View>

          <View className="bg-white p-4 rounded-lg mb-4">
            <Text className="text-gray-700 font-bold mb-3">Transaction Details</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Reference ID</Text>
                <Text className="text-gray-700">{withdrawal._id}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Date Requested</Text>
                <Text className="text-gray-700">{formatDate(withdrawal.createdAt)}</Text>
              </View>
              {withdrawal.processedAt && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Date Processed</Text>
                  <Text className="text-gray-700">{formatDate(withdrawal.processedAt)}</Text>
                </View>
              )}
              {withdrawal.notes && (
                <View className="mt-2">
                  <Text className="text-gray-500">Notes</Text>
                  <Text className="text-gray-700 mt-1">{withdrawal.notes}</Text>
                </View>
              )}
            </View>
          </View>

          {renderMethodDetails()}

          {withdrawal.status === 'pending' && (
            <TouchableOpacity
              onPress={handleCancelWithdrawal}
              className="bg-red-500 py-3 rounded-lg mb-4"
            >
              <Text className="text-white text-center font-semibold">Cancel Withdrawal</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="border border-[#005DA0] py-3 rounded-lg mb-8"
          >
            <Text className="text-[#005DA0] text-center font-semibold">View All Withdrawals</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center p-4">
          <Feather name="alert-circle" size={50} color="#B0BEC5" />
          <Text className="text-gray-500 mt-4 text-center">
            Withdrawal not found
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mt-6 bg-[#005DA0] py-3 px-6 rounded-xl"
          >
            <Text className="text-white font-semibold">View All Withdrawals</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}