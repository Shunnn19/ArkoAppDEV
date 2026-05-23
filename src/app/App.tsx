import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Skeleton } from './components/ui/skeleton';
import { Toaster } from './components/ui/sonner';
import { SchedulingProvider } from './components/scheduling/SchedulingContext';
import { AuthProvider, useAuth } from './components/auth/AuthContext';

// Portal components (not lazy loaded for better UX)
import LoginRegister from './components/portal/LoginRegister';
import PortalMain from './components/portal/PortalMain';

// Curator Dashboard (not lazy loaded for better UX)
import CuratorApp from './components/curator/CuratorApp';

// Staff Dashboard (not lazy loaded for better UX)
import StaffApp from './components/staff/StaffApp';

// Landing Portal (not lazy loaded as it's the entry point)
import LandingPortal from './pages/LandingPortal';

// Lazy-loaded page components for optimal performance
const VisitorScheduling = lazy(() => import('./pages/VisitorScheduling'));

// Loading component with skeleton UI
function PageLoader() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[72px] border-b border-gray-200 px-4 sm:px-6 lg:px-[88px]">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex gap-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[88px] py-12">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-6 w-full max-w-2xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Scroll to top on route change for better UX
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Main app content with routing logic
function AppContent() {
  const navigate = useNavigate();
  const { user, isLoading, logout: authLogout } = useAuth();

  // Global keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchButton = document.querySelector('[aria-label="Search museum collections"]') as HTMLButtonElement;
        searchButton?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await authLogout();
    navigate('/register');
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Portal - Main Entry Point */}
          <Route path="/" element={<LandingPortal />} />
          
          {/* Visitor Scheduling & Management Module (public) */}
          <Route path="/visitor-scheduling" element={<VisitorScheduling />} />

          {/* Museum Membership Portal Routes */}
          <Route 
            path="/register" 
            element={<LoginRegister />}
          />
          <Route 
            path="/portal/*" 
            element={
              user ? (
                <PortalMain user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/register" replace />
              )
            } 
          />
          
          {/* Curator Dashboard — curator role required */}
          <Route 
            path="/curator" 
            element={
              user?.role === 'curator' ? (
                <CuratorApp user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/register" replace />
              )
            } 
          />
          
          {/* Staff Dashboard — staff role required */}
          <Route 
            path="/staff" 
            element={
              user?.role === 'staff' ? (
                <StaffApp user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/register" replace />
              )
            } 
          />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <SchedulingProvider>
          <Toaster position="top-right" />
          <AppContent />
        </SchedulingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
