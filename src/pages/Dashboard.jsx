import React, { useState, useEffect } from 'react';
import { Package, Flame, Wallet, Activity, DollarSign, TrendingUp, TrendingDown, Banknote } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalCollections: 0,
    totalDried: 0,
    pendingPayments: 0,
    activeBatches: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [financialMetrics, setFinancialMetrics] = useState({
    totalRevenue: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
  });
  const [financialChartData, setFinancialChartData] = useState([]);
  const [accountSummary, setAccountSummary] = useState({
    cashBalance: 0,
    bankBalance: 0,
    totalReceivables: 0,
    totalPayables: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState({
    recentIncome: [],
    recentExpenses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        metricsRes, 
        trendsRes, 
        financialMetricsRes, 
        financialTrendsRes,
        accountSummaryRes,
        recentTransactionsRes
      ] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getCollectionTrends(),
        dashboardAPI.getFinancialMetrics(),
        dashboardAPI.getFinancialTrends(),
        dashboardAPI.getAccountSummary(),
        dashboardAPI.getRecentTransactions(),
      ]);
      setMetrics(metricsRes.data);
      setChartData(trendsRes.data);
      setFinancialMetrics(financialMetricsRes.data);
      setFinancialChartData(financialTrendsRes.data);
      setAccountSummary(accountSummaryRes.data);
      setRecentTransactions(recentTransactionsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-2xl font-normal text-slate-900 dark:text-slate-100 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card
          title="Total Collections"
          value={`${metrics.totalCollections} kg`}
          icon={Package}
          trend="up"
          trendValue="12%"
        />
        <Card
          title="Total Dried"
          value={`${metrics.totalDried} kg`}
          icon={Flame}
          trend="up"
          trendValue="8%"
        />
        <Card
          title="Pending Payments"
          value={`₹${metrics.pendingPayments.toLocaleString()}`}
          icon={Wallet}
          trend="down"
          trendValue="5%"
        />
        <Card
          title="Active Batches"
          value={metrics.activeBatches}
          icon={Activity}
        />
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card
          title="Total Revenue"
          value={`₹${financialMetrics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="15%"
          iconColor="text-green-600"
        />
        <Card
          title="Total Income"
          value={`₹${financialMetrics.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
          trendValue="12%"
          iconColor="text-blue-600"
        />
        <Card
          title="Total Expenses"
          value={`₹${financialMetrics.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          trend="down"
          trendValue="8%"
          iconColor="text-red-600"
        />
        <Card
          title="Net Profit"
          value={`₹${financialMetrics.netProfit.toLocaleString()}`}
          icon={Banknote}
          trend="up"
          trendValue="18%"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Collection Trends Chart */}
      <div className="card">
        <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
          Daily Collection Trends (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="quantity"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ fill: '#16a34a', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Trends Chart */}
      <div className="card">
        <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
          Revenue vs Expenses Trends (Last 7 Days)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={financialChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              formatter={(value, name) => [`₹${value.toLocaleString()}`, name === 'income' ? 'Income' : name === 'expenses' ? 'Expenses' : 'Profit']}
            />
            <Area
              type="monotone"
              dataKey="income"
              stackId="1"
              stroke="#16a34a"
              fill="#16a34a"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stackId="2"
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Accounts Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Cash Balance</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.cashBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Banknote className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Bank Balance</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.bankBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Receivables</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.totalReceivables.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-normal text-slate-600 dark:text-slate-400">Payables</h3>
              <p className="text-2xl font-normal text-slate-900 dark:text-slate-100">
                ₹{accountSummary.totalPayables.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="card">
          <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
            Recent Collections
          </h2>
          <div className="space-y-3">
            {[
              { customer: 'Rajesh Kumar', qty: '150 kg', time: '2 hours ago' },
              { customer: 'Suresh Nair', qty: '200 kg', time: '5 hours ago' },
              { customer: 'Mahesh Singh', qty: '180 kg', time: '1 day ago' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
              >
                <div>
                  <p className="font-normal text-slate-900 dark:text-slate-100">{item.customer}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.time}</p>
                </div>
                <span className="font-normal text-primary-600 dark:text-primary-400">
                  {item.qty}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
            Recent Income
          </h2>
          <div className="space-y-3">
            {recentTransactions.recentIncome.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg"
              >
                <div>
                  <p className="font-normal text-slate-900 dark:text-slate-100">{item.category}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
                <span className="font-normal text-green-600 dark:text-green-400">
                  +₹{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
            Recent Expenses
          </h2>
          <div className="space-y-3">
            {recentTransactions.recentExpenses.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg"
              >
                <div>
                  <p className="font-normal text-slate-900 dark:text-slate-100">{item.category}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.vendor || item.description}</p>
                </div>
                <span className="font-normal text-red-600 dark:text-red-400">
                  -₹{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Batches */}
      <div className="card">
        <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
          Active Batches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { batch: 'B002', qty: '450 kg', status: 'In Progress', progress: 60 },
            { batch: 'B003', qty: '600 kg', status: 'In Progress', progress: 30 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-normal text-slate-900 dark:text-slate-100">{item.batch}</p>
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.qty}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{item.progress}% complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

