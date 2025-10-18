import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DataTable from '../components/DataTable';
import ModalForm from '../components/ModalForm';
import { batchAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const schema = yup.object().shape({
  batchNo: yup.string().required('Batch number is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string(),
  rawQty: yup.number().positive('Must be positive').required('Raw quantity is required'),
  dryQty: yup.number().min(0, 'Cannot be negative').required('Dry quantity is required'),
  grade: yup.string().required('Grade is required'),
  status: yup.string().required('Status is required'),
});

const DryingBatch = () => {
  const { t } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'In Progress',
      grade: 'A',
    },
  });

  const rawQty = watch('rawQty');
  const dryQty = watch('dryQty');

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await batchAPI.getAll();
      setBatches(response.data);
    } catch (error) {
      toast.error('Failed to fetch batches');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingItem) {
        await batchAPI.update(editingItem.id, data);
        toast.success('Batch updated successfully');
      } else {
        await batchAPI.create(data);
        toast.success('Batch created successfully');
      }
      fetchBatches();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save batch');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    reset(item);
    setIsModalOpen(true);
  };

  const handleMarkCompleted = async (item) => {
    if (window.confirm('Mark this batch as completed?')) {
      try {
        await batchAPI.markCompleted(item.id);
        toast.success('Batch marked as completed');
        fetchBatches();
      } catch (error) {
        toast.error('Failed to update batch');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset({
      status: 'In Progress',
      grade: 'A',
    });
  };

  const calculateLoss = (raw, dry) => {
    if (!raw || !dry) return '0';
    const loss = ((raw - dry) / raw) * 100;
    return loss.toFixed(2);
  };

  const columns = [
    { key: 'batchNo', label: t('dryingBatch.batchNumber') },
    { key: 'startDate', label: t('dryingBatch.startDate') },
    { key: 'endDate', label: t('dryingBatch.endDate'), render: (value) => value || '-' },
    { key: 'rawQty', label: t('dryingBatch.wetWeight') + ' (kg)' },
    { key: 'dryQty', label: t('dryingBatch.dryWeight') + ' (kg)' },
    {
      key: 'loss',
      label: 'Loss %',
      render: (_, row) => calculateLoss(row.rawQty, row.dryQty) + '%',
    },
    { key: 'grade', label: 'Grade' },
    {
      key: 'status',
      label: t('common.status'),
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'Completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            {t('dryingBatch.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('dryingBatch.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          <span>{t('dryingBatch.addBatch')}</span>
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <DataTable
          columns={columns}
          data={batches}
          onEdit={handleEdit}
          onDelete={(item) => {
            if (item.status === 'In Progress') {
              handleMarkCompleted(item);
            }
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Batch' : 'Add Batch'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="batchNo" className="label">
              Batch Number
            </label>
            <input
              id="batchNo"
              type="text"
              {...register('batchNo')}
              className="input-field"
              placeholder="e.g., B001"
            />
            {errors.batchNo && (
              <p className="mt-1 text-xs text-red-600">{errors.batchNo.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="label">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="input-field"
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="label">
                End Date (Optional)
              </label>
              <input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rawQty" className="label">
                Raw Quantity (kg)
              </label>
              <input
                id="rawQty"
                type="number"
                step="0.01"
                {...register('rawQty')}
                className="input-field"
                placeholder="0"
              />
              {errors.rawQty && (
                <p className="mt-1 text-xs text-red-600">{errors.rawQty.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dryQty" className="label">
                Dry Quantity (kg)
              </label>
              <input
                id="dryQty"
                type="number"
                step="0.01"
                {...register('dryQty')}
                className="input-field"
                placeholder="0"
              />
              {errors.dryQty && (
                <p className="mt-1 text-xs text-red-600">{errors.dryQty.message}</p>
              )}
            </div>
          </div>

          {rawQty && dryQty && (
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                Drying Loss: {calculateLoss(rawQty, dryQty)}%
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade" className="label">
                Grade
              </label>
              <select id="grade" {...register('grade')} className="input-field">
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="label">
                Status
              </label>
              <select id="status" {...register('status')} className="input-field">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
};

export default DryingBatch;

