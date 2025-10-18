import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, CreditCard, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { debtAPI, customerAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const DebtManagement = () => {
  const { t } = useLanguage();
  const [debts, setDebts] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('debts'); // 'debts' or 'repayments'
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [editingRepayment, setEditingRepayment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [customers, setCustomers] = useState([]);
  
  const [debtFormData, setDebtFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    amount: '',
    reason: '',
    dueDate: '',
    interestRate: '',
    paymentMode: 'Cash',
    reference: '',
  });

  const [repaymentFormData, setRepaymentFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    debtId: '',
    customerName: '',
    amount: '',
    paymentMode: 'Cash',
    reference: '',
    remarks: '',
  });

  useEffect(() => {
    fetchDebts();
    fetchRepayments();
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerAPI.search('');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to load customers');
    }
  };

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const response = await debtAPI.getAllDebts();
      setDebts(response.data);
    } catch (error) {
      toast.error('Failed to fetch debt records');
    } finally {
      setLoading(false);
    }
  };

  const fetchRepayments = async () => {
    try {
      const response = await debtAPI.getAllRepayments();
      setRepayments(response.data);
    } catch (error) {
      toast.error('Failed to fetch repayment records');
    }
  };

  const handleDebtSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDebt) {
        await debtAPI.updateDebt(editingDebt.id, debtFormData);
        toast.success('Debt record updated successfully');
      } else {
        await debtAPI.createDebt(debtFormData);
        toast.success('Debt record created successfully');
      }
      fetchDebts();
      handleCloseDebtModal();
    } catch (error) {
      toast.error('Failed to save debt record');
    }
  };

  const handleRepaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRepayment) {
        await debtAPI.updateRepayment(editingRepayment.id, repaymentFormData);
        toast.success('Repayment record updated successfully');
      } else {
        await debtAPI.createRepayment(repaymentFormData);
        toast.success('Repayment recorded successfully');
      }
      fetchDebts();
      fetchRepayments();
      handleCloseRepaymentModal();
    } catch (error) {
      toast.error('Failed to save repayment record');
    }
  };

  const handleEditDebt = (debt) => {
    setEditingDebt(debt);
    setDebtFormData({
      date: debt.date,
      customerName: debt.customerName,
      amount: debt.amount,
      reason: debt.reason || '',
      dueDate: debt.dueDate || '',
      interestRate: debt.interestRate || '',
      paymentMode: debt.paymentMode,
      reference: debt.reference || '',
    });
    setIsDebtModalOpen(true);
  };

  const handleEditRepayment = (repayment) => {
    setEditingRepayment(repayment);
    setRepaymentFormData({
      date: repayment.date,
      debtId: repayment.debtId,
      customerName: repayment.customerName,
      amount: repayment.amount,
      paymentMode: repayment.paymentMode,
      reference: repayment.reference || '',
      remarks: repayment.remarks || '',
    });
    setIsRepaymentModalOpen(true);
  };

  const handleDeleteDebt = async (id) => {
    if (window.confirm('Are you sure you want to delete this debt record?')) {
      try {
        await debtAPI.deleteDebt(id);
        toast.success('Debt record deleted successfully');
        fetchDebts();
      } catch (error) {
        toast.error('Failed to delete debt record');
      }
    }
  };

  const handleDeleteRepayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this repayment record?')) {
      try {
        await debtAPI.deleteRepayment(id);
        toast.success('Repayment record deleted successfully');
        fetchDebts();
        fetchRepayments();
      } catch (error) {
        toast.error('Failed to delete repayment record');
      }
    }
  };

  const handleCloseDebtModal = () => {
    setIsDebtModalOpen(false);
    setEditingDebt(null);
    setDebtFormData({
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      amount: '',
      reason: '',
      dueDate: '',
      interestRate: '',
      paymentMode: 'Cash',
      reference: '',
    });
  };

  const handleCloseRepaymentModal = () => {
    setIsRepaymentModalOpen(false);
    setEditingRepayment(null);
    setRepaymentFormData({
      date: new Date().toISOString().split('T')[0],
      debtId: '',
      customerName: '',
      amount: '',
      paymentMode: 'Cash',
      reference: '',
      remarks: '',
    });
  };

  // Calculate statistics
  const filteredDebts = filterStatus === 'all' 
    ? debts 
    : debts.filter(debt => debt.status === filterStatus);

  const totalDebtGiven = debts.reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
  const totalOutstanding = debts.reduce((sum, debt) => sum + parseFloat(debt.outstanding), 0);
  const totalRepaid = debts.reduce((sum, debt) => sum + parseFloat(debt.repaid), 0);
  const activeDebts = debts.filter(debt => debt.status === 'active').length;

  // Debt columns
  const debtColumns = [
    { key: 'date', label: t('common.date') },
    { key: 'customerName', label: t('collection.customer') },
    { 
      key: 'amount',
      label: t('debtManagement.debtAmount'),
      render: (value) => (
        <span className="font-semibold text-orange-600">
          ₹{parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { 
      key: 'repaid',
      label: t('debtManagement.repaid'),
      render: (value) => (
        <span className="font-semibold text-green-600">
          ₹{parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { 
      key: 'outstanding',
      label: t('debtManagement.outstanding'),
      render: (value) => (
        <span className="font-semibold text-red-600">
          ₹{parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: 'dueDate', label: t('debtManagement.dueDate') },
    {
      key: 'status',
      label: t('common.status'),
      render: (value) => {
        const statusConfig = {
          active: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock },
          completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
          overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
        };
        const config = statusConfig[value] || statusConfig.active;
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <Icon className="w-3 h-3" />
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    { key: 'reason', label: t('debtManagement.reason') },
    {
      key: 'id',
      label: t('common.actions'),
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditDebt(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteDebt(value)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Repayment columns
  const repaymentColumns = [
    { key: 'date', label: t('common.date') },
    { key: 'customerName', label: t('collection.customer') },
    { 
      key: 'amount',
      label: t('debtManagement.amountRepaid'),
      render: (value) => (
        <span className="font-semibold text-green-600">
          ₹{parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { key: 'paymentMode', label: t('payments.paymentMethod') },
    { key: 'reference', label: t('common.reference') },
    { key: 'remarks', label: t('common.remarks') },
    {
      key: 'id',
      label: t('common.actions'),
      render: (value, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditRepayment(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteRepayment(value)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Form fields for debt
  const debtFormFields = [
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
    },
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'select',
      options: customers.map(c => ({ value: c, label: c })),
      required: true,
    },
    {
      name: 'amount',
      label: 'Debt Amount',
      type: 'number',
      placeholder: '0.00',
      required: true,
      min: 0,
      step: 0.01,
    },
    {
      name: 'reason',
      label: 'Reason/Purpose',
      type: 'textarea',
      placeholder: 'Reason for giving debt',
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      type: 'date',
    },
    {
      name: 'interestRate',
      label: 'Interest Rate (%)',
      type: 'number',
      placeholder: '0',
      min: 0,
      step: 0.01,
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
      ],
      required: true,
    },
    {
      name: 'reference',
      label: 'Reference Number',
      type: 'text',
      placeholder: 'Transaction reference',
    },
  ];

  // Form fields for repayment
  const repaymentFormFields = [
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
    },
    {
      name: 'customerName',
      label: 'Customer Name',
      type: 'select',
      options: debts
        .filter(d => d.status !== 'completed')
        .map(d => ({ value: d.customerName, label: `${d.customerName} (Outstanding: ₹${d.outstanding})` })),
      required: true,
    },
    {
      name: 'amount',
      label: 'Repayment Amount',
      type: 'number',
      placeholder: '0.00',
      required: true,
      min: 0,
      step: 0.01,
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
      ],
      required: true,
    },
    {
      name: 'reference',
      label: 'Reference Number',
      type: 'text',
      placeholder: 'Transaction reference',
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      placeholder: 'Any additional notes',
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            {t('debtManagement.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('debtManagement.subtitle')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsDebtModalOpen(true)}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span>{t('debtManagement.giveDebt')}</span>
          </button>
          <button
            onClick={() => setIsRepaymentModalOpen(true)}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            <CreditCard className="w-5 h-5" />
            <span>{t('debtManagement.recordRepayment')}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">{t('debtManagement.totalDebtGiven')}</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100 mt-1">
                ₹{totalDebtGiven.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{debts.length} records</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">{t('debtManagement.outstandingAmount')}</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100 mt-1">
                ₹{totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activeDebts} active</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">{t('debtManagement.totalRepaid')}</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100 mt-1">
                ₹{totalRepaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{repayments.length} payments</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">{t('debtManagement.recoveryRate')}</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100 mt-1">
                {totalDebtGiven > 0 ? ((totalRepaid / totalDebtGiven) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">of total debt</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('debts')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'debts'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
{t('debtManagement.debtRecords')} ({debts.length})
        </button>
        <button
          onClick={() => setActiveTab('repayments')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'repayments'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
{t('debtManagement.repaymentHistory')} ({repayments.length})
        </button>
      </div>

      {activeTab === 'debts' && (
        <>
          {/* Filter */}
          <div className="mb-4 flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">{t('debtManagement.allStatus')}</option>
              <option value="active">{t('common.active')}</option>
              <option value="completed">{t('common.completed')}</option>
              <option value="overdue">{t('debtManagement.overdue')}</option>
            </select>
          </div>

          <DataTable
            columns={debtColumns}
            data={filteredDebts}
            loading={loading}
            emptyMessage={t('debtManagement.noDebtRecordsFound')}
          />
        </>
      )}

      {activeTab === 'repayments' && (
        <DataTable
          columns={repaymentColumns}
          data={repayments}
          loading={loading}
          emptyMessage="No repayment records found."
        />
      )}

      <ModalForm
        isOpen={isDebtModalOpen}
        onClose={handleCloseDebtModal}
        onSubmit={handleDebtSubmit}
        title={editingDebt ? 'Edit Debt Record' : 'Give Debt to Customer'}
        fields={debtFormFields}
        formData={debtFormData}
        setFormData={setDebtFormData}
      />

      <ModalForm
        isOpen={isRepaymentModalOpen}
        onClose={handleCloseRepaymentModal}
        onSubmit={handleRepaymentSubmit}
        title={editingRepayment ? 'Edit Repayment Record' : 'Record Debt Repayment'}
        fields={repaymentFormFields}
        formData={repaymentFormData}
        setFormData={setRepaymentFormData}
      />
    </div>
  );
};

export default DebtManagement;

