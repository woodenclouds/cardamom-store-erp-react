import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import Card from '../components/Card';
import { paymentAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  date: yup.string().required('Date is required'),
  customerName: yup.string().required('Customer name is required'),
  amount: yup.number().positive('Must be positive').required('Amount is required'),
  mode: yup.string().required('Payment mode is required'),
  remarks: yup.string(),
});

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalReceived: 0, totalPending: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      mode: 'Cash',
    },
  });

  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentAPI.getAll();
      setPayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch payments');
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await paymentAPI.getSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch summary');
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
      await paymentAPI.create(data);
      toast.success('Payment recorded successfully');
      fetchPayments();
      fetchSummary();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset({
      mode: 'Cash',
    });
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'customerName', label: 'Customer Name' },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => `₹${value.toLocaleString()}`,
    },
    { key: 'mode', label: 'Payment Mode' },
    { key: 'remarks', label: 'Remarks', render: (value) => value || '-' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-slate-900 dark:text-slate-100 mb-2">
            Payments
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track customer payments
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Total Received"
          value={`₹${summary.totalReceived.toLocaleString()}`}
          icon={TrendingUp}
          className="border-l-4 border-green-500"
        />
        <Card
          title="Total Pending"
          value={`₹${summary.totalPending.toLocaleString()}`}
          icon={TrendingDown}
          className="border-l-4 border-yellow-500"
        />
      </div>

      {/* Table */}
      <div className="card">
        <DataTable columns={columns} data={payments} />
      </div>

      {/* Add Modal */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Payment"
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
            <label htmlFor="amount" className="label">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
              className="input-field"
              placeholder="0"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="mode" className="label">
              Payment Mode
            </label>
            <select id="mode" {...register('mode')} className="input-field">
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div>
            <label htmlFor="remarks" className="label">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              {...register('remarks')}
              className="input-field"
              rows="3"
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Save Payment
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

export default Payments;

