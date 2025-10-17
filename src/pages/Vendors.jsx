import React, { useState, useEffect } from 'react';
import { Plus, Building2, Phone, Mail, MapPin, User } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    status: 'active',
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    const sampleVendors = [
      {
        id: 1,
        vendorName: 'Kerala Spices Ltd',
        contactPerson: 'Rajesh Kumar',
        email: 'contact@keralaspices.com',
        phone: '+91 9876543210',
        address: 'Idukki, Kerala',
        gstNumber: '29AABCU9603R1ZM',
        status: 'active',
        createdAt: '2024-01-15',
      },
      {
        id: 2,
        vendorName: 'Green Valley Traders',
        contactPerson: 'Suresh Nair',
        email: 'info@greenvalley.com',
        phone: '+91 9876543211',
        address: 'Munnar, Kerala',
        gstNumber: '29AABCU9604R1ZN',
        status: 'active',
        createdAt: '2024-02-20',
      },
      {
        id: 3,
        vendorName: 'Mountain Fresh Supplies',
        contactPerson: 'Mahesh Singh',
        email: 'sales@mountainfresh.com',
        phone: '+91 9876543212',
        address: 'Thekkady, Kerala',
        gstNumber: '29AABCU9605R1ZO',
        status: 'active',
        createdAt: '2024-03-10',
      },
      {
        id: 4,
        vendorName: 'Spice Garden Co.',
        contactPerson: 'Priya Sharma',
        email: 'contact@spicegarden.com',
        phone: '+91 9876543213',
        address: 'Kumily, Kerala',
        gstNumber: '29AABCU9606R1ZP',
        status: 'inactive',
        createdAt: '2024-04-05',
      },
    ];
    
    setVendors(sampleVendors);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'vendorName',
      label: 'Vendor Name',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-slate-400" />
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
      key: 'address',
      label: 'Address',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
  ];

  const handleAddVendor = () => {
    setEditingVendor(null);
    setFormData({
      vendorName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      gstNumber: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      vendorName: vendor.vendorName,
      contactPerson: vendor.contactPerson,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      gstNumber: vendor.gstNumber,
      status: vendor.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteVendor = (vendor) => {
    if (window.confirm(`Are you sure you want to delete ${vendor.vendorName}?`)) {
      setVendors(vendors.filter(v => v.id !== vendor.id));
    }
  };

  const handleSaveVendor = (e) => {
    e.preventDefault();
    if (editingVendor) {
      // Update existing vendor
      setVendors(vendors.map(v => 
        v.id === editingVendor.id 
          ? { ...v, ...formData, id: editingVendor.id }
          : v
      ));
    } else {
      // Add new vendor
      const newVendor = {
        ...formData,
        id: Math.max(...vendors.map(v => v.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setVendors([...vendors, newVendor]);
    }
    setIsModalOpen(false);
    setEditingVendor(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVendor(null);
    setFormData({
      vendorName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      gstNumber: '',
      status: 'active',
    });
  };

  const formFields = [
    {
      name: 'vendorName',
      label: 'Vendor Name',
      type: 'text',
      required: true,
      placeholder: 'Enter vendor name',
    },
    {
      name: 'contactPerson',
      label: 'Contact Person',
      type: 'text',
      required: true,
      placeholder: 'Enter contact person name',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: 'Enter phone number',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter email address',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      required: true,
      placeholder: 'Enter complete address',
    },
    {
      name: 'gstNumber',
      label: 'GST Number',
      type: 'text',
      required: false,
      placeholder: 'Enter GST number (optional)',
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

  const activeVendorsCount = vendors.filter(v => v.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">Vendors</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your vendor information and supplier details
          </p>
        </div>
        <button
          onClick={handleAddVendor}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Vendors</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{vendors.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Vendors</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {activeVendorsCount}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Locations</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {new Set(vendors.map(v => v.address.split(',')[0])).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <DataTable
          columns={columns}
          data={vendors}
          loading={loading}
          onEdit={handleEditVendor}
          onDelete={handleDeleteVendor}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No vendors found. Add one to get started."
        />
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveVendor}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
        submitText={editingVendor ? 'Update Vendor' : 'Add Vendor'}
      />
    </div>
  );
};

export default Vendors;

