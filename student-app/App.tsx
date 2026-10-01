import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import RestaurantScreen from './src/screens/RestaurantScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import TermsScreen from './src/screens/TermsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import RefundScreen from './src/screens/RefundScreen';
import ContactScreen from './src/screens/ContactScreen';

export type RootStackParamList = {
  Home: undefined;
  Restaurant: { id: string; name: string };
  Checkout: { total: number; restaurantId: string; items: any[] };
  Tracking: { orderId: string };
  Terms: undefined;
  Privacy: undefined;
  Refund: undefined;
  Contact: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

import { View, Platform } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#e9ecef', alignItems: 'center' }}>
      <View style={{ 
        flex: 1, 
        width: '100%', 
        maxWidth: Platform.OS === 'web' ? 480 : '100%', 
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5
      }}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f8f9fa' } }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Restaurant" component={RestaurantScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Tracking" component={TrackingScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Refund" component={RefundScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
