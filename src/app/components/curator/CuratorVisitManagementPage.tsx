import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Users, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface CuratorVisitManagementPageProps {
  onNavigateToVisitQuota: () => void;
}

/**
 * CuratorVisitManagementPage
 * Parent page for visit management features
 */
export function CuratorVisitManagementPage({ onNavigateToVisitQuota }: CuratorVisitManagementPageProps) {
  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-[#0a0a0a]">Visit Management</h1>
          <p className="text-[#717182]">Manage visitor scheduling, tracking, and analytics for museum experiences</p>
        </div>

        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Visit Quota Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onNavigateToVisitQuota}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 rounded-[10px] size-[48px] flex items-center justify-center">
                  <TrendingUp className="size-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-[#0a0a0a] mb-2">Visit Quota Management</h3>
              <p className="text-[#717182] text-[14px] mb-4">
                Monitor and manage museum visit quotas for virtual and on-site experiences
              </p>
              <Button variant="outline" className="w-full">
                Manage Quotas
              </Button>
            </CardContent>
          </Card>

          {/* Visitor Scheduling Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-green-100 rounded-[10px] size-[48px] flex items-center justify-center">
                  <Calendar className="size-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-[#0a0a0a] mb-2">Visitor Scheduling</h3>
              <p className="text-[#717182] text-[14px] mb-4">
                Schedule and manage visitor appointments for tours and exhibitions
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Visitor Analytics Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-100 rounded-[10px] size-[48px] flex items-center justify-center">
                  <BarChart3 className="size-5 text-purple-600" />
                </div>
              </div>
              <h3 className="text-[#0a0a0a] mb-2">Visitor Analytics</h3>
              <p className="text-[#717182] text-[14px] mb-4">
                View comprehensive analytics and reports on visitor engagement
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Visitor Registration Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-orange-100 rounded-[10px] size-[48px] flex items-center justify-center">
                  <Users className="size-5 text-orange-600" />
                </div>
              </div>
              <h3 className="text-[#0a0a0a] mb-2">Visitor Registration</h3>
              <p className="text-[#717182] text-[14px] mb-4">
                Manage visitor registrations and track attendance records
              </p>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-[#4a5565] text-[14px]">Total Visitors (Month)</p>
              <p className="text-[#0a0a0a] text-[24px] mt-2">1,847</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-[#4a5565] text-[14px]">Active Quotas</p>
              <p className="text-[#0a0a0a] text-[24px] mt-2">7</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-[#4a5565] text-[14px]">Scheduled Visits</p>
              <p className="text-[#0a0a0a] text-[24px] mt-2">23</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-[#4a5565] text-[14px]">Quota Achievement</p>
              <p className="text-[#0a0a0a] text-[24px] mt-2">87%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CuratorVisitManagementPage;
