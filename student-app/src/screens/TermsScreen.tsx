import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Terms'>;
};

export default function TermsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>
        
        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.paragraph}>Welcome to CampusFood. By accessing our platform, you agree to these Terms and Conditions. CampusFood acts as an aggregator connecting students with campus restaurants.</Text>

        <Text style={styles.heading}>2. User Responsibilities</Text>
        <Text style={styles.paragraph}>You must provide accurate information during checkout. Misuse of the platform, including fake orders or harassment of delivery personnel, will result in immediate account termination.</Text>

        <Text style={styles.heading}>3. Orders and Pricing</Text>
        <Text style={styles.paragraph}>All prices are determined by the respective restaurants. CampusFood charges a nominal delivery fee which is displayed at checkout. Restaurants reserve the right to cancel orders if items are out of stock.</Text>

        <Text style={styles.heading}>4. Limitation of Liability</Text>
        <Text style={styles.paragraph}>CampusFood is not liable for the quality of food prepared by the restaurants. Any disputes regarding food quality must be taken up with the restaurant directly, though we will assist in mediation.</Text>

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
