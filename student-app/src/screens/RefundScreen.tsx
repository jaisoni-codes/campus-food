import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Refund'>;
};

export default function RefundScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancellation & Refund</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>
        
        <Text style={styles.heading}>1. Order Cancellation by Customer</Text>
        <Text style={styles.paragraph}>You can cancel an order for a full refund ONLY before the restaurant accepts the order (usually within 1-2 minutes). Once the restaurant begins preparing the food, cancellations are not permitted, and no refunds will be issued.</Text>

        <Text style={styles.heading}>2. Order Cancellation by Restaurant</Text>
        <Text style={styles.paragraph}>If a restaurant cancels your order due to unavailability of items or unforeseen circumstances, a 100% refund will be automatically initiated to your original payment method.</Text>

        <Text style={styles.heading}>3. Refund Processing Time</Text>
        <Text style={styles.paragraph}>Approved refunds are processed immediately on our end. However, depending on your bank and the payment gateway (Razorpay), it may take 5-7 business days for the amount to reflect in your bank account.</Text>

        <Text style={styles.heading}>4. Failed Transactions</Text>
        <Text style={styles.paragraph}>If money is deducted from your account but the order is not placed, the payment gateway will auto-refund the amount within 24-48 hours.</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f1f6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#282c3f' },
  placeholder: { width: 32 },
  content: { padding: 20 },
  lastUpdated: { fontSize: 13, color: '#686b78', marginBottom: 20 },
  heading: { fontSize: 16, fontWeight: '700', color: '#282c3f', marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 14, color: '#535665', lineHeight: 22 }
});
