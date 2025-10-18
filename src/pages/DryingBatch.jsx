import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Filter, X, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { batchAPI, customerAPI, settingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const schema = yup.object().shape({
  batchNo: yup.string().required('Batch number is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string(),
  rawQty: yup.number().positive('Must be positive').required('Raw quantity is required'),
  dryQty: yup.number().min(0, 'Cannot be negative').required('Dry quantity is required'),
  grade: yup.string().required('Grade is required'),
  status: yup.string().required('Status is required'),
});

const DryingBatch = () => {
  const { t } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'In Progress',
      grade: 'A',
    },
  });

  const rawQty = watch('rawQty');
  const dryQty = watch('dryQty');

  useEffect(() => {
    fetchBatches();
    fetchLocations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [batches, filters]);

  const fetchBatches = async () => {
    try {
      const response = await batchAPI.getAll();
      setBatches(response.data);
    } catch (error) {
      toast.error('Failed to fetch batches');
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
    let filtered = [...batches];

    // Date range filter (using startDate)
    if (filters.fromDate) {
      filtered = filtered.filter(item => item.startDate >= filters.fromDate);
    }
    if (filters.toDate) {
      filtered = filtered.filter(item => item.startDate <= filters.toDate);
    }

    // Customer filter
    if (filters.customer) {
      filtered = filtered.filter(item => 
        item.customerName && item.customerName.toLowerCase().includes(filters.customer.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(item => item.location === filters.location);
    }

    setFilteredBatches(filtered);
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

  const onSubmit = async (data) => {
    try {
      if (editingItem) {
        await batchAPI.update(editingItem.id, data);
        toast.success('Batch updated successfully');
      } else {
        await batchAPI.create(data);
        toast.success('Batch created successfully');
      }
      fetchBatches();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save batch');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    reset(item);
    setIsModalOpen(true);
  };

  const handleMarkCompleted = async (item) => {
    if (window.confirm('Mark this batch as completed?')) {
      try {
        await batchAPI.markCompleted(item.id);
        toast.success('Batch marked as completed');
        fetchBatches();
      } catch (error) {
        toast.error('Failed to update batch');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset({
      status: 'In Progress',
      grade: 'A',
    });
  };

  const calculateDryPercentage = (raw, dry) => {
    if (!raw || !dry) return '0';
    const dryPercent = (dry / raw) * 100;
    return dryPercent.toFixed(2);
  };

  const columns = [
    { key: 'batchNo', label: 'Batch' },
    { key: 'customerName', label: t('collection.customer') },
    { key: 'startDate', label: t('dryingBatch.startDate') },
    { key: 'endDate', label: t('dryingBatch.endDate'), render: (value) => value || '-' },
    {
      key: 'rawQuantity',
      label: 'Raw Qty (kg)',
      render: (_, row) => `${row.rawQty}`,
    },
    {
      key: 'dryPercentage',
      label: 'Dry %',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <span>{row.rawQty}/{row.dryQty}</span>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {calculateDryPercentage(row.rawQty, row.dryQty)}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('common.status'),
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'Completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            {t('dryingBatch.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('dryingBatch.subtitle')}
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
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span>{t('dryingBatch.addBatch')}</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Filter Drying Batches
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
                Showing <span className="font-semibold">{filteredBatches.length}</span> of <span className="font-semibold">{batches.length}</span> batches
              </p>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card">
        <DataTable
          columns={columns}
          data={hasActiveFilters() ? filteredBatches : batches}
          onEdit={handleEdit}
          onDelete={(item) => {
            if (item.status === 'In Progress') {
              handleMarkCompleted(item);
            }
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Batch' : 'Add Batch'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="batchNo" className="label">
              Batch Number
            </label>
            <input
              id="batchNo"
              type="text"
              {...register('batchNo')}
              className="input-field"
              placeholder="e.g., B001"
            />
            {errors.batchNo && (
              <p className="mt-1 text-xs text-red-600">{errors.batchNo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="label">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="input-field"
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="label">
                End Date (Optional)
              </label>
              <input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rawQty" className="label">
                Raw Quantity (kg)
              </label>
              <input
                id="rawQty"
                type="number"
                step="0.01"
                {...register('rawQty')}
                className="input-field"
                placeholder="0"
              />
              {errors.rawQty && (
                <p className="mt-1 text-xs text-red-600">{errors.rawQty.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dryQty" className="label">
                Dry Quantity (kg)
              </label>
              <input
                id="dryQty"
                type="number"
                step="0.01"
                {...register('dryQty')}
                className="input-field"
                placeholder="0"
              />
              {errors.dryQty && (
                <p className="mt-1 text-xs text-red-600">{errors.dryQty.message}</p>
              )}
            </div>
          </div>

          {rawQty && dryQty && (
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                Dry Percentage: {calculateDryPercentage(rawQty, dryQty)}%
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade" className="label">
                Grade
              </label>
              <select id="grade" {...register('grade')} className="input-field">
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="label">
                Status
              </label>
              <select id="status" {...register('status')} className="input-field">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
};

export default DryingBatch;

