import React, { useState, useEffect } from 'react';
import { Plus, Package, FileText } from 'lucide-react';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { useLanguage } from '../contexts/LanguageContext';

const Items = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
  });

  // Sample data - replace with actual API calls
  useEffect(() => {
    const sampleItems = [
      {
        id: 1,
        itemName: 'Raw Cardamom',
        description: 'Fresh cardamom pods for drying',
        createdAt: '2024-01-15',
      },
      {
        id: 2,
        itemName: 'Packaging Materials',
        description: 'Cardboard boxes and packaging supplies',
        createdAt: '2024-02-20',
      },
      {
        id: 3,
        itemName: 'Drying Equipment',
        description: 'Equipment used for drying process',
        createdAt: '2024-03-10',
      },
    ];
    
    setItems(sampleItems);
    setLoading(false);
  }, []);

  const columns = [
    {
      key: 'itemName',
      label: t('items.itemName'),
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      label: t('common.description'),
      render: (value) => (
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 dark:text-slate-300">{value || '-'}</span>
        </div>
      ),
    },
  ];

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      itemName: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      description: item.description,
    });
    setIsModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`${t('common.confirmDelete')} ${item.itemName}?`)) {
      setItems(items.filter(i => i.id !== item.id));
    }
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      // Update existing item
      setItems(items.map(i => 
        i.id === editingItem.id 
          ? { ...i, ...formData, id: editingItem.id }
          : i
      ));
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: Math.max(...items.map(i => i.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setItems([...items, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      itemName: '',
      description: '',
    });
  };

  const formFields = [
    {
      name: 'itemName',
      label: t('items.itemName'),
      type: 'text',
      required: true,
      placeholder: t('items.enterItemName'),
    },
    {
      name: 'description',
      label: t('common.description'),
      type: 'textarea',
      required: false,
      placeholder: t('items.enterDescription'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">{t('items.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('items.subtitle')}
          </p>
        </div>
        <button
          onClick={handleAddItem}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span>{t('items.addItem')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('items.totalItems')}</p>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">{items.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          searchable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage={t('items.noItemsFound')}
        />
      </div>

      {/* Modal Form */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveItem}
        title={editingItem ? t('items.editItem') : t('items.addNewItem')}
        fields={formFields}
        formData={formData}
        setFormData={setFormData}
        submitText={editingItem ? t('items.updateItem') : t('items.addItem')}
      />
    </div>
  );
};

export default Items;

