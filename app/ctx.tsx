import React from "react";
import { useStorageState } from "./useStorageState";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = React.createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  React.useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setSession(token);
        }
      } catch (error) {
        console.error("Failed to load auth token", error);
      }
    };

    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: (token: string) => {
          setSession(token);
        },
        signOut: async () => {
          // Clear both the context session and AsyncStorage
          setSession(null);
          try {
            await AsyncStorage.removeItem("token");
          } catch (error) {
            console.error("Error removing token", error);
          }
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;