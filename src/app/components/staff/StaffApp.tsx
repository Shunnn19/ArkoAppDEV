import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { StaffSidebar } from './StaffSidebar';
import { Toaster } from '../ui/sonner';
import { SchedulingStaffView } from '../scheduling/SchedulingStaffView';

type PageType = 'visitor-scheduling';

interface StaffAppProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

export default function StaffApp({ user, onLogout }: StaffAppProps) {
  const location = useLocation();
  const museum = (location.state as { museum?: string } | null)?.museum || localStorage.getItem('selected_museum') || '';
  const [currentPage, setCurrentPage] = useState<PageType>('visitor-scheduling');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userInfo = {
    name: user?.name || 'John Doe',
    role: user?.role || 'Staff'
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
      case 'visitor-scheduling':
        return <SchedulingStaffView museum={museum} />;
      default:
        return <SchedulingStaffView museum={museum} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Toaster position="top-right" richColors toastOptions={{ style: { zIndex: 9999 } }} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1f2937] text-white p-2.5 rounded-lg shadow-lg"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <StaffSidebar
          activePage={currentPage}
          userInfo={userInfo}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      <div className="ml-0 md:ml-64 min-h-screen overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}
