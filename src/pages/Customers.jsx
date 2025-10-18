import React, { useState, useEffect } from 'react';
import { Plus, Users, MapPin, Phone, Home } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { useLanguage } from '../contexts/LanguageContext';

const Customers = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    houseName: '',
    phone: '',
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    const sampleCustomers = [
      {
        id: 1,
        fullName: 'John Smith',
        location: 'Downtown',
        houseName: 'Smith Villa',
        phone: '+1 (555) 123-4567',
        createdAt: '2024-01-15',
      },
      {
        id: 2,
        fullName: 'Sarah Johnson',
        location: 'Uptown',
        houseName: 'Rose Garden House',
        phone: '+1 (555) 987-6543',
        createdAt: '2024-01-20',
      },
      {
        id: 3,
        fullName: 'Michael Brown',
        location: 'Suburbs',
        houseName: 'Green Meadows',
        phone: '+1 (555) 456-7890',
        createdAt: '2024-02-01',
      },
      {
        id: 4,
        fullName: 'Emily Davis',
        location: 'Downtown',
        houseName: 'Sunset Residence',
        phone: '+1 (555) 321-0987',
        createdAt: '2024-02-10',
      },
    ];
    
    // Set data immediately like other pages
    setCustomers(sampleCustomers);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'fullName',
      label: t('customers.fullName'),
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      label: t('customers.location'),
      render: (value) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'houseName',
      label: t('customers.houseName'),
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Home className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: t('common.phone'),
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: t('customers.addedDate'),
      render: (value) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData({
      fullName: '',
      location: '',
      houseName: '',
      phone: '',
    });
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      fullName: customer.fullName,
      location: customer.location,
      houseName: customer.houseName,
      phone: customer.phone,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customer) => {
    if (window.confirm(`${t('common.confirmDelete')} ${customer.fullName}?`)) {
      setCustomers(customers.filter(c => c.id !== customer.id));
    }
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      // Update existing customer
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id 
          ? { ...c, ...formData, id: editingCustomer.id }
          : c
      ));
    } else {
      // Add new customer
      const newCustomer = {
        ...formData,
        id: Math.max(...customers.map(c => c.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, newCustomer]);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({
      fullName: '',
      location: '',
      houseName: '',
      phone: '',
    });
  };

  const formFields = [
    {
      name: 'fullName',
      label: t('customers.fullName'),
      type: 'text',
      required: true,
      placeholder: t('customers.enterFullName'),
    },
    {
      name: 'location',
      label: t('customers.location'),
      type: 'select',
      required: true,
      options: [
        { value: 'Downtown', label: 'Downtown' },
        { value: 'Uptown', label: 'Uptown' },
        { value: 'Suburbs', label: 'Suburbs' },
        { value: 'East Side', label: 'East Side' },
        { value: 'West Side', label: 'West Side' },
        { value: 'North End', label: 'North End' },
        { value: 'South End', label: 'South End' },
      ],
    },
    {
      name: 'houseName',
      label: t('customers.houseName'),
      type: 'text',
      required: true,
      placeholder: t('customers.enterHouseName'),
    },
    {
      name: 'phone',
      label: t('customers.phoneNumber'),
      type: 'tel',
      required: true,
      placeholder: t('customers.enterPhoneNumber'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">{t('customers.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('customers.subtitle')}
          </p>
        </div>
        <button
          onClick={handleAddCustomer}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>{t('customers.addCustomer')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('customers.totalCustomers')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{customers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('customers.locations')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                {new Set(customers.map(c => c.location)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('customers.houses')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                {customers.filter(c => c.houseName).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <DataTable
          columns={columns}
          data={customers}
          loading={loading}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage={t('customers.noCustomersFound')}
        />
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveCustomer}
        title={editingCustomer ? t('customers.editCustomer') : t('customers.addNewCustomer')}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
        submitText={editingCustomer ? t('customers.updateCustomer') : t('customers.addCustomer')}
      />
    </div>
  );
};

export default Customers;
