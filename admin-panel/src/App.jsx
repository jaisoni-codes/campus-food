import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Store, TrendingUp, Settings, Bell, Activity, Search, Plus, IndianRupee, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ commissionRate: 0, deliveryFee: 0 });
  const [newRest, setNewRest] = useState({ name: '', contactNumber: '', commissionRate: '', deliveryFee: '' });
  
  // View State: 'dashboard' or 'add'
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API_URL}/restaurants`);
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error('Failed to fetch', err);
    }
  };

  const totalOrders = restaurants.reduce((sum, r) => sum + (r.orders || 0), 0);
  const totalRevenue = restaurants.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const platformProfit = restaurants.reduce((sum, r) => sum + ((r.revenue || 0) * ((r.commissionRate || 0) / 100)), 0);

  const handleEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setEditForm({ commissionRate: restaurant.commissionRate || 0, deliveryFee: restaurant.deliveryFee || 0 });
  };

  const handleSave = async (id) => {
    try {
      setRestaurants(restaurants.map(r => 
        r._id === id ? { ...r, commissionRate: Number(editForm.commissionRate), deliveryFee: Number(editForm.deliveryFee) } : r
      ));
      setEditingId(null);
    } catch(err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
      try {
        const res = await fetch(`${API_URL}/restaurants/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchRestaurants();
        } else {
          alert('Failed to delete restaurant');
        }
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRest.name,
          contactNumber: newRest.contactNumber,
          commissionRate: Number(newRest.commissionRate),
          deliveryFee: Number(newRest.deliveryFee),
          location: { address: 'Campus', proximityToCampus: 'Near Gate' }
        })
      });
      if(res.ok) {
        const data = await res.json();
        setNewRest({ name: '', contactNumber: '', commissionRate: '', deliveryFee: '' });
        fetchRestaurants();
        alert(`Restaurant Added Successfully!\n\nGive these login details to the Vendor:\nEmail: ${data.credentials.email}\nPassword: ${data.credentials.password}\n\n(Save these, they won't be shown again!)`);
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 text-white p-1.5 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CampusFood</span>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${currentView === 'dashboard' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Activity size={20} /> Overview
          </button>
          <button onClick={() => setCurrentView('add')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${currentView === 'add' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Plus size={20} /> Onboard Restaurant
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold">{currentView === 'dashboard' ? 'Master Overview' : 'Partner Onboarding'}</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {currentView === 'add' && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Partner Registration</h2>
                <p className="text-gray-500 text-sm mt-1">Enter restaurant details below. This screen is safe to show to vendors.</p>
              </div>
              <form onSubmit={handleAddRestaurant} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                  <input className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" value={newRest.name} onChange={e=>setNewRest({...newRest, name: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" value={newRest.contactNumber} onChange={e=>setNewRest({...newRest, contactNumber: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                    <input type="number" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" value={newRest.commissionRate} onChange={e=>setNewRest({...newRest, commissionRate: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                    <input type="number" className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-gray-50" value={newRest.deliveryFee} onChange={e=>setNewRest({...newRest, deliveryFee: e.target.value})} required />
                  </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors mt-4">
                  Register Partner
                </button>
              </form>
            </div>
          )}

          {currentView === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Activity size={24} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Platform Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <IndianRupee size={24} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-90 z-0" />
              <div className="relative z-10 text-white">
                <p className="text-sm font-medium text-red-100 mb-1">Net Profit (Commissions)</p>
                <p className="text-3xl font-bold">₹{platformProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white relative z-10 backdrop-blur-sm">
                <LayoutDashboard size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Live Restaurants (Database)</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Restaurant</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Commission (%)</th>
                    <th className="px-6 py-4 text-right">Delivery Fee (₹)</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {restaurants.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-8 text-gray-500">No restaurants added yet. Database is empty!</td></tr>
                  )}
                  {restaurants.map(r => (
                    <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl shadow-inner">
                            🏪
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{r.name}</p>
                            <p className="text-xs text-gray-500">{r.contactNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        {editingId === r._id ? (
                          <input type="number" className="w-20 px-2 py-1 text-right border rounded outline-none" value={editForm.commissionRate} onChange={(e) => setEditForm({...editForm, commissionRate: e.target.value})} />
                        ) : (
                          <span className="font-medium text-gray-900">{r.commissionRate || 0}%</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        {editingId === r._id ? (
                          <input type="number" className="w-20 px-2 py-1 text-right border rounded outline-none" value={editForm.deliveryFee} onChange={(e) => setEditForm({...editForm, deliveryFee: e.target.value})} />
                        ) : (
                          <span className="font-medium text-gray-900">₹{r.deliveryFee || 0}</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        {editingId === r._id ? (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleSave(r._id)} className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-medium">Save</button>
                            <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-1">
                            <button onClick={() => handleEdit(r)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg" title="Edit Commission/Fees">
                              <Settings size={18} />
                            </button>
                            <button onClick={() => handleDelete(r._id, r.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete Restaurant">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
