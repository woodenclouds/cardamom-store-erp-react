import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  DollarSign,
  MapPin,
  Tag,
  Save,
  Plus,
  Edit2,
  Trash2,
  Building2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import ModalForm from '../components/ModalForm';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: 'Admin User',
    email: 'admin@wostore.com',
    phone: '+91 9876543210',
    storeName: 'Cardamom Processing Center',
    address: 'Idukki, Kerala, India',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Drying price state
  const [dryingPrice, setDryingPrice] = useState({
    pricePerKg: 10,
    currency: 'INR',
  });

  // Places state
  const [places, setPlaces] = useState([
    { id: 1, name: 'Idukki', active: true },
    { id: 2, name: 'Munnar', active: true },
    { id: 3, name: 'Thekkady', active: true },
    { id: 4, name: 'Kumily', active: true },
  ]);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [placeFormData, setPlaceFormData] = useState({ name: '' });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'pricing', label: 'Drying Price', icon: DollarSign },
    { id: 'places', label: 'Places', icon: MapPin },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'general', label: 'General', icon: Building2 },
  ];

  const handleProfileSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const handlePricingSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Drying price updated successfully!');
    }, 1000);
  };

  const handlePlaceSubmit = (e) => {
    e.preventDefault();
    if (editingPlace) {
      setPlaces(places.map(p => p.id === editingPlace.id ? { ...p, ...placeFormData } : p));
    } else {
      setPlaces([...places, { id: Date.now(), ...placeFormData, active: true }]);
    }
    setIsPlaceModalOpen(false);
    setEditingPlace(null);
    setPlaceFormData({ name: '' });
  };

  const handleEditPlace = (place) => {
    setEditingPlace(place);
    setPlaceFormData({ name: place.name });
    setIsPlaceModalOpen(true);
  };

  const handleDeletePlace = (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      setPlaces(places.filter(p => p.id !== id));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4 sm:p-6 border border-primary-200 dark:border-primary-800">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-normal text-slate-900 dark:text-slate-100 truncate">
                    {profileData.fullName}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 truncate">{profileData.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={profileData.storeName}
                  onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="space-y-4 sm:space-y-6 max-w-2xl">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Password Requirements:</strong> Use at least 6 characters with a mix of letters, numbers, and symbols.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4 sm:space-y-6 max-w-2xl">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 sm:p-6 border border-primary-200 dark:border-primary-800">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
                <h3 className="text-base sm:text-lg font-normal text-slate-900 dark:text-slate-100">
                  Drying Service Pricing
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Set the standard price per kilogram for drying services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Price per Kg
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={dryingPrice.pricePerKg}
                    onChange={(e) => setDryingPrice({ ...dryingPrice, pricePerKg: parseFloat(e.target.value) })}
                    className="w-full pl-8 pr-3 sm:pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                  Currency
                </label>
                <select
                  value={dryingPrice.currency}
                  onChange={(e) => setDryingPrice({ ...dryingPrice, currency: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100 text-sm sm:text-base"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="font-normal text-slate-900 dark:text-slate-100 mb-2 text-sm sm:text-base">Preview</h4>
              <p className="text-xl sm:text-2xl font-normal text-primary-600 dark:text-primary-400">
                ₹{dryingPrice.pricePerKg} / Kg
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                This rate will be used for drying cost calculations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handlePricingSave}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{loading ? 'Saving...' : 'Save Pricing'}</span>
              </button>
            </div>
          </div>
        );

      case 'places':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-normal text-slate-900 dark:text-slate-100">
                  Manage Places
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Add and manage places for customer locations.
                </p>
              </div>
              <button
                onClick={() => setIsPlaceModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Place</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-normal text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                          {place.name}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                          place.active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {place.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditPlace(place)}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlace(place.id)}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {places.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">No places added yet.</p>
              </div>
            )}

            <ModalForm
              isOpen={isPlaceModalOpen}
              onClose={() => {
                setIsPlaceModalOpen(false);
                setEditingPlace(null);
                setPlaceFormData({ name: '' });
              }}
              title={editingPlace ? 'Edit Place' : 'Add New Place'}
              onSubmit={handlePlaceSubmit}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-normal text-slate-700 dark:text-slate-300 mb-2">
                    Place Name
                  </label>
                  <input
                    type="text"
                    value={placeFormData.name}
                    onChange={(e) => setPlaceFormData({ ...placeFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-slate-100"
                    placeholder="Enter place name"
                    required
                  />
                </div>
              </div>
            </ModalForm>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 sm:p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-normal text-slate-900 dark:text-slate-100">
                      Income Categories
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Manage income categories
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/income-categories'}
                  className="w-full px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  Manage Income Categories
                </button>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 sm:p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-normal text-slate-900 dark:text-slate-100">
                      Expense Categories
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Manage expense categories
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/expense-categories'}
                  className="w-full px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Manage Expense Categories
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Categories help you organize and track your income and expenses effectively. 
                You can add, edit, or deactivate categories as needed.
              </p>
            </div>
          </div>
        );

      case 'general':
        return (
          <div className="space-y-4 sm:space-y-6 max-w-2xl">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
              <h3 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
                General Settings
              </h3>
              
              <div className="space-y-4">
                {/* Date Format */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-slate-200 dark:border-slate-700 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-normal text-slate-900 dark:text-slate-100">Date Format</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred date format</p>
                  </div>
                  <div className="sm:ml-4 flex-shrink-0">
                    <select className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-slate-100 text-sm">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                {/* Time Zone */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-slate-200 dark:border-slate-700 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-normal text-slate-900 dark:text-slate-100">Time Zone</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Set your local time zone</p>
                  </div>
                  <div className="sm:ml-4 flex-shrink-0">
                    <select className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-slate-100 text-sm">
                      <option>IST (GMT+5:30)</option>
                      <option>UTC (GMT+0:00)</option>
                      <option>EST (GMT-5:00)</option>
                    </select>
                  </div>
                </div>

                {/* Language */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-slate-200 dark:border-slate-700 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-normal text-slate-900 dark:text-slate-100">Language</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Choose display language</p>
                  </div>
                  <div className="sm:ml-4 flex-shrink-0">
                    <select className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-slate-100 text-sm">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Malayalam</option>
                    </select>
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 space-y-2 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-normal text-slate-900 dark:text-slate-100">Email Notifications</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Receive email updates</p>
                  </div>
                  <div className="sm:ml-4 flex-shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => alert('General settings saved!')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="px-1 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-normal text-slate-900 dark:text-slate-100">Settings</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
              Manage your profile, store, and application preferences
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        {/* Tabs - Mobile Optimized */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-1 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent" aria-label="Settings tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-normal whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;

