import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Calendar, DollarSign, Package, FileText } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vendorId: '',
    vendorName: '',
    itemDescription: '',
    quantity: '',
    unit: 'kg',
    ratePerUnit: '',
    amount: '',
    paymentMode: 'Cash',
    invoiceNumber: '',
    remarks: '',
  });

  // Sample data
  useEffect(() => {
    const sampleVendors = [
      { id: 1, name: 'Kerala Spices Ltd' },
      { id: 2, name: 'Green Valley Traders' },
      { id: 3, name: 'Mountain Fresh Supplies' },
      { id: 4, name: 'Spice Garden Co.' },
    ];

    const samplePurchases = [
      {
        id: 1,
        date: '2025-10-15',
        vendorId: 1,
        vendorName: 'Kerala Spices Ltd',
        itemDescription: 'Raw Cardamom',
        quantity: 500,
        unit: 'kg',
        ratePerUnit: 850,
        amount: 425000,
        paymentMode: 'Bank Transfer',
        invoiceNumber: 'INV-2025-001',
        remarks: 'Grade A quality',
      },
      {
        id: 2,
        date: '2025-10-14',
        vendorId: 2,
        vendorName: 'Green Valley Traders',
        itemDescription: 'Raw Cardamom',
        quantity: 300,
        unit: 'kg',
        ratePerUnit: 820,
        amount: 246000,
        paymentMode: 'Cash',
        invoiceNumber: 'INV-2025-002',
        remarks: 'Grade B quality',
      },
      {
        id: 3,
        date: '2025-10-13',
        vendorId: 3,
        vendorName: 'Mountain Fresh Supplies',
        itemDescription: 'Raw Cardamom',
        quantity: 400,
        unit: 'kg',
        ratePerUnit: 830,
        amount: 332000,
        paymentMode: 'Bank Transfer',
        invoiceNumber: 'INV-2025-003',
        remarks: 'Premium quality',
      },
      {
        id: 4,
        date: '2025-10-12',
        vendorId: 1,
        vendorName: 'Kerala Spices Ltd',
        itemDescription: 'Packaging Materials',
        quantity: 1000,
        unit: 'pieces',
        ratePerUnit: 15,
        amount: 15000,
        paymentMode: 'UPI',
        invoiceNumber: 'INV-2025-004',
        remarks: 'Cardboard boxes',
      },
      {
        id: 5,
        date: '2025-10-11',
        vendorId: 4,
        vendorName: 'Spice Garden Co.',
        itemDescription: 'Raw Cardamom',
        quantity: 250,
        unit: 'kg',
        ratePerUnit: 840,
        amount: 210000,
        paymentMode: 'Cheque',
        invoiceNumber: 'INV-2025-005',
        remarks: 'Mixed grade',
      },
    ];

    setVendors(sampleVendors);
    setPurchases(samplePurchases);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{row.invoiceNumber}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'itemDescription',
      label: 'Item Description',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (value, row) => (
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {value} {row.unit}
        </span>
      ),
    },
    {
      key: 'ratePerUnit',
      label: 'Rate/Unit',
      render: (value) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          ₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Total Amount',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            ₹{value.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {value}
        </span>
      ),
    },
  ];

  const handleAddPurchase = () => {
    setEditingPurchase(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vendorId: '',
      vendorName: '',
      itemDescription: '',
      quantity: '',
      unit: 'kg',
      ratePerUnit: '',
      amount: '',
      paymentMode: 'Cash',
      invoiceNumber: '',
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      date: purchase.date,
      vendorId: purchase.vendorId,
      vendorName: purchase.vendorName,
      itemDescription: purchase.itemDescription,
      quantity: purchase.quantity,
      unit: purchase.unit,
      ratePerUnit: purchase.ratePerUnit,
      amount: purchase.amount,
      paymentMode: purchase.paymentMode,
      invoiceNumber: purchase.invoiceNumber,
      remarks: purchase.remarks,
    });
    setIsModalOpen(true);
  };

  const handleDeletePurchase = (purchase) => {
    if (window.confirm(`Are you sure you want to delete this purchase record?`)) {
      setPurchases(purchases.filter(p => p.id !== purchase.id));
    }
  };

  const handleSavePurchase = (e) => {
    e.preventDefault();
    
    // Calculate amount if not already set
    const calculatedAmount = formData.amount || (parseFloat(formData.quantity) * parseFloat(formData.ratePerUnit));
    
    // Find vendor name from vendorId
    const selectedVendor = vendors.find(v => v.id === parseInt(formData.vendorId));
    const vendorName = selectedVendor ? selectedVendor.name : formData.vendorName;
    
    if (editingPurchase) {
      // Update existing purchase
      setPurchases(purchases.map(p => 
        p.id === editingPurchase.id 
          ? { 
              ...p, 
              ...formData, 
              vendorName,
              amount: calculatedAmount,
              quantity: parseFloat(formData.quantity),
              ratePerUnit: parseFloat(formData.ratePerUnit)
            }
          : p
      ));
    } else {
      // Add new purchase
      const newPurchase = {
        ...formData,
        id: Math.max(...purchases.map(p => p.id), 0) + 1,
        vendorName,
        amount: calculatedAmount,
        quantity: parseFloat(formData.quantity),
        ratePerUnit: parseFloat(formData.ratePerUnit)
      };
      setPurchases([newPurchase, ...purchases]);
    }
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const handleFormChange = (newFormData) => {
    // Auto-calculate amount when quantity or rate changes
    if (newFormData.quantity && newFormData.ratePerUnit) {
      newFormData.amount = parseFloat(newFormData.quantity) * parseFloat(newFormData.ratePerUnit);
    }
    setFormData(newFormData);
  };

  const formFields = [
    {
      name: 'date',
      label: 'Purchase Date',
      type: 'date',
      required: true,
    },
    {
      name: 'vendorId',
      label: 'Vendor',
      type: 'select',
      required: true,
      options: vendors.map(v => ({ value: v.id, label: v.name })),
    },
    {
      name: 'itemDescription',
      label: 'Item Description',
      type: 'text',
      required: true,
      placeholder: 'Enter item description',
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
      placeholder: 'Enter quantity',
      step: '0.01',
    },
    {
      name: 'unit',
      label: 'Unit',
      type: 'select',
      required: true,
      options: [
        { value: 'kg', label: 'Kilogram (kg)' },
        { value: 'g', label: 'Gram (g)' },
        { value: 'pieces', label: 'Pieces' },
        { value: 'liters', label: 'Liters' },
        { value: 'boxes', label: 'Boxes' },
      ],
    },
    {
      name: 'ratePerUnit',
      label: 'Rate per Unit (₹)',
      type: 'number',
      required: true,
      placeholder: 'Enter rate per unit',
      step: '0.01',
    },
    {
      name: 'amount',
      label: 'Total Amount (₹)',
      type: 'number',
      required: true,
      placeholder: 'Auto-calculated',
      readOnly: true,
    },
    {
      name: 'paymentMode',
      label: 'Payment Mode',
      type: 'select',
      required: true,
      options: [
        { value: 'Cash', label: 'Cash' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'UPI', label: 'UPI' },
        { value: 'Cheque', label: 'Cheque' },
        { value: 'Credit', label: 'Credit' },
      ],
    },
    {
      name: 'invoiceNumber',
      label: 'Invoice Number',
      type: 'text',
      required: false,
      placeholder: 'Enter invoice number',
    },
    {
      name: 'remarks',
      label: 'Remarks',
      type: 'textarea',
      required: false,
      placeholder: 'Enter any additional notes',
    },
  ];

  const totalPurchases = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal text-slate-900 dark:text-slate-100">Purchase Management</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track and manage all purchase transactions
          </p>
        </div>
        <button
          onClick={handleAddPurchase}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Purchase
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Purchases</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{purchases.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ₹{totalPurchases.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Quantity</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalQuantity.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Vendors</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {new Set(purchases.map(p => p.vendorId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <DataTable
          columns={columns}
          data={purchases}
          loading={loading}
          onEdit={handleEditPurchase}
          onDelete={handleDeletePurchase}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No purchases found. Add one to get started."
        />
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSavePurchase}
        title={editingPurchase ? 'Edit Purchase' : 'Add New Purchase'}
        fields={formFields}
        formData={formData}
        setFormData={handleFormChange}
        submitText={editingPurchase ? 'Update Purchase' : 'Add Purchase'}
      />
    </div>
  );
};

export default Purchases;

