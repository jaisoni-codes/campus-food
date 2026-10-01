import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;
type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

interface Props {
  navigation: CheckoutScreenNavigationProp;
  route: CheckoutScreenRouteProp;
}

const CAMPUS_LOCATIONS = [
  'IIT Jammu Hostel 1',
  'IIT Jammu Hostel 2',
  'IIM Jammu Block A',
  'IIM Jammu Block B',
  'Library Block',
  'Academic Block'
];

export default function CheckoutScreen({ navigation, route }: Props) {
  const { total, restaurantId, items } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId,
          items,
          totalAmount: total + 15,
          deliveryLocation: selectedLocation,
          studentDetails: { name: 'Demo Student', phone: '9999999999' }
        })
      });
      const data = await res.json();
      if(res.ok) {
        navigation.navigate('Tracking', { orderId: data._id });
      } else {
        alert('Failed to place order');
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Location</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            activeOpacity={0.7}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <View style={styles.locationInfo}>
              <Ionicons name="location" size={24} color="#fc8019" />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationType}>Campus Address</Text>
                <Text style={styles.locationText}>{selectedLocation}</Text>
              </View>
            </View>
            <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={20} color="#282c3f" />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownList}>
              {CAMPUS_LOCATIONS.map((loc, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.dropdownItem, selectedLocation === loc && styles.dropdownItemSelected]}
                  onPress={() => { setSelectedLocation(loc); setShowDropdown(false); }}
                >
                  <Text style={[styles.dropdownItemText, selectedLocation === loc && styles.dropdownItemTextSelected]}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.billContainer}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billText}>Item Total</Text>
            <Text style={styles.billText}>₹{total}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billText}>Delivery Fee (Campus)</Text>
            <Text style={styles.billText}>₹15</Text>
          </View>
          <View style={[styles.billRow, styles.billTotalRow]}>
            <Text style={styles.billTotalText}>To Pay</Text>
            <Text style={styles.billTotalText}>₹{total + 15}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payBtn}
          onPress={placeOrder}
          disabled={loading}
        >
          <Text style={styles.payBtnText}>{loading ? 'Processing...' : `Proceed to Pay ₹${total + 15}`}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', elevation: 2 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#282c3f' },
  placeholder: { width: 32 },
  content: { flex: 1, padding: 16 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#282c3f', marginBottom: 16 },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e9e9eb', padding: 16, borderRadius: 12 },
  locationInfo: { flexDirection: 'row', alignItems: 'center' },
  locationTextContainer: { marginLeft: 12 },
  locationType: { fontSize: 12, color: '#fc8019', fontWeight: '600', marginBottom: 4 },
  locationText: { fontSize: 16, color: '#3d4152', fontWeight: '500' },
  dropdownList: { borderWidth: 1, borderColor: '#e9e9eb', borderTopWidth: 0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#fafafa', marginTop: -4 },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f1f6' },
  dropdownItemSelected: { backgroundColor: '#f0f8f1' },
  dropdownItemText: { fontSize: 14, color: '#3d4152' },
  dropdownItemTextSelected: { color: '#60b246', fontWeight: '600' },
  billContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 16, elevation: 1 },
  billTitle: { fontSize: 16, fontWeight: '700', color: '#282c3f', marginBottom: 16 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  billText: { fontSize: 14, color: '#686b78' },
  billTotalRow: { borderTopWidth: 1, borderTopColor: '#f1f1f6', paddingTop: 16, marginTop: 4, marginBottom: 0 },
  billTotalText: { fontSize: 16, fontWeight: '700', color: '#282c3f' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f1f6' },
  payBtn: { backgroundColor: '#60b246', padding: 16, borderRadius: 12, alignItems: 'center' },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
