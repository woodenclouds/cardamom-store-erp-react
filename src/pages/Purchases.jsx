import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Calendar, DollarSign, Package, FileText, Upload } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { useLanguage } from '../contexts/LanguageContext';

const Purchases = () => {
  const { t } = useLanguage();
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vendorId: '',
    vendorName: '',
    itemId: '',
    itemName: '',
    quantity: '',
    unit: 'kg',
    ratePerUnit: '',
    amount: '',
    paymentMode: 'Cash',
    invoiceNumber: '',
    invoiceFile: null,
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

    const sampleItems = [
      { id: 1, itemName: 'Raw Cardamom', description: 'Fresh cardamom pods for drying' },
      { id: 2, itemName: 'Packaging Materials', description: 'Cardboard boxes and packaging supplies' },
      { id: 3, itemName: 'Drying Equipment', description: 'Equipment used for drying process' },
    ];

    const samplePurchases = [
      {
        id: 1,
        date: '2025-10-15',
        vendorId: 1,
        vendorName: 'Kerala Spices Ltd',
        itemId: 1,
        itemName: 'Raw Cardamom',
        quantity: 500,
        unit: 'kg',
        ratePerUnit: 850,
        amount: 425000,
        paymentMode: 'Bank Transfer',
        invoiceNumber: 'INV-2025-001',
        invoiceFile: null,
        remarks: 'Grade A quality',
      },
      {
        id: 2,
        date: '2025-10-14',
        vendorId: 2,
        vendorName: 'Green Valley Traders',
        itemId: 1,
        itemName: 'Raw Cardamom',
        quantity: 300,
        unit: 'kg',
        ratePerUnit: 820,
        amount: 246000,
        paymentMode: 'Cash',
        invoiceNumber: 'INV-2025-002',
        invoiceFile: null,
        remarks: 'Grade B quality',
      },
      {
        id: 3,
        date: '2025-10-13',
        vendorId: 3,
        vendorName: 'Mountain Fresh Supplies',
        itemId: 1,
        itemName: 'Raw Cardamom',
        quantity: 400,
        unit: 'kg',
        ratePerUnit: 830,
        amount: 332000,
        paymentMode: 'Bank Transfer',
        invoiceNumber: 'INV-2025-003',
        invoiceFile: null,
        remarks: 'Premium quality',
      },
      {
        id: 4,
        date: '2025-10-12',
        vendorId: 1,
        vendorName: 'Kerala Spices Ltd',
        itemId: 2,
        itemName: 'Packaging Materials',
        quantity: 1000,
        unit: 'pieces',
        ratePerUnit: 15,
        amount: 15000,
        paymentMode: 'UPI',
        invoiceNumber: 'INV-2025-004',
        invoiceFile: null,
        remarks: 'Cardboard boxes',
      },
      {
        id: 5,
        date: '2025-10-11',
        vendorId: 4,
        vendorName: 'Spice Garden Co.',
        itemId: 1,
        itemName: 'Raw Cardamom',
        quantity: 250,
        unit: 'kg',
        ratePerUnit: 840,
        amount: 210000,
        paymentMode: 'Cheque',
        invoiceNumber: 'INV-2025-005',
        invoiceFile: null,
        remarks: 'Mixed grade',
      },
    ];

    setVendors(sampleVendors);
    setItems(sampleItems);
    setPurchases(samplePurchases);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'date',
      label: t('purchases.purchaseDate'),
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
      label: t('purchases.vendor'),
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
      key: 'itemName',
      label: t('purchases.item'),
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>
        </div>
      ),
    },
    {
      key: 'quantity',
      label: t('collection.quantity'),
      render: (value, row) => (
        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {value} {row.unit}
        </span>
      ),
    },
    {
      key: 'ratePerUnit',
      label: t('collection.pricePerKg'),
      render: (value) => (
        <span className="text-sm text-slate-600 dark:text-slate-300">
          ₹{value.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'amount',
      label: t('collection.totalAmount'),
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
      label: t('payments.paymentMethod'),
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {value}
        </span>
      ),
    },
  ];

  const handleAddPurchase = () => {
    setEditingPurchase(null);
    setInvoiceFile(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vendorId: '',
      vendorName: '',
      itemId: '',
      itemName: '',
      quantity: '',
      unit: 'kg',
      ratePerUnit: '',
      amount: '',
      paymentMode: 'Cash',
      invoiceNumber: '',
      invoiceFile: null,
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase);
    setInvoiceFile(purchase.invoiceFile || null);
    setFormData({
      date: purchase.date,
      vendorId: purchase.vendorId,
      vendorName: purchase.vendorName,
      itemId: purchase.itemId || '',
      itemName: purchase.itemName || '',
      quantity: purchase.quantity,
      unit: purchase.unit,
      ratePerUnit: purchase.ratePerUnit,
      amount: purchase.amount,
      paymentMode: purchase.paymentMode,
      invoiceNumber: purchase.invoiceNumber,
      invoiceFile: purchase.invoiceFile || null,
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
    
    // Find item name from itemId
    const selectedItem = items.find(i => i.id === parseInt(formData.itemId));
    const itemName = selectedItem ? selectedItem.itemName : formData.itemName;
    
    if (editingPurchase) {
      // Update existing purchase
      setPurchases(purchases.map(p => 
        p.id === editingPurchase.id 
          ? { 
              ...p, 
              ...formData, 
              vendorName,
              itemName,
              invoiceFile: invoiceFile || p.invoiceFile,
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
        itemName,
        invoiceFile: invoiceFile,
        amount: calculatedAmount,
        quantity: parseFloat(formData.quantity),
        ratePerUnit: parseFloat(formData.ratePerUnit)
      };
      setPurchases([newPurchase, ...purchases]);
    }
    setIsModalOpen(false);
    setEditingPurchase(null);
    setInvoiceFile(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPurchase(null);
    setInvoiceFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInvoiceFile(file);
      setFormData(prev => ({ ...prev, invoiceFile: file }));
    }
  };

  const handleFormChange = (newFormData) => {
    // Auto-calculate amount when quantity or rate changes
    if (newFormData.quantity && newFormData.ratePerUnit) {
      newFormData.amount = parseFloat(newFormData.quantity) * parseFloat(newFormData.ratePerUnit);
    }
    
    // Set item name when item is selected
    if (newFormData.itemId) {
      const selectedItem = items.find(i => i.id === parseInt(newFormData.itemId));
      if (selectedItem) {
        newFormData.itemName = selectedItem.itemName;
      }
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
      name: 'itemId',
      label: 'Item',
      type: 'select',
      required: true,
      options: items.map(i => ({ value: i.id, label: i.itemName })),
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
      name: 'invoiceFile',
      label: 'Upload Invoice',
      type: 'file',
      required: false,
      accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx',
      onChange: handleFileChange,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">{t('purchases.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('purchases.subtitle')}
          </p>
        </div>
        <button
          onClick={handleAddPurchase}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>{t('purchases.addPurchase')}</span>
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
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('purchases.totalPurchases')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{purchases.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('collection.totalAmount')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
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
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('collection.totalCollected')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
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
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('vendors.activeVendors')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
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

