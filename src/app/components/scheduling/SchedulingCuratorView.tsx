import React, { useState } from 'react';
import { MuseumContextBanner } from './MuseumSelector';
import { useScheduling, PH_HOLIDAYS, DEFAULT_TIME_SLOTS } from './SchedulingContext';
import type { SlotStatus } from './SchedulingContext';
import { NotificationCenter } from './NotificationCenter';

type CuratorTab = 'dashboard' | 'staff-assignment' | 'approval' | 'slot-availability' | 'historical-reports' | 'notifications';

interface StaffMember {
  id: string; name: string; role: string;
  permissions: { bookingManagement: boolean; logbook: boolean; reports: boolean; approvals: boolean; };
}

// userId format: USR-[PREFIX][8-digit-seq] = 15 chars exactly
const MUSEUM_STAFF_MAP: Record<string, StaffMember[]> = {
  'Peñafrancia Museum': [
    { id: 'USR-PFM00000001', name: 'Ma. Cecilia Obias',  role: 'Senior Guide',        permissions: { bookingManagement: true,  logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-PFM00000002', name: 'Rolando Fajardo',    role: 'Museum Attendant',    permissions: { bookingManagement: true,  logbook: true,  reports: false, approvals: false } },
    { id: 'USR-PFM00000003', name: 'Theresa Alcantara',  role: 'Collections Officer', permissions: { bookingManagement: false, logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-PFM00000004', name: 'Benjamin Soriano',   role: 'Security Officer',    permissions: { bookingManagement: false, logbook: true,  reports: false, approvals: false } },
  ],
  'Museo del Seminario Conciliar': [
    { id: 'USR-MSC00000001', name: 'Elena Suarez',           role: 'Senior Guide',        permissions: { bookingManagement: true,  logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-MSC00000002', name: 'Rosario Bernal',         role: 'Museum Attendant',    permissions: { bookingManagement: true,  logbook: true,  reports: false, approvals: false } },
    { id: 'USR-MSC00000003', name: 'Fr. Andres Villanueva',  role: 'Collections Officer', permissions: { bookingManagement: false, logbook: true,  reports: true,  approvals: true  } },
    { id: 'USR-MSC00000004', name: 'Roberto Manaog',         role: 'Security Officer',    permissions: { bookingManagement: false, logbook: true,  reports: false, approvals: false } },
  ],
  'UNC Museum': [
    { id: 'USR-UNC00000001', name: 'Luz Reyes',     role: 'Senior Guide',        permissions: { bookingManagement: true,  logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-UNC00000002', name: 'Jose Bautista', role: 'Museum Attendant',    permissions: { bookingManagement: true,  logbook: true,  reports: false, approvals: false } },
    { id: 'USR-UNC00000003', name: 'Ana Garcia',    role: 'Collections Officer', permissions: { bookingManagement: false, logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-UNC00000004', name: 'Carlo Mendoza', role: 'Security Officer',    permissions: { bookingManagement: false, logbook: true,  reports: false, approvals: false } },
  ],
  'Jesse M. Robredo Museum': [
    { id: 'USR-JRM00000001', name: 'Maria Concepcion',  role: 'Senior Guide',     permissions: { bookingManagement: true,  logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-JRM00000002', name: 'Dante Pereira',     role: 'Museum Attendant', permissions: { bookingManagement: true,  logbook: true,  reports: false, approvals: false } },
    { id: 'USR-JRM00000003', name: 'Ricardo Santos',    role: 'Floor Manager',    permissions: { bookingManagement: true,  logbook: true,  reports: true,  approvals: true  } },
    { id: 'USR-JRM00000004', name: 'Nestor Villanueva', role: 'Security Officer', permissions: { bookingManagement: false, logbook: true,  reports: false, approvals: false } },
  ],
  'Museo Hayskulano': [
    { id: 'USR-MHY00000001', name: 'Marites Corpuz',  role: 'Senior Guide',        permissions: { bookingManagement: true,  logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-MHY00000002', name: 'Danny Abundo',    role: 'Museum Attendant',    permissions: { bookingManagement: true,  logbook: true,  reports: false, approvals: false } },
    { id: 'USR-MHY00000003', name: 'Priscilla Ramos', role: 'Collections Officer', permissions: { bookingManagement: false, logbook: true,  reports: true,  approvals: false } },
    { id: 'USR-MHY00000004', name: 'Allan Barcenas',  role: 'Security Officer',    permissions: { bookingManagement: false, logbook: true,  reports: false, approvals: false } },
  ],
};

// museumId enum derived silently from museumName (already selected in Step 1)
const MUSEUM_ID_MAP: Record<string, 'Museum_1' | 'Museum_2' | 'Museum_3' | 'Museum_4' | 'Museum_5'> = {
  'Peñafrancia Museum':           'Museum_1',
  'Museo del Seminario Conciliar':'Museum_2',
  'UNC Museum':                   'Museum_3',
  'Jesse M. Robredo Museum':      'Museum_4',
  'Museo Hayskulano':             'Museum_5',
};

// performedBy: curator user ID per museum (CUR-[PREFIX][8-digit] = 15 chars)
const MUSEUM_CURATOR_ID: Record<string, string> = {
  'Peñafrancia Museum':           'CUR-PFM00000001',
  'Museo del Seminario Conciliar':'CUR-MSC00000001',
  'UNC Museum':                   'CUR-UNC00000001',
  'Jesse M. Robredo Museum':      'CUR-JRM00000001',
  'Museo Hayskulano':             'CUR-MHY00000001',
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SuccessBanner({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-[200] bg-white border border-[rgba(15,118,110,0.3)] rounded-xl shadow-xl px-5 py-4 flex items-start gap-3 max-w-sm">
      <div className="w-8 h-8 bg-[rgba(15,118,110,0.1)] rounded-full flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <div className="flex-1">
        <p className=" font-semibold text-[#1e293b] text-[13px]">Success</p>
        <p className=" text-[#64748b] text-[12px] mt-0.5 leading-[20px]">{msg}</p>
      </div>
      <button onClick={onClose} className="text-[#94a3b8] hover:text-[#1e293b]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}
function CModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h3 className=" font-bold text-[#1e293b] text-[18px]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
const cinput = (err?: string) => `w-full border rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none transition-colors ${err ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus:border-[#334155]'}`;
function CField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">
        {label}{required && <span className="text-[#AC0000] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[#AC0000] text-[12px]">{error}</p>}
    </div>
  );
}

// ─── Curator Dashboard ────────────────────────────────────────────────────────

function CuratorDashboardTab({ onNavigate, museumName }: { onNavigate: (tab: CuratorTab) => void; museumName: string }) {
  const { bookings, staffAssignments, logEntries, getSlotStatus, getBookedCount } = useScheduling();
  const todayStr = new Date().toISOString().slice(0, 10);

  // Today's active bookings for this museum
  const todayCount = bookings.filter(
    b => b.museum === museumName && b.date === todayStr && b.status !== 'cancelled'
  ).length;

  // Pending approvals (any date)
  const livePending = bookings.filter(
    b => b.museum === museumName && b.status === 'pending'
  ).length;

  // Staff assigned specifically for today (excluding cancelled)
  const liveStaff = staffAssignments.filter(
    a => a.museumId === (MUSEUM_ID_MAP[museumName] ?? 'Museum_3') &&
         a.visitDate === todayStr &&
         a.assignmentStatus !== 'Cancelled'
  ).length;

  // On-site visitors: checked in today, not yet departed
  const onSiteCount = logEntries
    .filter(e =>
      e.museum === museumName &&
      e.visitDate === todayStr &&
      (e.attendanceStatus === 'Present' || e.attendanceStatus === 'Late') &&
      !e.departureTime
    )
    .reduce((sum, e) => sum + (e.numberOfVisitors ?? e.groupSize ?? 1), 0);

  // Conflicts: open slots today where booked visitors exceed capacity
  const conflictSlots = DEFAULT_TIME_SLOTS.filter(ts => {
    const { capacity, status } = getSlotStatus(museumName, todayStr, ts);
    const booked = getBookedCount(museumName, todayStr, ts);
    return status === 'open' && booked > capacity;
  });

  // Average capacity used across all open slots today
  const openSlotsToday = DEFAULT_TIME_SLOTS.map(ts => {
    const { capacity, status } = getSlotStatus(museumName, todayStr, ts);
    const booked = getBookedCount(museumName, todayStr, ts);
    return { capacity, booked, status };
  }).filter(s => s.status === 'open');
  const totalCapacity  = openSlotsToday.reduce((sum, s) => sum + s.capacity, 0);
  const totalBooked    = openSlotsToday.reduce((sum, s) => sum + s.booked, 0);
  const avgCapacityPct = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
  const capacityStr    = totalCapacity > 0 ? `${avgCapacityPct}%` : '—';

  const stateColors: Record<string, string> = { normal: '#0f766e', warning: '#b45309', critical: '#AC0000' };

  const stats: { value: string; label: string; state: 'normal' | 'warning' | 'critical' }[] = [
    { value: String(todayCount),          label: "Today's Bookings",   state: 'normal' },
    { value: String(onSiteCount),         label: 'On-Site Visitors',   state: onSiteCount > 0 ? 'warning' : 'normal' },
    { value: String(livePending),         label: 'Pending Approvals',  state: livePending > 0 ? 'critical' : 'normal' },
    { value: String(liveStaff),           label: 'Staff Assigned',     state: 'normal' },
    { value: String(conflictSlots.length),label: 'Conflicts Detected', state: conflictSlots.length > 0 ? 'critical' : 'normal' },
    { value: capacityStr,                 label: 'Avg. Capacity Used', state: avgCapacityPct >= 90 ? 'critical' : avgCapacityPct >= 75 ? 'warning' : 'normal' },
  ];

  // Operational alerts derived entirely from live context data
  const operationalAlerts: { type: 'critical' | 'warning'; msg: string }[] = [];

  conflictSlots.forEach(ts => {
    const { capacity } = getSlotStatus(museumName, todayStr, ts);
    const booked = getBookedCount(museumName, todayStr, ts);
    operationalAlerts.push({
      type: 'critical',
      msg: `Overbooking on ${ts} slot at ${museumName}: ${booked} visitor(s) booked against a capacity of ${capacity}.`,
    });
  });

  logEntries
    .filter(e => e.museum === museumName && e.visitDate === todayStr && !e.isComplete)
    .slice(0, 3)
    .forEach(e => {
      operationalAlerts.push({
        type: 'critical',
        msg: `Logbook entry for ${e.bookingRef} is incomplete. Recorded by ${e.recordedBy}.`,
      });
    });

  if (avgCapacityPct >= 75 && totalCapacity > 0) {
    operationalAlerts.push({
      type: 'warning',
      msg: `${museumName} is at ${capacityStr} capacity for today. Consider activating overflow procedures.`,
    });
  }

  return (
    <div className="p-8">
      <h2 className=" font-bold text-[#1e293b] text-[28px] leading-[36px] mb-2">Curator Dashboard</h2>
      <p className=" text-[#64748b] text-[16px] leading-[29px] mb-8">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — <strong>{museumName}</strong>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[#334155] rounded-xl p-5 flex flex-col items-center" style={s.state !== 'normal' ? { borderLeft: `4px solid ${stateColors[s.state]}` } : {}}>
            <span className=" font-bold text-[28px] leading-[36px] text-white">{s.value}</span>
            <span className=" font-semibold text-[12px] leading-[20px] text-[#d1d5dc] mt-1 text-center">{s.label}</span>
            {s.state === 'critical' && <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#AC0000]/30 text-[#fca5a5] text-[10px]">Critical</span>}
            {s.state === 'warning'  && <span className="mt-1.5 px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#fcd34d] text-[10px]">Warning</span>}
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h3 className=" font-semibold text-[#1e293b] text-[16px] leading-[28px]">Operational Alerts — {museumName}</h3>
        </div>
        <div className="p-6 space-y-3">
          {operationalAlerts.length === 0 ? (
            <p className=" text-[#64748b] text-[14px] leading-[24px]">No active alerts for today. All systems normal.</p>
          ) : (
            operationalAlerts.map(({ type, msg }, i) => (
              <div key={i} className={`flex gap-3 p-4 rounded-lg border ${type === 'critical' ? 'bg-[rgba(172,0,0,0.05)] border-[rgba(172,0,0,0.2)]' : 'bg-[rgba(245,158,11,0.05)] border-[rgba(245,158,11,0.2)]'}`}>
                <svg className={`w-5 h-5 shrink-0 mt-0.5 ${type === 'critical' ? 'text-[#AC0000]' : 'text-[#b45309]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className=" text-[#1e293b] text-[13px] leading-[22.75px]">{msg}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Review Pending Approvals', tab: 'approval'            as CuratorTab, badge: livePending > 0 ? String(livePending) : null },
          { label: 'Staff Assignment Grid',    tab: 'staff-assignment'    as CuratorTab, badge: null },
          { label: 'Slot Availability Mgmt',   tab: 'slot-availability'   as CuratorTab, badge: null },
          { label: 'Historical Reports',       tab: 'historical-reports'  as CuratorTab, badge: null },
        ].map(({ label, tab, badge }) => (
          <button key={tab} onClick={() => onNavigate(tab)} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-left hover:shadow-md hover:border-[#334155] transition-all group flex items-center justify-between">
            <span className=" font-semibold text-[#1e293b] text-[14px]">{label}</span>
            <div className="flex items-center gap-2">
              {badge && <span className="w-5 h-5 bg-[#AC0000] rounded-full text-white text-[10px] flex items-center justify-center">{badge}</span>}
              <svg className="w-4 h-4 text-[#64748b] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Staff Assignment ─────────────────────────────────────────────────────────

const STAFF_ROLES = ['Senior Guide', 'Museum Attendant', 'Collections Officer', 'Security Officer', 'Floor Manager'];

function StaffAssignment({ museumName }: { museumName: string }) {
  const scheduling  = useScheduling();
  const today       = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);
  const [assignSlot, setAssignSlot]     = useState<string | null>(null);
  const [pickedUserId, setPickedUserId] = useState('');
  const [pickedRole, setPickedRole]     = useState(STAFF_ROLES[0]);
  const [removeId, setRemoveId]         = useState<string | null>(null);
  const [conflictMsg, setConflictMsg]   = useState('');
  const [success, setSuccess]           = useState('');
  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  // These are stored silently — never shown in the UI
  const museumId  = MUSEUM_ID_MAP[museumName]     ?? 'Museum_3';
  const curatorId = MUSEUM_CURATOR_ID[museumName] ?? 'CUR-UNC00000001';

  const museumStaff = MUSEUM_STAFF_MAP[museumName] ?? MUSEUM_STAFF_MAP['UNC Museum'];

  const dateAssignments = scheduling.staffAssignments.filter(
    a => a.museumId === museumId && a.visitDate === selectedDate && a.assignmentStatus !== 'Cancelled'
  );
  const slotAssignments = (slot: string) => dateAssignments.filter(a => a.timeSlot === slot);
  const staffByUserId   = (userId: string) => museumStaff.find(s => s.id === userId);

  const handleAssign = () => {
    if (!pickedUserId || !pickedRole || !assignSlot) return;
    const staff = staffByUserId(pickedUserId);
    if (!staff) return;
    if (slotAssignments(assignSlot).some(a => a.userId === pickedUserId)) {
      setConflictMsg(`${staff.name} is already assigned to this slot.`);
      return;
    }
    const scheduleId   = `SCH-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    const assignmentId = scheduling.addStaffAssignment({
      museumId,
      assignmentStatus: 'Assigned',
      scheduleId,
      userId:      pickedUserId,
      performedBy: curatorId,
      staffRole:   pickedRole,
      visitDate:   selectedDate,
      timeSlot:    assignSlot,
    });
    scheduling.addNotification({
      notificationType:   'Staff Assignment',
      assignmentId:        assignmentId,
      museum:             museumName,
      recipient:          `${staff.name.toLowerCase().replace(/\s+/g, '.')}@arko.ph`,
      channel:            'System Alert',
      notificationStatus: 'Sent',
      message: `${staff.name} (${pickedRole}) assigned to ${assignSlot} on ${selectedDate} at ${museumName}.`,
    });
    setAssignSlot(null);
    setPickedUserId('');
    setPickedRole(STAFF_ROLES[0]);
    setConflictMsg('');
    showSuccess(`${staff.name} assigned to ${assignSlot} on ${selectedDate}.`);
  };

  const handleRemove = () => {
    if (!removeId) return;
    const a    = scheduling.staffAssignments.find(x => x.assignmentId === removeId);
    const name = a ? (staffByUserId(a.userId)?.name ?? 'Staff member') : 'Staff member';
    scheduling.removeStaffAssignment(removeId);
    setRemoveId(null);
    showSuccess(a ? `${name} unassigned from ${a.timeSlot}.` : 'Assignment cancelled.');
  };

  return (
    <div className="p-8">
      {success && <SuccessBanner msg={success} onClose={() => setSuccess('')} />}
      <h2 className="font-bold text-[#1e293b] text-[22px] leading-[28px] mb-2">Staff Assignment</h2>
      <p className="text-[#64748b] text-[14px] mb-6">
        Assign staff to time slots at <strong>{museumName}</strong>. Select a date and click "Assign" on any slot.
      </p>

      {/* Date selector */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-6 shadow-sm flex items-center gap-4 flex-wrap">
        <div>
          <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Select Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none" />
        </div>
        <div className="text-[#64748b] text-[13px]">
          <span className="font-semibold text-[#1e293b]">{dateAssignments.length}</span> active assignment{dateAssignments.length !== 1 ? 's' : ''} on this date
        </div>
      </div>

      {/* Assignment grid */}
      <div className="space-y-4">
        {DEFAULT_TIME_SLOTS.map(slot => {
          const assignments = slotAssignments(slot);
          return (
            <div key={slot} className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
              <div className="bg-[#f8fafc] px-5 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
                <span className="font-semibold text-[#1e293b] text-[14px]">{slot}</span>
                <span className="text-[#64748b] text-[12px]">{assignments.length} staff assigned</span>
              </div>
              <div className="p-5">
                {assignments.length === 0 ? (
                  <p className="text-[#94a3b8] text-[13px] mb-3">No staff assigned to this slot.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {assignments.map(a => {
                      const staff = staffByUserId(a.userId);
                      return (
                        <div key={a.assignmentId} className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(51,65,85,0.07)] border border-[rgba(51,65,85,0.14)] rounded-full">
                          <span className="font-semibold text-[#334155] text-[12px]">{staff?.name ?? '—'}</span>
                          <span className="text-[#64748b] text-[11px]">· {a.staffRole}</span>
                          <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${a.assignmentStatus === 'Assigned' ? 'bg-[rgba(15,118,110,0.12)] text-[#0f766e]' : 'bg-[rgba(180,83,9,0.12)] text-[#b45309]'}`}>
                            {a.assignmentStatus}
                          </span>
                          <button onClick={() => setRemoveId(a.assignmentId)} title="Remove assignment"
                            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[rgba(172,0,0,0.1)] text-[#94a3b8] hover:text-[#AC0000] transition-colors ml-0.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button onClick={() => { setAssignSlot(slot); setPickedUserId(''); setPickedRole(STAFF_ROLES[0]); setConflictMsg(''); }}
                  className="border-2 border-dashed border-[#334155] rounded-lg px-3 py-1.5 flex items-center gap-1.5 hover:bg-[rgba(51,65,85,0.05)] transition-colors text-[#334155] font-semibold text-[12px]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Assign Staff
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign modal */}
      {assignSlot && (
        <CModal title={`Assign Staff — ${assignSlot}`} onClose={() => { setAssignSlot(null); setConflictMsg(''); }}>
          <p className="text-[#64748b] text-[13px] mb-4">
            Assign a staff member to <strong>{assignSlot}</strong> on <strong>{selectedDate}</strong> at {museumName}.
          </p>
          {conflictMsg && (
            <div className="mb-4 bg-[rgba(172,0,0,0.05)] border border-[rgba(172,0,0,0.2)] rounded-lg px-4 py-3">
              <p className="text-[#AC0000] text-[13px]">{conflictMsg}</p>
            </div>
          )}
          <div className="space-y-3">
            <CField label="Staff Member" required>
              <select value={pickedUserId} onChange={e => { setPickedUserId(e.target.value); setConflictMsg(''); }} className={cinput()}>
                <option value="">— Select staff member —</option>
                {museumStaff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}{slotAssignments(assignSlot).some(a => a.userId === s.id) ? ' (already assigned)' : ''}
                  </option>
                ))}
              </select>
            </CField>
            <CField label="Assigned Role / Category" required>
              <select value={pickedRole} onChange={e => setPickedRole(e.target.value)} className={cinput()}>
                {STAFF_ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </CField>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleAssign} disabled={!pickedUserId || !pickedRole}
              className="flex-1 bg-[#334155] hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">
              Confirm Assignment
            </button>
            <button onClick={() => { setAssignSlot(null); setConflictMsg(''); }}
              className="px-5 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
              Cancel
            </button>
          </div>
        </CModal>
      )}

      {/* Remove confirmation */}
      {removeId && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={() => setRemoveId(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 bg-[rgba(172,0,0,0.1)] rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-[#AC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="font-bold text-[#1e293b] text-[17px] text-center mb-2">Remove Assignment?</h3>
            <p className="text-[#64748b] text-[13px] text-center mb-5">
              {(() => {
                const a    = scheduling.staffAssignments.find(x => x.assignmentId === removeId);
                const name = a ? (staffByUserId(a.userId)?.name ?? 'This staff member') : 'This staff member';
                return a ? `Remove ${name} from the ${a.timeSlot} slot?` : 'Remove this assignment?';
              })()}
            </p>
            <div className="flex gap-3">
              <button onClick={handleRemove}
                className="flex-1 bg-[#AC0000] hover:bg-[#8b0000] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">
                Remove
              </button>
              <button onClick={() => setRemoveId(null)}
                className="flex-1 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Schedule Approval ────────────────────────────────────────────────────────

function ScheduleApproval({ museumName }: { museumName: string }) {
  const scheduling = useScheduling();
  const [rejectingRef, setRejectingRef] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approvingRef, setApprovingRef] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  // Live pending bookings from context — auto-updates when public bookings are submitted
  const pendingBookings = scheduling.bookings
    .filter(b => b.museum === museumName && b.status === 'pending')
    .slice()
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  const approve = (ref: string, name: string) => {
    const bk = scheduling.bookings.find(b => b.ref === ref);
    scheduling.updateBooking(ref, { status: 'confirmed' });
    scheduling.addNotification({
      notificationType: 'Booking Confirmation',
      bookingId: ref,
      museum: museumName,
      recipient: bk?.email || 'visitor@arko.ph',
      channel: 'Email',
      notificationStatus: 'Sent',
      message: `Booking ${ref} for ${name} has been approved by the curator. Visit is confirmed.`,
    });
    showSuccess(`Booking ${ref} (${name}) approved. Visitor has been notified via email.`);
  };

  const reject = (ref: string) => {
    if (!rejectReason.trim()) return;
    const bk = scheduling.bookings.find(b => b.ref === ref);
    scheduling.updateBooking(ref, { status: 'cancelled' });
    scheduling.addNotification({
      notificationType: 'Booking Update',
      bookingId: ref,
      museum: museumName,
      recipient: bk?.email || 'visitor@arko.ph',
      channel: 'Email',
      notificationStatus: 'Sent',
      message: `Booking ${ref} has been rejected by the curator. Reason: ${rejectReason}`,
    });
    showSuccess(`Booking ${ref} rejected. Rejection reason sent to visitor's email.`);
    setRejectingRef(null); setRejectReason('');
  };

  return (
    <div className="p-8">
      {success && <SuccessBanner msg={success} onClose={() => setSuccess('')} />}
      <h2 className=" font-bold text-[#1e293b] text-[22px] leading-[28px] mb-2">Schedule Approval</h2>
      <p className=" text-[#64748b] text-[14px] mb-6">
        Review pending visitor booking requests for <strong>{museumName}</strong>.
        {pendingBookings.length > 0 && <span className="ml-1 text-[#b45309] font-semibold">{pendingBookings.length} awaiting review.</span>}
      </p>
      {pendingBookings.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-10 text-center shadow-sm">
          <div className="w-12 h-12 bg-[rgba(15,118,110,0.1)] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className=" font-semibold text-[#1e293b] text-[16px]">All caught up!</p>
          <p className=" text-[#64748b] text-[14px] mt-1">No pending approvals for {museumName} at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map(b => {
            const conflicts = scheduling.detectConflicts(b.museum, b.date, b.timeSlot, b.groupSize);
            const hasConflict = conflicts.length > 0;
            const submittedLabel = b.submittedAt.slice(0, 16).replace('T', ' ');
            return (
              <div key={b.ref} className={`bg-white border rounded-xl p-5 shadow-sm ${hasConflict ? 'border-[#AC0000]' : 'border-[#e2e8f0]'}`}>
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <span className=" font-semibold text-[#334155] text-[13px] block mb-1">{b.ref}</span>
                    <span className=" font-bold text-[#1e293b] text-[16px]">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {hasConflict && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(172,0,0,0.1)] text-[#AC0000] border border-[rgba(172,0,0,0.2)] flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Conflict
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(245,158,11,0.1)] text-[#b45309] border border-[rgba(245,158,11,0.2)]">Pending Review</span>
                  </div>
                </div>
                {hasConflict && (
                  <div className="mb-4 bg-[rgba(172,0,0,0.04)] border border-[rgba(172,0,0,0.2)] rounded-lg px-4 py-3 space-y-1">
                    {conflicts.map((c, ci) => (
                      <div key={ci} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#AC0000] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <p className=" text-[#1e293b] text-[12px] leading-[20px]">{c}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-[13px]">
                  {([
                    ['Gallery', b.museum],
                    ['Group Type', b.groupType],
                    ['Group Size', String(b.groupSize)],
                    ['Submitted', submittedLabel],
                    ['Visit Date', b.date],
                    ['Time Slot', b.timeSlot],
                    ['Contact', b.contact || '—'],
                    ['Email', b.email || '—'],
                  ] as [string, string][]).map(([l, v]) => (
                    <div key={l}>
                      <p className=" font-semibold text-[#64748b] text-[11px] mb-0.5">{l}</p>
                      <p className=" text-[#1e293b] text-[13px] break-all">{v}</p>
                    </div>
                  ))}
                </div>
                {b.specialRequirements && (
                  <div className="mb-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2">
                    <p className=" font-semibold text-[#64748b] text-[11px] mb-0.5">Special Requirements</p>
                    <p className=" text-[#1e293b] text-[13px]">{b.specialRequirements}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => { setApprovingRef(b.ref); setRejectingRef(null); setRejectReason(''); }}
                    className="bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 px-5 rounded-[6px] transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
                    Approve
                  </button>
                  <button onClick={() => { setRejectingRef(b.ref); setApprovingRef(null); }}
                    className="h-10 px-5 border border-[rgba(172,0,0,0.3)] rounded-[6px] font-semibold text-[#AC0000] text-[13px] bg-white hover:bg-[rgba(172,0,0,0.05)] transition-colors">
                    Reject
                  </button>
                </div>
                {approvingRef === b.ref && (
                  <div className="mt-4 border-t border-[#e2e8f0] pt-4">
                    <p className="font-semibold text-[#1e293b] text-[13px] mb-1">Confirm Approval</p>
                    <p className="text-[#64748b] text-[12px] mb-3">
                      Approving <strong>{b.name}</strong> ({b.ref}) will confirm their visit and notify them via email.
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => { approve(b.ref, b.name); setApprovingRef(null); }}
                        className="bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-9 px-4 rounded-[6px] transition-colors">
                        Confirm Approval
                      </button>
                      <button onClick={() => setApprovingRef(null)}
                        className="h-9 px-4 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {rejectingRef === b.ref && (
                  <div className="mt-4 border-t border-[#e2e8f0] pt-4">
                    <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">
                      Rejection Reason <span className="text-[#AC0000]">*</span>
                    </label>
                    <textarea rows={2} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder="Provide a reason — this will be emailed to the visitor..."
                      className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none resize-none mb-2" />
                    <div className="flex gap-2">
                      <button onClick={() => reject(b.ref)} disabled={!rejectReason.trim()}
                        className="bg-[#AC0000] hover:bg-[#8b0000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[13px] h-9 px-4 rounded-[6px] transition-colors">
                        Confirm Rejection
                      </button>
                      <button onClick={() => { setRejectingRef(null); setRejectReason(''); }}
                        className="h-9 px-4 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Slot Availability Management (context-connected) ────────────────────────

type SlotStatusLocal = 'open' | 'closed' | 'holiday' | 'blocked';
const statusStyles: Record<SlotStatusLocal, { bg: string; text: string; border: string; label: string }> = {
  open:    { bg: 'bg-[rgba(15,118,110,0.1)]',  text: 'text-[#0f766e]', border: 'border-[rgba(15,118,110,0.2)]',  label: 'Open'    },
  closed:  { bg: 'bg-[#f1f5f9]',               text: 'text-[#64748b]', border: 'border-[#e2e8f0]',               label: 'Closed'  },
  holiday: { bg: 'bg-[rgba(172,0,0,0.08)]',    text: 'text-[#AC0000]', border: 'border-[rgba(172,0,0,0.2)]',    label: 'Holiday' },
  blocked: { bg: 'bg-[rgba(180,83,9,0.08)]',   text: 'text-[#b45309]', border: 'border-[rgba(180,83,9,0.25)]',  label: 'Blocked' },
};

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getWeekDates(anchor: string): string[] {
  const d = new Date(anchor + 'T00:00:00');
  const dow = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dow + 6) % 7)); // back to Monday
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return dt.toISOString().slice(0, 10);
  });
}

function SlotAvailabilityManager({ museumName }: { museumName: string }) {
  const scheduling = useScheduling();
  const today = new Date().toISOString().slice(0, 10);

  const [anchorDate, setAnchorDate]   = useState(today);
  const [showUpload, setShowUpload]   = useState(false);
  const [success, setSuccess]         = useState('');
  // Confirmation state: which cell the curator clicked
  const [pending, setPending]         = useState<{ date: string; time: string; current: SlotStatusLocal } | null>(null);
  const [pendingTarget, setPendingTarget] = useState<SlotStatusLocal>('open');
  const [blockReason, setBlockReason] = useState('');

  const showSuccess = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); };

  const weekDates = getWeekDates(anchorDate);

  const getStatus = (date: string, time: string): SlotStatusLocal =>
    scheduling.getSlotStatus(museumName, date, time).status as SlotStatusLocal;

  const shiftWeek = (dir: number) => {
    const d = new Date(anchorDate + 'T00:00:00');
    d.setDate(d.getDate() + dir * 7);
    setAnchorDate(d.toISOString().slice(0, 10));
  };

  const openConfirm = (date: string, time: string) => {
    const current = getStatus(date, time);
    const cycle: Record<SlotStatusLocal, SlotStatusLocal> = { open: 'closed', closed: 'holiday', holiday: 'blocked', blocked: 'open' };
    setPendingTarget(cycle[current]);
    setBlockReason('');
    setPending({ date, time, current });
  };

  const applyChange = () => {
    if (!pending) return;
    if (pendingTarget === 'blocked' && !blockReason.trim()) return;
    scheduling.setCellStatus(museumName, pending.date, pending.time, pendingTarget, blockReason.trim() || undefined);
    showSuccess(
      `${pending.time} on ${pending.date} set to "${pendingTarget}" at ${museumName}. ` +
      `Public calendar updated immediately.`
    );
    setPending(null);
  };

  const holidaysInView = weekDates.filter(d => PH_HOLIDAYS[d]);

  return (
    <div className="p-8">
      {success && <SuccessBanner msg={success} onClose={() => setSuccess('')} />}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div>
          <h2 className="font-bold text-[#1e293b] text-[22px] leading-[28px]">Slot Availability Management</h2>
          <p className="text-[#64748b] text-[14px] mt-1">
            Set each slot as <span className="text-[#0f766e] font-semibold">Open</span>,{' '}
            <span className="text-[#64748b] font-semibold">Closed</span>, or{' '}
            <span className="text-[#AC0000] font-semibold">Holiday</span> for <strong>{museumName}</strong>.
            Every change reflects instantly on the public booking calendar.
          </p>
        </div>
      </div>

      {/* Live-sync notice */}
      <div className="mb-4 bg-[rgba(15,118,110,0.05)] border border-[rgba(15,118,110,0.2)] rounded-lg px-4 py-2.5 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#0f766e] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p className="text-[#0f766e] text-[12px] font-semibold">
          Changes are applied immediately and reflected in real time on the public-facing booking calendar and slot selector.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {(Object.entries(statusStyles) as [SlotStatusLocal, typeof statusStyles[SlotStatusLocal]][]).map(([key, s]) => (
          <div key={key} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-semibold ${s.bg} ${s.text} ${s.border}`}>
            <span className={`w-2 h-2 rounded-full ${key === 'open' ? 'bg-[#0f766e]' : key === 'closed' ? 'bg-[#94a3b8]' : 'bg-[#AC0000]'}`} />
            {s.label}
          </div>
        ))}
      </div>

      {/* Date navigation */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-4 shadow-sm flex items-center gap-3 flex-wrap">
        <button onClick={() => shiftWeek(-1)}
          className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <label className="block text-[11px] font-semibold text-[#64748b] mb-0.5">Jump to date</label>
          <div className="flex items-center gap-1.5">
            {/* Manual text input */}
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              defaultValue={anchorDate}
              key={anchorDate}
              onBlur={e => {
                const v = e.target.value.trim();
                if (/^\d{4}-\d{2}-\d{2}$/.test(v)) setAnchorDate(v);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) setAnchorDate(v);
                }
              }}
              className="border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-1.5 text-[13px] text-[#1e293b] focus:outline-none w-[120px]"
            />
            {/* Calendar icon button — opens a hidden date picker */}
            <label className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b] cursor-pointer relative" title="Pick a date from calendar">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <input
                type="date"
                value={anchorDate}
                onChange={e => e.target.value && setAnchorDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                tabIndex={-1}
              />
            </label>
          </div>
        </div>
        <button onClick={() => shiftWeek(1)}
          className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] transition-colors text-[#64748b]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <span className="text-[#64748b] text-[13px]">
          Week of <strong className="text-[#1e293b]">{weekDates[0]}</strong> — <strong className="text-[#1e293b]">{weekDates[6]}</strong>
        </span>
        <button onClick={() => setAnchorDate(today)} className="ml-auto text-[12px] font-semibold text-[#334155] border border-[#e2e8f0] rounded-lg px-3 py-1.5 hover:bg-[#f8fafc] transition-colors">
          Today
        </button>
      </div>

      {/* Holiday strip for visible week */}
      {holidaysInView.length > 0 && (
        <div className="mb-4 bg-[rgba(172,0,0,0.04)] border border-[rgba(172,0,0,0.15)] rounded-lg px-4 py-3">
          <p className="font-semibold text-[#AC0000] text-[12px] mb-1">Philippine / Naga City Holidays this week</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {holidaysInView.map(d => (
              <span key={d} className="text-[#64748b] text-[12px]">
                <strong className="text-[#AC0000]">{d}</strong> — {PH_HOLIDAYS[d]}
              </span>
            ))}
          </div>
          <p className="text-[#94a3b8] text-[11px] mt-1">Auto-blocked by system. Click a cell to override for {museumName}.</p>
        </div>
      )}

      {/* Slot grid */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="px-4 py-3 text-left font-semibold text-[#64748b] text-[12px] w-[140px]">Time Slot</th>
                {weekDates.map(d => (
                  <th key={d} className={`px-3 py-3 text-center font-semibold text-[12px] whitespace-nowrap ${PH_HOLIDAYS[d] ? 'text-[#AC0000]' : d === today ? 'text-[#334155]' : 'text-[#64748b]'}`}>
                    <div>{DAY_NAMES[new Date(d + 'T00:00:00').getDay()]}</div>
                    <div className={`font-normal text-[11px] ${d === today ? 'underline' : ''}`}>{d.slice(5)}</div>
                    {PH_HOLIDAYS[d] && <div className="text-[9px] font-semibold mt-0.5 text-[#AC0000]">Holiday</div>}
                    {d === today && !PH_HOLIDAYS[d] && <div className="text-[9px] font-semibold mt-0.5 text-[#334155]">Today</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEFAULT_TIME_SLOTS.map((time, idx) => (
                <React.Fragment key={time}>
                  <tr key={time} className="border-b border-[#f1f5f9]">
                    <td className="px-4 py-3 font-semibold text-[#1e293b] text-[12px] whitespace-nowrap">{time}</td>
                    {weekDates.map(date => {
                      const st      = getStatus(date, time);
                      const style   = statusStyles[st];
                      const booked  = scheduling.getBookedCount(museumName, date, time);
                      const cap     = scheduling.getSlotStatus(museumName, date, time).capacity;
                      const isPast  = date < today;
                      return (
                        <td key={date} className="px-2 py-3 text-center">
                          <button
                            onClick={() => !isPast && openConfirm(date, time)}
                            disabled={isPast}
                            title={isPast ? 'Past date — cannot edit' : `Click to change status for ${date} ${time}`}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all whitespace-nowrap
                              ${isPast ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}
                              ${style.bg} ${style.text} ${style.border}`}>
                            {style.label}
                            {!!PH_HOLIDAYS[date] && st === 'holiday' && <span className="ml-1 opacity-50">*</span>}
                          </button>
                          {st === 'open' && booked > 0 && (
                            <div className="text-[10px] text-[#64748b] mt-0.5">{booked}/{cap}</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[#94a3b8] text-[12px] mt-2">* Auto-blocked by PH holiday calendar. Click to override per slot.</p>

      {/* ── Status-change confirmation modal ── */}
      {pending && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={() => setPending(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-[#1e293b] text-[17px] mb-1">Change Slot Status</h3>
            <p className="text-[#64748b] text-[13px] mb-4">
              <strong>{pending.time}</strong> · <strong>{pending.date}</strong> · {museumName}
            </p>
            <p className="text-[#64748b] text-[12px] mb-3">
              Current status: <span className={`font-semibold ${statusStyles[pending.current].text}`}>{statusStyles[pending.current].label}</span>
            </p>
            <p className="font-semibold text-[#1e293b] text-[12px] mb-2">Set to:</p>
            <div className="flex flex-col gap-2 mb-3">
              {(['open', 'closed', 'holiday', 'blocked'] as SlotStatusLocal[]).map(s => (
                <label key={s} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${pendingTarget === s ? `${statusStyles[s].bg} ${statusStyles[s].border}` : 'border-[#e2e8f0] hover:border-[#334155]/30'}`}>
                  <input type="radio" name="slotStatus" value={s} checked={pendingTarget === s} onChange={() => { setPendingTarget(s); if (s !== 'blocked') setBlockReason(''); }} className="accent-[#334155]" />
                  <span className={`font-semibold text-[13px] ${pendingTarget === s ? statusStyles[s].text : 'text-[#1e293b]'}`}>{statusStyles[s].label}</span>
                  <span className="text-[#94a3b8] text-[11px] ml-auto">
                    {s === 'open' ? 'Visible & bookable' : s === 'closed' ? 'Hidden from public' : s === 'holiday' ? 'Non-operating day' : 'Visible but unavailable'}
                  </span>
                </label>
              ))}
            </div>
            {pendingTarget === 'blocked' && (
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-[#b45309] mb-1">Reason for blocking <span className="text-[#AC0000]">*</span></label>
                <textarea
                  value={blockReason}
                  onChange={e => setBlockReason(e.target.value)}
                  placeholder="e.g. Special event, maintenance, private reservation…"
                  rows={2}
                  className="w-full border border-[rgba(180,83,9,0.3)] focus:border-[#b45309] rounded-lg px-3 py-2 text-[12px] text-[#1e293b] focus:outline-none resize-none"
                />
                {!blockReason.trim() && <p className="text-[#AC0000] text-[10px] mt-0.5">A reason is required so visitors can see why this slot is unavailable.</p>}
              </div>
            )}
            <div className="bg-[rgba(15,118,110,0.05)] border border-[rgba(15,118,110,0.2)] rounded-lg px-3 py-2 mb-4">
              <p className="text-[#0f766e] text-[11px] font-semibold">This change will be applied immediately to the public-facing calendar.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={applyChange}
                disabled={pendingTarget === 'blocked' && !blockReason.trim()}
                className="flex-1 bg-[#334155] hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">
                Apply Change
              </button>
              <button onClick={() => setPending(null)}
                className="flex-1 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload template modal */}
      {showUpload && (
        <CModal title="Upload Slot Availability Template" onClose={() => setShowUpload(false)}>
          <p className="text-[#64748b] text-[13px] leading-[22.75px] mb-4">
            Upload a CSV to bulk-configure slot availability for <strong>{museumName}</strong>.
            Columns: <code className="bg-[#f1f5f9] px-1 rounded text-[#334155]">date, time_slot, status</code> (open / closed / holiday).
          </p>
          <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-6 text-center mb-5 hover:border-[#334155] transition-colors cursor-pointer">
            <svg className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            <p className="font-semibold text-[#1e293b] text-[13px]">Click to browse or drag & drop</p>
            <p className="text-[#64748b] text-[12px] mt-1">CSV files only · Max 2 MB</p>
          </div>
          <div className="bg-[#f1f5f9] rounded-lg p-3 mb-5">
            <p className="font-semibold text-[#1e293b] text-[12px] mb-1">Sample CSV format:</p>
            <code className="text-[#334155] text-[11px] leading-[20px] block">
              date,time_slot,status<br />
              2026-05-19,09:00–10:00,open<br />
              2026-05-19,10:00–11:00,open<br />
              2026-05-19,11:00–12:00,closed<br />
              2026-05-19,13:00–14:00,open<br />
              2026-05-19,14:00–15:00,open<br />
              2026-05-19,15:00–16:00,open<br />
              2026-05-19,16:00–17:00,holiday
            </code>
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              scheduling.bulkSetOverrides(museumName, weekDates.flatMap(date =>
                DEFAULT_TIME_SLOTS.map(ts => ({ date, timeSlot: ts, status: PH_HOLIDAYS[date] ? 'holiday' as const : 'open' as const }))
              ));
              setShowUpload(false);
              showSuccess('Template uploaded & applied. Public calendar updated for ' + museumName + '.');
            }} className="flex-1 bg-[#334155] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">
              Upload & Apply
            </button>
            <button onClick={() => setShowUpload(false)} className="flex-1 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">Cancel</button>
          </div>
        </CModal>
      )}
    </div>
  );
}

// ─── Per-museum staff performance data ───────────────────────────────────────


// ─── Historical Reports + Staff Performance Metrics ───────────────────────────

function HistoricalReports({ museumName }: { museumName: string }) {
  const { logEntries, staffAssignments } = useScheduling();

  const todayStr = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10); })();

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate,   setEndDate]   = useState(todayStr);
  const [success,   setSuccess]   = useState('');

  const ratingStyle: Record<string, string> = {
    Excellent: 'bg-[rgba(15,118,110,0.1)] text-[#0f766e] border-[rgba(15,118,110,0.2)]',
    Good:      'bg-[rgba(51,65,85,0.08)] text-[#334155] border-[rgba(51,65,85,0.15)]',
    Fair:      'bg-[rgba(245,158,11,0.1)] text-[#b45309] border-[rgba(245,158,11,0.2)]',
    Poor:      'bg-[rgba(172,0,0,0.08)] text-[#AC0000] border-[rgba(172,0,0,0.2)]',
  };

  // Log entries for this museum within the selected date range
  const filtered = logEntries.filter(e =>
    e.museum === museumName && e.visitDate >= startDate && e.visitDate <= endDate
  );
  const present = filtered.filter(e => e.attendanceStatus === 'Present');

  // ISO week string helper (YYYY-Www)
  const isoWeek = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const jan4 = new Date(d.getFullYear(), 0, 4);
    const dayNum = Math.round((d.getTime() - jan4.getTime()) / 86400000);
    const wk = Math.ceil((dayNum + jan4.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${String(wk).padStart(2, '0')}`;
  };

  const totalVisitors  = present.reduce((s, e) => s + e.groupSize, 0);
  const distinctWeeks  = new Set(filtered.map(e => isoWeek(e.visitDate)));
  const weeksTracked   = distinctWeeks.size;
  const adherencePct   = filtered.length > 0 ? Math.round((present.length / filtered.length) * 100) : 0;
  const avgWeekly      = weeksTracked > 0 ? Math.round(totalVisitors / weeksTracked) : 0;

  // Weekly bar chart: sum present groupSizes per ISO week
  const weeklyMap = new Map<string, number>();
  present.forEach(e => { const w = isoWeek(e.visitDate); weeklyMap.set(w, (weeklyMap.get(w) ?? 0) + e.groupSize); });
  const weekKeys   = Array.from(weeklyMap.keys()).sort();
  const weeklyBars = weekKeys.map(w => ({ label: w.replace(/^\d{4}-/, ''), value: weeklyMap.get(w) ?? 0 }));
  const barMax     = weeklyBars.length > 0 ? Math.max(...weeklyBars.map(b => b.value)) : 1;

  // Staff performance: derived from MUSEUM_STAFF_MAP + real logEntries + staffAssignments
  const museumId   = MUSEUM_ID_MAP[museumName];
  const staffList  = MUSEUM_STAFF_MAP[museumName] ?? MUSEUM_STAFF_MAP['UNC Museum'];
  const staffPerf  = staffList.map(sm => {
    const myLogs    = filtered.filter(e => e.recordedBy === sm.id || e.recordedBy === sm.name || (e as any).assignedStaff === sm.id);
    const myPresent = myLogs.filter(e => e.attendanceStatus === 'Present');
    const sessions  = staffAssignments.filter(a => a.museumId === museumId && a.userId === sm.id && a.assignmentStatus !== 'Cancelled').length;
    const adherence = myLogs.length > 0 ? Math.round((myPresent.length / myLogs.length) * 100) : 0;
    const rating    = myLogs.length === 0 ? '—' : adherence >= 95 ? 'Excellent' : adherence >= 85 ? 'Good' : adherence >= 70 ? 'Fair' : 'Poor';
    return { name: sm.name, role: sm.role, entries: myLogs.length, adherence, sessions, rating };
  });

  return (
    <div className="p-8">
      {success && <SuccessBanner msg={success} onClose={() => setSuccess('')} />}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2 className="font-bold text-[#1e293b] text-[22px] leading-[28px]">Historical Reports & Trends</h2>
          <p className="text-[#64748b] text-[14px] mt-1">Attendance and staff analytics for <strong>{museumName}</strong>.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setSuccess('Report exported as CSV.'); setTimeout(() => setSuccess(''), 3000); }} className="h-10 px-4 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13.25px] bg-white hover:bg-[#f8fafc] transition-colors">Export CSV</button>
          <button onClick={() => { setSuccess('Report exported as PDF.'); setTimeout(() => setSuccess(''), 3000); }} className="h-10 px-4 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13.25px] bg-white hover:bg-[#f8fafc] transition-colors">Export PDF</button>
        </div>
      </div>

      {/* Date range filter */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-end">
        <div>
          <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none" />
        </div>
        <div>
          <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none" />
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {([
          [totalVisitors > 0 ? totalVisitors.toLocaleString() : '0', 'Total Visitors'],
          [String(weeksTracked),                                       'Weeks Tracked'],
          [filtered.length > 0 ? `${adherencePct}%` : '—',           'Avg. Attendance Rate'],
          [totalVisitors > 0 ? String(avgWeekly) : '—',               'Avg. Weekly Visitors'],
        ] as [string, string][]).map(([v, l]) => (
          <div key={l} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-center shadow-sm">
            <p className="font-bold text-[#1e293b] text-[26px] leading-[36px]">{v}</p>
            <p className="text-[#64748b] text-[12px] leading-[22.75px] mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-[#1e293b] text-[16px] leading-[28px] mb-5">Weekly Visitor Volume</h3>
        {weeklyBars.length > 0 ? (
          <div className="flex items-end gap-4 h-40">
            {weeklyBars.map(b => (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[#64748b] text-[12px]">{b.value}</span>
                <div className="w-full rounded-t-md" style={{ height: `${(b.value / barMax) * 100}%`, background: b.value === barMax ? '#AC0000' : '#0f766e' }} />
                <span className="text-[#64748b] text-[11px]">{b.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center gap-2 text-[#94a3b8]">
            <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <p className="text-[13px]">No visitor log entries in this date range.</p>
          </div>
        )}
      </div>

      {/* Staff performance table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h3 className="font-semibold text-[#1e293b] text-[16px] leading-[28px]">Staff Performance Metrics</h3>
          <p className="text-[#64748b] text-[13px]">Entries logged, attendance rate, and assignment sessions per staff member.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                {['Staff Member','Role','Entries Logged','Attendance Rate','Assigned Sessions','Rating'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold text-[#64748b] text-[12px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffPerf.map(sp => (
                <tr key={sp.name} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-5 py-4 font-semibold text-[#1e293b] text-[13px]">{sp.name}</td>
                  <td className="px-5 py-4 text-[#64748b] text-[13px]">{sp.role}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-[#1e293b] text-[16px]">{sp.entries}</span>
                    <span className="text-[#64748b] text-[11px] ml-1">entries</span>
                  </td>
                  <td className="px-5 py-4">
                    {sp.entries > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${sp.adherence}%`, background: sp.adherence >= 95 ? '#0f766e' : sp.adherence >= 85 ? '#b45309' : '#AC0000' }} />
                        </div>
                        <span className="font-semibold text-[#1e293b] text-[13px]">{sp.adherence}%</span>
                      </div>
                    ) : <span className="text-[#94a3b8] text-[12px]">No entries</span>}
                  </td>
                  <td className="px-5 py-4 text-[#1e293b] text-[13px]">{sp.sessions} sessions</td>
                  <td className="px-5 py-4">
                    {sp.rating !== '—' ? (
                      <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${ratingStyle[sp.rating]}`}>{sp.rating}</span>
                    ) : <span className="text-[#94a3b8] text-[12px]">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Recurring Schedules ──────────────────────────────────────────────────────

// ─── Main Curator View ────────────────────────────────────────────────────────

export function SchedulingCuratorView({ museum }: { museum: string }) {
  const [tab, setTab] = useState<CuratorTab>('dashboard');

  const { notifications, bookings } = useScheduling();

  const pendingCount      = bookings.filter(b => b.museum === museum && b.status === 'pending').length;
  const unreadNotifCount  = notifications.filter(n => n.museum === museum && !n.isRead).length;

  const tabs: { id: CuratorTab; label: string; badge?: number }[] = [
    { id: 'dashboard',           label: 'Dashboard'                                            },
    { id: 'approval',            label: 'Approvals',     badge: pendingCount || undefined      },
    { id: 'staff-assignment',    label: 'Staff Assignment'                                     },
    { id: 'slot-availability',   label: 'Slot Availability'                                    },
    { id: 'historical-reports',  label: 'Historical Reports'                                   },
    { id: 'notifications',       label: 'Notifications', badge: unreadNotifCount || undefined  },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <MuseumContextBanner museumName={museum} />
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="flex overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-4 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${tab === t.id ? 'border-[#334155] text-[#1e293b]' : 'border-transparent text-[#64748b] hover:text-[#1e293b]'}`}>
              {t.label}
              {t.badge && <span className="w-4 h-4 bg-[#AC0000] rounded-full text-white text-[9px] flex items-center justify-center">{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>
      {tab === 'dashboard'           && <CuratorDashboardTab onNavigate={setTab} museumName={museum} />}
      {tab === 'approval'            && <ScheduleApproval museumName={museum} />}
      {tab === 'staff-assignment'    && <StaffAssignment museumName={museum} />}
      {tab === 'slot-availability'   && <SlotAvailabilityManager museumName={museum} />}
      {tab === 'historical-reports'  && <HistoricalReports museumName={museum} />}
      {tab === 'notifications'       && <NotificationCenter museumName={museum} />}
    </div>
  );
}
