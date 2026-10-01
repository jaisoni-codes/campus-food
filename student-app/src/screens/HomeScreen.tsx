import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const RESTAURANTS = [
  { id: '1', name: 'Campus Canteen', rating: 4.5, time: '15-20 min', category: 'North Indian', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60' },
  { id: '2', name: 'Maggi Hotspot', rating: 4.8, time: '10-15 min', category: 'Snacks, Beverages', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=60' },
  { id: '3', name: 'Night Owls Cafe', rating: 4.2, time: '30-40 min', category: 'Burgers, Pizza', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=60' },
];

export default function HomeScreen({ navigation }: Props) {
  const [restaurants, setRestaurants] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.locationLabel}>Delivering to</Text>
          <Text style={styles.locationValue}>Hostel 1, Campus <Ionicons name="chevron-down" size={16}/></Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons name="person-circle-outline" size={36} color="#fc8019" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <Text style={styles.searchText}>Restaurant name or a dish...</Text>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Restaurant', { id: item._id, name: item.name })}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=60' }} 
              style={styles.image} 
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>Delivery: ₹{item.deliveryFee}</Text>
              <View style={styles.meta}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#fff" />
                  <Text style={styles.ratingText}>New</Text>
                </View>
                <Text style={styles.time}>15-20 min</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Text style={styles.footerBrand}>CampusFood</Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity onPress={() => (navigation as any).navigate('Terms')}><Text style={styles.footerLink}>Terms</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => (navigation as any).navigate('Privacy')}><Text style={styles.footerLink}>Privacy</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => (navigation as any).navigate('Refund')}><Text style={styles.footerLink}>Refunds</Text></TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity onPress={() => (navigation as any).navigate('Contact')}><Text style={styles.footerLink}>Contact</Text></TouchableOpacity>
            </View>
            <Text style={styles.copyright}>© 2026 Campus Delivery Services.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  locationLabel: { fontSize: 12, color: '#fc8019', fontWeight: '700', textTransform: 'uppercase' },
  locationValue: { fontSize: 16, fontWeight: '700', color: '#3d4152', marginTop: 2 },
  profileBtn: { padding: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, padding: 12, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  searchIcon: { marginRight: 8 },
  searchText: { color: '#93959f', fontSize: 14 },
  list: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  image: { width: '100%', height: 160 },
  cardContent: { padding: 16 },
  name: { fontSize: 18, fontWeight: '700', color: '#282c3f', marginBottom: 4 },
  category: { fontSize: 14, color: '#686b78', marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#48c479', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginRight: 12 },
  ratingText: { color: '#fff', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  time: { fontSize: 13, color: '#535665', fontWeight: '500' },
  footer: { padding: 32, alignItems: 'center', justifyContent: 'center', marginTop: 16, backgroundColor: '#f0f0f5', borderRadius: 16 },
  footerBrand: { fontSize: 24, fontWeight: '900', color: '#93959f', letterSpacing: -1, marginBottom: 16 },
  footerLinks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 },
  footerLink: { color: '#535665', fontSize: 12, fontWeight: '600' },
  footerDot: { color: '#93959f', fontSize: 12, marginHorizontal: 8 },
  copyright: { fontSize: 11, color: '#93959f', fontWeight: '500' }
});
