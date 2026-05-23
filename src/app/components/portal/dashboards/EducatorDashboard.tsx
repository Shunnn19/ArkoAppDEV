import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { GraduationCap, Users, Calendar, BookOpen, CheckCircle, FileText } from 'lucide-react';

interface EducatorDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

export default function EducatorDashboard({ userName, onNavigate }: EducatorDashboardProps) {
  const membershipStatus = {
    isActive: true,
    type: 'Educator Monthly',
    expiryDate: '2025-02-15',
    studentsRegistered: 32
  };

  const teachingResources = [
    {
      id: 1,
      title: 'Ancient Civilizations Curriculum Guide',
      grade: 'Grades 6-8',
      downloads: 234,
      type: 'Lesson Plan'
    },
    {
      id: 2,
      title: 'Art History Workshop Materials',
      grade: 'Grades 9-12',
      downloads: 189,
      type: 'Activity Guide'
    },
    {
      id: 3,
      title: 'Field Trip Activity Booklet',
      grade: 'All Grades',
      downloads: 456,
      type: 'Student Resource'
    }
  ];

  const upcomingPrograms = [
    {
      title: 'Teacher Workshop: Using Museum Resources',
      date: '2025-01-22',
      spots: 5
    },
    {
      title: 'Student Field Trip: Colonial History',
      date: '2025-02-05',
      spots: 12
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl mb-2 text-[#1e3a5f]">Welcome, {userName}</h1>
        <p className="text-[#4A5565]">
          Access teaching resources and schedule educational programs for your students
        </p>
      </div>

      {/* Membership Status Card - Green Theme */}
      <Card className="p-6 bg-gradient-to-br from-[#10B981] to-[#059669] text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Educator Membership Active</span>
            </div>
            <h2 className="text-2xl mb-1">{membershipStatus.type}</h2>
            <p className="text-white text-opacity-90">
              {membershipStatus.studentsRegistered} students registered
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
            className="bg-white text-[#10B981] hover:bg-gray-100 border-0"
          >
            Renew
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl mb-4 text-[#1e3a5f]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('resources')}
          >
            <div className="w-12 h-12 rounded-full bg-[#10B981] bg-opacity-10 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[#10B981]" />
            </div>
            <h3 className="font-medium text-[#1e3a5f] mb-2">Teaching Resources</h3>
            <p className="text-sm text-[#4A5565]">
              Access curriculum guides and materials
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('events')}
          >
            <div className="w-12 h-12 rounded-full bg-[#059669] bg-opacity-10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#059669]" />
            </div>
            <h3 className="font-medium text-[#1e3a5f] mb-2">Schedule Field Trip</h3>
            <p className="text-sm text-[#4A5565]">
              Book a visit for your students
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('resources')}
          >
            <div className="w-12 h-12 rounded-full bg-[#10B981] bg-opacity-10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#10B981]" />
            </div>
            <h3 className="font-medium text-[#1e3a5f] mb-2">Student Groups</h3>
            <p className="text-sm text-[#4A5565]">
              Manage your registered students
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate('events')}
          >
            <div className="w-12 h-12 rounded-full bg-[#059669] bg-opacity-10 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6 text-[#059669]" />
            </div>
            <h3 className="font-medium text-[#1e3a5f] mb-2">Workshops</h3>
            <p className="text-sm text-[#4A5565]">
              Professional development programs
            </p>
          </Card>
        </div>
      </div>

      {/* Teaching Resources */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-[#1e3a5f]">Popular Teaching Resources</h2>
          <Button
            variant="outline"
            onClick={() => onNavigate('resources')}
          >
            Browse All
          </Button>
        </div>
        <div className="grid gap-4">
          {teachingResources.map((resource) => (
            <Card key={resource.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#10B981] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1e3a5f] mb-1">{resource.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#4A5565]">
                      <span className="px-2 py-1 bg-[#10B981] bg-opacity-10 text-[#10B981] rounded text-xs">
                        {resource.type}
                      </span>
                      <span>{resource.grade}</span>
                      <span>{resource.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Programs */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-medium text-[#1e3a5f] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#10B981]" />
            Upcoming Programs
          </h3>
          <div className="space-y-3">
            {upcomingPrograms.map((program, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-[#1e3a5f] mb-1">{program.title}</h4>
                <div className="flex items-center justify-between text-xs text-[#4A5565]">
                  <span>
                    {new Date(program.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-[#10B981]">{program.spots} spots available</span>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4 bg-[#10B981] hover:bg-[#059669]" onClick={() => onNavigate('events')}>
            View All Programs
          </Button>
        </Card>

        <Card className="p-6 bg-[#10B981] bg-opacity-5 border-[#10B981] border-opacity-20">
          <h3 className="font-medium text-[#1e3a5f] mb-4">Educator Benefits</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Free admission for you and your students</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Access to curriculum-aligned resources</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Professional development workshops</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Priority booking for field trips</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#4A5565]">Special educator events and previews</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
