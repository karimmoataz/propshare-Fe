import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {View,Text,Pressable,TextInput,ScrollView,Modal,TouchableOpacity,} from "react-native";
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from "expo-router";

const withdrawalMethods = [
  {
    title: "Local Bank Transfer",
    description: "Usually up to 1 working day to withdraw",
  },
  {
    title: "E-Wallet",
    description: "Usually up to 1 working day to withdraw",
  },
  {
    title: "InstaPay",
    description: "Couple of hours to transfer",
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
  const [ammount, setAmount] = useState("");
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const { isRTL } = useLanguage();
  const router = useRouter();

  const getHeaderTitle = () => {
    switch (selectedMethod) {
      case "Local Bank Transfer":
        return "Bank Information";
      case "E-Wallet":
        return "E-Wallet Information";
      case "InstaPay":
        return "InstaPay Information";
      default:
        return "Choose Withdrawal Method";
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-[#005DA0] pt-12 pb-4 px-4">
        <View className="flex-row items-center text-white text-xl font-semibold pt-2">
          <TouchableOpacity 
            onPress={
              selectedMethod ? () => setSelectedMethod(null) : () => router.back()
            } 
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
          <Text className="text-gray-700 text-xl mb-4 font-bold">Amount you want to withdraw</Text>
          <TextInput
                className="border-[2px] border-gray-100 placeholder:text-gray-500 rounded-lg px-4 py-3 mb-4"
                placeholder="Enter Amount"
                keyboardType="phone-pad"
                autoCapitalize="none"
                value={ammount}
                onChangeText={setAmount}
              />
            <Text className="text-gray-700 mb-4">Please select a withdrawal method.</Text>
          {withdrawalMethods.map((method, index) => (
            <View key={index} className="mb-6">
              <Pressable
                onPress={() => setSelectedMethod(method.title as "Local Bank Transfer" | "E-Wallet" | "InstaPay")}
                className="border-[2px] border-gray-100 p-5 rounded-xl"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="font-semibold text-base text-[#828282]">
                      Fees Apply
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
        <View className="p-4 space-y-9">
          <Text className="text-gray-700 text-xl">
            In case you forgot any required details, contact your bank for
            assistance
          </Text>

          <View>
            <Text className="text-black font-bold mt-5 mb-1">Bank Name</Text>
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
              <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
                <View className="bg-white p-6 rounded-xl w-4/5 max-h-[80%]">
                  <ScrollView>
                    {egyptianBanks.map((bank, index) => (
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
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>

          <View>
            <Text className="text-black font-bold mt-5 mb-1">Receiver Name</Text>
            <TextInput
              placeholder="Enter name of bank account holder"
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
            />
          </View>

          <View>
            <Text className="text-black font-bold mt-5 mb-1">IBAN</Text>
            <TextInput
              placeholder="Example: EG210900020202kddosjf"
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
            />
          </View>

          <Pressable
            onPress={() => setSelectedMethod(null)}
            className="mt-4 bg-[#005DA0] py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">Go Back</Text>
          </Pressable>
        </View>
      )}

      {selectedMethod === "E-Wallet" && (
        <View className="p-4 space-y-9">
          <Text className="text-gray-700 text-xl">
            Please provide your e-wallet information for withdrawal.
          </Text>

          <View>
            <Text className="text-black font-bold mt-5 mb-1">
              E-Wallet Provider
            </Text>
            <TextInput
              placeholder="Enter your e-wallet provider"
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
            />
          </View>

          <View>
            <Text className="text-black font-bold mt-5 mb-1">Account Number</Text>
            <TextInput
              placeholder="Enter your e-wallet account number"
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
            />
          </View>

          <Pressable
            onPress={() => setSelectedMethod(null)}
            className="mt-4 bg-[#005DA0] py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">Go Back</Text>
          </Pressable>
        </View>
      )}

      {selectedMethod === "InstaPay" && (
        <View className="p-4 space-y-9">
          <Text className="text-gray-700 text-xl">
            Please provide your InstaPay information for withdrawal.
          </Text>

          <View>
            <Text className="text-black font-bold mt-5 mb-1">InstaPay ID</Text>
            <TextInput
              placeholder="Enter your InstaPay ID"
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
            />
          </View>

          <View>
            <Text className="text-black font-bold mt-5 mb-1">
              Registered Mobile Number
            </Text>
            <TextInput
              placeholder="Enter your registered mobile number"
              placeholderTextColor="#828282"
              className="border border-gray-100 rounded-xl p-3"
            />
          </View>

          <Pressable
            onPress={() => setSelectedMethod(null)}
            className="mt-4 bg-[#005DA0] py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">Go Back</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
