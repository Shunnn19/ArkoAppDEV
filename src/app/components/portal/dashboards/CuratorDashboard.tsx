import { useEffect, useState } from 'react';
import { Card } from '../../ui/card';
import { Users, CalendarCheck, Clock, AlertTriangle, FileText, Bell, BarChart3 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/museum-api/api';

interface CuratorDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

interface Booking {
  bookingId: string;
  museumSelection: string;
  bookingStatus: string;
  numberOfVisitors: number;
  visitDate: string;
  timeSlot: string;
  firstName: string;
  lastName: string;
}

interface LogEntry {
  logId: string;
  entryType: string;
  attendanceStatus: string;
  departureTime: string | null;
  visitorFirstName: string;
  visitorLastName: string;
  visitorCount: number;
}

interface Notification {
  notificationId: string;
  notificationType: string;
  recipient: string;
  dateNotified: string;
}

export default function CuratorDashboard({ userName, onNavigate }: CuratorDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const headers = getAuthHeaders();
    Promise.all([
      fetch(`${API_BASE}/visitor-bookings`, { headers }).then(r => r.json()).then(d => Array.isArray(d.value) ? d.value : []).catch(() => []),
      fetch(`${API_BASE}/attendance-logs`, { headers }).then(r => r.json()).then(d => Array.isArray(d.value) ? d.value : []).catch(() => []),
      fetch(`${API_BASE}/notifications`, { headers }).then(r => r.json()).then(d => Array.isArray(d.value) ? d.value : []).catch(() => []),
    ]).then(([b, l, n]) => {
      setBookings(b);
      setLogs(l);
      setNotifications(n);
    }).finally(() => setLoading(false));
  }, []);

  const todayBookings = bookings.filter(b => b.visitDate === today && b.bookingStatus !== 'Cancelled');
  const pendingBookings = bookings.filter(b => b.bookingStatus === 'Pending');
  const onSiteLogs = logs.filter(l => !l.departureTime && l.attendanceStatus === 'Present');
  const onSiteCount = onSiteLogs.reduce((sum, l) => sum + l.visitorCount, 0);
  const todayTotalVisitors = todayBookings.reduce((sum, b) => sum + b.numberOfVisitors, 0);

  const stats = [
    { label: "Today's Bookings", value: todayBookings.length.toString(), sub: `${todayTotalVisitors} visitors`, icon: CalendarCheck, color: '#8B5CF6' },
    { label: 'Pending Approvals', value: pendingBookings.length.toString(), sub: 'awaiting confirmation', icon: AlertTriangle, color: '#F59E0B' },
    { label: 'On-Site Now', value: onSiteCount.toString(), sub: `${onSiteLogs.length} entries`, icon: Users, color: '#10B981' },
    { label: 'Total Notifications', value: notifications.length.toString(), sub: 'all time', icon: Bell, color: '#3B82F6' },
  ];

  const quickActions = [
    { title: 'Manage Members', description: 'View and manage all visitor accounts', icon: Users, color: '#8B5CF6', page: 'members' },
    { title: 'Review Bookings', description: 'Approve or modify pending reservations', icon: FileText, color: '#F59E0B', page: 'visitor-scheduling' },
    { title: 'Send Announcement', description: 'Communicate with visitors and staff', icon: Bell, color: '#3B82F6', page: 'announcement' },
    { title: 'Staff Management', description: 'Manage staff assignments and schedules', icon: BarChart3, color: '#10B981', page: 'staff-management' },
  ];

  const recentNotifications = notifications.slice(0, 5);

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
        <p className="text-[#4A5565]">Museum operations overview — {today}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
            <h3 className="text-2xl mb-1" style={{ color: stat.color }}>{stat.value}</h3>
            <p className="text-sm text-[#4A5565] mb-1">{stat.label}</p>
            <p className="text-xs text-[#4A5565]">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-xl mb-4 text-[#1e3a5f]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1" onClick={() => onNavigate(action.page)}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${action.color}15` }}>
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <h3 className="font-medium text-[#1e3a5f] mb-2">{action.title}</h3>
              <p className="text-sm text-[#4A5565]">{action.description}</p>
            </Card>
          ))}
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

        <Card className="p-6">
          <h3 className="font-medium text-[#1e3a5f] mb-4">Currently On-Site</h3>
          {onSiteLogs.length === 0 ? (
            <p className="text-sm text-[#4A5565]">No visitors on-site right now.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {onSiteLogs.slice(0, 6).map((l) => (
                <div key={l.logId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#1e3a5f] font-medium">{l.visitorFirstName} {l.visitorLastName}</p>
                    <p className="text-xs text-[#4A5565]">{l.entryType} &middot; {l.visitorCount} visitors</p>
                  </div>
                  <Clock className="w-4 h-4 text-[#10B981]" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-medium text-[#1e3a5f] mb-4">Recent Notifications</h3>
        {recentNotifications.length === 0 ? (
          <p className="text-sm text-[#4A5565]">No recent notifications.</p>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map((n) => (
              <div key={n.notificationId} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#3B82F615' }}>
                  <Bell className="w-5 h-5" style={{ color: '#3B82F6' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1e3a5f]">{n.notificationType}</p>
                  <p className="text-xs text-[#4A5565] truncate">To: {n.recipient}</p>
                  <p className="text-xs text-[#4A5565]">{n.dateNotified}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
