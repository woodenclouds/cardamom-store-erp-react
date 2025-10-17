import React, { useState, useEffect } from 'react';
import { Package, Flame, Wallet, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, trendsRes] = await Promise.all([
        dashboardAPI.getMetrics(),
        dashboardAPI.getCollectionTrends(),
      ]);
      setMetrics(metricsRes.data);
      setChartData(trendsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
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

      {/* Collection Trends Chart */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
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
                  <p className="font-medium text-slate-900 dark:text-slate-100">{item.customer}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.time}</p>
                </div>
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {item.qty}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Active Batches
          </h2>
          <div className="space-y-3">
            {[
              { batch: 'B002', qty: '450 kg', status: 'In Progress', progress: 60 },
              { batch: 'B003', qty: '600 kg', status: 'In Progress', progress: 30 },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900 dark:text-slate-100">{item.batch}</p>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.qty}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

