import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Flame,
  Send,
  Wallet,
  BookOpen,
  BarChart3,
  Users,
  X,
  TrendingUp,
  TrendingDown,
  Tag,
  Bell,
  Workflow,
  ChevronDown,
  DollarSign,
  Store,
  FileText,
  UserCog,
  Receipt,
  CreditCard,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [isOperationsOpen, setIsOperationsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isHROpen, setIsHROpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/store-management', icon: Workflow, label: 'Store Management' },
    { path: '/customers', icon: Users, label: 'Customers' },
  ];

  const operationsMenuItems = [
    { path: '/collection', icon: Package, label: 'Collections' },
    { path: '/drying-batch', icon: Flame, label: 'Drying Batches' },
    { path: '/return', icon: Send, label: 'Returns' },
  ];

  const hrMenuItems = [
    { path: '/employees', icon: UserCog, label: 'Employees' },
    { path: '/payrolls', icon: Receipt, label: 'Payrolls' },
  ];

  const accountsMenuItems = [
    { path: '/payments', icon: Wallet, label: 'Payments' },
    { path: '/income', icon: TrendingUp, label: 'Income' },
    { path: '/expenses', icon: TrendingDown, label: 'Expenses' },
    { path: '/debt-management', icon: CreditCard, label: 'Debt Management' },
  ];

  const reportsMenuItems = [
    { path: '/ledger', icon: BookOpen, label: 'Customer Ledger' },
    { path: '/reports', icon: BarChart3, label: 'Store Report' },
    { path: '/financial-report', icon: TrendingUp, label: 'Financial Report' },
  ];

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close sidebar on Escape key press and scroll to top on route change
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = 'hidden';
    }

    // Scroll sidebar to top when it opens
    if (isOpen && navRef.current) {
      navRef.current.scrollTop = 0;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Scroll to top when route changes
  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = 0;
    }
  }, []);

  // Handle scroll indicators
  const handleScroll = () => {
    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current;
      setShowScrollTop(scrollTop > 10);
      setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 10);
    }
  };

  // Add scroll listener
  useEffect(() => {
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state
      
      
      return () => nav.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Navigation menu"
        style={{ top: '4rem', height: 'calc(100vh - 4rem)' }}
      >
        <div className="h-full flex flex-col sidebar-container">
          {/* Close Button (Mobile) */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 lg:hidden">
            <h2 className="text-lg font-normal text-slate-900 dark:text-slate-100">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 relative overflow-hidden sidebar-nav-container">
            {/* Scroll indicators */}
            {showScrollTop && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />
            )}
            {showScrollBottom && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />
            )}
            
            <nav ref={navRef} className="h-full overflow-y-auto p-4 sidebar-nav">
              <ul className="space-y-2">
                {/* Dashboard */}
                <li>
                  <NavLink
                    to="/dashboard"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`
                    }
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-normal">Dashboard</span>
                  </NavLink>
                </li>

                {/* Store Management */}
                <li>
                  <NavLink
                    to="/store-management"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`
                    }
                  >
                    <Workflow className="w-5 h-5" />
                    <span className="font-normal">Store Management</span>
                  </NavLink>
                </li>

                {/* Store Dropdown Menu */}
                <li>
                  <button
                    onClick={() => setIsOperationsOpen(!isOperationsOpen)}
                    className="flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5" />
                      <span className="font-normal">Store</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOperationsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Submenu Items */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOperationsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="mt-2 space-y-1 pl-4">
                      {operationsMenuItems.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`
                            }
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-normal">{item.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                {/* HR Management Dropdown Menu */}
                <li>
                  <button
                    onClick={() => setIsHROpen(!isHROpen)}
                    className="flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <UserCog className="w-5 h-5" />
                      <span className="font-normal">HR Management</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isHROpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Submenu Items */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isHROpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="mt-2 space-y-1 pl-4">
                      {hrMenuItems.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`
                            }
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-normal">{item.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                {/* Accounts Dropdown Menu */}
                <li>
                  <button
                    onClick={() => setIsAccountsOpen(!isAccountsOpen)}
                    className="flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-normal">Accounts</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isAccountsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Submenu Items */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isAccountsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="mt-2 space-y-1 pl-4">
                      {accountsMenuItems.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`
                            }
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-normal">{item.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                {/* Reports Dropdown Menu */}
                <li>
                  <button
                    onClick={() => setIsReportsOpen(!isReportsOpen)}
                    className="flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <span className="font-normal">Reports</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isReportsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Submenu Items */}
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isReportsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="mt-2 space-y-1 pl-4">
                      {reportsMenuItems.map((item) => (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                  ? 'bg-primary-600 text-white'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`
                            }
                          >
                            <item.icon className="w-4 h-4" />
                            <span className="text-sm font-normal">{item.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                {/* Customers */}
                <li>
                  <NavLink
                    to="/customers"
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`
                    }
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-normal">Customers</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <p className="text-xs font-normal text-primary-900 dark:text-primary-100 mb-1">
                Version 1.0.0
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-300">
                © 2025 Cardamom Center
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

