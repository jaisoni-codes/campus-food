import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';

import { RouteProp } from '@react-navigation/native';

type TrackingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tracking'>;
type TrackingScreenRouteProp = RouteProp<RootStackParamList, 'Tracking'>;

interface Props {
  navigation: TrackingScreenNavigationProp;
  route: TrackingScreenRouteProp;
}

export default function TrackingScreen({ navigation, route }: Props) {
  const { orderId } = route.params;
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success'>('processing');
  const [orderStatusIndex, setOrderStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentStatus('success');
    }, 2000); // Simulate UPI payment
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (paymentStatus === 'success') {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
          const data = await res.json();
          if (data && data.status) {
            let index = 0;
            if (data.status === 'Accepted' || data.status === 'Preparing') index = 1;
            if (data.status === 'Ready') index = 2;
            if (data.status === 'Out for Delivery') index = 3;
            if (data.status === 'Delivered') {
              index = 4;
              clearInterval(interval);
            }
            setOrderStatusIndex(index);
          }
        } catch (err) {
          console.error(err);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [paymentStatus, orderId]);

  const statuses = [
    { title: 'Order Placed', icon: 'cart-outline' },
    { title: 'Accepted & Preparing', icon: 'flame-outline' },
    { title: 'Ready', icon: 'restaurant-outline' },
    { title: 'Out for Delivery', icon: 'bicycle-outline' },
    { title: 'Delivered', icon: 'checkmark-circle-outline' }
  ];

  if (paymentStatus === 'processing') {
    return (
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#60b246" />
        <Text style={styles.processingText}>Processing UPI Payment...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
          <Ionicons name="close" size={28} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{orderId.substring(orderId.length - 6).toUpperCase()}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.statusCard}>
          <Text style={styles.etaText}>Arriving in 15-20 mins</Text>
          <View style={styles.timeline}>
            {statuses.map((status, index) => {
              const isActive = index <= orderStatusIndex;
              return (
                <View key={index} style={styles.timelineItem}>
                  <View style={[styles.timelineIconContainer, isActive && styles.timelineIconActive]}>
                    <Ionicons name={status.icon as any} size={20} color={isActive ? '#fff' : '#93959f'} />
                  </View>
                  <Text style={[styles.timelineText, isActive && styles.timelineTextActive]}>{status.title}</Text>
                  {index < statuses.length - 1 && (
                    <View style={[styles.timelineLine, isActive && index < orderStatusIndex && styles.timelineLineActive]} />
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  processingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  processingText: { marginTop: 16, fontSize: 16, fontWeight: '600', color: '#3d4152' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', elevation: 2 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#282c3f' },
  placeholder: { width: 32 },
  content: { flex: 1, padding: 16 },
  statusCard: { backgroundColor: '#fff', padding: 24, borderRadius: 16, elevation: 2 },
  etaText: { fontSize: 22, fontWeight: '800', color: '#282c3f', marginBottom: 32, textAlign: 'center' },
  timeline: { paddingLeft: 16 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, position: 'relative' },
  timelineIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f1f6', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  timelineIconActive: { backgroundColor: '#60b246' },
  timelineText: { fontSize: 16, color: '#93959f', marginLeft: 16, fontWeight: '500' },
  timelineTextActive: { color: '#282c3f', fontWeight: '700' },
  timelineLine: { position: 'absolute', left: 19, top: 40, width: 2, height: 32, backgroundColor: '#f1f1f6', zIndex: 1 },
  timelineLineActive: { backgroundColor: '#60b246' }
});
