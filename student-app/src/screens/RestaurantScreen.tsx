import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { Ionicons } from '@expo/vector-icons';

type RestaurantScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Restaurant'>;
type RestaurantScreenRouteProp = RouteProp<RootStackParamList, 'Restaurant'>;

interface Props {
  navigation: RestaurantScreenNavigationProp;
  route: RestaurantScreenRouteProp;
}

const MENU = [
  { id: 'm1', name: 'Margherita Pizza', price: 199, description: 'Classic cheese and tomato pizza', isVeg: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80' },
  { id: 'm2', name: 'Chicken Burger', price: 149, description: 'Crispy chicken patty with lettuce and mayo', isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
  { id: 'm3', name: 'Cold Coffee', price: 99, description: 'Thick cold coffee with ice cream', isVeg: true, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80' },
  { id: 'm4', name: 'Paneer Tikka Roll', price: 129, description: 'Spicy paneer wrapped in paratha', isVeg: true, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80' },
];

export default function RestaurantScreen({ navigation, route }: Props) {
  const { id, name } = route.params;
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => {
        if(data && data.menu) setMenu(data.menu);
      })
      .catch(console.error);
  }, [id]);

  const addToCart = (itemId: string) => setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  const removeFromCart = (itemId: string) => setCart(prev => {
    const newCart = { ...prev };
    if (newCart[itemId] > 1) newCart[itemId]--;
    else delete newCart[itemId];
    return newCart;
  });

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.keys(cart).reduce((total, itemId) => {
    const item = menu.find(m => m._id === itemId);
    return total + (item ? item.price * cart[itemId] : 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={menu}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <View style={styles.itemDetails}>
              <View style={[styles.vegBadge, { borderColor: item.category === 'Beverages' ? '#0f8a65' : '#e43b4f' }]}>
                <View style={[styles.vegDot, { backgroundColor: item.category === 'Beverages' ? '#0f8a65' : '#e43b4f' }]} />
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.category} • {item.description || 'Delicious dish'}</Text>
            </View>
            <View style={styles.itemImageContainer}>
              <View style={[styles.itemImage, { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 32 }}>{item.image || '🍔'}</Text>
              </View>
              {cart[item._id] ? (
                <View style={styles.cartControl}>
                  <TouchableOpacity style={styles.controlBtn} onPress={() => removeFromCart(item._id)}>
                    <Text style={styles.controlText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.controlCount}>{cart[item._id]}</Text>
                  <TouchableOpacity style={styles.controlBtn} onPress={() => addToCart(item._id)}>
                    <Text style={styles.controlText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item._id)}>
                  <Text style={styles.addBtnText}>ADD</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {cartItemsCount > 0 && (
        <View style={styles.bottomCart}>
          <View>
            <Text style={styles.cartItemsText}>{cartItemsCount} ITEM{cartItemsCount > 1 ? 'S' : ''}</Text>
            <Text style={styles.cartTotalText}>₹{cartTotal}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={() => {
              const orderItems = Object.keys(cart).map(itemId => {
                const menuItem = menu.find(m => m._id === itemId);
                return {
                  menuItem: itemId,
                  name: menuItem?.name,
                  quantity: cart[itemId],
                  price: menuItem?.price
                };
              });
              navigation.navigate('Checkout', { 
                total: cartTotal, 
                restaurantId: id, 
                items: orderItems 
              });
            }}
          >
            <Text style={styles.checkoutText}>Next</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f1f6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#282c3f' },
  placeholder: { width: 32 },
  list: { padding: 16, paddingBottom: 100 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: '#f1f1f6' },
  itemDetails: { flex: 1, paddingRight: 16 },
  vegBadge: { width: 12, height: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 6, borderRadius: 2 },
  vegDot: { width: 6, height: 6, borderRadius: 3 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#3d4152', marginBottom: 4 },
  itemPrice: { fontSize: 14, color: '#3d4152', marginBottom: 8 },
  itemDesc: { fontSize: 13, color: '#686b78', lineHeight: 18 },
  itemImageContainer: { width: 118, height: 120, alignItems: 'center' },
  itemImage: { width: 118, height: 96, borderRadius: 12 },
  addBtn: { position: 'absolute', bottom: 8, backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#e9e9eb' },
  addBtnText: { color: '#60b246', fontWeight: '800', fontSize: 13 },
  cartControl: { position: 'absolute', bottom: 8, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#e9e9eb', overflow: 'hidden' },
  controlBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  controlText: { color: '#60b246', fontWeight: '800', fontSize: 16 },
  controlCount: { color: '#60b246', fontWeight: '800', fontSize: 13, minWidth: 20, textAlign: 'center' },
  bottomCart: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#60b246', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 32 },
  cartItemsText: { color: '#fff', fontSize: 12, fontWeight: '600', opacity: 0.8 },
  cartTotalText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
