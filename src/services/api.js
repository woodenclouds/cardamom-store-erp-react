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
        { id: 1, customerName: 'Rajesh Kumar', location: 'Idukki', date: '2025-10-15', quantity: 150, rate: 850, amount: 127500, advanceAmount: 0, batchNo: 'B001', status: 'drying', drierNo: 'D1', dryQty: 45 },
        { id: 2, customerName: 'Suresh Nair', location: 'Munnar', date: '2025-10-14', quantity: 200, rate: 820, amount: 164000, advanceAmount: 20000, batchNo: 'B001', status: 'pending', drierNo: null, dryQty: 0 },
        { id: 3, customerName: 'Mahesh Singh', location: 'Thekkady', date: '2025-10-13', quantity: 180, rate: 830, amount: 149400, advanceAmount: 15000, batchNo: 'B002', status: 'pending', drierNo: null, dryQty: 0 },
        { id: 4, customerName: 'Ramesh Patel', location: 'Kumily', date: '2025-10-12', quantity: 220, rate: 800, amount: 176000, advanceAmount: 0, batchNo: 'B003', status: 'completed', drierNo: 'D2', dryQty: 66 },
        { id: 5, customerName: 'Dinesh Reddy', location: 'Idukki', date: '2025-10-11', quantity: 160, rate: 840, amount: 134400, advanceAmount: 10000, batchNo: 'B004', status: 'completed', drierNo: 'D3', dryQty: 48 },
        { id: 6, customerName: 'Rajesh Kumar', location: 'Idukki', date: '2025-10-10', quantity: 130, rate: 850, amount: 110500, advanceAmount: 0, batchNo: 'B005', status: 'completed', drierNo: 'D1', dryQty: 39 },
        { id: 7, customerName: 'Vijay Kumar', location: 'Munnar', date: '2025-10-09', quantity: 175, rate: 830, amount: 145250, advanceAmount: 25000, batchNo: 'B006', status: 'drying', drierNo: 'D2', dryQty: 52 },
        { id: 8, customerName: 'Anil Menon', location: 'Thekkady', date: '2025-10-08', quantity: 190, rate: 840, amount: 159600, advanceAmount: 0, batchNo: 'B007', status: 'pending', drierNo: null, dryQty: 0 },
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
        { id: 1, batchNo: 'B001', customerName: 'Rajesh Kumar', location: 'Idukki', startDate: '2025-10-10', endDate: '2025-10-15', rawQty: 500, dryQty: 150, grade: 'A', status: 'Completed' },
        { id: 2, batchNo: 'B002', customerName: 'Suresh Nair', location: 'Munnar', startDate: '2025-10-12', endDate: null, rawQty: 450, dryQty: 135, grade: 'A', status: 'In Progress' },
        { id: 3, batchNo: 'B003', customerName: 'Mahesh Singh', location: 'Thekkady', startDate: '2025-10-14', endDate: null, rawQty: 600, dryQty: 180, grade: 'B', status: 'In Progress' },
        { id: 4, batchNo: 'B004', customerName: 'Ramesh Patel', location: 'Kumily', startDate: '2025-10-09', endDate: '2025-10-13', rawQty: 380, dryQty: 114, grade: 'A', status: 'Completed' },
        { id: 5, batchNo: 'B005', customerName: 'Dinesh Reddy', location: 'Idukki', startDate: '2025-10-08', endDate: '2025-10-12', rawQty: 420, dryQty: 126, grade: 'B', status: 'Completed' },
        { id: 6, batchNo: 'B006', customerName: 'Vijay Kumar', location: 'Munnar', startDate: '2025-10-11', endDate: null, rawQty: 550, dryQty: 165, grade: 'A', status: 'In Progress' },
        { id: 7, batchNo: 'B007', customerName: 'Anil Menon', location: 'Thekkady', startDate: '2025-10-13', endDate: '2025-10-16', rawQty: 480, dryQty: 144, grade: 'A', status: 'Completed' },
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
        { id: 1, customerName: 'Rajesh Kumar', location: 'Idukki', batchNo: 'B001', rawQty: 500, dryQty: 150, quantity: 50, rate: 2500, amount: 125000, paidAmount: 125000, pendingAmount: 0, paymentStatus: 'Paid', date: '2025-10-16' },
        { id: 2, customerName: 'Suresh Nair', location: 'Munnar', batchNo: 'B001', rawQty: 450, dryQty: 135, quantity: 40, rate: 2450, amount: 98000, paidAmount: 50000, pendingAmount: 48000, paymentStatus: 'Pending', date: '2025-10-15' },
        { id: 3, customerName: 'Mahesh Singh', location: 'Thekkady', batchNo: 'B002', rawQty: 600, dryQty: 180, quantity: 45, rate: 2480, amount: 111600, paidAmount: 111600, pendingAmount: 0, paymentStatus: 'Paid', date: '2025-10-14' },
        { id: 4, customerName: 'Ramesh Patel', location: 'Kumily', batchNo: 'B003', rawQty: 380, dryQty: 114, quantity: 55, rate: 2520, amount: 138600, paidAmount: 70000, pendingAmount: 68600, paymentStatus: 'Pending', date: '2025-10-13' },
        { id: 5, customerName: 'Dinesh Reddy', location: 'Idukki', batchNo: 'B004', rawQty: 420, dryQty: 126, quantity: 48, rate: 2500, amount: 120000, paidAmount: 120000, pendingAmount: 0, paymentStatus: 'Paid', date: '2025-10-12' },
        { id: 6, customerName: 'Vijay Kumar', location: 'Munnar', batchNo: 'B005', rawQty: 550, dryQty: 165, quantity: 52, rate: 2550, amount: 132600, paidAmount: 80000, pendingAmount: 52600, paymentStatus: 'Pending', date: '2025-10-11' },
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
    // Sample customer data - in a real app, this would come from an API
    const customers = [
      { id: 1, fullName: 'Rajesh Kumar', location: 'Downtown', houseName: 'Kumar Villa', phone: '+91 98765 43210' },
      { id: 2, fullName: 'Suresh Nair', location: 'Uptown', houseName: 'Nair House', phone: '+91 98765 43211' },
      { id: 3, fullName: 'Mahesh Singh', location: 'Suburbs', houseName: 'Singh Palace', phone: '+91 98765 43212' },
      { id: 4, fullName: 'Ramesh Patel', location: 'East Side', houseName: 'Patel Mansion', phone: '+91 98765 43213' },
      { id: 5, fullName: 'Dinesh Reddy', location: 'West Side', houseName: 'Reddy Villa', phone: '+91 98765 43214' },
    ];
    
    if (!query || query.trim() === '') {
      return Promise.resolve({ data: customers.map(c => c.fullName) });
    }
    
    const filtered = customers.filter(c => 
      c.fullName.toLowerCase().includes(query.toLowerCase())
    );
    return Promise.resolve({
      data: filtered.map(c => c.fullName),
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

// Employee API
export const employeeAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          fullName: 'Rajesh Kumar',
          email: 'rajesh.kumar@wostore.com',
          phone: '+91 9876543210',
          position: 'Processing Manager',
          department: 'Operations',
          joiningDate: '2024-01-15',
          salary: 35000,
          payrollType: 'monthly',
          status: 'active',
        },
        {
          id: 2,
          fullName: 'Priya Sharma',
          email: 'priya.sharma@wostore.com',
          phone: '+91 9876543211',
          position: 'Accounts Manager',
          department: 'Finance',
          joiningDate: '2024-02-01',
          salary: 40000,
          payrollType: 'monthly',
          status: 'active',
        },
        {
          id: 3,
          fullName: 'Suresh Nair',
          email: 'suresh.nair@wostore.com',
          phone: '+91 9876543212',
          position: 'Drying Supervisor',
          department: 'Operations',
          joiningDate: '2024-03-10',
          salary: 8000,
          payrollType: 'weekly',
          status: 'active',
        },
        {
          id: 4,
          fullName: 'Anita Patel',
          email: 'anita.patel@wostore.com',
          phone: '+91 9876543213',
          position: 'Quality Inspector',
          department: 'Quality Control',
          joiningDate: '2024-04-05',
          salary: 7500,
          payrollType: 'weekly',
          status: 'active',
        },
        {
          id: 5,
          fullName: 'Vijay Singh',
          email: 'vijay.singh@wostore.com',
          phone: '+91 9876543214',
          position: 'Warehouse Assistant',
          department: 'Warehouse',
          joiningDate: '2024-05-20',
          salary: 25000,
          payrollType: 'monthly',
          status: 'active',
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
  getActive: async () => {
    return Promise.resolve({
      data: [
        { id: 1, fullName: 'Rajesh Kumar', salary: 35000, payrollType: 'monthly' },
        { id: 2, fullName: 'Priya Sharma', salary: 40000, payrollType: 'monthly' },
        { id: 3, fullName: 'Suresh Nair', salary: 8000, payrollType: 'weekly' },
        { id: 4, fullName: 'Anita Patel', salary: 7500, payrollType: 'weekly' },
        { id: 5, fullName: 'Vijay Singh', salary: 25000, payrollType: 'monthly' },
      ],
    });
  },
};

// Payroll API
export const payrollAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          employeeId: 1,
          employeeName: 'Rajesh Kumar',
          payrollType: 'monthly',
          periodStart: '2025-10-01',
          periodEnd: '2025-10-31',
          basicSalary: 35000,
          allowances: 5000,
          deductions: 2000,
          netSalary: 38000,
          paymentDate: '2025-10-31',
          paymentMode: 'Bank Transfer',
          status: 'paid',
          remarks: 'Regular monthly salary',
        },
        {
          id: 2,
          employeeId: 2,
          employeeName: 'Priya Sharma',
          payrollType: 'monthly',
          periodStart: '2025-10-01',
          periodEnd: '2025-10-31',
          basicSalary: 40000,
          allowances: 6000,
          deductions: 2500,
          netSalary: 43500,
          paymentDate: '2025-10-31',
          paymentMode: 'Bank Transfer',
          status: 'paid',
          remarks: 'Regular monthly salary',
        },
        {
          id: 3,
          employeeId: 3,
          employeeName: 'Suresh Nair',
          payrollType: 'weekly',
          periodStart: '2025-10-11',
          periodEnd: '2025-10-17',
          basicSalary: 8000,
          allowances: 1000,
          deductions: 500,
          netSalary: 8500,
          paymentDate: '2025-10-18',
          paymentMode: 'Cash',
          status: 'paid',
          remarks: 'Weekly payment - Week 3',
        },
        {
          id: 4,
          employeeId: 4,
          employeeName: 'Anita Patel',
          payrollType: 'weekly',
          periodStart: '2025-10-11',
          periodEnd: '2025-10-17',
          basicSalary: 7500,
          allowances: 800,
          deductions: 400,
          netSalary: 7900,
          paymentDate: '2025-10-18',
          paymentMode: 'Cash',
          status: 'pending',
          remarks: 'Weekly payment - Week 3',
        },
        {
          id: 5,
          employeeId: 5,
          employeeName: 'Vijay Singh',
          payrollType: 'monthly',
          periodStart: '2025-10-01',
          periodEnd: '2025-10-31',
          basicSalary: 25000,
          allowances: 3000,
          deductions: 1500,
          netSalary: 26500,
          paymentDate: '2025-10-31',
          paymentMode: 'Bank Transfer',
          status: 'pending',
          remarks: 'Regular monthly salary',
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
  getSummary: async () => {
    return Promise.resolve({
      data: {
        totalPaid: 81900,
        totalPending: 34400,
        totalPayrolls: 5,
      },
    });
  },
};

// Debt Management API
export const debtAPI = {
  // Debt records
  getAllDebts: async () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          date: '2025-10-01',
          customerName: 'Rajesh Kumar',
          amount: 50000,
          repaid: 20000,
          outstanding: 30000,
          dueDate: '2025-11-30',
          status: 'active',
          reason: 'Business expansion loan',
          interestRate: 2,
          paymentMode: 'Bank Transfer',
          reference: 'DEBT001',
        },
        {
          id: 2,
          date: '2025-09-15',
          customerName: 'Suresh Nair',
          amount: 30000,
          repaid: 30000,
          outstanding: 0,
          dueDate: '2025-10-15',
          status: 'completed',
          reason: 'Emergency medical expenses',
          interestRate: 0,
          paymentMode: 'Cash',
          reference: 'DEBT002',
        },
        {
          id: 3,
          date: '2025-08-20',
          customerName: 'Mahesh Singh',
          amount: 75000,
          repaid: 25000,
          outstanding: 50000,
          dueDate: '2025-10-10',
          status: 'overdue',
          reason: 'Purchase raw materials',
          interestRate: 3,
          paymentMode: 'Bank Transfer',
          reference: 'DEBT003',
        },
        {
          id: 4,
          date: '2025-10-10',
          customerName: 'Dinesh Reddy',
          amount: 40000,
          repaid: 10000,
          outstanding: 30000,
          dueDate: '2025-12-10',
          status: 'active',
          reason: 'Equipment purchase',
          interestRate: 2.5,
          paymentMode: 'Cheque',
          reference: 'DEBT004',
        },
      ],
    });
  },
  createDebt: async (data) => {
    return Promise.resolve({ 
      data: { 
        id: Date.now(), 
        ...data,
        repaid: 0,
        outstanding: parseFloat(data.amount),
        status: 'active',
      } 
    });
  },
  updateDebt: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  deleteDebt: async (id) => {
    return Promise.resolve({ data: { message: 'Debt record deleted successfully' } });
  },

  // Repayment records
  getAllRepayments: async () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          date: '2025-10-05',
          debtId: 1,
          customerName: 'Rajesh Kumar',
          amount: 10000,
          paymentMode: 'Bank Transfer',
          reference: 'REP001',
          remarks: 'First installment',
        },
        {
          id: 2,
          date: '2025-10-10',
          debtId: 1,
          customerName: 'Rajesh Kumar',
          amount: 10000,
          paymentMode: 'Bank Transfer',
          reference: 'REP002',
          remarks: 'Second installment',
        },
        {
          id: 3,
          date: '2025-10-15',
          debtId: 2,
          customerName: 'Suresh Nair',
          amount: 30000,
          paymentMode: 'Cash',
          reference: 'REP003',
          remarks: 'Full payment',
        },
        {
          id: 4,
          date: '2025-09-01',
          debtId: 3,
          customerName: 'Mahesh Singh',
          amount: 25000,
          paymentMode: 'UPI',
          reference: 'REP004',
          remarks: 'Partial payment',
        },
        {
          id: 5,
          date: '2025-10-15',
          debtId: 4,
          customerName: 'Dinesh Reddy',
          amount: 10000,
          paymentMode: 'Cheque',
          reference: 'REP005',
          remarks: 'Initial payment',
        },
      ],
    });
  },
  createRepayment: async (data) => {
    return Promise.resolve({ data: { id: Date.now(), ...data } });
  },
  updateRepayment: async (id, data) => {
    return Promise.resolve({ data: { id, ...data } });
  },
  deleteRepayment: async (id) => {
    return Promise.resolve({ data: { message: 'Repayment record deleted successfully' } });
  },

  // Summary
  getSummary: async () => {
    return Promise.resolve({
      data: {
        totalDebtGiven: 195000,
        totalOutstanding: 110000,
        totalRepaid: 85000,
        activeDebts: 3,
      },
    });
  },
};

// Vendor API
export const vendorAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          vendorName: 'Kerala Spices Ltd',
          contactPerson: 'Rajesh Kumar',
          email: 'contact@keralaspices.com',
          phone: '+91 9876543210',
          address: 'Idukki, Kerala',
          gstNumber: '29AABCU9603R1ZM',
          status: 'active',
          createdAt: '2024-01-15',
        },
        {
          id: 2,
          vendorName: 'Green Valley Traders',
          contactPerson: 'Suresh Nair',
          email: 'info@greenvalley.com',
          phone: '+91 9876543211',
          address: 'Munnar, Kerala',
          gstNumber: '29AABCU9604R1ZN',
          status: 'active',
          createdAt: '2024-02-20',
        },
        {
          id: 3,
          vendorName: 'Mountain Fresh Supplies',
          contactPerson: 'Mahesh Singh',
          email: 'sales@mountainfresh.com',
          phone: '+91 9876543212',
          address: 'Thekkady, Kerala',
          gstNumber: '29AABCU9605R1ZO',
          status: 'active',
          createdAt: '2024-03-10',
        },
        {
          id: 4,
          vendorName: 'Spice Garden Co.',
          contactPerson: 'Priya Sharma',
          email: 'contact@spicegarden.com',
          phone: '+91 9876543213',
          address: 'Kumily, Kerala',
          gstNumber: '29AABCU9606R1ZP',
          status: 'inactive',
          createdAt: '2024-04-05',
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
    return Promise.resolve({ data: { message: 'Vendor deleted successfully' } });
  },
  getActive: async () => {
    return Promise.resolve({
      data: [
        { id: 1, vendorName: 'Kerala Spices Ltd' },
        { id: 2, vendorName: 'Green Valley Traders' },
        { id: 3, vendorName: 'Mountain Fresh Supplies' },
      ],
    });
  },
};

// Purchase API
export const purchaseAPI = {
  getAll: async () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          date: '2025-10-15',
          vendorId: 1,
          vendorName: 'Kerala Spices Ltd',
          itemDescription: 'Raw Cardamom',
          quantity: 500,
          unit: 'kg',
          ratePerUnit: 850,
          amount: 425000,
          paymentMode: 'Bank Transfer',
          invoiceNumber: 'INV-2025-001',
          remarks: 'Grade A quality',
        },
        {
          id: 2,
          date: '2025-10-14',
          vendorId: 2,
          vendorName: 'Green Valley Traders',
          itemDescription: 'Raw Cardamom',
          quantity: 300,
          unit: 'kg',
          ratePerUnit: 820,
          amount: 246000,
          paymentMode: 'Cash',
          invoiceNumber: 'INV-2025-002',
          remarks: 'Grade B quality',
        },
        {
          id: 3,
          date: '2025-10-13',
          vendorId: 3,
          vendorName: 'Mountain Fresh Supplies',
          itemDescription: 'Raw Cardamom',
          quantity: 400,
          unit: 'kg',
          ratePerUnit: 830,
          amount: 332000,
          paymentMode: 'Bank Transfer',
          invoiceNumber: 'INV-2025-003',
          remarks: 'Premium quality',
        },
        {
          id: 4,
          date: '2025-10-12',
          vendorId: 1,
          vendorName: 'Kerala Spices Ltd',
          itemDescription: 'Packaging Materials',
          quantity: 1000,
          unit: 'pieces',
          ratePerUnit: 15,
          amount: 15000,
          paymentMode: 'UPI',
          invoiceNumber: 'INV-2025-004',
          remarks: 'Cardboard boxes',
        },
        {
          id: 5,
          date: '2025-10-11',
          vendorId: 4,
          vendorName: 'Spice Garden Co.',
          itemDescription: 'Raw Cardamom',
          quantity: 250,
          unit: 'kg',
          ratePerUnit: 840,
          amount: 210000,
          paymentMode: 'Cheque',
          invoiceNumber: 'INV-2025-005',
          remarks: 'Mixed grade',
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
    return Promise.resolve({ data: { message: 'Purchase record deleted successfully' } });
  },
  getSummary: async () => {
    return Promise.resolve({
      data: {
        totalPurchases: 1228000,
        totalQuantity: 2450,
        averageRate: 501.22,
      },
    });
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

