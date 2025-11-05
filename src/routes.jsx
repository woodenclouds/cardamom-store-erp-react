import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Collection from './pages/Collection';
import DryingBatch from './pages/DryingBatch';
import Customers from './pages/Customers';
import Vendors from './pages/Vendors';
import Purchases from './pages/Purchases';
import Items from './pages/Items';
import Return from './pages/Return';
import Payments from './pages/Payments';
import Ledger from './pages/Ledger';
import Reports from './pages/Reports';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import IncomeCategories from './pages/IncomeCategories';
import ExpenseCategories from './pages/ExpenseCategories';
import StoreManagement from './pages/StoreManagement';
import FinancialReport from './pages/FinancialReport';
import Employees from './pages/Employees';
import Payrolls from './pages/Payrolls';
import DebtManagement from './pages/DebtManagement';
import Settings from './pages/Settings';

// Protected Route wrapper
export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route wrapper (redirect to dashboard if already logged in)
export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/store-management',
    element: (
      <ProtectedRoute>
        <StoreManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/order-management',
    element: <Navigate to="/store-management" replace />,
  },
  {
    path: '/collection',
    element: (
      <ProtectedRoute>
        <Collection />
      </ProtectedRoute>
    ),
  },
  {
    path: '/drying-batch',
    element: (
      <ProtectedRoute>
        <DryingBatch />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <Customers />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendors',
    element: (
      <ProtectedRoute>
        <Vendors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/purchases',
    element: (
      <ProtectedRoute>
        <Purchases />
      </ProtectedRoute>
    ),
  },
  {
    path: '/items',
    element: (
      <ProtectedRoute>
        <Items />
      </ProtectedRoute>
    ),
  },
  {
    path: '/return',
    element: (
      <ProtectedRoute>
        <Return />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payments',
    element: (
      <ProtectedRoute>
        <Payments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ledger',
    element: (
      <ProtectedRoute>
        <Ledger />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/income',
    element: (
      <ProtectedRoute>
        <Income />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expenses',
    element: (
      <ProtectedRoute>
        <Expenses />
      </ProtectedRoute>
    ),
  },
  {
    path: '/income-categories',
    element: (
      <ProtectedRoute>
        <IncomeCategories />
      </ProtectedRoute>
    ),
  },
  {
    path: '/expense-categories',
    element: (
      <ProtectedRoute>
        <ExpenseCategories />
      </ProtectedRoute>
    ),
  },
  {
    path: '/financial-report',
    element: (
      <ProtectedRoute>
        <FinancialReport />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employees',
    element: (
      <ProtectedRoute>
        <Employees />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payrolls',
    element: (
      <ProtectedRoute>
        <Payrolls />
      </ProtectedRoute>
    ),
  },
  {
    path: '/debt-management',
    element: (
      <ProtectedRoute>
        <DebtManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The page you're looking for doesn't exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    ),
  },
];

export default routes;

