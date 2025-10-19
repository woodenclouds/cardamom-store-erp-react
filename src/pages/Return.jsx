import React, { useState, useEffect } from 'react';
import { Plus, Filter, X, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { returnAPI, customerAPI, batchAPI, settingsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  batchNo: yup.string().required('Batch number is required'),
  quantity: yup.number().positive('Must be positive').required('Quantity is required'),
  rate: yup.number().positive('Must be positive').required('Rate is required'),
  paymentStatus: yup.string().required('Payment status is required'),
  date: yup.string().required('Date is required'),
});

const Return = () => {
  const { t } = useLanguage();
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    customer: '',
    location: '',
  });

  const [locations, setLocations] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentStatus: 'Pending',
    },
  });

  const quantity = watch('quantity');
  const rate = watch('rate');

  useEffect(() => {
    fetchReturns();
    fetchBatches();
    fetchLocations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [returns, filters]);

  useEffect(() => {
    if (quantity && rate) {
      setValue('amount', quantity * rate);
    }
  }, [quantity, rate, setValue]);

  const fetchReturns = async () => {
    try {
      const response = await returnAPI.getAll();
      setReturns(response.data);
    } catch (error) {
      toast.error('Failed to fetch returns');
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await batchAPI.getAll();
      setBatches(response.data.filter(b => b.status === 'Completed'));
    } catch (error) {
      console.error('Failed to fetch batches');
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
    let filtered = [...returns];

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

    setFilteredReturns(filtered);
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
        await returnAPI.update(editingItem.id, data);
        toast.success('Return updated successfully');
      } else {
        await returnAPI.create(data);
        toast.success('Return created successfully');
      }
      fetchReturns();
      handleCloseModal();
    } catch (error) {
      toast.error(editingItem ? 'Failed to update return' : 'Failed to create return');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    reset(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this return?')) {
      try {
        await returnAPI.delete(item.id);
        toast.success('Return deleted successfully');
        fetchReturns();
      } catch (error) {
        toast.error('Failed to delete return');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset({
      paymentStatus: 'Pending',
    });
  };

  const calculateDryPercentage = (raw, dry) => {
    if (!raw || !dry) return '0';
    const dryPercent = (dry / raw) * 100;
    return dryPercent.toFixed(2);
  };

  const columns = [
    { key: 'batchNo', label: 'Batch' },
    { key: 'date', label: t('common.date') },
    { key: 'customerName', label: t('collection.customer') },
    {
      key: 'rawQuantity',
      label: 'Raw Qty (kg)',
      render: (_, row) => `${row.rawQty || 0}`,
    },
    {
      key: 'dryPercentage',
      label: 'Dry %',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <span>{row.rawQty || 0}/{row.dryQty || 0}</span>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            {calculateDryPercentage(row.rawQty, row.dryQty)}%
          </span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (_, row) => `₹${(row.amount || 0).toLocaleString()}`,
    },
    {
      key: 'paidAmount',
      label: 'Paid Amount',
      render: (_, row) => `₹${(row.paidAmount || 0).toLocaleString()}`,
    },
    {
      key: 'pendingAmount',
      label: 'Pending Amount',
      render: (_, row) => `₹${(row.pendingAmount || 0).toLocaleString()}`,
    },
    {
      key: 'paymentStatus',
      label: t('common.status'),
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'Paid'
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
            {t('returns.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('returns.subtitle')}
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
            <span>{t('returns.addReturn')}</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Filter Returns
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
                list="customer-list-filter"
              />
              <datalist id="customer-list-filter">
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
                Showing <span className="font-semibold">{filteredReturns.length}</span> of <span className="font-semibold">{returns.length}</span> returns
              </p>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="card">
        <DataTable 
          columns={columns} 
          data={hasActiveFilters() ? filteredReturns : returns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Modal */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Return' : 'Add Return'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="date" className="label">
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className="input-field"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerName" className="label">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              {...register('customerName')}
              onChange={(e) => searchCustomers(e.target.value)}
              className="input-field"
              placeholder="Start typing to search..."
              list="customers"
            />
            <datalist id="customers">
              {customers.map((customer, idx) => (
                <option key={idx} value={customer} />
              ))}
            </datalist>
            {errors.customerName && (
              <p className="mt-1 text-xs text-red-600">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="batchNo" className="label">
              Batch Number
            </label>
            <select id="batchNo" {...register('batchNo')} className="input-field">
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.batchNo}>
                  {batch.batchNo} - {batch.dryQty}kg available
                </option>
              ))}
            </select>
            {errors.batchNo && (
              <p className="mt-1 text-xs text-red-600">{errors.batchNo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="label">
                Quantity (kg)
              </label>
              <input
                id="quantity"
                type="number"
                step="0.01"
                {...register('quantity')}
                className="input-field"
                placeholder="0"
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="rate" className="label">
                Rate/kg (₹)
              </label>
              <input
                id="rate"
                type="number"
                step="0.01"
                {...register('rate')}
                className="input-field"
                placeholder="0"
              />
              {errors.rate && (
                <p className="mt-1 text-xs text-red-600">{errors.rate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Amount (₹)</label>
            <input
              type="text"
              value={quantity && rate ? `₹${(quantity * rate).toLocaleString()}` : '₹0'}
              className="input-field bg-slate-100 dark:bg-slate-700"
              disabled
            />
          </div>

          <div>
            <label htmlFor="paymentStatus" className="label">
              Payment Status
            </label>
            <select id="paymentStatus" {...register('paymentStatus')} className="input-field">
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? 'Update Return' : 'Save Return'}
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

export default Return;

