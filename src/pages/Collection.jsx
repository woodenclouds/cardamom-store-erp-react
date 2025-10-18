import React, { useState, useEffect } from 'react';
import { Plus, Filter, X, Calendar } from 'lucide-react';
import DataTable from '../components/DataTable';
import AddCollectionModal from '../components/AddCollectionModal';
import { collectionAPI, customerAPI, settingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const Collection = () => {
  const { t } = useLanguage();
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    customer: '',
    location: '',
  });
  
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchCollections();
    fetchLocations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [collections, filters]);

  const fetchCollections = async () => {
    try {
      const response = await collectionAPI.getAll();
      setCollections(response.data);
    } catch (error) {
      toast.error('Failed to fetch collections');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await settingsAPI.getPlaces();
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to fetch locations');
    }
  };

  const searchCustomers = async (query) => {
    try {
      const response = await customerAPI.search(query);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search customers');
    }
  };

  const applyFilters = () => {
    let filtered = [...collections];

    // Date range filter
    if (filters.fromDate) {
      filtered = filtered.filter(item => item.date >= filters.fromDate);
    }
    if (filters.toDate) {
      filtered = filtered.filter(item => item.date <= filters.toDate);
    }

    // Customer filter
    if (filters.customer) {
      filtered = filtered.filter(item => 
        item.customerName.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    setFilteredCollections(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      customer: '',
      location: '',
    });
  };

  const hasActiveFilters = () => {
    return filters.fromDate || filters.toDate || filters.customer || filters.location;
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionAPI.delete(item.id);
        toast.success('Collection deleted successfully');
        fetchCollections();
      } catch (error) {
        toast.error('Failed to delete collection');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleOpenModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchCollections();
  };

  const columns = [
    { key: 'batchNo', label: 'Batch' },
    { key: 'customerName', label: t('collection.customer') },
    { key: 'location', label: 'Location' },
    { key: 'date', label: t('common.date') },
    { key: 'quantity', label: t('collection.quantity') + ' (kg)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            {t('collection.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('collection.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${
              hasActiveFilters()
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters() && (
              <span className="ml-1 px-2 py-0.5 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold">
                {Object.values(filters).filter(v => v).length}
              </span>
            )}
          </button>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span>{t('collection.addCollection')}</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Filter Collections
            </h3>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* From Date */}
            <div>
              <label htmlFor="fromDate" className="label">
                From Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="fromDate"
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label htmlFor="toDate" className="label">
                To Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="toDate"
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Customer */}
            <div>
              <label htmlFor="customer" className="label">
                Customer
              </label>
              <input
                id="customer"
                type="text"
                value={filters.customer}
                onChange={(e) => {
                  handleFilterChange('customer', e.target.value);
                  searchCustomers(e.target.value);
                }}
                className="input-field"
                placeholder="Search customer..."
                list="customer-list"
              />
              <datalist id="customer-list">
                {customers.map((customer, idx) => (
                  <option key={idx} value={customer} />
                ))}
              </datalist>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="label">
                Location
              </label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input-field"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters() && (
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-sm text-primary-900 dark:text-primary-100">
                Showing <span className="font-semibold">{filteredCollections.length}</span> of <span className="font-semibold">{collections.length}</span> collections
              </p>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card">
        <DataTable
          columns={columns}
          data={hasActiveFilters() ? filteredCollections : collections}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Collection Modal */}
      <AddCollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editingItem={editingItem}
        collections={collections}
        title={t('collection.addNewCollection')}
      />
    </div>
  );
};

export default Collection;

