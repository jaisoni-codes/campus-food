import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Contact'>;
};

export default function ContactScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content}>
        
        <Text style={styles.heading}>Get in Touch</Text>
        <Text style={styles.paragraph}>We'd love to hear from you. Whether you have a question about an order, want to partner with us, or just want to share feedback.</Text>

        <View style={styles.contactCard}>
          <Ionicons name="mail" size={24} color="#fc8019" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardValue}>support@campusfood.in</Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <Ionicons name="call" size={24} color="#fc8019" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Phone Support</Text>
            <Text style={styles.cardValue}>+91 9999999999</Text>
          </View>
        </View>

        <View style={styles.contactCard}>
          <Ionicons name="location" size={24} color="#fc8019" />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Office Address</Text>
            <Text style={styles.cardValue}>CampusFood HQ, Startup Incubation Center, Campus Delivery Services, Jammu, India - 181221</Text>
          </View>
        </View>

        <Text style={styles.paragraph}>Operating Hours: 10:00 AM to 11:00 PM (All days)</Text>

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
  heading: { fontSize: 22, fontWeight: '800', color: '#282c3f', marginBottom: 16 },
  paragraph: { fontSize: 15, color: '#535665', lineHeight: 22, marginBottom: 32 },
  contactCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fafafa', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#f1f1f6' },
  cardTextContainer: { marginLeft: 16, flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#3d4152', marginBottom: 4 },
  cardValue: { fontSize: 15, color: '#686b78', lineHeight: 22 }
});
