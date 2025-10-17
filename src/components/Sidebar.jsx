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
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/collection', icon: Package, label: 'Collections' },
    { path: '/drying-batch', icon: Flame, label: 'Drying Batches' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/return', icon: Send, label: 'Returns' },
    { path: '/payments', icon: Wallet, label: 'Payments' },
    { path: '/income', icon: TrendingUp, label: 'Income' },
    { path: '/expenses', icon: TrendingDown, label: 'Expenses' },
    { path: '/income-categories', icon: Tag, label: 'Income Categories' },
    { path: '/expense-categories', icon: Tag, label: 'Expense Categories' },
    { path: '/ledger', icon: BookOpen, label: 'Ledger' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
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
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Menu</h2>
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
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-primary-900 dark:text-primary-100 mb-1">
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

