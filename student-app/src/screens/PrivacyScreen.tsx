import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Privacy'>;
};

export default function PrivacyScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>
        
        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>To process your orders, we collect your name, phone number, email address, and campus delivery location. Payment details are processed securely through our payment gateway partners (e.g., Razorpay) and are never stored on our servers.</Text>

        <Text style={styles.heading}>2. How We Use Your Data</Text>
        <Text style={styles.paragraph}>Your data is used exclusively to facilitate food delivery. Your name, phone number, and delivery address are shared with the restaurant and delivery personnel solely for fulfilling your current order.</Text>

        <Text style={styles.heading}>3. Data Security</Text>
        <Text style={styles.paragraph}>We implement industry-standard security measures to protect your personal information. We do not sell or rent your data to third parties.</Text>

        <Text style={styles.heading}>4. User Rights</Text>
        <Text style={styles.paragraph}>You have the right to request deletion of your account and personal data at any time by contacting our support team.</Text>

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
