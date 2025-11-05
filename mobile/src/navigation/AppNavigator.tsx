import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// Main App Navigation
import TabNavigator from "./TabNavigator";

// Loading Screen
import LoadingScreen from "../screens/LoadingScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  Loading: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
        cardOverlayEnabled: true,
        gestureEnabled: true,
      }}
    >
      {user ? (
        // Kullanıcı giriş yapmış - Ana uygulama
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{
            animationTypeForReplace: "push",
          }}
        />
      ) : (
        // Kullanıcı giriş yapmamış - Auth ekranları
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animationTypeForReplace: "pop",
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              presentation: "modal",
              gestureDirection: "vertical",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
