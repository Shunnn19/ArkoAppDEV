import imgArkoLogoNew from 'figma:asset/46a7c40df42c58a640692a560d514465085e4443.png';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  BookOpen,
  MessageSquare,
  Settings,
  Users,
  FileText,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  Archive,
  FolderOpen,
  UserCheck,
  LayoutGrid,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DashboardSidebarProps {
  currentPage: string;
  userRole: string;
  userName: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export default function DashboardSidebar({
  currentPage,
  userRole,
  userName,
  onNavigate,
  onLogout
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [operationsExpanded, setOperationsExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Member Services']);

  const isAdmin = userRole === 'curator' || userRole === 'staff';

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const handleItemClick = (action?: string | (() => void)) => {
    if (typeof action === 'function') {
      action();
    } else if (typeof action === 'string') {
      onNavigate(action);
    }
  };

  // Member Navigation Items
  const memberNav = [
    {
      label: 'Dashboard',
      icon: LayoutGrid,
      action: 'dashboard'
    },
    {
      label: 'Member Services',
      icon: Users,
      children: [
        {
          label: 'Renew Membership',
          icon: CreditCard,
          action: 'payment'
        },
        {
          label: 'Give Feedback',
          icon: MessageSquare,
          action: 'feedback'
        }
      ]
    },
    {
      label: 'Settings',
      icon: Settings,
      action: 'settings'
    }
  ];

  // Admin Navigation Items
  const adminNav = [
    {
      id: 'archives',
      label: 'Digital Archives',
      icon: Archive,
      action: () => toast.info('Digital Archives', { description: 'This feature is coming soon' })
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: FolderOpen,
      action: () => toast.info('Catalog', { description: 'This feature is coming soon' })
    },
    { id: 'applications', label: 'Access Management', icon: UserCheck }
  ];

  const adminOperations = [
    { id: 'members', label: 'Manage Members', icon: Users },
    { id: 'announcement', label: 'Communication', icon: Bell },
    { id: 'analytics', label: 'Analytics and Reports', icon: BarChart3 },
    {
      id: 'staff-mgmt',
      label: 'Staff Management',
      icon: FileText,
      action: () => toast.info('Staff Management', { description: 'This feature is coming soon' })
    }
  ];

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
    } else {
      onNavigate(item.id);
    }
  };

  if (isAdmin) {
    return (
      <aside className="w-64 bg-[#2c3e50] text-white h-full flex flex-col">
        {/* Admin Header */}
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white bg-opacity-10 flex items-center justify-center">
              <span className="font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="font-bold">ARKO</h2>
              <p className="text-xs text-white text-opacity-60">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {adminNav.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-white bg-opacity-10 text-white'
                    : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}

            {/* Museum Operations Section */}
            <div className="pt-4">
              <button
                onClick={() => setOperationsExpanded(!operationsExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-white text-opacity-60 hover:text-opacity-100 transition-colors"
              >
                <span className="text-xs uppercase tracking-wider font-medium">
                  Museum Operations
                </span>
                {operationsExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {operationsExpanded && (
                <div className="space-y-1 mt-1">
                  {adminOperations.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        currentPage === item.id
                          ? 'bg-white bg-opacity-10 text-white'
                          : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="pt-4">
              <button
                onClick={() => onNavigate('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentPage === 'settings'
                    ? 'bg-white bg-opacity-10 text-white'
                    : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
    );
  }

  // Member Sidebar
  return (
    <aside className="w-64 bg-[#2d3e50] text-white h-full flex flex-col">
      {/* Header with Logo */}
      <div className="px-4 py-[17px] border-b border-[#364153] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 size-[40px]" data-name="image 138">
            <img
              alt="ARKO Logo"
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={imgArkoLogoNew}
            />
          </div>
          <div>
            <h1 className="text-white text-[17px] leading-[28px]">Member Portal</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {memberNav.map((item) => (
            <div key={item.label}>
              {/* Main Item */}
              <button
                onClick={() => {
                  if (item.children) {
                    toggleExpanded(item.label);
                  } else if (item.action) {
                    handleItemClick(item.action);
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.children && (
                  expandedItems.includes(item.label) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                )}
              </button>

              {/* Children */}
              {item.children && expandedItems.includes(item.label) && (
                <div className="mt-1 space-y-1 ml-8 border-l border-white/10 pl-4">
                  {item.children.map((child) => (
                    <button
                      key={child.label}
                      onClick={() => handleItemClick(child.action)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-sm"
                    >
                      <child.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* User Info */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-[#364153] bg-[#1a202c]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full flex-shrink-0 bg-[#AC0000] flex items-center justify-center text-white font-bold text-sm">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] text-[#f3f4f6] font-medium truncate">{userName}</p>
              <p className="text-[12px] text-[#9ca3af] truncate capitalize">{userRole}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onLogout) onLogout();
              navigate('/portal');
            }}
            className="p-2 text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[rgba(106,114,130,0.15)] rounded-lg transition-colors flex-shrink-0"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}