import React, { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import DataTable from '../components/DataTable';
import { reportAPI } from '../services/api';
import toast from 'react-hot-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('drying');
  const [dryingReport, setDryingReport] = useState([]);
  const [outstandingReport, setOutstandingReport] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [dryingRes, outstandingRes] = await Promise.all([
        reportAPI.getDryingYield(dateRange),
        reportAPI.getOutstanding(),
      ]);
      setDryingReport(dryingRes.data);
      setOutstandingReport(outstandingRes.data);
    } catch (error) {
      toast.error('Failed to fetch reports');
    }
  };

  const handleExport = (reportType) => {
    toast.success(`Exporting ${reportType} report...`);
    // In a real app, this would trigger a file download
  };

  const dryingColumns = [
    { key: 'batchNo', label: 'Batch No' },
    { key: 'rawQty', label: 'Raw Qty (kg)' },
    { key: 'dryQty', label: 'Dry Qty (kg)' },
    {
      key: 'yieldPercentage',
      label: 'Yield %',
      render: (value) => `${value}%`,
    },
    {
      key: 'loss',
      label: 'Loss %',
      render: (value) => `${value}%`,
    },
  ];

  const outstandingColumns = [
    { key: 'customerName', label: 'Customer Name' },
    {
      key: 'outstanding',
      label: 'Outstanding Amount',
      render: (value) => `₹${value.toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
          <h1 className="text-2xl font-normal text-slate-900 dark:text-slate-100 mb-2">
          Reports
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Generate and view various reports
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('drying')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'drying'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Drying Yield Report
          </button>
          <button
            onClick={() => setActiveTab('outstanding')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'outstanding'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Outstanding Summary
          </button>
        </div>

        <div className="p-6">
          {/* Date Range Filter */}
          {activeTab === 'drying' && (
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="label">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, startDate: e.target.value })
                    }
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="endDate" className="label">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, endDate: e.target.value })
                    }
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
                <button
                  onClick={fetchReports}
                  className="btn-primary"
                >
                  Apply Filter
                </button>
                <button
                  onClick={() => handleExport('drying')}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'outstanding' && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => handleExport('outstanding')}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}

          {/* Report Table */}
          {activeTab === 'drying' && (
            <DataTable
              columns={dryingColumns}
              data={dryingReport}
              searchable={false}
            />
          )}

          {activeTab === 'outstanding' && (
            <>
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                  Total Outstanding: ₹
                  {outstandingReport
                    .reduce((sum, item) => sum + item.outstanding, 0)
                    .toLocaleString()}
                </p>
              </div>
              <DataTable
                columns={outstandingColumns}
                data={outstandingReport}
                searchable={false}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;

