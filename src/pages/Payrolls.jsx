import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
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
    payrollType: 'monthly',
    periodStart: '',
    periodEnd: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: '',
    paymentDate: '',
    paymentMode: 'Bank Transfer',
    status: 'pending',
    remarks: '',
  });

  // Sample employees data
  useEffect(() => {
    const sampleEmployees = [
      { id: 1, fullName: 'Rajesh Kumar', salary: 35000, payrollType: 'monthly', status: 'active' },
      { id: 2, fullName: 'Priya Sharma', salary: 40000, payrollType: 'monthly', status: 'active' },
      { id: 3, fullName: 'Suresh Nair', salary: 8000, payrollType: 'weekly', status: 'active' },
      { id: 4, fullName: 'Anita Patel', salary: 7500, payrollType: 'weekly', status: 'active' },
      { id: 5, fullName: 'Vijay Singh', salary: 25000, payrollType: 'monthly', status: 'active' },
    ];
    setEmployees(sampleEmployees);

    const samplePayrolls = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'Rajesh Kumar',
        payrollType: 'monthly',
        periodStart: '2025-10-01',
        periodEnd: '2025-10-31',
        basicSalary: 35000,
        allowances: 5000,
        deductions: 2000,
        netSalary: 38000,
        paymentDate: '2025-10-31',
        paymentMode: 'Bank Transfer',
        status: 'paid',
        remarks: 'Regular monthly salary',
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'Priya Sharma',
        payrollType: 'monthly',
        periodStart: '2025-10-01',
        periodEnd: '2025-10-31',
        basicSalary: 40000,
        allowances: 6000,
        deductions: 2500,
        netSalary: 43500,
        paymentDate: '2025-10-31',
        paymentMode: 'Bank Transfer',
        status: 'paid',
        remarks: 'Regular monthly salary',
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'Suresh Nair',
        payrollType: 'weekly',
        periodStart: '2025-10-11',
        periodEnd: '2025-10-17',
        basicSalary: 8000,
        allowances: 1000,
        deductions: 500,
        netSalary: 8500,
        paymentDate: '2025-10-18',
        paymentMode: 'Cash',
        status: 'paid',
        remarks: 'Weekly payment - Week 3',
      },
      {
        id: 4,
        employeeId: 4,
        employeeName: 'Anita Patel',
        payrollType: 'weekly',
        periodStart: '2025-10-11',
        periodEnd: '2025-10-17',
        basicSalary: 7500,
        allowances: 800,
        deductions: 400,
        netSalary: 7900,
        paymentDate: '2025-10-18',
        paymentMode: 'Cash',
        status: 'pending',
        remarks: 'Weekly payment - Week 3',
      },
      {
        id: 5,
        employeeId: 5,
        employeeName: 'Vijay Singh',
        payrollType: 'monthly',
        periodStart: '2025-10-01',
        periodEnd: '2025-10-31',
        basicSalary: 25000,
        allowances: 3000,
        deductions: 1500,
        netSalary: 26500,
        paymentDate: '2025-10-31',
        paymentMode: 'Bank Transfer',
        status: 'pending',
        remarks: 'Regular monthly salary',
      },
    ];
    
    setPayrolls(samplePayrolls);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'employeeName',
      label: 'Employee',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {row.payrollType.charAt(0).toUpperCase() + row.payrollType.slice(1)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'periodStart',
      label: 'Period',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <div className="text-sm">
            <div className="text-slate-600 dark:text-slate-300">
              {new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              to {new Date(row.periodEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'basicSalary',
      label: 'Basic Salary',
      render: (value) => (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          ₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'allowances',
      label: 'Allowances',
      render: (value) => (
        <span className="text-sm text-green-600 dark:text-green-400">
          +₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'deductions',
      label: 'Deductions',
      render: (value) => (
        <span className="text-sm text-red-600 dark:text-red-400">
          -₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'netSalary',
      label: 'Net Salary',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-normal text-slate-900 dark:text-slate-100">
            ₹{value.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      render: (value) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const statusConfig = {
          paid: { icon: CheckCircle, class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
          pending: { icon: Clock, class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
          cancelled: { icon: XCircle, class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
        };
        const config = statusConfig[value];
        const Icon = config.icon;
        
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.class}`}>
            <Icon className="w-3 h-3" />
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
  ];

  const handleAddPayroll = () => {
    setEditingPayroll(null);
    setFormData({
      employeeId: '',
      employeeName: '',
      payrollType: 'monthly',
      periodStart: '',
      periodEnd: '',
      basicSalary: '',
      allowances: '0',
      deductions: '0',
      netSalary: '',
      paymentDate: '',
      paymentMode: 'Bank Transfer',
      status: 'pending',
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleEditPayroll = (payroll) => {
    setEditingPayroll(payroll);
    setFormData({
      employeeId: payroll.employeeId.toString(),
      employeeName: payroll.employeeName,
      payrollType: payroll.payrollType,
      periodStart: payroll.periodStart,
      periodEnd: payroll.periodEnd,
      basicSalary: payroll.basicSalary.toString(),
      allowances: payroll.allowances.toString(),
      deductions: payroll.deductions.toString(),
      netSalary: payroll.netSalary.toString(),
      paymentDate: payroll.paymentDate,
      paymentMode: payroll.paymentMode,
      status: payroll.status,
      remarks: payroll.remarks,
    });
    setIsModalOpen(true);
  };

  const handleDeletePayroll = (payroll) => {
    if (window.confirm(`Are you sure you want to delete payroll for ${payroll.employeeName}?`)) {
      setPayrolls(payrolls.filter(p => p.id !== payroll.id));
    }
  };

  const handleSavePayroll = (e) => {
    e.preventDefault();
    
    const basicSalary = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const netSalary = basicSalary + allowances - deductions;

    const payrollData = {
      ...formData,
      employeeId: parseInt(formData.employeeId),
      basicSalary,
      allowances,
      deductions,
      netSalary,
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
        basicSalary: employee.salary.toString(),
        payrollType: employee.payrollType,
      }));
    }
  };

  // Calculate net salary when basic, allowances, or deductions change
  useEffect(() => {
    const basicSalary = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const netSalary = basicSalary + allowances - deductions;
    
    setFormData(prev => ({
      ...prev,
      netSalary: netSalary.toString(),
    }));
  }, [formData.basicSalary, formData.allowances, formData.deductions]);

  const formFields = [
    {
      name: 'employeeId',
      label: 'Employee',
      type: 'select',
      required: true,
      options: employees
        .filter(e => e.status === 'active')
        .map(e => ({
          value: e.id.toString(),
          label: `${e.fullName} (${e.payrollType})`,
        })),
      onChange: handleEmployeeChange,
    },
    {
      name: 'payrollType',
      label: 'Payroll Type',
      type: 'select',
      required: true,
      disabled: true,
      options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
      ],
    },
    {
      name: 'periodStart',
      label: 'Period Start Date',
      type: 'date',
      required: true,
    },
    {
      name: 'periodEnd',
      label: 'Period End Date',
      type: 'date',
      required: true,
    },
    {
      name: 'basicSalary',
      label: 'Basic Salary (₹)',
      type: 'number',
      required: true,
      step: '0.01',
    },
    {
      name: 'allowances',
      label: 'Allowances (₹)',
      type: 'number',
      required: true,
      step: '0.01',
      placeholder: '0',
    },
    {
      name: 'deductions',
      label: 'Deductions (₹)',
      type: 'number',
      required: true,
      step: '0.01',
      placeholder: '0',
    },
    {
      name: 'netSalary',
      label: 'Net Salary (₹)',
      type: 'number',
      required: true,
      disabled: true,
      step: '0.01',
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
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      placeholder: 'Any additional notes...',
    },
  ];

  // Calculate statistics
  const totalPayrolls = payrolls.length;
  const paidPayrolls = payrolls.filter(p => p.status === 'paid').length;
  const pendingPayrolls = payrolls.filter(p => p.status === 'pending').length;
  const totalPaid = payrolls
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.netSalary, 0);
  const totalPending = payrolls
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Payroll Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage employee payroll records and payments
          </p>
        </div>
        <button
          onClick={handleAddPayroll}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Add Payroll</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Payrolls</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{totalPayrolls}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
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
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Pending</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{totalPending.toLocaleString()}
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
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Count</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{pendingPayrolls}</p>
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
          emptyMessage="No payroll records found. Add one to get started."
        />
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSavePayroll}
        title={editingPayroll ? 'Edit Payroll' : 'Add New Payroll'}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
        submitText={editingPayroll ? 'Update Payroll' : 'Add Payroll'}
      />
    </div>
  );
};

export default Payrolls;

