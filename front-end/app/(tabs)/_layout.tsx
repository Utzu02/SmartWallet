import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
        setIsLoggedIn(!!userData);
        console.log("User data found: ", userData);
      } catch (error) {
        console.error("Error checking login status: ", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#888888', // Culoare subtilă pentru tab-urile inactive
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#A0A0A0', // Fundal gri foarte închis
            borderTopWidth: 0, // Elimină bordura de sus
            paddingTop: 10, // Mărește padding-ul de sus
            width: '100%', // Lățimea completă a ecranului
            height: 80, // Înălțime mai mare pentru spațiu suplimentar
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            backgroundColor: '#A0A0A0', // Fundal gri foarte închis
            elevation: 3, // Umbră pe Android
            paddingTop: 10, // Mărește padding-ul de sus
            height: 80,
            width: '100%',
          },
          default: {
            height: 80,
            paddingTop: 10, // Mărește padding-ul de sus
            width: '100%',
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: -5, // Ajustare poziție icon
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
