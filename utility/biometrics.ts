import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BIOMETRICS_ENABLED_KEY = 'biometrics_enabled';

export async function checkBiometricAvailability() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  return {
    available: hasHardware && isEnrolled,
    hasHardware,
    isEnrolled
  };
}

export async function isBiometricsEnabled() {
  try {
    const value = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
    return value === 'true';
  } catch (error) {
    console.error("Error checking biometrics setting:", error);
    return false;
  }
}

export async function setBiometricsEnabled(enabled: boolean) {
  try {
    await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
    return true;
  } catch (error) {
    console.error("Error saving biometrics setting:", error);
    return false;
  }
}

export async function authenticateWithBiometrics(promptMessage = "Verify your identity") {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      disableDeviceFallback: false,
      cancelLabel: "Cancel",
      biometricsSecurityLevel: 'strong',
    });
    
    return {
      success: result.success,
      error: result.success ? null : "Authentication failed",
    };
  } catch (error) {
    console.error("Biometric authentication error:", error);
    return {
      success: false,
      error: "Authentication failed",
    };
  }
}