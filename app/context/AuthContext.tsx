import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import api from '../api/axios';

interface User {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  authenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface LoginResponse {
  token: string;
}

interface VerifyTokenResponse {
  user: User;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: false,
    user: null,
    loading: true
  });

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (authState.loading) return;

    const inAuthGroup = segments[0] === '(Auth)';
    const inMainApp = segments[0] === '(root)';

    if (!authState.authenticated && inMainApp) {
      router.replace('/sign-in');
    } else if (authState.authenticated && inAuthGroup) {
      router.replace('/home');
    }
  }, [segments, authState.authenticated, authState.loading]);

  const loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get<VerifyTokenResponse>('/verify-token');

        setAuthState({
          token,
          authenticated: true,
          user: data.user,
          loading: false
        });
        return;
      }

      setAuthState(prev => ({
        ...prev,
        token: null,
        authenticated: false,
        user: null,
        loading: false
      }));
    } catch (error) {
      console.error('Failed to load token', error);
      setAuthState(prev => ({
        ...prev,
        token: null,
        authenticated: false,
        user: null,
        loading: false
      }));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post<LoginResponse>('/login', { email, password });

      await AsyncStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      const { data: userData } = await api.get<VerifyTokenResponse>('/verify-token');

      setAuthState({
        token: data.token,
        authenticated: true,
        user: userData.user,
        loading: false
      });

      return true;
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];

      setAuthState({
        token: null,
        authenticated: false,
        user: null,
        loading: false
      });

      router.replace('/sign-in');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
    }}>
      {!authState.loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
