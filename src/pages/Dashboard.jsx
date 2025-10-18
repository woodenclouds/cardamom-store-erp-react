import React, { useState, useEffect } from 'react';
import { Package, Flame, Wallet, Activity, DollarSign, TrendingUp, TrendingDown, Banknote } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import { dashboardAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
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
        financialTrendsRes
      ] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getCollectionTrends(),
        dashboardAPI.getFinancialMetrics(),
        dashboardAPI.getFinancialTrends(),
      ]);
      setMetrics(metricsRes.data);
      setChartData(trendsRes.data);
      setFinancialMetrics(financialMetricsRes.data);
      setFinancialChartData(financialTrendsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
          {t('dashboard.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('dashboard.welcomeBack')}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card
          title={t('dashboard.totalCollections')}
          value={`${metrics.totalCollections} kg`}
          icon={Package}
          trend="up"
          trendValue="12%"
        />
        <Card
          title={t('dashboard.totalDried')}
          value={`${metrics.totalDried} kg`}
          icon={Flame}
          trend="up"
          trendValue="8%"
        />
        <Card
          title={t('dashboard.pendingPayments')}
          value={`₹${metrics.pendingPayments.toLocaleString()}`}
          icon={Wallet}
          trend="down"
          trendValue="5%"
        />
        <Card
          title={t('dashboard.activeBatches')}
          value={metrics.activeBatches}
          icon={Activity}
        />
      </div>

      {/* Collection Trends Chart */}
      <div className="card">
        <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
          {t('dashboard.dailyCollectionTrends')}
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

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card
          title={t('dashboard.totalRevenue')}
          value={`₹${financialMetrics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="15%"
          iconColor="text-green-600"
        />
        <Card
          title={t('dashboard.totalIncome')}
          value={`₹${financialMetrics.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          trend="up"
          trendValue="12%"
          iconColor="text-blue-600"
        />
        <Card
          title={t('dashboard.totalExpenses')}
          value={`₹${financialMetrics.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          trend="down"
          trendValue="8%"
          iconColor="text-red-600"
        />
        <Card
          title={t('dashboard.netProfit')}
          value={`₹${financialMetrics.netProfit.toLocaleString()}`}
          icon={Banknote}
          trend="up"
          trendValue="18%"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Financial Trends Chart */}
      <div className="card">
        <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100 mb-4">
          {t('dashboard.revenueExpensesTrends')}
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


    </div>
  );
};

export default Dashboard;

