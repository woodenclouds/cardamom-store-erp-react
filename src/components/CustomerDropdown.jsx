import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { customerAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const CustomerDropdown = ({ 
  value, 
  onChange, 
  onAddCustomer, 
  error,
  placeholder = "Start typing to search...",
  className = ""
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search customers when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchCustomers(searchQuery);
    } else {
      loadCustomers();
    }
  }, [searchQuery]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerAPI.search('');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (query) => {
    setLoading(true);
    try {
      const response = await customerAPI.search(query);
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to search customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onChange(query);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    onChange(customer);
    setSearchQuery(customer);
    setIsOpen(false);
  };

  const handleAddCustomer = () => {
    setIsOpen(false);
    onAddCustomer();
  };

  const handleClear = () => {
    setSelectedCustomer(null);
    setSearchQuery('');
    onChange('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-20 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
          >
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {/* Add Customer Option */}
            <button
              type="button"
              onClick={handleAddCustomer}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-slate-700 flex items-center space-x-3 text-primary-600 dark:text-primary-400 font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>{t('customers.addNewCustomer')}</span>
            </button>

            {/* Search Results */}
            <div className="py-1">
              {loading ? (
                <div className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </div>
                </div>
              ) : customers.length > 0 ? (
                customers.map((customer, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCustomerSelect(customer)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{customer}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                  {searchQuery ? 'No customers found' : 'No customers available'}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default CustomerDropdown;
