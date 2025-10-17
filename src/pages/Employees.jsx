import React, { useState, useEffect } from 'react';
import { Plus, Users, Mail, Phone, Briefcase, Calendar, DollarSign } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joiningDate: '',
    salary: '',
    payrollType: 'monthly',
    status: 'active',
  });

  // Sample data
  useEffect(() => {
    const sampleEmployees = [
      {
        id: 1,
        fullName: 'Rajesh Kumar',
        email: 'rajesh.kumar@wostore.com',
        phone: '+91 9876543210',
        position: 'Processing Manager',
        department: 'Operations',
        joiningDate: '2024-01-15',
        salary: 35000,
        payrollType: 'monthly',
        status: 'active',
      },
      {
        id: 2,
        fullName: 'Priya Sharma',
        email: 'priya.sharma@wostore.com',
        phone: '+91 9876543211',
        position: 'Accounts Manager',
        department: 'Finance',
        joiningDate: '2024-02-01',
        salary: 40000,
        payrollType: 'monthly',
        status: 'active',
      },
      {
        id: 3,
        fullName: 'Suresh Nair',
        email: 'suresh.nair@wostore.com',
        phone: '+91 9876543212',
        position: 'Drying Supervisor',
        department: 'Operations',
        joiningDate: '2024-03-10',
        salary: 8000,
        payrollType: 'weekly',
        status: 'active',
      },
      {
        id: 4,
        fullName: 'Anita Patel',
        email: 'anita.patel@wostore.com',
        phone: '+91 9876543213',
        position: 'Quality Inspector',
        department: 'Quality Control',
        joiningDate: '2024-04-05',
        salary: 7500,
        payrollType: 'weekly',
        status: 'active',
      },
      {
        id: 5,
        fullName: 'Vijay Singh',
        email: 'vijay.singh@wostore.com',
        phone: '+91 9876543214',
        position: 'Warehouse Assistant',
        department: 'Warehouse',
        joiningDate: '2024-05-20',
        salary: 25000,
        payrollType: 'monthly',
        status: 'active',
      },
    ];
    
    setEmployees(sampleEmployees);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'fullName',
      label: 'Employee',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{row.position}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'payrollType',
      label: 'Payroll Type',
      render: (value, row) => (
        <div className="flex flex-col">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            value === 'weekly' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          }`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ₹{row.salary.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      joiningDate: '',
      salary: '',
      payrollType: 'monthly',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joiningDate: employee.joiningDate,
      salary: employee.salary,
      payrollType: employee.payrollType,
      status: employee.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      setEmployees(employees.filter(e => e.id !== employee.id));
    }
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(employees.map(e => 
        e.id === editingEmployee.id 
          ? { ...e, ...formData, salary: parseFloat(formData.salary) }
          : e
      ));
    } else {
      const newEmployee = {
        ...formData,
        id: Math.max(...employees.map(e => e.id), 0) + 1,
        salary: parseFloat(formData.salary),
      };
      setEmployees([...employees, newEmployee]);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const formFields = [
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter employee full name',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'employee@wostore.com',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: '+91 9876543210',
    },
    {
      name: 'position',
      label: 'Position',
      type: 'text',
      required: true,
      placeholder: 'e.g., Processing Manager',
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: [
        { value: 'Operations', label: 'Operations' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Quality Control', label: 'Quality Control' },
        { value: 'Warehouse', label: 'Warehouse' },
        { value: 'Administration', label: 'Administration' },
        { value: 'Sales', label: 'Sales' },
      ],
    },
    {
      name: 'joiningDate',
      label: 'Joining Date',
      type: 'date',
      required: true,
    },
    {
      name: 'payrollType',
      label: 'Payroll Type',
      type: 'select',
      required: true,
      options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
      ],
    },
    {
      name: 'salary',
      label: 'Salary Amount (₹)',
      type: 'number',
      required: true,
      placeholder: 'Enter salary amount',
      step: '0.01',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ];

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const weeklyPayroll = employees
    .filter(e => e.payrollType === 'weekly' && e.status === 'active')
    .reduce((sum, e) => sum + e.salary, 0);
  const monthlyPayroll = employees
    .filter(e => e.payrollType === 'monthly' && e.status === 'active')
    .reduce((sum, e) => sum + e.salary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Employees</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage employee information and payroll settings
          </p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Employees</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{totalEmployees}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{activeEmployees}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Weekly Payroll</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{weeklyPayroll.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Payroll</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{monthlyPayroll.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No employees found. Add one to get started."
        />
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveEmployee}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
        submitText={editingEmployee ? 'Update Employee' : 'Add Employee'}
      />
    </div>
  );
};

export default Employees;
