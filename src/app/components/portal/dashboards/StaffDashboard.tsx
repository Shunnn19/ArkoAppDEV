import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Users, FileText, MessageSquare, BarChart3, HelpCircle, CheckCircle } from 'lucide-react';

interface StaffDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

export default function StaffDashboard({ userName, onNavigate }: StaffDashboardProps) {
  const operationalStats = [
    {
      label: 'Active Support Tickets',
      value: '12',
      icon: HelpCircle,
      color: '#1e3a5f'
    },
    {
      label: 'Members Assisted Today',
      value: '34',
      icon: Users,
      color: '#3B82F6'
    },
    {
      label: 'Applications Processed',
      value: '18',
      icon: FileText,
      color: '#10B981'
    },
    {
      label: 'Announcements Sent',
      value: '47',
      icon: MessageSquare,
      color: '#8B5CF6'
    }
  ];

  const tasks = [
    { task: 'Review new member applications', priority: 'high', count: 8 },
    { task: 'Respond to support requests', priority: 'medium', count: 12 },
    { task: 'Update membership records', priority: 'low', count: 5 },
    { task: 'Prepare monthly report', priority: 'high', count: 1 }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-[#f8f6f3] min-h-screen">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl mb-2 text-[#1e3a5f]">Welcome, {userName}</h1>
        <p className="text-[#4A5565]">
          Museum staff operations dashboard - Member support and management
        </p>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operationalStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <h3 className="text-2xl mb-1" style={{ color: stat.color }}>
              {stat.value}
            </h3>
            <p className="text-sm text-[#4A5565]">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl mb-4 text-[#1e3a5f]">Staff Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('members')}
          >
            <Users className="w-8 h-8 text-[#1e3a5f] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Member Management</h3>
            <p className="text-sm text-[#4A5565]">View and manage member accounts</p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('applications')}
          >
            <FileText className="w-8 h-8 text-[#3B82F6] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Applications</h3>
            <p className="text-sm text-[#4A5565]">Process membership requests</p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('announcement')}
          >
            <MessageSquare className="w-8 h-8 text-[#8B5CF6] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Communications</h3>
            <p className="text-sm text-[#4A5565]">Send member announcements</p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('analytics')}
          >
            <BarChart3 className="w-8 h-8 text-[#10B981] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Reports</h3>
            <p className="text-sm text-[#4A5565]">View operational analytics</p>
          </Card>
        </div>
      </div>

      {/* Tasks & Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-[#1e3a5f] mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span className="text-sm text-[#1e3a5f]">{task.task}</span>
                </div>
                <span className="text-sm font-medium text-[#4A5565]">{task.count}</span>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-[#1e3a5f] hover:bg-[#2d4a6f]">
            View All Tasks
          </Button>
        </Card>

        <Card className="p-6 bg-[#1e3a5f] bg-opacity-5 border-[#1e3a5f] border-opacity-20">
          <h3 className="font-medium text-[#1e3a5f] mb-4">Staff Responsibilities</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Process membership applications and renewals</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Provide member support and assistance</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Manage member communications</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#1e3a5f] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Generate operational reports</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
