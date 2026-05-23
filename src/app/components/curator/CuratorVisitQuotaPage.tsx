import { useState } from 'react';
import { mockVisitQuotas } from '../../data/mockVisitQuotas';
import { VisitQuota } from '../../types/visitQuota';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Search, TrendingUp, TrendingDown, Plus, Pencil, Trash2, X, CheckCircle, BarChart3, Target, Calendar, Activity } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * CuratorVisitQuotaPage
 * Monitor and manage museum visit quotas for virtual and on-site experiences
 */
export function CuratorVisitQuotaPage() {
  const [quotas, setQuotas] = useState<VisitQuota[]>(mockVisitQuotas);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'quota' | 'analytics'>('quota');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedQuota, setSelectedQuota] = useState<VisitQuota | null>(null);
  
  // Form states
  const [formPeriod, setFormPeriod] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [useCustomTarget, setUseCustomTarget] = useState(false);
  const [formActual, setFormActual] = useState('');

  // Generate next sequential Quota ID
  const generateNextQuotaID = () => {
    if (quotas.length === 0) return 'Q001';
    
    // Get all numeric parts of quota IDs
    const numbers = quotas.map(q => parseInt(q.quotaID.replace('Q', '')));
    const maxNumber = Math.max(...numbers);
    const nextNumber = maxNumber + 1;
    
    // Format with leading zeros (Q001, Q002, etc.)
    return `Q${nextNumber.toString().padStart(3, '0')}`;
  };

  // Re-sequence Quota IDs after deletion
  const resequenceQuotaIDs = (quotaList: VisitQuota[]) => {
    return quotaList.map((quota, index) => ({
      ...quota,
      quotaID: `Q${(index + 1).toString().padStart(3, '0')}`
    }));
  };

  // Filter quotas based on search and filters
  const filteredQuotas = quotas.filter(quota => {
    const matchesSearch = searchTerm === '' || 
      quota.quotaID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quota.period.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = periodFilter === 'all' || quota.period === periodFilter;
    const matchesStatus = statusFilter === 'all' || quota.status === statusFilter;
    
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  // Get unique periods for dropdown
  const uniquePeriods = Array.from(new Set(quotas.map(q => q.period)));

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setPeriodFilter('all');
    setStatusFilter('all');
  };

  // Predefined target options
  const targetOptions = [100, 150, 200, 500, 800, 1000, 1500, 2000, 5000, 8000, 10000, 12000];

  // Open create modal
  const openCreateModal = () => {
    setFormPeriod('');
    setFormTarget('');
    setFormActual('0');
    setUseCustomTarget(false);
    setShowCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (quota: VisitQuota) => {
    setSelectedQuota(quota);
    setFormPeriod(quota.period);
    setFormTarget(quota.target.toString());
    setFormActual(quota.actual.toString());
    
    // Check if target is in predefined options
    const isCustom = !targetOptions.includes(quota.target);
    setUseCustomTarget(isCustom);
    
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (quota: VisitQuota) => {
    setSelectedQuota(quota);
    setShowDeleteModal(true);
  };

  // Create new quota
  const handleCreateQuota = () => {
    if (!formPeriod || !formTarget) return;

    const target = parseInt(formTarget);
    const actual = parseInt(formActual);
    const progress = Math.min(Math.round((actual / target) * 100), 100);
    const status: 'Met' | 'Unmet' = progress >= 100 ? 'Met' : 'Unmet';
    
    const newQuota: VisitQuota = {
      quotaID: generateNextQuotaID(),
      period: formPeriod,
      target,
      actual,
      progress,
      status,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    };

    setQuotas([...quotas, newQuota]);
    setShowCreateModal(false);
    setSuccessMessage('Visit quota created successfully!');
    setShowSuccessModal(true);
    
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  // Update existing quota
  const handleUpdateQuota = () => {
    if (!selectedQuota || !formPeriod || !formTarget) return;

    const target = parseInt(formTarget);
    const actual = parseInt(formActual);
    const progress = Math.min(Math.round((actual / target) * 100), 100);
    const status: 'Met' | 'Unmet' = progress >= 100 ? 'Met' : 'Unmet';

    const updatedQuotas = quotas.map(q => 
      q.quotaID === selectedQuota.quotaID 
        ? {
            ...q,
            period: formPeriod,
            target,
            actual,
            progress,
            status,
            lastUpdated: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
          }
        : q
    );

    setQuotas(updatedQuotas);
    setShowEditModal(false);
    setSuccessMessage('Visit quota updated successfully!');
    setShowSuccessModal(true);
    
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  // Delete quota with re-sequencing
  const handleDeleteQuota = () => {
    if (!selectedQuota) return;

    const filteredQuotas = quotas.filter(q => q.quotaID !== selectedQuota.quotaID);
    const resequencedQuotas = resequenceQuotaIDs(filteredQuotas);
    
    setQuotas(resequencedQuotas);
    setShowDeleteModal(false);
    setSuccessMessage('Visit quota deleted successfully!');
    setShowSuccessModal(true);
    
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  // Get progress bar color based on percentage
  const getProgressBarColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Calculate analytics
  const totalQuotas = quotas.length;
  const metQuotas = quotas.filter(q => q.status === 'Met').length;
  const unmetQuotas = quotas.filter(q => q.status === 'Unmet').length;
  const averageProgress = quotas.length > 0 
    ? Math.round(quotas.reduce((sum, q) => sum + q.progress, 0) / quotas.length) 
    : 0;
  const totalTarget = quotas.reduce((sum, q) => sum + q.target, 0);
  const totalActual = quotas.reduce((sum, q) => sum + q.actual, 0);

  // Prepare chart data
  const statusChartData = [
    { name: 'Met', value: metQuotas, color: '#10b981' },
    { name: 'Unmet', value: unmetQuotas, color: '#ef4444' }
  ];

  const periodChartData = uniquePeriods.map(period => {
    const periodQuotas = quotas.filter(q => q.period === period);
    const periodTarget = periodQuotas.reduce((sum, q) => sum + q.target, 0);
    const periodActual = periodQuotas.reduce((sum, q) => sum + q.actual, 0);
    
    return {
      period,
      target: periodTarget,
      actual: periodActual,
      difference: periodTarget - periodActual
    };
  });

  const progressTrendData = quotas.map(q => ({
    quota: q.quotaID,
    progress: q.progress,
    target: 100
  }));

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#0a0a0a]">Visit Quota Management</h1>
            <p className="text-[#717182]">Monitor and manage museum visit quotas for virtual and on-site experiences</p>
          </div>
          <Button 
            onClick={openCreateModal}
            className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <Plus className="size-4" />
            Create Quota
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('quota')}
            className={`px-4 py-2 text-[14px] border-b-2 transition-colors ${
              activeTab === 'quota'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Quota Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-[14px] border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Analytics & Reports
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#4a5565] text-[14px]">Total Quotas</p>
                      <p className="text-[#0a0a0a] text-[24px] mt-3">{totalQuotas}</p>
                    </div>
                    <div className="bg-blue-100 rounded-[10px] size-[48px] flex items-center justify-center">
                      <BarChart3 className="size-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#4a5565] text-[14px]">Met Quotas</p>
                      <p className="text-[#0a0a0a] text-[24px] mt-3">{metQuotas}</p>
                      <p className="text-green-600 text-[12px] mt-1">
                        {totalQuotas > 0 ? Math.round((metQuotas / totalQuotas) * 100) : 0}% success rate
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-[10px] size-[48px] flex items-center justify-center">
                      <CheckCircle className="size-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#4a5565] text-[14px]">Unmet Quotas</p>
                      <p className="text-[#0a0a0a] text-[24px] mt-3">{unmetQuotas}</p>
                      <p className="text-red-600 text-[12px] mt-1">
                        {totalQuotas > 0 ? Math.round((unmetQuotas / totalQuotas) * 100) : 0}% pending
                      </p>
                    </div>
                    <div className="bg-red-100 rounded-[10px] size-[48px] flex items-center justify-center">
                      <TrendingDown className="size-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#4a5565] text-[14px]">Avg Progress</p>
                      <p className="text-[#0a0a0a] text-[24px] mt-3">{averageProgress}%</p>
                    </div>
                    <div className="bg-purple-100 rounded-[10px] size-[48px] flex items-center justify-center">
                      <Activity className="size-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Period-based Analytics */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-[#0a0a0a] mb-4">Period-Based Performance</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={periodChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => value.toLocaleString()}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="target" fill="#3b82f6" name="Target Visits" />
                    <Bar dataKey="actual" fill="#10b981" name="Actual Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Overall Performance Summary */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-[#0a0a0a] mb-4">Overall Performance Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="size-4 text-blue-600" />
                      <p className="text-[#4a5565] text-[14px]">Total Target</p>
                    </div>
                    <p className="text-[#0a0a0a] text-[24px]">{totalTarget.toLocaleString()}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="size-4 text-green-600" />
                      <p className="text-[#4a5565] text-[14px]">Total Actual</p>
                    </div>
                    <p className="text-[#0a0a0a] text-[24px]">{totalActual.toLocaleString()}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="size-4 text-purple-600" />
                      <p className="text-[#4a5565] text-[14px]">Completion Rate</p>
                    </div>
                    <p className="text-[#0a0a0a] text-[24px]">
                      {totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution Chart */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-[#0a0a0a] mb-4">Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Period-wise Target vs Actual Chart */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-[#0a0a0a] mb-4">Period-wise Target vs Actual</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={periodChartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="target" fill="#8884d8" />
                    <Bar dataKey="actual" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Progress Trend Chart */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-[#0a0a0a] mb-4">Progress Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={progressTrendData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quota" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="progress" stroke="#8884d8" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quota Management Tab */}
        {activeTab === 'quota' && (
          <>
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by Quota ID or period..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Period Filter */}
                  <select
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1 md:flex-none md:min-w-[200px]"
                  >
                    <option value="all">All Periods</option>
                    {uniquePeriods.map(period => (
                      <option key={period} value={period}>{period}</option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 flex-1 md:flex-none md:min-w-[180px]"
                  >
                    <option value="all">All Status</option>
                    <option value="Met">Met</option>
                    <option value="Unmet">Unmet</option>
                  </select>

                  {/* Reset Filters Button */}
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="flex items-center gap-2 flex-1 md:flex-none md:min-w-[160px] justify-center"
                  >
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quotas Table */}
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">QUOTA ID</th>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">PERIOD</th>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">TARGET</th>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">ACTUAL</th>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">PROGRESS</th>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">STATUS</th>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">LAST UPDATED</th>
                        <th className="px-4 py-3 text-left text-[#4a5565] text-[14px]">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotas.map((quota) => (
                        <tr key={quota.quotaID} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-[#0a0a0a] text-[14px]">{quota.quotaID}</td>
                          <td className="px-4 py-3 text-[#0a0a0a] text-[14px]">{quota.period}</td>
                          <td className="px-4 py-3 text-[#0a0a0a] text-[14px]">{quota.target.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[#0a0a0a] text-[14px]">{quota.actual.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-2 min-w-[120px]">
                              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${getProgressBarColor(quota.progress)}`}
                                  style={{ width: `${quota.progress}%` }}
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[#0a0a0a] text-[14px]">{quota.progress}%</span>
                                {quota.progress < 100 && (
                                  <span className="text-gray-500 text-[12px]">
                                    ({quota.target - quota.actual} remaining)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge 
                              className={`flex items-center gap-1 w-fit ${
                                quota.status === 'Met' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {quota.status === 'Met' ? (
                                <TrendingUp className="size-3" />
                              ) : (
                                <TrendingDown className="size-3" />
                              )}
                              {quota.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[#0a0a0a] text-[14px]">{quota.lastUpdated}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="p-2"
                                onClick={() => openEditModal(quota)}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="p-2"
                                onClick={() => openDeleteModal(quota)}
                              >
                                <Trash2 className="size-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredQuotas.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No quotas found matching your filters.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-[#0a0a0a] text-[20px] mb-4">Create New Quota</h2>
            
            <div className="space-y-4">
              {/* Period */}
              <div>
                <label className="text-[#4a5565] text-[14px] mb-2 block">
                  Period <span className="text-red-500">*</span>
                </label>
                <select
                  value={formPeriod}
                  onChange={(e) => setFormPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                >
                  <option value="">Select Period</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              {/* Target Visits */}
              <div>
                <label className="text-[#4a5565] text-[14px] mb-2 block">
                  Target Visits <span className="text-red-500">*</span>
                </label>
                
                {!useCustomTarget ? (
                  <div className="space-y-2">
                    <select
                      value={formTarget}
                      onChange={(e) => setFormTarget(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    >
                      <option value="">Select Target</option>
                      {targetOptions.map(option => (
                        <option key={option} value={option}>{option.toLocaleString()}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUseCustomTarget(true)}
                      className="w-full text-[14px]"
                    >
                      Use Custom Value
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={formTarget}
                      onChange={(e) => setFormTarget(e.target.value)}
                      placeholder="Enter custom target"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUseCustomTarget(false)}
                      className="w-full text-[14px]"
                    >
                      Use Predefined Options
                    </Button>
                  </div>
                )}
              </div>

              {/* Actual Visits */}
              <div>
                <label className="text-[#4a5565] text-[14px] mb-2 block">
                  Actual Visits <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formActual}
                  onChange={(e) => setFormActual(e.target.value)}
                  placeholder="Enter actual visits"
                  min="0"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateQuota}
                disabled={!formPeriod || !formTarget}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Create Quota
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedQuota && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-[#0a0a0a] text-[20px] mb-4">Edit Quota - {selectedQuota.quotaID}</h2>
            
            <div className="space-y-4">
              {/* Period */}
              <div>
                <label className="text-[#4a5565] text-[14px] mb-2 block">
                  Period <span className="text-red-500">*</span>
                </label>
                <select
                  value={formPeriod}
                  onChange={(e) => setFormPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                >
                  <option value="">Select Period</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              {/* Target Visits */}
              <div>
                <label className="text-[#4a5565] text-[14px] mb-2 block">
                  Target Visits <span className="text-red-500">*</span>
                </label>
                
                {!useCustomTarget ? (
                  <div className="space-y-2">
                    <select
                      value={formTarget}
                      onChange={(e) => setFormTarget(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                    >
                      <option value="">Select Target</option>
                      {targetOptions.map(option => (
                        <option key={option} value={option}>{option.toLocaleString()}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUseCustomTarget(true)}
                      className="w-full text-[14px]"
                    >
                      Use Custom Value
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={formTarget}
                      onChange={(e) => setFormTarget(e.target.value)}
                      placeholder="Enter custom target"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUseCustomTarget(false)}
                      className="w-full text-[14px]"
                    >
                      Use Predefined Options
                    </Button>
                  </div>
                )}
              </div>

              {/* Actual Visits */}
              <div>
                <label className="text-[#4a5565] text-[14px] mb-2 block">
                  Actual Visits <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  value={formActual}
                  onChange={(e) => setFormActual(e.target.value)}
                  placeholder="Enter actual visits"
                  min="0"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateQuota}
                disabled={!formPeriod || !formTarget}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedQuota && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full size-12 flex items-center justify-center">
                <Trash2 className="size-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-[#0a0a0a] text-[20px]">Confirm Deletion</h2>
                <p className="text-[#717182] text-[14px]">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-[#4a5565] text-[14px] mb-2">You are about to delete:</p>
              <p className="text-[#0a0a0a]">Quota ID: <span className="font-mono">{selectedQuota.quotaID}</span></p>
              <p className="text-[#0a0a0a]">Period: {selectedQuota.period}</p>
              <p className="text-[#0a0a0a]">Target: {selectedQuota.target.toLocaleString()}</p>
              <p className="text-[#717182] text-[12px] mt-2">
                Note: All quota IDs will be re-sequenced after deletion.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteQuota}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Delete Quota
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6 text-center shadow-xl">
            <div className="bg-green-100 rounded-full size-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h3 className="text-[#0a0a0a] text-[18px] mb-2">Success!</h3>
            <p className="text-[#717182] text-[14px]">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CuratorVisitQuotaPage;
