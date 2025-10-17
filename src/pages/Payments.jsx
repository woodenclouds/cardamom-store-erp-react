import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Banknote, Wallet } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import Card from '../components/Card';
import { paymentAPI, customerAPI, dashboardAPI } from '../services/api';
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
  const [accountSummary, setAccountSummary] = useState({
    cashBalance: 0,
    bankBalance: 0,
    totalReceivables: 0,
    totalPayables: 0,
  });
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
    fetchAccountSummary();
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

  const fetchAccountSummary = async () => {
    try {
      const response = await dashboardAPI.getAccountSummary();
      setAccountSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch account summary');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            Payments
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track customer payments
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Add Payment</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Cash Balance</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.cashBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Banknote className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Bank Balance</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.bankBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Receivables</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.totalReceivables.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Payables</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.totalPayables.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary Cards */}
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

