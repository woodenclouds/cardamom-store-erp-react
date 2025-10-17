import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { collectionAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  date: yup.string().required('Date is required'),
  quantity: yup.number().positive('Must be positive').required('Quantity is required'),
  rate: yup.number().positive('Must be positive').required('Rate is required'),
  batchNo: yup.string(),
});

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const quantity = watch('quantity');
  const rate = watch('rate');

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (customerSearch) {
      searchCustomers(customerSearch);
    }
  }, [customerSearch]);

  // Auto-calculate amount
  useEffect(() => {
    if (quantity && rate) {
      setValue('amount', quantity * rate);
    }
  }, [quantity, rate, setValue]);

  const fetchCollections = async () => {
    try {
      const response = await collectionAPI.getAll();
      setCollections(response.data);
    } catch (error) {
      toast.error('Failed to fetch collections');
    }
  };

  const searchCustomers = async (query) => {
    try {
      const response = await customerAPI.search(query);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search customers:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingItem) {
        await collectionAPI.update(editingItem.id, data);
        toast.success('Collection updated successfully');
      } else {
        await collectionAPI.create(data);
        toast.success('Collection added successfully');
      }
      fetchCollections();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save collection');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    reset(item);
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
    reset({});
  };

  const columns = [
    { key: 'customerName', label: 'Customer Name' },
    { key: 'date', label: 'Date' },
    { key: 'quantity', label: 'Quantity (kg)' },
    {
      key: 'rate',
      label: 'Rate/kg',
      render: (value) => `₹${value}`,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => `₹${value.toLocaleString()}`,
    },
    { key: 'batchNo', label: 'Batch No' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            Collections
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage raw cardamom collections
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Add Collection</span>
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <DataTable
          columns={columns}
          data={collections}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Modal */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Collection' : 'Add Collection'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="label">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              {...register('customerName')}
              onChange={(e) => setCustomerSearch(e.target.value)}
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
            <label htmlFor="batchNo" className="label">
              Batch No (Optional)
            </label>
            <input
              id="batchNo"
              type="text"
              {...register('batchNo')}
              className="input-field"
              placeholder="e.g., B001"
            />
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

export default Collection;

