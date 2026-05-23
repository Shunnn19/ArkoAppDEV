import { LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';

interface PortalHeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

const roleLabels: Record<string, string> = {
  general: 'General Member',
  researcher: 'Historical Researcher',
  educator: 'Educator',
  curator: 'Curator',
  staff: 'Museum Staff'
};

const roleColors: Record<string, string> = {
  general: '#4A90E2',
  researcher: '#7C3AED',
  educator: '#10B981',
  curator: '#8B5CF6',
  staff: '#1e3a5f'
};

export default function PortalHeader({ userName, userRole, onLogout }: PortalHeaderProps) {
  return (
    <header className="h-[73px] bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Logo/Branding */}
      <div className="flex items-center gap-3">
        {userRole === 'researcher' ? (
          <div>
            <h1 className="font-medium text-[#1e3a5f]">Research Portal - {userName}</h1>
            <p className="text-xs text-[#4A5565]">University of Historical Studies</p>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="font-medium text-[#1e3a5f]">Museum Portal</h1>
              <p className="text-xs text-[#4A5565]">Membership Management</p>
            </div>
          </>
        )}
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-[#1e3a5f]">{userName}</p>
            <p
              className="text-xs"
              style={{ color: roleColors[userRole] }}
            >
              {roleLabels[userRole]}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: roleColors[userRole] }}
          >
            <User className="w-5 h-5" />
          </div>
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}