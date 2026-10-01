import React, { useState, useEffect } from 'react';
import { ChefHat, UtensilsCrossed, BellRing, Check, X, Plus, Edit2, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const initialOrders = [
  { id: 'ORD-001', customer: 'Alice Johnson', items: ['1x Classic Burger', '1x Fries'], total: 14.50, status: 'pending', time: '2 mins ago' },
  { id: 'ORD-002', customer: 'Bob Smith', items: ['2x Veggie Pizza'], total: 24.00, status: 'pending', time: '5 mins ago' },
  { id: 'ORD-003', customer: 'Charlie Davis', items: ['1x Caesar Salad'], total: 9.00, status: 'preparing', time: '12 mins ago' },
];

const initialMenu = [
  { id: 1, name: 'Classic Burger', price: 10.50, category: 'Mains', available: true, image: '🍔' },
  { id: 2, name: 'Fries', price: 4.00, category: 'Sides', available: true, image: '🍟' },
  { id: 3, name: 'Veggie Pizza', price: 12.00, category: 'Mains', available: true, image: '🍕' },
  { id: 4, name: 'Caesar Salad', price: 9.00, category: 'Starters', available: false, image: '🥗' },
];

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('vendorToken') || null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [restaurantName, setRestaurantName] = useState('Loading...');

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      fetchMyRestaurant();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('vendorToken', data.token);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch(err) {
      alert('Network error');
    }
  };

  const fetchMyRestaurant = async () => {
    try {
      const res = await fetch(`${API_URL}/restaurants/my-restaurant`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRestaurantName(data.name);
        setMenu(data.menu || []);
        fetchMyOrders();
      } else {
        // Token might be invalid
        setToken(null);
        localStorage.removeItem('vendorToken');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/vendor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newItem, setNewItem] = useState({ name: '', description: 'Delicious', price: '', category: 'Mains', image: '🍔' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return alert('Password must be at least 6 characters');
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ newPassword })
      });
      if(res.ok) {
        alert('Password changed successfully! You can use it next time you login.');
        setShowChangePassword(false);
        setNewPassword('');
      } else {
        alert('Failed to change password');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/restaurants/my-restaurant/menu`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: newItem.name,
          description: newItem.description,
          price: Number(newItem.price),
          category: newItem.category,
          image: newItem.image
        })
      });
      if(res.ok) {
        setShowAddMenu(false);
        setNewItem({ name: '', description: 'Delicious', price: '', category: 'Mains', image: '🍔' });
        fetchMyRestaurant(); // Refresh menu
      } else {
        alert('Failed to add item');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'Placed');
  const activeOrders = orders.filter(o => o.status === 'Accepted' || o.status === 'Preparing' || o.status === 'Ready');

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if(res.ok) {
        fetchMyOrders(); // Refetch to get latest
      } else {
        alert('Could not update status');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const toggleMenuItem = (id) => {
    setMenu(menu.map(m => m._id === id ? { ...m, available: !m.available } : m));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-orange-500 text-white p-3 rounded-2xl inline-block mb-4 shadow-inner">
              <ChefHat size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Partner Login</h2>
            <p className="text-gray-500 mt-1">Use the credentials provided by CampusFood</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white p-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors mt-2">
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 text-white p-2 rounded-xl shadow-inner border border-orange-600/50">
                <ChefHat size={24} />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight leading-none text-gray-900">{restaurantName}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Accepting Orders
                  </span>
                  <button onClick={() => setShowChangePassword(true)} className="text-[10px] text-gray-500 hover:text-gray-900 underline">Change Password</button>
                  <button onClick={() => { setToken(null); localStorage.removeItem('vendorToken'); }} className="text-[10px] text-gray-400 hover:text-red-500 underline">Logout</button>
                </div>
              </div>
            </div>
            <nav className="flex space-x-1 sm:space-x-4 bg-gray-100/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'orders'
                    ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BellRing size={16} />
                  Live Orders
                  {pendingOrders.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {pendingOrders.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'menu'
                    ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={16} />
                  Menu Manager
                </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orders' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Incoming Orders */}
            <div className="flex flex-col h-[calc(100vh-8rem)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  Incoming <span className="bg-orange-100 text-orange-700 py-0.5 px-2 rounded-full text-xs">{pendingOrders.length}</span>
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {pendingOrders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-white border border-dashed border-gray-300 rounded-2xl">
                    <Clock size={48} className="mb-4 opacity-20" />
                    <p>No new orders right now</p>
                  </div>
                ) : (
                  pendingOrders.map(order => (
                    <div key={order._id} className="bg-white rounded-2xl p-5 border-l-4 border-l-orange-500 border-y border-r border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-900">#{order._id.substring(order._id.length - 6)}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{new Date(order.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 font-medium">{order.student ? order.student.name : 'Student'}</p>
                        </div>
                        <p className="font-bold text-lg text-green-600">₹{order.totalPrice.toFixed(2)}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100">
                        <ul className="space-y-2">
                          {order.orderItems.map((item, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0"></span>
                              {item.qty}x {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                          className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <X size={18} /> Reject
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'Accepted')}
                          className="flex-[2] px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <Check size={18} /> Accept
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Active Orders */}
            <div className="flex flex-col h-[calc(100vh-8rem)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  Active Orders <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">{activeOrders.length}</span>
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {activeOrders.map(order => (
                  <div key={order._id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">#{order._id.substring(order._id.length - 6)}</h3>
                        <p className="text-sm text-gray-500">{order.student ? order.student.name : 'Student'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'Accepted' || order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                      {order.orderItems.map(item => `${item.qty}x ${item.name}`).join(', ')}
                    </p>
                    
                    {order.status === 'Accepted' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'Preparing')}
                        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'Preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order._id, 'Ready')}
                        className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} /> Mark as Ready for Pickup
                      </button>
                    )}
                    {order.status === 'Ready' && (
                      <div className="w-full py-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                        <Check size={18} /> Waiting for Rider
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Menu Categories</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your items and availability</p>
              </div>
              <button onClick={() => setShowAddMenu(!showAddMenu)} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-sm transition-colors shadow-sm">
                {showAddMenu ? <X size={18} /> : <Plus size={18} />}
                {showAddMenu ? 'Cancel' : 'Add Item'}
              </button>
            </div>
            
            <div className="p-6">
              {showAddMenu && (
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-6">
                  <h3 className="font-bold text-lg mb-4 text-orange-900">Add New Dish</h3>
                  <form onSubmit={handleAddMenuItem} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Dish Name</label>
                      <input required className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Cheese Pizza" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Price (₹)</label>
                      <input required type="number" className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={newItem.price} onChange={e=>setNewItem({...newItem, price: e.target.value})} placeholder="0" />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                      <select className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" value={newItem.category} onChange={e=>setNewItem({...newItem, category: e.target.value})}>
                        <option>Mains</option>
                        <option>Starters</option>
                        <option>Beverages</option>
                        <option>Desserts</option>
                      </select>
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Emoji</label>
                      <input className="w-full border border-gray-200 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-center" value={newItem.image} onChange={e=>setNewItem({...newItem, image: e.target.value})} />
                    </div>
                    <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors h-[42px]">
                      Save Dish
                    </button>
                  </form>
                </div>
              )}

              {menu.length === 0 && !showAddMenu && (
                <div className="text-center py-12 text-gray-400">
                  <UtensilsCrossed size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Your menu is empty.</p>
                  <p className="text-sm">Click "Add Item" to start building your menu.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menu.map(item => (
                  <div key={item._id} className="bg-white border-gray-200 p-5 rounded-2xl border hover:border-orange-300 hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-gray-200/50">
                        {item.image || '🍔'}
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md text-sm">₹{item.price.toFixed(2)}</span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-xl text-gray-900 mb-2">Change Password</h3>
            <p className="text-sm text-gray-500 mb-5">Enter your new secure password.</p>
            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" 
                  value={newPassword} 
                  onChange={e=>setNewPassword(e.target.value)} 
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowChangePassword(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gray-900 text-white font-bold hover:bg-gray-800 rounded-xl transition-colors">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
