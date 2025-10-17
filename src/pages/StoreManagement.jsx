import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Package, Droplet, CheckCircle2, Truck, Search, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ModalForm from '../components/ModalForm';
import { collectionAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  date: yup.string().required('Date is required'),
  quantity: yup.number().positive('Must be positive').required('Quantity is required'),
  rate: yup.number().positive('Must be positive').required('Rate is required'),
});

const StoreManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrierModalOpen, setIsDrierModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [drierNumber, setDrierNumber] = useState('');
  const [dryQuantity, setDryQuantity] = useState('');
  const [searchTerms, setSearchTerms] = useState({
    pending: '',
    drying: '',
    completed: '',
  });

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
  const rate = watch('rate');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (quantity && rate) {
      setValue('amount', quantity * rate);
    }
  }, [quantity, rate, setValue]);

  const fetchOrders = async () => {
    try {
      const response = await collectionAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
  };

  const searchCustomers = async (query) => {
    try {
      const response = await customerAPI.search(query);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search customers');
    }
  };

  const onSubmit = async (data) => {
    try {
      const newOrder = {
        ...data,
        status: 'pending',
        drierNo: null,
        dryQty: 0,
      };
      await collectionAPI.create(newOrder);
      toast.success('Collection added successfully');
      fetchOrders();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to add collection');
    }
  };

  const handleAddToDrier = (order) => {
    setSelectedOrder(order);
    setDrierNumber('');
    setIsDrierModalOpen(true);
  };

  const handleAssignDrier = () => {
    if (!drierNumber) {
      toast.error('Please enter drier number');
      return;
    }
    
    setOrders(orders.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, status: 'drying', drierNo: drierNumber }
        : o
    ));
    toast.success(`Assigned to Drier ${drierNumber}`);
    setIsDrierModalOpen(false);
    setDrierNumber('');
  };

  const handleMarkCompleted = (order) => {
    setSelectedOrder(order);
    setDryQuantity((order.quantity * 0.3).toFixed(1)); // Default 30% yield
    setIsCompleteModalOpen(true);
  };

  const handleConfirmCompleted = () => {
    if (!dryQuantity || dryQuantity <= 0) {
      toast.error('Please enter a valid dried quantity');
      return;
    }
    
    setOrders(orders.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, status: 'completed', dryQty: parseFloat(dryQuantity) }
        : o
    ));
    toast.success('Batch marked as completed');
    setIsCompleteModalOpen(false);
    setDryQuantity('');
  };

  const handleMarkReturned = (order) => {
    // Remove from orders completely when returned
    setOrders(orders.filter(o => o.id !== order.id));
    toast.success('Order completed and removed from tracking');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset({});
  };

  const handleSearchChange = (column, value) => {
    console.log('Search change:', column, value); // Debug log
    setSearchTerms(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearSearch = (column) => {
    setSearchTerms(prev => ({
      ...prev,
      [column]: ''
    }));
  };

  // Search function to filter orders
  const searchOrders = (orders, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return orders;
    
    const term = searchTerm.toLowerCase().trim();
    console.log('Searching with term:', term, 'in orders:', orders.length); // Debug log
    const filtered = orders.filter(order => 
      order.customerName.toLowerCase().includes(term) ||
      (order.batchNo && order.batchNo.toLowerCase().includes(term)) ||
      (order.drierNo && order.drierNo.toLowerCase().includes(term)) ||
      order.quantity.toString().includes(term) ||
      order.amount?.toString().includes(term) ||
      order.date.includes(term)
    );
    console.log('Filtered results:', filtered.length); // Debug log
    return filtered;
  };

  // Filter orders by status and search
  const pendingOrders = searchOrders(
    orders.filter(o => o.status === 'pending'), 
    searchTerms.pending
  );
  const dryingOrders = searchOrders(
    orders.filter(o => o.status === 'drying'), 
    searchTerms.drying
  );
  const completedOrders = searchOrders(
    orders.filter(o => o.status === 'completed'), 
    searchTerms.completed
  );

  const StatusColumn = ({ title, icon: Icon, color, orders, actionButton, searchKey }) => (
    <div className="flex-1 min-w-[280px]">
      <div className={`${color} rounded-t-lg p-4`}>
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-5 h-5" />
          <h2 className="font-normal text-lg">{title}</h2>
          <span className="ml-auto bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-sm font-medium text-slate-900 dark:text-slate-100">
            {orders.length}
          </span>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerms[searchKey] || ''}
            onChange={(e) => {
              const value = e.target.value;
              handleSearchChange(searchKey, value);
            }}
            className="w-full pl-10 pr-8 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm border border-white/20 focus:border-white/40 focus:outline-none"
          />
          {searchTerms[searchKey] && searchTerms[searchKey].length > 0 && (
            <button
              onClick={() => clearSearch(searchKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 min-h-[calc(100vh-280px)] p-3 space-y-3 rounded-b-lg">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No items</p>
          </div>
        ) : (
          orders.map(order => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-normal text-slate-900 dark:text-slate-100">
                  {order.customerName}
                </h3>
                {order.batchNo && (
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                    {order.batchNo}
                  </span>
                )}
              </div>
              
              <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{order.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Raw Qty:</span>
                  <span className="font-medium">{order.quantity} kg</span>
                </div>
                {order.dryQty > 0 && (
                  <div className="flex justify-between">
                    <span>Dry Qty:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{order.dryQty} kg</span>
                  </div>
                )}
                {order.drierNo && (
                  <div className="flex justify-between">
                    <span>Drier:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">#{order.drierNo}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Amount:</span>
                  <span className="font-normal text-slate-900 dark:text-slate-100">
                    ₹{order.amount?.toLocaleString() || (order.quantity * order.rate).toLocaleString()}
                  </span>
                </div>
              </div>

              {actionButton && (
                <button
                  onClick={() => actionButton.action(order)}
                  className={`mt-3 w-full ${actionButton.className} flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors`}
                >
                  {actionButton.icon}
                  {actionButton.label}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-slate-900 dark:text-slate-100 mb-2">
            Store Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track orders from collection to return
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Collection
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <StatusColumn
          title="Pending Collection"
          icon={Package}
          color="bg-slate-600 dark:bg-slate-700 text-white"
          orders={pendingOrders}
          searchKey="pending"
          actionButton={{
            label: 'Add to Drier',
            icon: <ArrowRight className="w-4 h-4" />,
            action: handleAddToDrier,
            className: 'bg-blue-600 hover:bg-blue-700 text-white',
          }}
        />

        <StatusColumn
          title="In Drying"
          icon={Droplet}
          color="bg-blue-600 dark:bg-blue-700 text-white"
          orders={dryingOrders}
          searchKey="drying"
          actionButton={{
            label: 'Mark Completed',
            icon: <CheckCircle2 className="w-4 h-4" />,
            action: handleMarkCompleted,
            className: 'bg-green-600 hover:bg-green-700 text-white',
          }}
        />

        <StatusColumn
          title="Completed"
          icon={CheckCircle2}
          color="bg-green-600 dark:bg-green-700 text-white"
          orders={completedOrders}
          searchKey="completed"
          actionButton={{
            label: 'Complete & Remove',
            icon: <Truck className="w-4 h-4" />,
            action: handleMarkReturned,
            className: 'bg-purple-600 hover:bg-purple-700 text-white',
          }}
        />
      </div>

      {/* Add Collection Modal */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Collection"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="label">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              {...register('customerName')}
              onChange={(e) => searchCustomers(e.target.value)}
              className="input-field"
              placeholder="Start typing to search..."
              list="customers"
            />
            <datalist id="customers">
              {customers.map((customer, idx) => (
                <option key={idx} value={customer} />
              ))}
            </datalist>
            {errors.customerName && (
              <p className="mt-1 text-xs text-red-600">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="label">
              Date
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
                Quantity (kg)
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
              <label htmlFor="rate" className="label">
                Rate/kg (₹)
              </label>
              <input
                id="rate"
                type="number"
                step="0.01"
                {...register('rate')}
                className="input-field"
                placeholder="0"
              />
              {errors.rate && (
                <p className="mt-1 text-xs text-red-600">{errors.rate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Amount (₹)</label>
            <input
              type="text"
              value={quantity && rate ? `₹${(quantity * rate).toLocaleString()}` : '₹0'}
              className="input-field bg-slate-100 dark:bg-slate-700"
              disabled
            />
          </div>

          <div>
            <label htmlFor="batchNo" className="label">
              Batch No (Optional)
            </label>
            <input
              id="batchNo"
              type="text"
              {...register('batchNo')}
              className="input-field"
              placeholder="e.g., B001"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Add Collection
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

      {/* Assign Drier Modal */}
      <ModalForm
        isOpen={isDrierModalOpen}
        onClose={() => setIsDrierModalOpen(false)}
        title="Assign to Drier"
      >
        <div className="space-y-4">
          {selectedOrder && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-normal text-slate-900 dark:text-slate-100 mb-2">
                {selectedOrder.customerName}
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>Quantity: {selectedOrder.quantity} kg</p>
                <p>Batch: {selectedOrder.batchNo || 'N/A'}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="drierNumber" className="label">
              Select Drier Number
            </label>
            <select
              id="drierNumber"
              value={drierNumber}
              onChange={(e) => setDrierNumber(e.target.value)}
              className="input-field"
            >
              <option value="">Select Drier</option>
              <option value="D1">Drier 1</option>
              <option value="D2">Drier 2</option>
              <option value="D3">Drier 3</option>
              <option value="D4">Drier 4</option>
              <option value="D5">Drier 5</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAssignDrier}
              className="btn-primary flex-1"
            >
              Assign Drier
            </button>
            <button
              onClick={() => setIsDrierModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalForm>

      {/* Mark Completed Modal */}
      <ModalForm
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Mark as Completed"
      >
        <div className="space-y-4">
          {selectedOrder && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-normal text-slate-900 dark:text-slate-100 mb-2">
                {selectedOrder.customerName}
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>Raw Quantity: {selectedOrder.quantity} kg</p>
                <p>Batch: {selectedOrder.batchNo || 'N/A'}</p>
                <p>Drier: #{selectedOrder.drierNo}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="dryQuantity" className="label">
              Dried Quantity (kg)
            </label>
            <input
              id="dryQuantity"
              type="number"
              step="0.1"
              value={dryQuantity}
              onChange={(e) => setDryQuantity(e.target.value)}
              className="input-field"
              placeholder="Enter dried quantity"
            />
            <p className="mt-1 text-xs text-slate-500">
              Expected yield: ~30% of raw quantity
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleConfirmCompleted}
              className="btn-primary flex-1"
            >
              Mark Completed
            </button>
            <button
              onClick={() => setIsCompleteModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

export default StoreManagement;

