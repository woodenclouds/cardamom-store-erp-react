import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, Calendar, User, Wallet } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';

const Payrolls = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    salary: '',
    paymentDate: '',
    paymentMode: 'Bank Transfer',
    remarks: '',
  });

  // Sample employees data
  useEffect(() => {
    const sampleEmployees = [
      { id: 1, fullName: 'Rajesh Kumar', salary: 35000, status: 'active' },
      { id: 2, fullName: 'Priya Sharma', salary: 40000, status: 'active' },
      { id: 3, fullName: 'Suresh Nair', salary: 8000, status: 'active' },
      { id: 4, fullName: 'Anita Patel', salary: 7500, status: 'active' },
      { id: 5, fullName: 'Vijay Singh', salary: 25000, status: 'active' },
    ];
    setEmployees(sampleEmployees);

    const samplePayrolls = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'Rajesh Kumar',
        salary: 35000,
        paymentDate: '2025-10-05',
        paymentMode: 'Bank Transfer',
        remarks: 'October salary',
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'Priya Sharma',
        salary: 40000,
        paymentDate: '2025-10-05',
        paymentMode: 'Bank Transfer',
        remarks: 'October salary',
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'Suresh Nair',
        salary: 8000,
        paymentDate: '2025-10-12',
        paymentMode: 'Cash',
        remarks: 'Weekly payment - Week 2',
      },
      {
        id: 4,
        employeeId: 5,
        employeeName: 'Vijay Singh',
        salary: 25000,
        paymentDate: '2025-09-30',
        paymentMode: 'Bank Transfer',
        remarks: 'September salary',
      },
    ];
    
    setPayrolls(samplePayrolls);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'employeeName',
      label: 'Employee Name',
      render: (value) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'salary',
      label: 'Salary Paid',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-base font-medium text-slate-900 dark:text-slate-100">
            ₹{value.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      ),
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'remarks',
      label: 'Remarks',
      render: (value) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {value || '-'}
        </span>
      ),
    },
  ];

  const handleAddPayroll = () => {
    setEditingPayroll(null);
    setFormData({
      employeeId: '',
      employeeName: '',
      salary: '',
      paymentDate: '',
      paymentMode: 'Bank Transfer',
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleEditPayroll = (payroll) => {
    setEditingPayroll(payroll);
    setFormData({
      employeeId: payroll.employeeId.toString(),
      employeeName: payroll.employeeName,
      salary: payroll.salary.toString(),
      paymentDate: payroll.paymentDate,
      paymentMode: payroll.paymentMode,
      remarks: payroll.remarks || '',
    });
    setIsModalOpen(true);
  };

  const handleDeletePayroll = (payroll) => {
    if (window.confirm(`Are you sure you want to delete salary payment for ${payroll.employeeName}?`)) {
      setPayrolls(payrolls.filter(p => p.id !== payroll.id));
    }
  };

  const handleSavePayroll = (e) => {
    e.preventDefault();
    
    const payrollData = {
      ...formData,
      employeeId: parseInt(formData.employeeId),
      salary: parseFloat(formData.salary),
    };

    if (editingPayroll) {
      setPayrolls(payrolls.map(p => 
        p.id === editingPayroll.id 
          ? { ...p, ...payrollData }
          : p
      ));
    } else {
      const newPayroll = {
        ...payrollData,
        id: Math.max(...payrolls.map(p => p.id), 0) + 1,
      };
      setPayrolls([...payrolls, newPayroll]);
    }
    setIsModalOpen(false);
    setEditingPayroll(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayroll(null);
  };

  // Handle employee selection
  const handleEmployeeChange = (value) => {
    const employee = employees.find(e => e.id === parseInt(value));
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employeeId: value,
        employeeName: employee.fullName,
        salary: employee.salary.toString(),
      }));
    }
  };

  const formFields = [
    {
      name: 'employeeId',
      label: 'Employee Name',
      type: 'select',
      required: true,
      options: employees
        .filter(e => e.status === 'active')
        .map(e => ({
          value: e.id.toString(),
          label: e.fullName,
        })),
      onChange: handleEmployeeChange,
    },
    {
      name: 'salary',
      label: 'Salary Amount (₹)',
      type: 'number',
      required: true,
      step: '0.01',
      placeholder: 'Enter salary amount',
    },
    {
      name: 'paymentDate',
      label: 'Payment Date',
      type: 'date',
      required: true,
    },
    {
      name: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      required: true,
      options: [
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'Cash', label: 'Cash' },
        { value: 'Cheque', label: 'Cheque' },
        { value: 'UPI', label: 'UPI' },
      ],
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      placeholder: 'e.g., October salary, bonus payment...',
    },
  ];

  // Calculate statistics
  const totalPayments = payrolls.length;
  const totalPaid = payrolls.reduce((sum, p) => sum + p.salary, 0);
  const thisMonthPayments = payrolls.filter(p => {
    const paymentDate = new Date(p.paymentDate);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  }).length;
  const thisMonthTotal = payrolls
    .filter(p => {
      const paymentDate = new Date(p.paymentDate);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.salary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Salary Payments</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track employee salary payments
          </p>
        </div>
        <button
          onClick={handleAddPayroll}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Payments</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{totalPayments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Paid</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">This Month</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{thisMonthTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <DataTable
          columns={columns}
          data={payrolls}
          loading={loading}
          onEdit={handleEditPayroll}
          onDelete={handleDeletePayroll}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No salary payments found. Add one to get started."
        />
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSavePayroll}
        title={editingPayroll ? 'Edit Salary Payment' : 'Add Salary Payment'}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
        submitText={editingPayroll ? 'Update Payment' : 'Add Payment'}
      />
    </div>
  );
};

export default Payrolls;

