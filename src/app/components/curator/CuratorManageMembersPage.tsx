import { useState } from 'react';
import { Search, Filter, MoreVertical, UserPlus, Download, Users, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  type: 'Weekly' | 'Monthly' | 'Yearly';
  status: 'Active' | 'Expiring Soon' | 'Expired';
  joinedDate: string;
  expiryDate: string;
  visits: number;
  avatar?: string;
  phone?: string;
  address?: string;
}

/**
 * CuratorManageMembersPage - Manage museum members and memberships
 */
export function CuratorManageMembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Member | null>(null);

  // Mock member data
  const mockMembers: Member[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      type: 'Monthly',
      status: 'Active',
      joinedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      visits: 24,
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mchen@company.com',
      type: 'Yearly',
      status: 'Active',
      joinedDate: '2023-08-20',
      expiryDate: '2025-08-20',
      visits: 42,
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      type: 'Weekly',
      status: 'Expiring Soon',
      joinedDate: '2024-02-10',
      expiryDate: '2024-12-25',
      visits: 8,
    },
    {
      id: '4',
      name: 'Robert Williams',
      email: 'rwilliams@email.com',
      type: 'Monthly',
      status: 'Active',
      joinedDate: '2024-03-05',
      expiryDate: '2025-03-05',
      visits: 15,
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'l.anderson@email.com',
      type: 'Weekly',
      status: 'Expired',
      joinedDate: '2023-06-12',
      expiryDate: '2024-11-30',
      visits: 12,
    },
    {
      id: '6',
      name: 'James Martinez',
      email: 'jmartinez@university.edu',
      type: 'Yearly',
      status: 'Active',
      joinedDate: '2023-09-18',
      expiryDate: '2025-09-18',
      visits: 56,
    },
    {
      id: '7',
      name: 'Patricia Brown',
      email: 'pbrown@email.com',
      type: 'Monthly',
      status: 'Expiring Soon',
      joinedDate: '2024-01-08',
      expiryDate: '2024-12-20',
      visits: 19,
    },
    {
      id: '8',
      name: 'David Lee',
      email: 'dlee@email.com',
      type: 'Weekly',
      status: 'Active',
      joinedDate: '2024-05-22',
      expiryDate: '2025-05-22',
      visits: 5,
    },
  ];

  // Calculate statistics
  const totalMembers = mockMembers.length;
  const activeMembers = mockMembers.filter(m => m.status === 'Active').length;
  const expiringSoon = mockMembers.filter(m => m.status === 'Expiring Soon').length;
  const expired = mockMembers.filter(m => m.status === 'Expired').length;

  // Filter members
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || member.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
    }
  };

  const getTypeColor = (type: Member['type']) => {
    switch (type) {
      case 'Weekly':
        return 'bg-gray-100 text-gray-800';
      case 'Monthly':
        return 'bg-purple-100 text-purple-800';
      case 'Yearly':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };

  const handleEditMember = (member: Member) => {
    setEditFormData(member);
    setIsEditModalOpen(true);
    setActiveMenu(null);
  };

  const handleSaveEdit = () => {
    // In a real app, this would save to backend
    setIsEditModalOpen(false);
    setEditFormData(null);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Manage Members</h1>
              <p className="text-gray-600">View and manage museum memberships</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Members</p>
                <p className="text-gray-900">{totalMembers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Active Members</p>
                <p className="text-gray-900">{activeMembers}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Expiring Soon</p>
                <p className="text-gray-900">{expiringSoon}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Expired</p>
                <p className="text-gray-900">{expired}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                <option value="all">All Types</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Member</th>
                  <th className="px-6 py-3 text-left text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700">Joined</th>
                  <th className="px-6 py-3 text-left text-gray-700">Expires</th>
                  <th className="px-6 py-3 text-left text-gray-700">Visits</th>
                  <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-gray-900">{member.name}</div>
                          <div className="text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getTypeColor(member.type)}`}>
                        {member.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(member.joinedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(member.expiryDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{member.visits}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === member.id ? null : member.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {activeMenu === member.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => handleViewDetails(member)}>
                              View Details
                            </button>
                            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => handleEditMember(member)}>
                              Edit Member
                            </button>
                            <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors">
                              Send Email
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No members found</p>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {isViewModalOpen && selectedMember && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-gray-900">Member Details</h2>
                  <p className="text-sm text-gray-600 mt-1">View member information</p>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">{selectedMember.name}</h3>
                    <p className="text-sm text-gray-600">{selectedMember.email}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Member ID</label>
                    <p className="text-gray-900">{selectedMember.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Membership Type</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getTypeColor(selectedMember.type)}`}>
                      {selectedMember.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(selectedMember.status)}`}>
                      {selectedMember.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Total Visits</label>
                    <p className="text-gray-900">{selectedMember.visits}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Joined Date</label>
                    <p className="text-gray-900">
                      {new Date(selectedMember.joinedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                    <p className="text-gray-900">
                      {new Date(selectedMember.expiryDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditModalOpen && editFormData && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-gray-900">Edit Member</h2>
                  <p className="text-sm text-gray-600 mt-1">Update member information</p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Membership Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value as Member['type'] })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] appearance-none bg-white cursor-pointer"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as Member['status'] })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] appearance-none bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={editFormData.expiryDate}
                    onChange={(e) => setEditFormData({ ...editFormData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2.5 bg-[#2c3e50] text-white rounded-lg hover:bg-[#1a252f] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CuratorManageMembersPage;
