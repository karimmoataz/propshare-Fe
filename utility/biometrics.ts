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
    // Ensure we wait for the complete authentication process
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      disableDeviceFallback: false,
      cancelLabel: "Cancel",
      biometricsSecurityLevel: 'strong',
      fallbackLabel: "Use Password", // Add fallback option
    });
    
    console.log('Biometric auth result:', result);
    
    // Check all possible result states
    if (result.success === true) {
      return {
        success: true,
        error: null,
      };
    } else {
      // Handle different error types
      let errorMessage = "Authentication failed";
      
      if (result.error === 'user_cancel') {
        errorMessage = "Authentication was cancelled";
      } else if (result.error === 'user_fallback') {
        errorMessage = "User chose fallback authentication";
      } else if (result.error === 'system_cancel') {
        errorMessage = "Authentication was cancelled by system";
      } else if (result.error === 'authentication_failed') {
        errorMessage = "Authentication failed - please try again";
      } else if (result.error === 'not_available') {
        errorMessage = "Biometric authentication is not available";
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error("Biometric authentication error:", error);
    return {
      success: false,
      error: "Authentication failed due to an unexpected error",
    };
  }
}