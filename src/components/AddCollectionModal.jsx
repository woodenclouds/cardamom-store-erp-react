import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ModalForm from './ModalForm';
import CustomerDropdown from './CustomerDropdown';
import { collectionAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  date: yup.string().required('Date is required'),
  quantity: yup.number().positive('Must be positive').required('Quantity is required'),
  rate: yup.number().positive('Must be positive').required('Rate is required'),
  advanceAmount: yup.number().min(0, 'Advance amount cannot be negative'),
  batchNo: yup.string(),
});

const AddCollectionModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingItem = null,
  collections = [],
  title = 'Add New Collection'
}) => {
  const { t } = useLanguage();
  
  // Customer management state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    fullName: '',
    location: '',
    houseName: '',
    phone: '',
  });

  // Fixed rate and batch number generation
  const FIXED_RATE = 12;
  const [nextBatchNumber, setNextBatchNumber] = useState('B001');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const quantity = watch('quantity');

  // Auto-calculate amount
  useEffect(() => {
    if (quantity) {
      setValue('amount', quantity * FIXED_RATE);
    }
  }, [quantity, setValue]);

  // Generate next batch number when collections change
  useEffect(() => {
    if (collections.length > 0) {
      generateNextBatchNumber(collections);
    }
  }, [collections]);

  const generateNextBatchNumber = (collectionsData = collections) => {
    // Find the highest batch number from existing collections
    const batchNumbers = collectionsData
      .map(c => c.batchNo)
      .filter(batchNo => batchNo && batchNo.startsWith('B'))
      .map(batchNo => parseInt(batchNo.substring(1)))
      .filter(num => !isNaN(num));
    
    const maxBatchNumber = batchNumbers.length > 0 ? Math.max(...batchNumbers) : 0;
    const nextNumber = maxBatchNumber + 1;
    const newBatchNumber = `B${nextNumber.toString().padStart(3, '0')}`;
    setNextBatchNumber(newBatchNumber);
    return newBatchNumber;
  };

  const onSubmit = async (data) => {
    try {
      // Ensure rate is set to fixed value and advance amount is included
      const formData = {
        ...data,
        rate: FIXED_RATE,
        advanceAmount: data.advanceAmount || 0
      };
      
      if (editingItem) {
        await collectionAPI.update(editingItem.id, formData);
        toast.success('Collection updated successfully');
      } else {
        await collectionAPI.create(formData);
        toast.success('Collection added successfully');
      }
      
      if (onSuccess) {
        onSuccess();
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save collection');
    }
  };

  const handleCloseModal = () => {
    onClose();
    reset({});
  };

  const handleOpenModal = () => {
    const today = new Date().toISOString().split('T')[0];
    // Generate fresh batch number for new collection
    const newBatchNumber = generateNextBatchNumber();
    reset({
      date: today,
      rate: FIXED_RATE,
      batchNo: newBatchNumber,
      advanceAmount: 0
    });
  };

  // Customer management functions
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerFormData({
      fullName: '',
      location: '',
      houseName: '',
      phone: '',
    });
    setIsCustomerModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerFormData({
      fullName: customer.fullName,
      location: customer.location,
      houseName: customer.houseName,
      phone: customer.phone,
    });
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      // Update existing customer
      // Note: In a real app, this would update the customer API
      toast.success('Customer updated successfully');
    } else {
      // Add new customer
      // Note: In a real app, this would call the customer API
      toast.success('Customer added successfully');
    }
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
  };

  const handleCloseCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
    setCustomerFormData({
      fullName: '',
      location: '',
      houseName: '',
      phone: '',
    });
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        reset(editingItem);
      } else {
        handleOpenModal();
      }
    }
  }, [isOpen, editingItem]);

  return (
    <>
      {/* Add Collection Modal */}
      <ModalForm
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={editingItem ? t('collection.editCollection') : title}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="label">
              {t('collection.customer')}
            </label>
            <CustomerDropdown
              value={watch('customerName') || ''}
              onChange={(value) => setValue('customerName', value)}
              onAddCustomer={handleAddCustomer}
              error={errors.customerName?.message}
              placeholder="Start typing to search..."
            />
          </div>

          <div>
            <label htmlFor="date" className="label">
              {t('common.date')}
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className="input-field"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="label">
                {t('collection.quantity')} (kg)
              </label>
              <input
                id="quantity"
                type="number"
                step="0.01"
                {...register('quantity')}
                className="input-field"
                placeholder="0"
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-600">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="label">
                {t('collection.pricePerKg')} (₹)
              </label>
              <input
                type="text"
                value={`₹${FIXED_RATE}`}
                className="input-field bg-slate-100 dark:bg-slate-700"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="label">{t('common.amount')} (₹)</label>
            <input
              type="text"
              value={quantity ? `₹${(quantity * FIXED_RATE).toLocaleString()}` : '₹0'}
              className="input-field bg-slate-100 dark:bg-slate-700"
              disabled
            />
          </div>

          <div>
            <label htmlFor="advanceAmount" className="label">
              Advance Amount (₹)
            </label>
            <input
              id="advanceAmount"
              type="number"
              step="0.01"
              {...register('advanceAmount')}
              className="input-field"
              placeholder="0"
            />
            {errors.advanceAmount && (
              <p className="mt-1 text-xs text-red-600">{errors.advanceAmount.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="batchNo" className="label">
              {t('dryingBatch.batchNumber')}
            </label>
            <input
              id="batchNo"
              type="text"
              {...register('batchNo')}
              className="input-field bg-slate-100 dark:bg-slate-700"
              disabled
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary flex-1"
            >
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? t('common.update') : t('collection.addCollection')}
            </button>
          </div>
        </form>
      </ModalForm>

      {/* Customer Management Modal */}
      <ModalForm
        isOpen={isCustomerModalOpen}
        onClose={handleCloseCustomerModal}
        onSubmit={handleSaveCustomer}
        title={editingCustomer ? t('customers.editCustomer') : t('customers.addNewCustomer')}
        fields={[
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
        ]}
        formData={customerFormData}
        setFormData={setCustomerFormData}
        submitText={editingCustomer ? t('customers.updateCustomer') : t('customers.addCustomer')}
      />
    </>
  );
};

export default AddCollectionModal;
