import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, TrendingUp, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { incomeAPI, incomeCategoryAPI } from '../services/api';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    amount: '',
    description: '',
    paymentMode: 'Cash',
    reference: '',
  });

  useEffect(() => {
    fetchIncomes();
    fetchCategories();
  }, []);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await incomeAPI.getAll();
      setIncomes(response.data);
    } catch (error) {
      toast.error('Failed to fetch income records');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await incomeCategoryAPI.getAll();
      setCategories(response.data.filter(cat => cat.status === 'active'));
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncome) {
        await incomeAPI.update(editingIncome.id, formData);
        toast.success('Income record updated successfully');
      } else {
        await incomeAPI.create(formData);
        toast.success('Income record created successfully');
      }
      fetchIncomes();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save income record');
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      date: income.date,
      categoryId: income.categoryId,
      amount: income.amount,
      description: income.description || '',
      paymentMode: income.paymentMode,
      reference: income.reference || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      try {
        await incomeAPI.delete(id);
        toast.success('Income record deleted successfully');
        fetchIncomes();
      } catch (error) {
        toast.error('Failed to delete income record');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      amount: '',
      description: '',
      paymentMode: 'Cash',
      reference: '',
    });
  };

  const filteredIncomes = filterCategory === 'all' 
    ? incomes 
    : incomes.filter(income => income.categoryId === parseInt(filterCategory));

  const totalIncome = filteredIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);

  const columns = [
    { key: 'date', label: 'Date' },
    { 
      key: 'categoryName',
      label: 'Category',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {value || 'N/A'}
        </span>
      ),
    },
    { 
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <span className="font-semibold text-green-600">
          ₹{parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: 'description', label: 'Description' },
    { key: 'paymentMode', label: 'Payment Mode' },
    { key: 'reference', label: 'Reference' },
    {
      key: 'id',
      label: 'Actions',
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(value)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const formFields = [
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
    },
    {
      name: 'categoryId',
      label: 'Income Category',
      type: 'select',
      options: categories.map(cat => ({ value: cat.id, label: cat.name })),
      required: true,
    },
    {
      name: 'amount',
      label: 'Amount',
      type: 'number',
      placeholder: '0.00',
      required: true,
      min: 0,
      step: 0.01,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Brief description of this income',
    },
    {
      name: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      options: [
        { value: 'Cash', label: 'Cash' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'Cheque', label: 'Cheque' },
        { value: 'UPI', label: 'UPI' },
        { value: 'Card', label: 'Card' },
      ],
      required: true,
    },
    {
      name: 'reference',
      label: 'Reference Number',
      type: 'text',
      placeholder: 'Transaction reference or receipt number',
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-normal text-slate-900 dark:text-slate-100 mb-2">
            Income Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track and manage all income transactions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Income</p>
            <h2 className="text-3xl font-bold mt-1">
              ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-green-100 text-sm mt-1">
              {filteredIncomes.length} transaction{filteredIncomes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-3">
        <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredIncomes}
        loading={loading}
        emptyMessage="No income records found. Create one to get started."
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingIncome ? 'Edit Income Record' : 'Add Income Record'}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Income;

