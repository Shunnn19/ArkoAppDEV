import imgArkoLogoNew from 'figma:asset/46a7c40df42c58a640692a560d514465085e4443.png';
import { LogOut } from 'lucide-react';

const profileImage = 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzY0Njc0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

interface StaffSidebarProps {
  activePage?: string;
  userInfo?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

export function StaffSidebar({ 
  activePage = 'visitor-scheduling',
  userInfo = { name: 'John Doe', role: 'Staff' },
  onNavigate,
  onLogout
}: StaffSidebarProps) {
  return (
    <div className="w-64 h-full bg-[#1f2937] border-r border-[#364153] flex flex-col overflow-y-auto">
      <div className="px-4 py-[17px] border-b border-[#364153] flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 size-[40px]" data-name="image 138">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgArkoLogoNew} />
          </div>
          <div>
            <h1 className="text-white text-[17px] leading-[28px]">Staff Dashboard</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">

        {/* Visitor Scheduling Module */}
        <button
          onClick={() => onNavigate?.('visitor-scheduling')}
          className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors ${
            activePage === 'visitor-scheduling'
              ? 'bg-[rgba(106,114,130,0.2)] text-[#f3f4f6]'
              : 'text-[#f3f4f6] hover:bg-[rgba(106,114,130,0.15)]'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
            <path d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d="M10.6667 1.33333V4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d="M5.33333 1.33333V4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d="M2 6.66667H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
          <span className="text-[13px] font-semibold">Visitor Scheduling</span>
        </button>

      </nav>

      <div className="flex-shrink-0 px-4 py-4 border-t border-[#364153] bg-[#1a202c]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img src={profileImage} alt={userInfo.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] text-[#f3f4f6] font-medium truncate">{userInfo.name}</p>
              <p className="text-[12px] text-[#9ca3af] truncate">{userInfo.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[rgba(106,114,130,0.15)] rounded-lg transition-colors flex-shrink-0"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
