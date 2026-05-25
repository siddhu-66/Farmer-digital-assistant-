"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { cropService, Crop } from '@/services/cropService';
import { Sprout, Plus, Pencil, Trash2, Search, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function CropManagementPage() {
  const { role } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    cropName: '',
    category: 'Other',
    season: 'All Season',
    description: '',
    basePrice: 0,
    unit: 'quintal',
    imageUrl: ''
  });

  const loadCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cropService.getAllCrops();
      setCrops(data);
    } catch (err) {
      setError('Failed to load crops');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role && role !== 'admin') {
      setError('Access denied. Admin only.');
      setLoading(false);
      return;
    }
    loadCrops();
  }, [role]);

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    try {
      await cropService.createCrop(formData);
      setSuccess('Crop added successfully!');
      setShowAddModal(false);
      setFormData({
        cropName: '',
        category: 'Other',
        season: 'All Season',
        description: '',
        basePrice: 0,
        unit: 'quintal',
        imageUrl: ''
      });
      loadCrops();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add crop');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop) return;
    setActionLoading(true);
    setError(null);
    try {
      await cropService.updateCrop(selectedCrop._id, formData);
      setSuccess('Crop updated successfully!');
      setShowEditModal(false);
      setSelectedCrop(null);
      loadCrops();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update crop');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crop?')) return;
    setActionLoading(true);
    setError(null);
    try {
      await cropService.deleteCrop(id);
      setSuccess('Crop deleted successfully!');
      loadCrops();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete crop');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (crop: Crop) => {
    setSelectedCrop(crop);
    setFormData({
      cropName: crop.cropName,
      category: crop.category,
      season: crop.season,
      description: crop.description,
      basePrice: crop.basePrice,
      unit: crop.unit,
      imageUrl: crop.imageUrl
    });
    setShowEditModal(true);
  };

  const filteredCrops = crops.filter(crop =>
    crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (role && role !== 'admin') {
    return (
      <div className="flex bg-[var(--theme-bg)] min-h-screen">
        <Sidebar />
        <main className="flex-1 main-content-shifted p-8 pt-10">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-gray-600">This page is only accessible to Admin users.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Crop Management</h1>
            <p className="text-gray-600">Manage crop catalog for the platform</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Crop
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search crops by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No crops found</h3>
            <p className="text-gray-500">Add your first crop to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div key={crop._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{crop.cropName}</h3>
                    <p className="text-sm text-gray-500">{crop.category} • {crop.season}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${crop.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {crop.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {crop.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{crop.description}</p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>₹{crop.basePrice}/{crop.unit}</span>
                  <span>{new Date(crop.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(crop)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCrop(crop._id)}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Crop Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Crop</h2>
              <form onSubmit={handleAddCrop} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Cereals">Cereals</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Oilseeds">Oilseeds</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Cash Crops">Cash Crops</option>
                      <option value="Spices">Spices</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                    <select
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Kharif">Kharif</option>
                      <option value="Rabi">Rabi</option>
                      <option value="Zaid">Zaid</option>
                      <option value="All Season">All Season</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="ton">ton</option>
                      <option value="bushel">bushel</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Crop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Crop Modal */}
        {showEditModal && selectedCrop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Crop</h2>
              <form onSubmit={handleEditCrop} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Cereals">Cereals</option>
                      <option value="Pulses">Pulses</option>
                      <option value="Oilseeds">Oilseeds</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Cash Crops">Cash Crops</option>
                      <option value="Spices">Spices</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                    <select
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Kharif">Kharif</option>
                      <option value="Rabi">Rabi</option>
                      <option value="Zaid">Zaid</option>
                      <option value="All Season">All Season</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="ton">ton</option>
                      <option value="bushel">bushel</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCrop(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Crop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
