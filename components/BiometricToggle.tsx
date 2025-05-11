import { View, Text, Pressable, LayoutAnimation, Platform, Switch } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { checkBiometricAvailability, isBiometricsEnabled, setBiometricsEnabled } from '../utility/biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from "../lib/i18n";
import { useLanguage } from '../context/LanguageContext';

const BiometricToggle = () => {
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'biometrics'>('biometrics');
  
  useEffect(() => {
    const checkBiometrics = async () => {
      // Check if device supports biometrics
      const biometricStatus = await checkBiometricAvailability();
      setBiometricSupported(biometricStatus.available);
      
      // Determine biometric type based on device
      if (Platform.OS === 'ios') {
        // On iOS, we could differentiate between Face ID and Touch ID with more sophisticated detection
        // For now, use a simplistic approach based on device model
        const deviceModel = await AsyncStorage.getItem('deviceModel');
        setBiometricType(deviceModel?.includes('iPhone X') ? 'face' : 'fingerprint');
      } else {
        // Android primarily uses fingerprint
        setBiometricType('fingerprint');
      }
      
      // Check if user has enabled biometrics
      const enabled = await isBiometricsEnabled();
      setBiometricEnabled(enabled);
    };
    
    checkBiometrics();
  }, []);

  const getBiometricLabel = () => {
    switch (biometricType) {
      case 'face':
        return I18n.t('faceId');
      case 'fingerprint':
        return I18n.t('fingerPrint');
      default:
        return 'Biometric Login';
    }
  };

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'face':
        return <MaterialCommunityIcons name="face-recognition" size={24} color="#005DA0" />;
      case 'fingerprint':
        return <Ionicons name="finger-print" size={24} color="#005DA0" />;
      default:
        return <Ionicons name="shield-checkmark" size={24} color="#005DA0" />;
    }
  };

  const toggleBiometrics = async (value: boolean) => {
    // If trying to enable biometrics but device doesn't support it
    if (value && !biometricSupported) {
      alert("Your device doesn't support biometric authentication or you haven't set it up in your device settings.");
      return;
    }
    
    const success = await setBiometricsEnabled(value);
    if (success) {
      setBiometricEnabled(value);
    } else {
      alert("Failed to update biometric settings.");
    }
  };

  return (
    <View className="pt-4 pb-2">
        <Pressable
        className="flex-row items-center justify-between"
        >
        <View className="flex-row items-center">
            <View className="bg-[#e6f0f7] p-2 rounded-lg me-3">
            {getBiometricIcon()}
            </View>
            <View>
            <Text className="text-[16px] font-bold text-[#242424]">
                {getBiometricLabel()}
            </Text>
            <Text className="text-[14px] text-gray-500">
                {biometricEnabled 
                ? `${I18n.t('UnlockAppWithYour')} ${biometricType === 'face' ? I18n.t('faceId') : I18n.t('fingerPrint')}` 
                : `${I18n.t('use')} ${biometricType === 'face' ? I18n.t('faceId') :  I18n.t('fingerPrint')} ${I18n.t('toLogIn')}`}
            </Text>
            </View>
        </View>
        <Switch
            value={biometricEnabled}
            onValueChange={toggleBiometrics}
            trackColor={{ false: "#d1d5db", true: "#bde7f9" }}
            thumbColor={biometricEnabled ? "#005DA0" : "#f4f3f4"}
            disabled={!biometricSupported}
        />
        </Pressable>
    </View>
  );
};

export default BiometricToggle;