import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { returnAPI, customerAPI, batchAPI } from '../services/api';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  batchNo: yup.string().required('Batch number is required'),
  quantity: yup.number().positive('Must be positive').required('Quantity is required'),
  rate: yup.number().positive('Must be positive').required('Rate is required'),
  paymentStatus: yup.string().required('Payment status is required'),
  date: yup.string().required('Date is required'),
});

const Return = () => {
  const [returns, setReturns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [batches, setBatches] = useState([]);

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
  }, []);

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

  const searchCustomers = async (query) => {
    try {
      const response = await customerAPI.search(query);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search customers');
    }
  };

  const onSubmit = async (data) => {
    try {
      await returnAPI.create(data);
      toast.success('Return created successfully');
      fetchReturns();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to create return');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset({
      paymentStatus: 'Pending',
    });
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'batchNo', label: 'Batch No' },
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
    {
      key: 'paymentStatus',
      label: 'Payment Status',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-slate-900 dark:text-slate-100 mb-2">
            Returns
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Return dried cardamom to customers
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Return
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <DataTable columns={columns} data={returns} />
      </div>

      {/* Add Modal */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Return"
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

          <div className="grid grid-cols-2 gap-4">
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
              Save Return
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

