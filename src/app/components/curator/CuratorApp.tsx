import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { CuratorSidebar } from './CuratorSidebar';
import CuratorAccessLogPage from './CuratorAccessLogPage';
import { CuratorVisitManagementPage } from './CuratorVisitManagementPage';
import CuratorVisitQuotaPage from './CuratorVisitQuotaPage';
import CuratorManageMembersPage from './CuratorManageMembersPage';

import CuratorStaffManagementPage from './CuratorStaffManagementPage';
import { Toaster } from '../ui/sonner';
import { SchedulingCuratorView } from '../scheduling/SchedulingCuratorView';

type PageType = 'access-log' | 'visit-management' | 'visit-quota' | 'manage-members' | 'staff-management' | 'visitor-scheduling';

interface CuratorAppProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

export default function CuratorApp({ user, onLogout }: CuratorAppProps) {
  const location = useLocation();
  const museum = (location.state as { museum?: string } | null)?.museum || localStorage.getItem('selected_museum') || '';
  const [currentPage, setCurrentPage] = useState<PageType>('visitor-scheduling');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userInfo = {
    name: user?.name || 'Sarah Chen',
    role: user?.role || 'Curator'
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    onLogout?.();
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'access-log':
        return <CuratorAccessLogPage />;
      case 'visit-management':
        return <CuratorVisitManagementPage 
          onNavigateToVisitQuota={() => setCurrentPage('visit-quota')}
        />;
      case 'visit-quota':
        return <CuratorVisitQuotaPage />;
      case 'manage-members':
        return <CuratorManageMembersPage />;

      case 'staff-management':
        return <CuratorStaffManagementPage />;
      case 'visitor-scheduling':
        return <SchedulingCuratorView museum={museum} />;
      default:
        return <SchedulingCuratorView museum={museum} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Toaster position="top-right" richColors toastOptions={{ style: { zIndex: 9999 } }} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1f2937] text-white p-2.5 rounded-lg shadow-lg"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar — slides in on mobile, always visible on desktop */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <CuratorSidebar
          activePage={currentPage}
          userInfo={userInfo}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className="ml-0 md:ml-64 min-h-screen">
        {renderPage()}
      </div>
    </div>
  );
}
