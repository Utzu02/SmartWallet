import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import Login from './login';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
        setIsLoggedIn(!!userData);
        console.log("User data found: ", !!userData);
      } catch (error) {
        console.error("Error checking login status: ", error);
      }
    };

    checkLoginStatus();

    if (loaded) {
      console.log("Fonts loaded successfully.");
    }
  }, [loaded]);

  if (!loaded) {
    console.log("Fonts not loaded yet.");
    return null;
  }

  console.log("Rendering RootLayout with isLoggedIn: ", isLoggedIn);

  return isLoggedIn ? (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
       
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  ) : <Login></Login>;
}
