import { useEffect, useState } from 'react';
import { Card } from '../../ui/card';
import { Users, CalendarCheck, Clock, Bell, FileText, BarChart3, MessageSquare, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/museum-api/api';

interface StaffDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

interface Booking {
  bookingId: string;
  bookingStatus: string;
  numberOfVisitors: number;
  visitDate: string;
  timeSlot: string;
  museumSelection: string;
  firstName: string;
  lastName: string;
}

interface LogEntry {
  logId: string;
  arrivalDate: string;
  departureTime: string | null;
  visitorCount: number;
  visitorFirstName: string;
  visitorLastName: string;
}

export default function StaffDashboard({ userName, onNavigate }: StaffDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    Promise.all([
      fetch(`${API_BASE}/visitor-bookings`, { headers }).then(r => r.json()).then(d => Array.isArray(d.value) ? d.value : []).catch(() => []),
      fetch(`${API_BASE}/attendance-logs`, { headers }).then(r => r.json()).then(d => Array.isArray(d.value) ? d.value : []).catch(() => []),
    ]).then(([b, l]) => {
      setBookings(b);
      setLogs(l);
    }).finally(() => setLoading(false));
  }, []);

  const todayBookings = bookings.filter(b => b.visitDate === today && b.bookingStatus !== 'Cancelled');
  const todayLogs = logs.filter(l => l.arrivalDate === today);
  const onSiteLogs = logs.filter(l => !l.departureTime);
  const onSiteCount = onSiteLogs.reduce((s, l) => s + l.visitorCount, 0);
  const pendingCount = bookings.filter(b => b.bookingStatus === 'Pending').length;
  const todayArrivals = todayLogs.reduce((s, l) => s + l.visitorCount, 0);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen bg-[#f8f6f3]">
        <p className="text-[#4A5565]">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-[#f8f6f3] min-h-screen">
      <div>
        <h1 className="text-3xl mb-2 text-[#1e3a5f]">Welcome, {userName}</h1>
        <p className="text-[#4A5565]">Staff operations dashboard — {today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#1e3a5f15' }}>
            <CalendarCheck className="w-6 h-6" style={{ color: '#1e3a5f' }} />
          </div>
          <h3 className="text-2xl mb-1" style={{ color: '#1e3a5f' }}>{todayBookings.length}</h3>
          <p className="text-sm text-[#4A5565]">Today's Bookings</p>
          <p className="text-xs text-[#4A5565]">{todayBookings.reduce((s, b) => s + b.numberOfVisitors, 0)} total visitors</p>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#3B82F615' }}>
            <Users className="w-6 h-6" style={{ color: '#3B82F6' }} />
          </div>
          <h3 className="text-2xl mb-1" style={{ color: '#3B82F6' }}>{todayArrivals}</h3>
          <p className="text-sm text-[#4A5565]">Arrivals Today</p>
          <p className="text-xs text-[#4A5565]">{todayLogs.length} log entries</p>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#10B98115' }}>
            <Clock className="w-6 h-6" style={{ color: '#10B981' }} />
          </div>
          <h3 className="text-2xl mb-1" style={{ color: '#10B981' }}>{onSiteCount}</h3>
          <p className="text-sm text-[#4A5565]">On-Site Now</p>
          <p className="text-xs text-[#4A5565]">{onSiteLogs.length} active entries</p>
        </Card>
        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F59E0B15' }}>
            <Bell className="w-6 h-6" style={{ color: '#F59E0B' }} />
          </div>
          <h3 className="text-2xl mb-1" style={{ color: '#F59E0B' }}>{pendingCount}</h3>
          <p className="text-sm text-[#4A5565]">Pending Approvals</p>
          <p className="text-xs text-[#4A5565]">awaiting confirmation</p>
        </Card>
      </div>

      <div>
        <h2 className="text-xl mb-4 text-[#1e3a5f]">Staff Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('members')}>
            <Users className="w-8 h-8 text-[#1e3a5f] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Member Management</h3>
            <p className="text-sm text-[#4A5565]">View and manage member accounts</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('applications')}>
            <FileText className="w-8 h-8 text-[#3B82F6] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Applications</h3>
            <p className="text-sm text-[#4A5565]">Process membership requests</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('announcement')}>
            <MessageSquare className="w-8 h-8 text-[#8B5CF6] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Communications</h3>
            <p className="text-sm text-[#4A5565]">Send member announcements</p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('analytics')}>
            <BarChart3 className="w-8 h-8 text-[#10B981] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Reports</h3>
            <p className="text-sm text-[#4A5565]">View operational analytics</p>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-[#1e3a5f] mb-4">Today's Bookings</h3>
          {todayBookings.length === 0 ? (
            <p className="text-sm text-[#4A5565]">No bookings for today.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {todayBookings.slice(0, 6).map((b) => (
                <div key={b.bookingId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#1e3a5f] font-medium">{b.firstName} {b.lastName}</p>
                    <p className="text-xs text-[#4A5565]">{b.timeSlot} &middot; {b.museumSelection.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                      backgroundColor: b.bookingStatus === 'Confirmed' ? '#10B98115' : b.bookingStatus === 'Pending' ? '#F59E0B15' : '#EF444415',
                      color: b.bookingStatus === 'Confirmed' ? '#10B981' : b.bookingStatus === 'Pending' ? '#F59E0B' : '#EF4444'
                    }}>{b.bookingStatus}</span>
                    <span className="text-xs text-[#4A5565]">{b.numberOfVisitors} pax</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[#1e3a5f] bg-opacity-5 border-[#1e3a5f] border-opacity-20">
          <h3 className="font-medium text-[#1e3a5f] mb-4">Staff Responsibilities</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Process visitor bookings and walk-in registration</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Log visitor arrivals and departures</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Monitor on-site visitor capacity</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Manage schedule slots and availability</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
