// App.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './Navigator/appnavigator';

export default function App() {
  const Stack = createStackNavigator();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Add any additional initialization code here
        // For example, fetching resources or performing async tasks
        // ...

        // Mark the app as ready
        setAppIsReady(true);
      } catch (error) {
        console.warn('Error preparing the app:', error);
      } finally {
        // Hide the splash screen after everything is ready
        await SplashScreen.hideAsync();
      }
    }

    // Call the preparation function
    prepareApp();
  }, []); // Empty dependency array means this useEffect runs once on mount

  if (!appIsReady) {
    // You can return a loading screen or null while the app is preparing
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AppNavigator" component={AppNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
