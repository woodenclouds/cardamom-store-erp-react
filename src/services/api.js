import axios from 'axios';

// Base API URL - this would be your backend URL in production
const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Stub API functions with mock data
export const authAPI = {
  login: async (username, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
          resolve({
            data: {
              token: 'mock-jwt-token-12345',
              user: { id: 1, username: 'admin', name: 'Admin User' },
            },
          });
        } else {
          reject({ message: 'Invalid credentials' });
        }
      }, 500);
    });
  },
  logout: async () => {
    return Promise.resolve({ data: { message: 'Logged out successfully' } });
  },
};

export const collectionAPI = {
  getAll: async () => {
    // Mock data with status for Order Management
    return Promise.resolve({
      data: [
        { id: 1, customerName: 'Rajesh Kumar', date: '2025-10-15', quantity: 150, rate: 850, amount: 127500, batchNo: 'B001', status: 'drying', drierNo: 'D1', dryQty: 45 },
        { id: 2, customerName: 'Suresh Nair', date: '2025-10-14', quantity: 200, rate: 820, amount: 164000, batchNo: 'B001', status: 'pending', drierNo: null, dryQty: 0 },
        { id: 3, customerName: 'Mahesh Singh', date: '2025-10-13', quantity: 180, rate: 830, amount: 149400, batchNo: 'B002', status: 'pending', drierNo: null, dryQty: 0 },
        { id: 4, customerName: 'Ramesh Patel', date: '2025-10-12', quantity: 220, rate: 800, amount: 176000, batchNo: 'B003', status: 'completed', drierNo: 'D2', dryQty: 66 },
        { id: 5, customerName: 'Dinesh Reddy', date: '2025-10-11', quantity: 160, rate: 840, amount: 134400, batchNo: 'B004', status: 'completed', drierNo: 'D3', dryQty: 48 },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  update: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  delete: async (id) => {
    return Promise.resolve({ data: { message: 'Deleted successfully' } });
  },
};

export const batchAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        { id: 1, batchNo: 'B001', startDate: '2025-10-10', endDate: '2025-10-15', rawQty: 500, dryQty: 150, grade: 'A', status: 'Completed' },
        { id: 2, batchNo: 'B002', startDate: '2025-10-12', endDate: null, rawQty: 450, dryQty: 0, grade: 'A', status: 'In Progress' },
        { id: 3, batchNo: 'B003', startDate: '2025-10-14', endDate: null, rawQty: 600, dryQty: 0, grade: 'B', status: 'In Progress' },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  update: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  markCompleted: async (id) => {
    return Promise.resolve({ data: { message: 'Batch marked as completed' } });
  },
};

export const returnAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        { id: 1, customerName: 'Rajesh Kumar', batchNo: 'B001', quantity: 50, rate: 2500, amount: 125000, paymentStatus: 'Paid', date: '2025-10-16' },
        { id: 2, customerName: 'Suresh Nair', batchNo: 'B001', quantity: 40, rate: 2450, amount: 98000, paymentStatus: 'Pending', date: '2025-10-15' },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
};

export const paymentAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        { id: 1, date: '2025-10-16', customerName: 'Rajesh Kumar', amount: 125000, mode: 'Bank Transfer', remarks: 'Payment for batch B001' },
        { id: 2, date: '2025-10-15', customerName: 'Mahesh Singh', amount: 50000, mode: 'Cash', remarks: 'Partial payment' },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  getSummary: async () => {
    return Promise.resolve({
      data: { totalReceived: 175000, totalPending: 98000 },
    });
  },
};

export const ledgerAPI = {
  getByCustomer: async (customerName) => {
    return Promise.resolve({
      data: [
        { id: 1, date: '2025-10-15', type: 'Collection', reference: 'C001', debit: 127500, credit: 0, balance: 127500, remarks: 'Raw cardamom collected' },
        { id: 2, date: '2025-10-16', type: 'Return', reference: 'R001', debit: 0, credit: 125000, balance: 2500, remarks: 'Dried cardamom returned' },
      ],
    });
  },
  export: async (format) => {
    return Promise.resolve({ data: { url: `/exports/ledger.${format}` } });
  },
};

export const reportAPI = {
  getDryingYield: async (dateRange) => {
    return Promise.resolve({
      data: [
        { batchNo: 'B001', rawQty: 500, dryQty: 150, yieldPercentage: 30, loss: 70 },
        { batchNo: 'B002', rawQty: 450, dryQty: 140, yieldPercentage: 31.1, loss: 68.9 },
      ],
    });
  },
  getOutstanding: async () => {
    return Promise.resolve({
      data: [
        { customerName: 'Suresh Nair', outstanding: 98000 },
        { customerName: 'Mahesh Singh', outstanding: 99400 },
      ],
    });
  },
};

export const dashboardAPI = {
  getMetrics: async () => {
    return Promise.resolve({
      data: {
        totalCollections: 1550,
        totalDried: 450,
        pendingPayments: 197400,
        activeBatches: 2,
      },
    });
  },
  getCollectionTrends: async () => {
    return Promise.resolve({
      data: [
        { date: '2025-10-10', quantity: 200 },
        { date: '2025-10-11', quantity: 250 },
        { date: '2025-10-12', quantity: 180 },
        { date: '2025-10-13', quantity: 220 },
        { date: '2025-10-14', quantity: 200 },
        { date: '2025-10-15', quantity: 300 },
        { date: '2025-10-16', quantity: 200 },
      ],
    });
  },
  getFinancialMetrics: async () => {
    return Promise.resolve({
      data: {
        totalRevenue: 425000,
        totalIncome: 190000,
        totalExpenses: 135500,
        netProfit: 54500,
      },
    });
  },
  getFinancialTrends: async () => {
    return Promise.resolve({
      data: [
        { date: '2025-10-10', income: 45000, expenses: 25000, profit: 20000 },
        { date: '2025-10-11', income: 55000, expenses: 30000, profit: 25000 },
        { date: '2025-10-12', income: 35000, expenses: 22000, profit: 13000 },
        { date: '2025-10-13', income: 40000, expenses: 28000, profit: 12000 },
        { date: '2025-10-14', income: 60000, expenses: 35000, profit: 25000 },
        { date: '2025-10-15', income: 65000, expenses: 40000, profit: 25000 },
        { date: '2025-10-16', income: 45000, expenses: 25000, profit: 20000 },
      ],
    });
  },
  getAccountSummary: async () => {
    return Promise.resolve({
      data: {
        cashBalance: 125000,
        bankBalance: 350000,
        totalReceivables: 197400,
        totalPayables: 45000,
      },
    });
  },
  getRecentTransactions: async () => {
    return Promise.resolve({
      data: {
        recentIncome: [
          { id: 1, date: '2025-10-16', category: 'Product Sales', amount: 65000, description: 'Cardamom sales' },
          { id: 2, date: '2025-10-15', amount: 25000, category: 'Service Income', description: 'Processing fees' },
        ],
        recentExpenses: [
          { id: 1, date: '2025-10-16', category: 'Raw Materials', amount: 40000, vendor: 'Kerala Spices' },
          { id: 2, date: '2025-10-15', amount: 35000, category: 'Salaries', description: 'Monthly salaries' },
        ],
      },
    });
  },
};

// Customer search/autocomplete
export const customerAPI = {
  search: async (query) => {
    const customers = ['Rajesh Kumar', 'Suresh Nair', 'Mahesh Singh', 'Ramesh Patel', 'Dinesh Reddy'];
    return Promise.resolve({
      data: customers.filter(c => c.toLowerCase().includes(query.toLowerCase())),
    });
  },
};

// Income Category API
export const incomeCategoryAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        { id: 1, name: 'Product Sales', description: 'Revenue from product sales', status: 'active' },
        { id: 2, name: 'Service Income', description: 'Revenue from services', status: 'active' },
        { id: 3, name: 'Commission', description: 'Commission income', status: 'active' },
        { id: 4, name: 'Other Income', description: 'Miscellaneous income', status: 'active' },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  update: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  delete: async (id) => {
    return Promise.resolve({ data: { message: 'Deleted successfully' } });
  },
};

// Expense Category API
export const expenseCategoryAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        { id: 1, name: 'Raw Materials', description: 'Purchase of raw materials', status: 'active' },
        { id: 2, name: 'Salaries', description: 'Employee salaries and wages', status: 'active' },
        { id: 3, name: 'Utilities', description: 'Electricity, water, internet', status: 'active' },
        { id: 4, name: 'Rent', description: 'Office and warehouse rent', status: 'active' },
        { id: 5, name: 'Transport', description: 'Transportation and logistics', status: 'active' },
        { id: 6, name: 'Maintenance', description: 'Equipment and facility maintenance', status: 'active' },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  update: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  delete: async (id) => {
    return Promise.resolve({ data: { message: 'Deleted successfully' } });
  },
};

// Income API
export const incomeAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        { 
          id: 1, 
          date: '2025-10-15', 
          categoryId: 1, 
          categoryName: 'Product Sales',
          amount: 150000, 
          description: 'Sale of cardamom batch B001', 
          paymentMode: 'Bank Transfer',
          reference: 'TXN123456'
        },
        { 
          id: 2, 
          date: '2025-10-14', 
          categoryId: 2, 
          categoryName: 'Service Income',
          amount: 25000, 
          description: 'Processing service charges', 
          paymentMode: 'Cash',
          reference: ''
        },
        { 
          id: 3, 
          date: '2025-10-13', 
          categoryId: 3, 
          categoryName: 'Commission',
          amount: 15000, 
          description: 'Commission from supplier', 
          paymentMode: 'UPI',
          reference: 'UPI789012'
        },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  update: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  delete: async (id) => {
    return Promise.resolve({ data: { message: 'Deleted successfully' } });
  },
};

// Expense API
export const expenseAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        { 
          id: 1, 
          date: '2025-10-15', 
          categoryId: 1, 
          categoryName: 'Raw Materials',
          amount: 85000, 
          vendor: 'Kerala Spices Ltd',
          description: 'Raw cardamom purchase', 
          paymentMode: 'Bank Transfer',
          reference: 'INV-2025-001'
        },
        { 
          id: 2, 
          date: '2025-10-14', 
          categoryId: 2, 
          categoryName: 'Salaries',
          amount: 45000, 
          vendor: '',
          description: 'Monthly salary payment', 
          paymentMode: 'Bank Transfer',
          reference: 'SAL-OCT-2025'
        },
        { 
          id: 3, 
          date: '2025-10-13', 
          categoryId: 3, 
          categoryName: 'Utilities',
          amount: 5500, 
          vendor: 'KSEB',
          description: 'Electricity bill', 
          paymentMode: 'UPI',
          reference: 'BILL123456'
        },
        { 
          id: 4, 
          date: '2025-10-12', 
          categoryId: 4, 
          categoryName: 'Rent',
          amount: 30000, 
          vendor: 'Property Owner',
          description: 'Monthly warehouse rent', 
          paymentMode: 'Cheque',
          reference: 'CHQ456789'
        },
      ],
    });
  },
  create: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  update: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  delete: async (id) => {
    return Promise.resolve({ data: { message: 'Deleted successfully' } });
  },
};

// Settings API
export const settingsAPI = {
  // Profile
  getProfile: async () => {
    return Promise.resolve({
      data: {
        fullName: 'Admin User',
        email: 'admin@wostore.com',
        phone: '+91 9876543210',
        storeName: 'Cardamom Processing Center',
        address: 'Idukki, Kerala, India',
      },
    });
  },
  updateProfile: async (data) => {
    return Promise.resolve({ data: { message: 'Profile updated successfully', ...data } });
  },
  
  // Password
  updatePassword: async (currentPassword, newPassword) => {
    return Promise.resolve({ data: { message: 'Password updated successfully' } });
  },
  
  // Drying Price
  getDryingPrice: async () => {
    return Promise.resolve({
      data: { pricePerKg: 10, currency: 'INR' },
    });
  },
  updateDryingPrice: async (data) => {
    return Promise.resolve({ data: { message: 'Drying price updated successfully', ...data } });
  },
  
  // Places
  getPlaces: async () => {
    return Promise.resolve({
      data: [
        { id: 1, name: 'Idukki', active: true },
        { id: 2, name: 'Munnar', active: true },
        { id: 3, name: 'Thekkady', active: true },
        { id: 4, name: 'Kumily', active: true },
      ],
    });
  },
  createPlace: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data, active: true } });
  },
  updatePlace: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  deletePlace: async (id) => {
    return Promise.resolve({ data: { message: 'Place deleted successfully' } });
  },
  
  // General Settings
  getGeneralSettings: async () => {
    return Promise.resolve({
      data: {
        dateFormat: 'DD/MM/YYYY',
        timeZone: 'IST (GMT+5:30)',
        language: 'English',
        emailNotifications: true,
      },
    });
  },
  updateGeneralSettings: async (data) => {
    return Promise.resolve({ data: { message: 'Settings updated successfully', ...data } });
  },
};

export default api;

