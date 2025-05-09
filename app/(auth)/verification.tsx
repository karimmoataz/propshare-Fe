import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { TextInput } from "react-native"; // Changed from gesture-handler to standard TextInput
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import I18n from "../../lib/i18n";
import { useLanguage } from '../../context/LanguageContext';
import api from "../api/axios";

// Define types
type VerificationStatus = "not_submitted" | "pending" | "verified" | "rejected" | null;
type DocumentType = 'frontId' | 'backId' | 'selfie';

interface ApiResponse {
  status: string;
  data?: {
    status: VerificationStatus;
    message?: string;
  };
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Verification: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(null);
  const [nationalId, setNationalId] = useState<string>("");
  const [frontId, setFrontId] = useState<string | null>(null);
  const [backId, setBackId] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const { locale, isRTL } = useLanguage();

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await api.get("/verify-id/status", {
        headers: { Authorization: token },
      });

      if (response.data.status !== 'not_submitted') {
        setVerificationStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prioritize taking a photo with camera instead of picking from gallery
  const takePhoto = async (type: DocumentType): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          I18n.t('verification.alerts.cameraPermission'),
          I18n.t('verification.alerts.cameraPermissionText')
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: type === 'selfie' ? [1, 1] : [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0] && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        
        switch (type) {
          case 'frontId':
            setFrontId(base64Image);
            break;
          case 'backId':
            setBackId(base64Image);
            break;
          case 'selfie':
            setSelfie(base64Image);
            break;
        }
      }
    } catch (error) {
      console.error(`Error taking ${type} photo:`, error);
      Alert.alert("Error", `Failed to take photo. Please try again.`);
    }
  };

  // Kept for backup option
//   const pickImage = async (type: DocumentType): Promise<void> => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
//       if (!permissionResult.granted) {
//         Alert.alert("Permission Required", "You need to allow access to your photo library to upload documents.");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: type === 'selfie' ? [1, 1] : [4, 3],
//         quality: 0.5,
//         base64: true,
//       });

//       if (!result.canceled && result.assets && result.assets[0] && result.assets[0].base64) {
//         const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        
//         switch (type) {
//           case 'frontId':
//             setFrontId(base64Image);
//             break;
//           case 'backId':
//             setBackId(base64Image);
//             break;
//           case 'selfie':
//             setSelfie(base64Image);
//             break;
//         }
//       }
//     } catch (error) {
//       console.error(`Error picking ${type} image:`, error);
//       Alert.alert("Error", `Failed to pick image. Please try again.`);
//     }
//   };

  const submitVerification = async (): Promise<void> => {
    if (!nationalId || !frontId || !backId || !selfie) {
      Alert.alert(
        I18n.t('verification.alerts.missingInfo'),
        I18n.t('verification.alerts.missingInfoText')
      );
      return;
    }

    if (nationalId.length < 10) {
      Alert.alert("Invalid National ID", "Please enter a valid national ID number.");
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        router.push("/");
        return;
      }

      const response = await api.post(
        "/verify-id/upload-base64",
        {
          nationalId,
          frontId,
          backId,
          selfie,
        },
        {
          headers: { 
            Authorization: token,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.status === 200) {
        Alert.alert(
        I18n.t('verification.alerts.success'),
        I18n.t('verification.alerts.successText'),
          [{ text: "OK", onPress: () => router.push("/profile") }]
        );
      }
    } catch (error: any) {
      console.error("Error submitting verification:", error);
      Alert.alert(
        I18n.t('verification.alerts.error'),
        error.response?.data?.message || I18n.t('verification.alerts.errorText')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center bg-[#f7f7fa]">
          <ActivityIndicator size="large" color="#005DA0" />
        </View>
      </GestureHandlerRootView>
    );
  }

  const renderStatusView = (): React.ReactNode => {
    if (!verificationStatus) return null;

    const statusConfig = {
      pending: {
        color: "#ffc107",
        icon: "clockcircleo" as const,
        message: I18n.t('verification.statusMessages.pending')
      },
      verified: {
        color: "#53D258",
        icon: "checkcircleo" as const,
        message: I18n.t('verification.statusMessages.verified')
      },
      rejected: {
        color: "#E25C5C",
        icon: "exclamationcircleo" as const,
        message: I18n.t('verification.statusMessages.rejected')
      }
    };

    const { color, icon, message } = statusConfig[verificationStatus as "pending" | "verified" | "rejected"] || {};

    return (
      <View className="bg-white p-4 shadow-sm border-[1px] border-[#e9ecef] mb-4 rounded-xl">
        <Text className="text-xl font-bold mb-2">{I18n.t('verification.status')}</Text>
        <View className="flex-row items-center mb-2">
          <AntDesign name={icon} size={24} color={color} />
          <Text className="text-lg ml-2 font-semibold" style={{ color: color }}>
            {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}
          </Text>
        </View>
        <Text className="text-gray-600">{I18n.t(`verification.statuses.${verificationStatus}`)}</Text>
        
        {verificationStatus === "rejected" && (
          <TouchableOpacity 
            className="bg-[#005DA0] py-3 rounded-lg mt-4 items-center"
            onPress={() => setVerificationStatus(null)}
          >
            <Text className="text-white font-bold">{I18n.t('verification.resubmit')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render document capture UI with camera option prioritized
  const renderDocumentCapture = (
    type: DocumentType, 
    setFunction: React.Dispatch<React.SetStateAction<string | null>>, 
    currentValue: string | null
  ): React.ReactNode => {
    const titleKey = `verification.${type}`;
    
    return (
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">{I18n.t(titleKey)}</Text>
        {currentValue ? (
          <View className="relative">
            <Image source={{ uri: currentValue }} className="h-48 w-full rounded-lg" resizeMode="cover" />
            <TouchableOpacity
              className="absolute top-2 end-2 bg-white rounded-full p-1"
              onPress={() => setFunction(null)}
            >
              <AntDesign name="close" size={20} color="#E25C5C" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-around" style={{ gap: 8 }}>
            <TouchableOpacity
              className="bg-[#005DA0] p-4 rounded-lg flex-1 items-center"
              onPress={() => takePhoto(type)}
            >
              <MaterialIcons name="camera-alt" size={28} color="white" />
              <Text className="text-white mt-2 font-bold">
                {I18n.t('verification.takePhoto')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

   return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView 
        className="bg-[#f5f6f9] flex-1 py-14 px-5"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign 
              name={isRTL ? "arrowright" : "arrowleft"} 
              size={24} 
              color="#005DA0" 
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold ms-4">
            {I18n.t('verification.title')}
          </Text>
        </View>

        {renderStatusView()}

        {!verificationStatus && (
          <>
            <View className="bg-[#005DA0] p-4 mb-4 rounded-xl">
              <Text className="text-lg font-bold text-white mb-2">
                {I18n.t('verification.whyTitle')}
              </Text>
              <Text className="text-white">
                {I18n.t('verification.whyText')}
              </Text>
            </View>

            <View className="bg-white p-4 shadow-sm border-[1px] border-[#e9ecef] mb-4 rounded-xl">
              <Text className="text-xl font-bold mb-4">
                {I18n.t('verification.uploadTitle')}
              </Text>
              
              <View className="mb-4">
                <Text className="text-gray-700 mb-2">
                  {I18n.t('verification.nationalId')}
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                  placeholder={I18n.t('verification.nationalIdPlaceholder')}
                  value={nationalId}
                  onChangeText={setNationalId}
                  keyboardType="number-pad"
                />
              </View>

              {renderDocumentCapture('frontId', setFrontId, frontId)}
              {renderDocumentCapture('backId', setBackId, backId)}
              {renderDocumentCapture('selfie', setSelfie, selfie)}

              <TouchableOpacity
                className="bg-[#005DA0] py-4 rounded-lg items-center"
                onPress={submitVerification}
                disabled={submitting || !nationalId || !frontId || !backId || !selfie}
                style={{ opacity: submitting || !nationalId || !frontId || !backId || !selfie ? 0.7 : 1 }}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    {I18n.t('verification.submit')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="bg-white p-4 mb-24 shadow-sm border-[1px] border-[#e9ecef] rounded-xl">
              <Text className="text-xl font-bold mb-2">
                {I18n.t('verification.notesTitle')}
              </Text>
              {[1, 2, 3].map((note) => (
                <View key={note} className="flex-row items-start mb-2">
                  <AntDesign 
                    name="checkcircle" 
                    size={16} 
                    color="#53D258" 
                    style={{ marginTop: 2 }} 
                  />
                  <Text className="text-gray-700 ms-2">
                    {I18n.t(`verification.note${note}`)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Verification;