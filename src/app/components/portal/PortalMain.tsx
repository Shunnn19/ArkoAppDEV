import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import GeneralPublicDashboard from "./dashboards/GeneralPublicDashboard";
import ResearcherDashboard from "./dashboards/ResearcherDashboard";
import EducatorDashboard from "./dashboards/EducatorDashboard";
import CuratorDashboard from "./dashboards/CuratorDashboard";
import StaffDashboard from "./dashboards/StaffDashboard";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";

interface PortalMainProps {
  user: {
    email: string;
    role: string;
    name: string;
  };
  onLogout: () => void;
}

export default function PortalMain({
  user,
  onLogout,
}: PortalMainProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    onLogout();
    setSidebarOpen(false);
    navigate("/register");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    if (currentPage === "dashboard") {
      switch (user.role) {
        case "general":
          return (
            <GeneralPublicDashboard
              userName={user.name}
              onNavigate={handleNavigate}
            />
          );
        case "researcher":
          return (
            <ResearcherDashboard
              userName={user.name}
              onNavigate={handleNavigate}
            />
          );
        case "educator":
          return (
            <EducatorDashboard
              userName={user.name}
              onNavigate={handleNavigate}
            />
          );
        case "curator":
          return (
            <CuratorDashboard
              userName={user.name}
              onNavigate={handleNavigate}
            />
          );
        case "staff":
          return (
            <StaffDashboard
              userName={user.name}
              onNavigate={handleNavigate}
            />
          );
        default:
          return (
            <GeneralPublicDashboard
              userName={user.name}
              onNavigate={handleNavigate}
            />
          );
      }
    }

    return (
      <GeneralPublicDashboard
        userName={user.name}
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <Toaster position="top-right" />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#2c3e50] text-white p-2.5 rounded-lg shadow-lg"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <DashboardSidebar
          currentPage={currentPage}
          userRole={user.role}
          userName={user.name}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
