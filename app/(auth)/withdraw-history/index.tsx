import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from '../../../context/LanguageContext';
import { useRouter } from "expo-router";
import api from "../../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Withdrawal {
  _id: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled' | string;
  createdAt: string;
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusColor = (status: string) => {
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

export default function WithdrawalHistoryScreen() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isRTL } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const fetchWithdrawalHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert("Authentication Error", "Please login to continue");
        router.push("/sign-in");
        return;
      }

      const response = await api.get(`/withdrawal/history`, {
        headers: { Authorization: token }
      });

      if (response.data && response.data.withdrawals) {
        setWithdrawals(response.data.withdrawals);
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      Alert.alert("Error", "Failed to fetch withdrawal history. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWithdrawalHistory();
  };

  const handleCancelWithdrawal = async (withdrawalId: string) => {
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
                  `/withdrawal/${withdrawalId}/cancel`,
                  {},
                  { headers: { Authorization: token } }
                );
                
                if (response.data) {
                  Alert.alert("Success", "Withdrawal cancelled successfully");
                  // Refresh the list
                  fetchWithdrawalHistory();
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

  const renderItem = ({ item }: { item: Withdrawal }) => (
    <View className="bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-100">
      <Pressable onPress={() => router.push(`/withdraw-history/${item._id}`)}>
        <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-600 font-medium">
          {formatDate(item.createdAt)}
        </Text>
        <View 
          style={{ 
            backgroundColor: getStatusColor(item.status) + '20', // Add 20% opacity
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: getStatusColor(item.status), fontWeight: '600', textTransform: 'capitalize' }}>
            {item.status}
          </Text>
        </View>
      </View>
      </Pressable>
      
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-700 font-bold text-lg">
          EGP {item.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text className="text-gray-600">
          {item.method}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-xs">Reference ID</Text>
          <Text className="text-gray-700">{item._id}</Text>
        </View>
        
        {item.status === 'pending' && (
          <TouchableOpacity
            onPress={() => handleCancelWithdrawal(item._id)}
            className="bg-red-50 py-2 px-4 rounded-lg"
          >
            <Text className="text-red-600 font-medium">Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
            Withdrawal History
          </Text>
        </View>
      </View>

      <View className="p-4 flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#005DA0" />
          </View>
        ) : withdrawals.length > 0 ? (
          <FlatList
            data={withdrawals}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Feather name="inbox" size={50} color="#B0BEC5" />
            <Text className="text-gray-500 mt-4 text-center">
              No withdrawal history found
            </Text>
            <Text className="text-gray-400 mt-2 text-center">
              Make your first withdrawal to see it here
            </Text>
            <Pressable
              onPress={() => router.push("/withdraw")}
              className="mt-6 bg-[#005DA0] py-3 px-6 rounded-xl"
            >
              <Text className="text-white font-semibold">Make a Withdrawal</Text>
            </Pressable>
          </View>
        )}
      </View>

      {!loading && withdrawals.length > 0 && (
        <View className="p-4">
          <Pressable
            onPress={() => router.push("/withdraw")}
            className="bg-[#005DA0] py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">Make a New Withdrawal</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}