import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Filter } from 'lucide-react';
import Card from '../components/Card';
import { incomeAPI, expenseAPI, incomeCategoryAPI, expenseCategoryAPI } from '../services/api';

const FinancialReport = () => {
  const [loading, setLoading] = useState(true);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes, incomeCatRes, expenseCatRes] = await Promise.all([
        incomeAPI.getAll(),
        expenseAPI.getAll(),
        incomeCategoryAPI.getAll(),
        expenseCategoryAPI.getAll(),
      ]);
      setIncomes(incomeRes.data || []);
      setExpenses(expenseRes.data || []);
      setIncomeCategories(incomeCatRes.data || []);
      setExpenseCategories(expenseCatRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };

  // Filter data by date range
  const filteredIncomes = incomes.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate);
  });

  const filteredExpenses = expenses.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate);
  });

  // Calculate totals
  const totalIncome = filteredIncomes.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalExpense = filteredExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const netProfit = totalIncome - totalExpense;

  // Group by category
  const incomeByCategory = filteredIncomes.reduce((acc, item) => {
    const categoryId = item.categoryId || 'uncategorized';
    const category = incomeCategories.find(cat => cat.id === categoryId);
    const categoryName = category ? category.name : 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += parseFloat(item.amount) || 0;
    return acc;
  }, {});

  const expenseByCategory = filteredExpenses.reduce((acc, item) => {
    const categoryId = item.categoryId || 'uncategorized';
    const category = expenseCategories.find(cat => cat.id === categoryId);
    const categoryName = category ? category.name : 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += parseFloat(item.amount) || 0;
    return acc;
  }, {});

  // Sort categories by amount
  const sortedIncomeCategories = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]);
  const sortedExpenseCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const setQuickDateRange = (range) => {
    const today = new Date();
    let startDate, endDate;

    switch (range) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      default:
        return;
    }

    setDateRange({ startDate, endDate });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600 dark:text-slate-400">Loading financial data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            Financial Report
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Overview of income, expenses, and profitability
          </p>
        </div>

        {/* Quick Date Range Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setQuickDateRange('today')}
            className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
          >
            Today
          </button>
          <button
            onClick={() => setQuickDateRange('week')}
            className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setQuickDateRange('month')}
            className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
          >
            This Month
          </button>
          <button
            onClick={() => setQuickDateRange('year')}
            className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
          >
            This Year
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-normal text-slate-900 dark:text-slate-100">Date Range</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Total Income"
          value={`₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          trend={`${filteredIncomes.length} transactions`}
          color="green"
        />
        <Card
          title="Total Expenses"
          value={`₹${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingDown}
          trend={`${filteredExpenses.length} transactions`}
          color="red"
        />
        <Card
          title={netProfit >= 0 ? "Net Profit" : "Net Loss"}
          value={`₹${Math.abs(netProfit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={netProfit >= 0 ? "Profitable" : "Loss"}
          color={netProfit >= 0 ? "blue" : "red"}
        />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Category */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-normal text-slate-900 dark:text-slate-100">Income by Category</h3>
          </div>
          
          {sortedIncomeCategories.length === 0 ? (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              No income data for selected period
            </p>
          ) : (
            <div className="space-y-3">
              {sortedIncomeCategories.map(([category, amount]) => {
                const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{category}</span>
                      <span className="text-slate-900 dark:text-slate-100">
                        ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {percentage.toFixed(1)}% of total income
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expenses by Category */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-lg font-normal text-slate-900 dark:text-slate-100">Expenses by Category</h3>
          </div>
          
          {sortedExpenseCategories.length === 0 ? (
            <p className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              No expense data for selected period
            </p>
          ) : (
            <div className="space-y-3">
              {sortedExpenseCategories.map(([category, amount]) => {
                const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{category}</span>
                      <span className="text-slate-900 dark:text-slate-100">
                        ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-red-600 dark:bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {percentage.toFixed(1)}% of total expenses
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <h3 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">Summary</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Description</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-700 dark:text-slate-300">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Total Income</td>
                <td className="py-3 px-4 text-sm text-right text-green-600 dark:text-green-400 font-medium">
                  ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Total Expenses</td>
                <td className="py-3 px-4 text-sm text-right text-red-600 dark:text-red-400 font-medium">
                  ₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                <td className="py-3 px-4 text-base font-medium text-slate-900 dark:text-slate-100">
                  {netProfit >= 0 ? 'Net Profit' : 'Net Loss'}
                </td>
                <td className={`py-3 px-4 text-base text-right font-semibold ${
                  netProfit >= 0 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ₹{Math.abs(netProfit).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;

