import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { CreditCard, Calendar, Image, HelpCircle, CheckCircle, Clock, Search, Upload, Download, Users as UsersIcon } from 'lucide-react';

interface GeneralPublicDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

export default function GeneralPublicDashboard({ userName, onNavigate }: GeneralPublicDashboardProps) {
  const membershipStatus = {
    isActive: true,
    type: 'Monthly',
    expiryDate: '2025-02-15',
    daysRemaining: 30
  };

  const upcomingEvents = [
    {
      id: 1,
      title: 'Ancient Civilizations Exhibition',
      date: '2025-01-25',
      time: '10:00 AM - 6:00 PM',
      location: 'Main Gallery'
    },
    {
      id: 2,
      title: 'Curator Talk: Medieval Art',
      date: '2025-01-28',
      time: '2:00 PM - 3:30 PM',
      location: 'Auditorium'
    },
    {
      id: 3,
      title: 'Family Day: Hands-on History',
      date: '2025-02-03',
      time: '9:00 AM - 12:00 PM',
      location: 'Education Center'
    }
  ];

  const recentActivity = [
    { action: 'Viewed "Renaissance Collection"', date: '2 days ago' },
    { action: 'Downloaded membership card', date: '1 week ago' },
    { action: 'Registered for workshop', date: '2 weeks ago' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Research Portal Header */}
      <div className="bg-[#3d5467] text-white p-6 rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl mb-1">Member Portal - {userName}</h1>
          </div>
          <div className="px-4 py-2 bg-white bg-opacity-10 rounded-full border border-[#10B981] text-[#10B981] text-sm">
            Full Archive Access
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gray-50">
          <p className="text-sm text-[#7E8B9A] mb-1">This Month</p>
          <p className="text-4xl text-[#4A90E2] mb-1">47</p>
          <p className="text-sm text-[#1e3a5f]">Research Hours</p>
        </Card>
        
        <Card className="p-6 bg-orange-50">
          <p className="text-sm text-[#7E8B9A] mb-1">Renewal</p>
          <p className="text-4xl text-[#F59E0B] mb-1">87</p>
          <p className="text-sm text-[#1e3a5f]">Days Remaining</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="md:col-span-2 space-y-6">
          {/* Digital Archive Search */}
          <Card className="p-6">
            <h2 className="text-lg text-[#10B981] mb-1">Digital Archive Search</h2>
            <p className="text-sm text-[#7E8B9A] mb-4">Search and request access to historical collections</p>
            
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search archives, documents, artifacts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white px-6">
                Search
              </Button>
            </div>
            
            <Button variant="outline" className="w-auto">
              Browse Collections
            </Button>

            {/* Collections List */}
            <div className="mt-6 space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-[#1e3a5f] mb-1">Medieval Manuscripts</h3>
                <p className="text-sm text-[#7E8B9A]">1,245 items • Full digitized collection</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-[#1e3a5f] mb-1">Industrial Revolution Records</h3>
                <p className="text-sm text-[#7E8B9A]">3,892 items • Photographs & documents</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-[#1e3a5f] mb-1">Archaeological Findings Database</h3>
                <p className="text-sm text-[#7E8B9A]">567 items • Excavation reports & analysis</p>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Collaborators */}
      

          {/* Research Counts */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon className="w-5 h-5 text-[#10B981]" />
              <h2 className="text-lg text-[#10B981]">Research Counts</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#1e3a5f]">All Publications</p>
                <p className="text-sm font-medium text-[#10B981]">8</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#1e3a5f]">All Citations</p>
                <p className="text-sm font-medium text-[#10B981]">156</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}