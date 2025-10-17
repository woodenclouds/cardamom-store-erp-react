import React, { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import { ledgerAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';

const Ledger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.search('');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers');
    }
  };

  const fetchLedger = async (customerName) => {
    if (!customerName) return;
    setLoading(true);
    try {
      const response = await ledgerAPI.getByCustomer(customerName);
      setLedgerData(response.data);
    } catch (error) {
      toast.error('Failed to fetch ledger data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await ledgerAPI.export(format);
      toast.success(`Exporting as ${format.toUpperCase()}...`);
      // In a real app, this would trigger a file download
      console.log('Export URL:', response.data.url);
    } catch (error) {
      toast.error('Failed to export');
    }
  };

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'reference', label: 'Reference' },
    {
      key: 'debit',
      label: 'Debit',
      render: (value) => value ? `₹${value.toLocaleString()}` : '-',
    },
    {
      key: 'credit',
      label: 'Credit',
      render: (value) => value ? `₹${value.toLocaleString()}` : '-',
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value) => `₹${value.toLocaleString()}`,
    },
    { key: 'remarks', label: 'Remarks', render: (value) => value || '-' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Customer Ledger
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          View customer account statements
        </p>
      </div>

      {/* Search and Export */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="customerSearch" className="label">
              Select Customer
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                id="customerSearch"
                value={selectedCustomer}
                onChange={(e) => {
                  setSelectedCustomer(e.target.value);
                  fetchLedger(e.target.value);
                }}
                className="input-field pl-10"
              >
                <option value="">Choose a customer...</option>
                {customers.map((customer, idx) => (
                  <option key={idx} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <button
              onClick={() => handleExport('pdf')}
              disabled={!selectedCustomer}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={!selectedCustomer}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      {selectedCustomer && (
        <div className="card">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Ledger for {selectedCustomer}
            </h2>
          </div>
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Loading...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={ledgerData} searchable={false} />
          )}
        </div>
      )}

      {!selectedCustomer && (
        <div className="card">
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a customer to view their ledger</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ledger;

