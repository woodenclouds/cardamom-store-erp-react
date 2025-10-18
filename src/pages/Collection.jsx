import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../components/DataTable';
import AddCollectionModal from '../components/AddCollectionModal';
import { collectionAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const Collection = () => {
  const { t } = useLanguage();
  const [collections, setCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await collectionAPI.getAll();
      setCollections(response.data);
    } catch (error) {
      toast.error('Failed to fetch collections');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionAPI.delete(item.id);
        toast.success('Collection deleted successfully');
        fetchCollections();
      } catch (error) {
        toast.error('Failed to delete collection');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleOpenModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchCollections();
  };

  const columns = [
    { key: 'customerName', label: t('collection.customer') },
    { key: 'date', label: t('common.date') },
    { key: 'quantity', label: t('collection.quantity') + ' (kg)' },
    {
      key: 'rate',
      label: t('collection.pricePerKg'),
      render: (value) => `₹${value}`,
    },
    {
      key: 'amount',
      label: t('common.amount'),
      render: (value) => `₹${value.toLocaleString()}`,
    },
    {
      key: 'advanceAmount',
      label: 'Advance Amount',
      render: (value) => `₹${(value || 0).toLocaleString()}`,
    },
    { key: 'batchNo', label: t('dryingBatch.batchNumber') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            {t('collection.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('collection.subtitle')}
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>{t('collection.addCollection')}</span>
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <DataTable
          columns={columns}
          data={collections}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Collection Modal */}
      <AddCollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editingItem={editingItem}
        collections={collections}
        title={t('collection.addNewCollection')}
      />
    </div>
  );
};

export default Collection;

