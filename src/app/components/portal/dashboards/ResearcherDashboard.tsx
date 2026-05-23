import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { FileText, Download, Search, CheckCircle, Clock, BookOpen } from 'lucide-react';

interface ResearcherDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

export default function ResearcherDashboard({ userName, onNavigate }: ResearcherDashboardProps) {
  const membershipStatus = {
    isActive: true,
    type: 'Yearly',
    expiryDate: '2025-12-15',
    documentsAccessed: 47
  };

  const recentDocuments = [
    {
      id: 1,
      title: 'Spanish Colonial Trade Records 1750-1800',
      category: 'Economic History',
      accessDate: '2025-01-10',
      pages: 156
    },
    {
      id: 2,
      title: 'Bicol Region Census Data 1903',
      category: 'Demographics',
      accessDate: '2025-01-08',
      pages: 89
    },
    {
      id: 3,
      title: 'Cathedral Construction Documents',
      category: 'Architecture',
      accessDate: '2025-01-05',
      pages: 234
    },
    {
      id: 4,
      title: 'Indigenous Language Manuscripts',
      category: 'Linguistics',
      accessDate: '2024-12-28',
      pages: 112
    }
  ];

  const archiveStats = [
    { label: 'Total Documents', value: '2,847', icon: FileText, color: '#7C3AED' },
    { label: 'Documents Accessed', value: '47', icon: BookOpen, color: '#9333EA' },
    { label: 'Downloads', value: '23', icon: Download, color: '#A855F7' },
    { label: 'Saved Items', value: '12', icon: Search, color: '#C084FC' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl mb-2 text-[#1e3a5f]">Welcome, {userName}</h1>
        <p className="text-[#4A5565]">
          Access our comprehensive digital archives and historical research materials
        </p>
      </div>

      {/* Membership Status Card - Purple Theme */}
      <Card className="p-6 bg-gradient-to-br from-[#7C3AED] to-[#9333EA] text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Research Membership Active</span>
            </div>
            <h2 className="text-2xl mb-1">{membershipStatus.type} Access</h2>
            <p className="text-white text-opacity-90">
              All documents automatically accessible with active membership
            </p>
            <p className="text-sm text-white text-opacity-80 mt-2">
              Expires: {new Date(membershipStatus.expiryDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <Button
            onClick={() => onNavigate('payment')}
            variant="outline"
            className="bg-white text-[#7C3AED] hover:bg-gray-100 border-0"
          >
            Renew
          </Button>
        </div>
      </Card>

      {/* Archive Statistics */}
      <div>
        <h2 className="text-xl mb-4 text-[#1e3a5f]">Archive Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {archiveStats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <p className="text-2xl mb-1" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-sm text-[#4A5565]">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-xl mb-4 text-[#1e3a5f]">Quick Access</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#7C3AED]"
            onClick={() => onNavigate('resources')}
          >
            <Search className="w-8 h-8 text-[#7C3AED] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Search Archives</h3>
            <p className="text-sm text-[#4A5565]">
              Browse and search through our digital collection
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#9333EA]"
            onClick={() => onNavigate('resources')}
          >
            <FileText className="w-8 h-8 text-[#9333EA] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Recent Documents</h3>
            <p className="text-sm text-[#4A5565]">
              Continue where you left off
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-[#A855F7]"
            onClick={() => onNavigate('resources')}
          >
            <Download className="w-8 h-8 text-[#A855F7] mb-3" />
            <h3 className="font-medium text-[#1e3a5f] mb-2">Download History</h3>
            <p className="text-sm text-[#4A5565]">
              View your downloaded materials
            </p>
          </Card>
        </div>
      </div>

      {/* Recently Accessed Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-[#1e3a5f]">Recently Accessed Documents</h2>
          <Button
            variant="outline"
            onClick={() => onNavigate('resources')}
          >
            View All Archives
          </Button>
        </div>
        <div className="grid gap-4">
          {recentDocuments.map((doc) => (
            <Card key={doc.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-[#7C3AED] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1e3a5f] mb-1">{doc.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#4A5565]">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {doc.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {doc.pages} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(doc.accessDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Research Tools */}
      <Card className="p-6 bg-[#7C3AED] bg-opacity-5 border-[#7C3AED] border-opacity-20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#7C3AED] bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-[#7C3AED]" />
          </div>
          <div>
            <h3 className="font-medium text-[#1e3a5f] mb-2">Research Membership Benefits</h3>
            <ul className="space-y-2 text-sm text-[#4A5565]">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7C3AED]" />
                Unlimited access to all 2,847 digital documents
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7C3AED]" />
                Advanced search and filtering tools
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7C3AED]" />
                High-resolution document downloads
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7C3AED]" />
                Citation tools and research assistance
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#7C3AED]" />
                Priority access to newly digitized materials
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
