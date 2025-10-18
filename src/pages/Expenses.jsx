import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, TrendingDown, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { expenseAPI, expenseCategoryAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const Expenses = () => {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    amount: '',
    description: '',
    paymentMode: 'Cash',
    reference: '',
    vendor: '',
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      setExpenses(response.data);
    } catch (error) {
      toast.error('Failed to fetch expense records');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await expenseCategoryAPI.getAll();
      setCategories(response.data.filter(cat => cat.status === 'active'));
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await expenseAPI.update(editingExpense.id, formData);
        toast.success('Expense record updated successfully');
      } else {
        await expenseAPI.create(formData);
        toast.success('Expense record created successfully');
      }
      fetchExpenses();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save expense record');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      date: expense.date,
      categoryId: expense.categoryId,
      amount: expense.amount,
      description: expense.description || '',
      paymentMode: expense.paymentMode,
      reference: expense.reference || '',
      vendor: expense.vendor || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await expenseAPI.delete(id);
        toast.success('Expense record deleted successfully');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense record');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      amount: '',
      description: '',
      paymentMode: 'Cash',
      reference: '',
      vendor: '',
    });
  };

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.categoryId === parseInt(filterCategory));

  const totalExpense = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const columns = [
    { key: 'date', label: t('common.date') },
    { 
      key: 'categoryName',
      label: t('expenses.category'),
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {value || 'N/A'}
        </span>
      ),
    },
    { 
      key: 'amount',
      label: t('common.amount'),
      render: (value) => (
        <span className="font-semibold text-red-600">
          ₹{parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: 'vendor', label: t('purchases.vendor') },
    { key: 'description', label: t('common.description') },
    { key: 'paymentMode', label: t('payments.paymentMethod') },
    { key: 'reference', label: t('common.reference') },
    {
      key: 'id',
      label: t('common.actions'),
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
      label: 'Expense Category',
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
      name: 'vendor',
      label: 'Vendor/Supplier',
      type: 'text',
      placeholder: 'Name of vendor or supplier',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Brief description of this expense',
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
      placeholder: 'Transaction reference or invoice number',
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            {t('expenses.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('expenses.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>{t('expenses.addExpense')}</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">{t('expenses.totalExpenses')}</h3>
            <p className="text-3xl font-normal text-slate-900 dark:text-slate-100 mt-1">
              ₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
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
        data={filteredExpenses}
        loading={loading}
        emptyMessage="No expense records found. Create one to get started."
      />

      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingExpense ? t('expenses.editExpense') : t('expenses.addNewExpense')}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Expenses;

