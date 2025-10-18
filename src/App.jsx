import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';
import routes from './routes';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Something went wrong
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              There was an error loading this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Layout wrapper for authenticated pages
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Debug logging for navigation
  useEffect(() => {
    console.log('Navigation to:', location.pathname);
  }, [location.pathname]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      console.log('PopState event:', event.state);
      // Small delay to ensure proper navigation
      setTimeout(() => {
        console.log('Navigation completed to:', window.location.pathname);
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check if current page is login
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return children;
  }

  // Show loading state to prevent white screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        user={user} 
        sidebarOpen={sidebarOpen}
      />
      <div className="flex content-with-header">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 lg:main-content">
          <div className="max-w-7xl mx-auto" key={location.pathname}>
            {children}
          </div>
          <ScrollToTop />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Layout>
            <Routes>
              {routes.map((route, index) => (
                <Route 
                  key={`${route.path}-${index}`} 
                  path={route.path} 
                  element={
                    <ErrorBoundary>
                      {route.element}
                    </ErrorBoundary>
                  } 
                />
              ))}
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
