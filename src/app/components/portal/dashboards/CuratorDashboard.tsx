import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Users, TrendingUp, FileText, DollarSign, UserPlus, Bell, BarChart3, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CuratorDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const memberGrowthData = [
  { month: 'Jul', members: 1245 },
  { month: 'Aug', members: 1389 },
  { month: 'Sep', members: 1502 },
  { month: 'Oct', members: 1621 },
  { month: 'Nov', members: 1738 },
  { month: 'Dec', members: 1847 }
];

const revenueData = [
  { month: 'Jul', revenue: 37350 },
  { month: 'Aug', revenue: 41670 },
  { month: 'Sep', revenue: 45060 },
  { month: 'Oct', revenue: 48630 },
  { month: 'Nov', revenue: 52140 },
  { month: 'Dec', revenue: 55410 }
];

export default function CuratorDashboard({ userName, onNavigate }: CuratorDashboardProps) {
  const stats = [
    {
      label: 'Total Members',
      value: '1,847',
      change: '+109 this month',
      icon: Users,
      color: '#8B5CF6',
      trend: 'up'
    },
    {
      label: 'Active Memberships',
      value: '1,642',
      change: '88.9% active rate',
      icon: CheckCircle,
      color: '#10B981',
      trend: 'up'
    },
    {
      label: 'Pending Applications',
      value: '24',
      change: '12 new this week',
      icon: FileText,
      color: '#F59E0B',
      trend: 'neutral'
    },
    {
      label: 'Monthly Revenue',
      value: '₱55,410',
      change: '+6.3% from last month',
      icon: DollarSign,
      color: '#3B82F6',
      trend: 'up'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Members',
      description: 'View and manage all member accounts',
      icon: Users,
      color: '#8B5CF6',
      page: 'members'
    },
    {
      title: 'View Applications',
      description: 'Review pending membership applications',
      icon: FileText,
      color: '#F59E0B',
      page: 'applications'
    },
    {
      title: 'Send Announcement',
      description: 'Communicate with members',
      icon: Bell,
      color: '#3B82F6',
      page: 'announcement'
    },
    {
      title: 'Analytics Reports',
      description: 'View detailed statistics and trends',
      icon: BarChart3,
      color: '#10B981',
      page: 'analytics'
    }
  ];

  const recentActivity = [
    { action: 'New member registration: John Smith', time: '5 minutes ago', icon: UserPlus, color: '#10B981' },
    { action: 'Application approved: Research Access', time: '1 hour ago', icon: CheckCircle, color: '#3B82F6' },
    { action: 'Announcement sent to 1,847 members', time: '3 hours ago', icon: Bell, color: '#8B5CF6' },
    { action: 'Monthly report generated', time: '1 day ago', icon: FileText, color: '#F59E0B' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-[#f8f6f3] min-h-screen">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl mb-2 text-[#1e3a5f]">Welcome, {userName}</h1>
        <p className="text-[#4A5565]">
          Museum administration dashboard - Overview of membership operations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="flex items-center gap-1 text-sm">
                {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-[#10B981]" />}
              </div>
            </div>
            <h3 className="text-2xl mb-1" style={{ color: stat.color }}>
              {stat.value}
            </h3>
            <p className="text-sm text-[#4A5565] mb-1">{stat.label}</p>
            <p className="text-xs text-[#4A5565]">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl mb-4 text-[#1e3a5f]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
              onClick={() => onNavigate(action.page)}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${action.color}15` }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <h3 className="font-medium text-[#1e3a5f] mb-2">{action.title}</h3>
              <p className="text-sm text-[#4A5565]">{action.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-[#1e3a5f] mb-6">Member Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={memberGrowthData}>
              <CartesianGrid key="growth-grid" strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis key="growth-xaxis" dataKey="month" stroke="#4A5565" style={{ fontSize: '12px' }} />
              <YAxis key="growth-yaxis" stroke="#4A5565" style={{ fontSize: '12px' }} />
              <Tooltip
                key="growth-tooltip"
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Line
                key="growth-line"
                type="monotone"
                dataKey="members"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-medium text-[#1e3a5f] mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid key="revenue-grid" strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis key="revenue-xaxis" dataKey="month" stroke="#4A5565" style={{ fontSize: '12px' }} />
              <YAxis key="revenue-yaxis" stroke="#4A5565" style={{ fontSize: '12px' }} />
              <Tooltip
                key="revenue-tooltip"
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Area
                key="revenue-area"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="font-medium text-[#1e3a5f] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${activity.color}15` }}
              >
                <activity.icon className="w-5 h-5" style={{ color: activity.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#1e3a5f]">{activity.action}</p>
                <p className="text-xs text-[#4A5565]">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}