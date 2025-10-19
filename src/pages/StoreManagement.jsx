import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Package, Droplet, CheckCircle2, Truck, Search, X } from 'lucide-react';
import ModalForm from '../components/ModalForm';
import AddCollectionModal from '../components/AddCollectionModal';
import { collectionAPI, returnAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

// StatusColumn component moved outside to prevent re-creation on every render
const StatusColumn = ({ title, icon: Icon, color, orders, actionButton, secondaryButton, searchKey, searchValue, onSearchChange, onClearSearch, t }) => (
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
          placeholder={t('common.search')}
          value={searchValue || ''}
          onChange={(e) => {
            const value = e.target.value;
            onSearchChange(searchKey, value);
          }}
          className="w-full pl-10 pr-8 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm border border-white/20 focus:border-white/40 focus:outline-none"
        />
        {searchValue && searchValue.length > 0 && (
          <button
            onClick={() => onClearSearch(searchKey)}
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
          <p className="text-sm">{t('common.noData')}</p>
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
                <span>{t('common.date')}:</span>
                <span className="font-medium">{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('collection.quantity')}:</span>
                <span className="font-medium">{order.quantity} kg</span>
              </div>
              {order.dryQty > 0 && order.status !== 'drying' && (
                <div className="flex justify-between">
                  <span>{t('dryingBatch.dryWeight')}:</span>
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
                <span>{t('common.amount')}:</span>
                <span className="font-normal text-slate-900 dark:text-slate-100">
                  ₹{order.amount?.toLocaleString() || (order.quantity * order.rate).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {actionButton && (
                <button
                  onClick={() => actionButton.action(order)}
                  className={`w-full ${actionButton.className} flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors`}
                >
                  {actionButton.icon}
                  {actionButton.label}
                </button>
              )}
              {secondaryButton && (
                <button
                  onClick={() => secondaryButton.action(order)}
                  className={`w-full ${secondaryButton.className} flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors`}
                >
                  {secondaryButton.icon}
                  {secondaryButton.label}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

const StoreManagement = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrierModalOpen, setIsDrierModalOpen] = useState(false);
  const [isChangeDrierModalOpen, setIsChangeDrierModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drierNumber, setDrierNumber] = useState('');
  const [dryQuantity, setDryQuantity] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchTerms, setSearchTerms] = useState({
    pending: '',
    drying: '',
    completed: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await collectionAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
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

  const handleChangeDrier = (order) => {
    setSelectedOrder(order);
    setDrierNumber(order.drierNo || '');
    setIsChangeDrierModalOpen(true);
  };

  const handleConfirmChangeDrier = () => {
    if (!drierNumber) {
      toast.error('Please select a dryer number');
      return;
    }
    
    setOrders(orders.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, drierNo: drierNumber }
        : o
    ));
    toast.success(`Dryer changed to ${drierNumber}`);
    setIsChangeDrierModalOpen(false);
    setDrierNumber('');
  };

  const handleMoveToPending = (order) => {
    if (window.confirm('Move this order back to Pending Collection?')) {
      setOrders(orders.map(o => 
        o.id === order.id 
          ? { ...o, status: 'pending', drierNo: null }
          : o
      ));
      toast.success('Moved back to Pending Collection');
    }
  };

  const handleMoveToDrying = (order) => {
    if (window.confirm('Move this order back to Drying?')) {
      setOrders(orders.map(o => 
        o.id === order.id 
          ? { ...o, status: 'drying' }
          : o
      ));
      toast.success('Moved back to Drying');
    }
  };

  const handleMarkReturned = (order) => {
    setSelectedOrder(order);
    setPaidAmount('');
    setPaymentMethod('');
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (!paidAmount || parseFloat(paidAmount) < 0) {
      toast.error('Please enter a valid paid amount');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    try {
      const totalAmount = selectedOrder.amount || (selectedOrder.quantity * selectedOrder.rate);
      const pendingAmount = totalAmount - parseFloat(paidAmount);
      
      // Create return record
      const returnData = {
        customerName: selectedOrder.customerName,
        location: selectedOrder.location || 'N/A',
        batchNo: selectedOrder.batchNo,
        rawQty: selectedOrder.quantity,
        dryQty: selectedOrder.dryQty,
        quantity: selectedOrder.dryQty,
        rate: 2500, // Default rate for returns (can be adjusted)
        amount: totalAmount,
        paidAmount: parseFloat(paidAmount),
        pendingAmount: pendingAmount,
        paymentStatus: pendingAmount > 0 ? 'Pending' : 'Paid',
        paymentMethod: paymentMethod,
        date: new Date().toISOString().split('T')[0],
      };
      
      await returnAPI.create(returnData);
      
      // Remove from orders after successful return creation
      setOrders(orders.filter(o => o.id !== selectedOrder.id));
      toast.success('Order returned to customer and recorded successfully');
      setIsReturnModalOpen(false);
      setPaidAmount('');
      setPaymentMethod('');
    } catch (error) {
      toast.error('Failed to create return record');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    fetchOrders();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            {t('storeManagement.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {t('storeManagement.subtitle')}
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

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <StatusColumn
          title="Pending Collection"
          icon={Package}
          color="bg-slate-600 dark:bg-slate-700 text-white"
          orders={pendingOrders}
          searchKey="pending"
          searchValue={searchTerms.pending}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          t={t}
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
          searchValue={searchTerms.drying}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          t={t}
          actionButton={{
            label: 'Mark Completed',
            icon: <CheckCircle2 className="w-4 h-4" />,
            action: handleMarkCompleted,
            className: 'bg-green-600 hover:bg-green-700 text-white',
          }}
          secondaryButton={{
            label: 'Change Dryer / Move Back',
            icon: <ArrowRight className="w-4 h-4 rotate-180" />,
            action: handleChangeDrier,
            className: 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200',
          }}
        />

        <StatusColumn
          title="Completed"
          icon={CheckCircle2}
          color="bg-green-600 dark:bg-green-700 text-white"
          orders={completedOrders}
          searchKey="completed"
          searchValue={searchTerms.completed}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          t={t}
          actionButton={{
            label: 'Return to Customer',
            icon: <Truck className="w-4 h-4" />,
            action: handleMarkReturned,
            className: 'bg-purple-600 hover:bg-purple-700 text-white',
          }}
          secondaryButton={{
            label: 'Move Back to Drying',
            icon: <ArrowRight className="w-4 h-4 rotate-180" />,
            action: handleMoveToDrying,
            className: 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200',
          }}
        />
      </div>

      {/* Add Collection Modal */}
      <AddCollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        collections={orders}
        title={t('collection.addNewCollection')}
      />

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
              onClick={() => setIsDrierModalOpen(false)}
              className="btn-secondary flex-1"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleAssignDrier}
              className="btn-primary flex-1"
            >
              Assign to Drier
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
              onClick={() => setIsCompleteModalOpen(false)}
              className="btn-secondary flex-1"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleConfirmCompleted}
              className="btn-primary flex-1"
            >
              Mark Completed
            </button>
          </div>
        </div>
      </ModalForm>

      {/* Change Dryer Modal */}
      <ModalForm
        isOpen={isChangeDrierModalOpen}
        onClose={() => setIsChangeDrierModalOpen(false)}
        title="Change Dryer / Move Back"
      >
        <div className="space-y-4">
          {selectedOrder && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-normal text-slate-900 dark:text-slate-100 mb-2">
                {selectedOrder.customerName}
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>Current Dryer: #{selectedOrder.drierNo}</p>
                <p>Quantity: {selectedOrder.quantity} kg</p>
                <p>Batch: {selectedOrder.batchNo || 'N/A'}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="newDrierNumber" className="label">
              Select New Dryer Number
            </label>
            <select
              id="newDrierNumber"
              value={drierNumber}
              onChange={(e) => setDrierNumber(e.target.value)}
              className="input-field"
            >
              <option value="">Select Dryer</option>
              <option value="D1">Dryer 1</option>
              <option value="D2">Dryer 2</option>
              <option value="D3">Dryer 3</option>
              <option value="D4">Dryer 4</option>
              <option value="D5">Dryer 5</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsChangeDrierModalOpen(false);
                handleMoveToPending(selectedOrder);
              }}
              className="btn-secondary flex-1"
            >
              Move to Pending
            </button>
            <button
              onClick={handleConfirmChangeDrier}
              className="btn-primary flex-1"
            >
              Change Dryer
            </button>
          </div>
        </div>
      </ModalForm>

      {/* Return to Customer Modal */}
      <ModalForm
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Return to Customer"
      >
        <div className="space-y-4">
          {selectedOrder && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="font-normal text-slate-900 dark:text-slate-100 mb-2">
                {selectedOrder.customerName}
              </h3>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>Batch: {selectedOrder.batchNo || 'N/A'}</p>
                <p>Raw Quantity: {selectedOrder.quantity} kg</p>
                {selectedOrder.dryQty > 0 && (
                  <p>Dry Weight: {selectedOrder.dryQty} kg</p>
                )}
                <p>Dryer: #{selectedOrder.drierNo}</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Total Amount:
              </span>
              <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                ₹{selectedOrder?.amount?.toLocaleString() || (selectedOrder?.quantity * selectedOrder?.rate)?.toLocaleString() || '0'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="paidAmount" className="label">
              Customer Paid Amount
            </label>
            <input
              id="paidAmount"
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="input-field"
              placeholder="Enter paid amount"
            />
            {paidAmount && selectedOrder && (
              <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Total Amount:</span>
                  <span className="font-medium">₹{(selectedOrder?.amount || (selectedOrder?.quantity * selectedOrder?.rate) || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-600 dark:text-slate-400">Paid Amount:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">₹{parseFloat(paidAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Pending Balance:</span>
                  <span className={`font-medium ${(selectedOrder?.amount || (selectedOrder?.quantity * selectedOrder?.rate) || 0) - parseFloat(paidAmount || 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    ₹{((selectedOrder?.amount || (selectedOrder?.quantity * selectedOrder?.rate) || 0) - parseFloat(paidAmount || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="paymentMethod" className="label">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field"
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsReturnModalOpen(false)}
              className="btn-secondary flex-1"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleConfirmReturn}
              className="btn-primary flex-1"
            >
              Complete Return
            </button>
          </div>
        </div>
      </ModalForm>

    </div>
  );
};

export default StoreManagement;

