import { ReactNode } from 'react';

interface CuratorStatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
}

/**
 * CuratorStatsCard - Displays key metrics for condition reports
 * Used in the Condition Report dashboard to show Total Reports, Urgent, and Pending counts
 */
export function CuratorStatsCard({ title, value, icon, iconBgColor }: CuratorStatsCardProps) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="stat-card-label text-[#6b7280] mb-2">{title}</p>
        <p className="stat-card-value text-[#111827]">{value.toLocaleString()}</p>
      </div>
      <div 
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}
      >
        {icon}
      </div>
    </div>
  );
}