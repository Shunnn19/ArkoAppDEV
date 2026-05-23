import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

export type SlotStatus = 'open' | 'closed' | 'holiday' | 'blocked';
export type DateState  = 'available' | 'partial' | 'booked' | 'holiday' | 'closed' | 'past' | 'empty';

export interface SlotOverride {
  museum: string;
  date: string;
  timeSlot: string;
  status: SlotStatus;
  capacity: number;
  isAutoHoliday: boolean;
  reason?: string;
  scheduleId?: string;
}

export interface PublicBooking {
  ref: string;
  museum: string;
  date: string;
  timeSlot: string;
  groupSize: number;
  name: string;
  email: string;
  contact: string;
  groupType: string;
  specialRequirements: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  submittedAt: string;
  assignedStaff?: string;
  bookingType?: string;
  visitorType?: string;
  visitorId?: string;
  scheduleId?: string;
}

export interface LogEntry {
  id: string;
  bookingRef: string;
  museum: string;
  visitDate: string;
  timeSlot: string;
  visitorName: string;
  groupSize: number;
  entryType: 'Pre-booked' | 'Walk-in';
  arrivalTime: string;
  arrivalDate: string;
  attendanceStatus: 'Present' | 'Absent' | 'Late';
  recordedBy: string;
  departureTime?: string;
  notes?: string;
  isComplete: boolean;
  walkInId?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  contactNumber?: string;
  emailAddress?: string;
  numberOfVisitors?: number;
  scheduleId?: string;
  registrationDate?: string;
  registrationTime?: string;
}

export interface StaffAssignment {
  assignmentId: string;
  museumId: string;
  assignmentStatus: 'Assigned' | 'Reassigned' | 'Cancelled';
  assignmentDate: string;
  scheduleId: string;
  userId: string;
  visitDate?: string;
  timeSlot?: string;
}

export interface NotificationRecord {
  id: string;
  notificationType: string;
  bookingId?: string;
  assignmentId?: string;
  scheduleId?: string;
  logId?: string;
  museum: string;
  recipient: string;
  channel: 'Email' | 'SMS' | 'System Alert';
  notificationStatus: 'Sent' | 'Failed' | 'Pending';
  message: string;
  createdAt: string;
  isRead: boolean;
}

export const DEFAULT_TIME_SLOTS = ['09:00–10:00', '10:00–11:00', '11:00–12:00', '13:00–14:00', '14:00–15:00', '15:00–16:00', '16:00–17:00'];
const DEFAULT_CAPACITY = 40;

export const PH_HOLIDAYS: Record<string, string> = {
  '2025-01-01': 'New Year\'s Day',
  '2025-04-09': 'Araw ng Kagitingan',
  '2025-04-17': 'Maundy Thursday',
  '2025-04-18': 'Good Friday',
  '2025-05-01': 'Labor Day',
  '2025-06-12': 'Independence Day',
  '2025-08-25': 'National Heroes Day',
  '2025-11-30': 'Bonifacio Day',
  '2025-12-08': 'Feast of the Immaculate Conception',
  '2025-12-25': 'Christmas Day',
  '2025-12-30': 'Rizal Day',
  '2026-01-01': 'New Year\'s Day',
  '2026-04-09': 'Araw ng Kagitingan',
  '2026-04-02': 'Maundy Thursday',
  '2026-04-03': 'Good Friday',
  '2026-05-01': 'Labor Day',
  '2026-06-12': 'Independence Day',
  '2026-08-31': 'National Heroes Day',
  '2026-11-30': 'Bonifacio Day',
  '2026-12-08': 'Feast of the Immaculate Conception',
  '2026-12-25': 'Christmas Day',
  '2026-12-30': 'Rizal Day',
};

// ─── API configuration ────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost/museum-api/api';

async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

// ─── Museum name mapping ──────────────────────────────────────────────────────
const MUSEUM_TO_ENUM: Record<string, string> = {
  'Peñafrancia Museum':           'Penafrancia_Museum',
  'Museo del Seminario Conciliar': 'Museo del Seminario Conciliar',
  'UNC Museum':                   'UNC Museum',
  'Jesse M. Robredo Museum':      'Jesse M. Robredo Museum',
  'Museo Hayskulano':             'Museo Hayskulano',
};

const ENUM_TO_MUSEUM: Record<string, string> = Object.fromEntries(
  Object.entries(MUSEUM_TO_ENUM).map(([k, v]) => [v, k])
);

function museumToEnum(name: string): string {
  return MUSEUM_TO_ENUM[name] || name;
}

function enumToMuseum(name: string): string {
  return ENUM_TO_MUSEUM[name] || name;
}

// ─── Context shape ────────────────────────────────────────────────────────────
interface SchedulingContextType {
  overrides: Record<string, SlotOverride>;
  setCellStatus: (museum: string, date: string, timeSlot: string, status: SlotStatus, reason?: string) => void;
  bulkSetOverrides: (museum: string, cells: Array<{ date: string; timeSlot: string; status: SlotStatus }>) => void;
  bookings: PublicBooking[];
  addBooking: (b: PublicBooking) => Promise<string>;
  updateBooking: (ref: string, updates: Partial<PublicBooking>) => void;
  cancelBooking: (ref: string) => void;
  deleteBooking: (ref: string) => void;
  myBookingRefs: string[];
  addMyBookingRef: (ref: string) => void;
  getBookingByRef: (ref: string) => PublicBooking | undefined;
  getBookingsByEmail: (email: string) => PublicBooking[];
  logEntries: LogEntry[];
  addLogEntry: (entry: Omit<LogEntry, 'id'>) => Promise<string>;
  updateLogEntry: (id: string, updates: Partial<LogEntry>) => void;
  deleteLogEntry: (id: string) => void;
  staffAssignments: StaffAssignment[];
  addStaffAssignment: (a: Omit<StaffAssignment, 'assignmentId' | 'assignmentDate'>) => Promise<string>;
  removeStaffAssignment: (assignmentId: string) => void;
  updateStaffAssignment: (assignmentId: string, updates: Partial<StaffAssignment>) => void;
  notifications: NotificationRecord[];
  addNotification: (n: Omit<NotificationRecord, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  retryNotification: (id: string) => void;
  getSlotStatus: (museum: string, date: string, timeSlot: string) => { status: SlotStatus; holidayName?: string; capacity: number; reason?: string };
  getBookedCount: (museum: string, date: string, timeSlot: string) => number;
  getDateState: (museum: string, date: string, today: string) => DateState;
  getOpenSlotsForDate: (museum: string, date: string) => Array<{ timeSlot: string; capacity: number; booked: number; status: SlotStatus; reason?: string; scheduleId?: string }>;
  detectConflicts: (museum: string, date: string, timeSlot: string, incomingGroupSize: number) => string[];
}

const SchedulingContext = createContext<SchedulingContextType | null>(null);

export function useScheduling() {
  const ctx = useContext(SchedulingContext);
  if (!ctx) throw new Error('useScheduling must be used inside SchedulingProvider');
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slotKey(museum: string, date: string, timeSlot: string) {
  return `${museum}||${date}||${timeSlot}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SchedulingProvider({ children }: { children: ReactNode }) {
  const [overrides,         setOverrides]         = useState<Record<string, SlotOverride>>({});
  const [bookings,          setBookings]           = useState<PublicBooking[]>([]);
  const [logEntries,        setLogEntries]         = useState<LogEntry[]>([]);
  const [staffAssignments,  setStaffAssignments]   = useState<StaffAssignment[]>([]);
  const [notifications,     setNotifications]      = useState<NotificationRecord[]>([]);
  const [myBookingRefs,     setMyBookingRefs]     = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('myBookingRefs') || '[]'); } catch { return []; }
  });

  // ── Load data from API on mount ──────────────────────────────────────────
  useEffect(() => {
    api<any[]>('GET', '/visit-schedules').then(schedules => {
      const ov: Record<string, SlotOverride> = {};
      const today = new Date().toISOString().slice(0, 10);
      schedules.forEach((s: any) => {
        const status = s.visitDate < today ? 'closed' as SlotStatus : s.scheduleStatus === 'Closed' ? 'closed' as SlotStatus : s.scheduleStatus === 'Holiday' ? 'holiday' as SlotStatus : s.scheduleStatus === 'Full' ? 'closed' as SlotStatus : s.scheduleStatus === 'Unavailable' ? 'blocked' as SlotStatus : 'open' as SlotStatus;
        const m = enumToMuseum(s.museumSelection);
        const key = slotKey(m, s.visitDate, s.timeSlot);
        ov[key] = { museum: m, date: s.visitDate, timeSlot: s.timeSlot, status, capacity: s.maxCapacity, isAutoHoliday: s.scheduleStatus === 'Holiday', scheduleId: s.scheduleId };
      });
      setOverrides(ov);
    }).catch(() => {});

    api<any[]>('GET', '/visitor-bookings').then(list => {
      setBookings(list.map(mapBookingFromApi));
    }).catch(() => {});

    api<any[]>('GET', '/attendance-logs').then(list => {
      setLogEntries(list.map(mapLogFromApi));
    }).catch(() => {});

    api<any[]>('GET', '/staff-assignments').then(list => {
      setStaffAssignments(list.map(mapAssignmentFromApi));
    }).catch(() => {});

    api<any[]>('GET', '/notifications').then(list => {
      setNotifications(list.map(mapNotificationFromApi));
    }).catch(() => {});
  }, []);

  // ── API data mapping ─────────────────────────────────────────────────────
  function mapBookingFromApi(b: any): PublicBooking {
    return {
      ref: b.bookingId,
      museum: enumToMuseum(b.museumSelection),
      date: b.visitDate || b.bookingDate,
      timeSlot: b.timeSlot || '',
      groupSize: b.numberOfVisitors,
      name: [b.firstName, b.lastName].filter(Boolean).join(' '),
      email: b.emailAddress || '',
      contact: b.contactNumber || '',
      groupType: b.bookingType,
      specialRequirements: b.specialRequest || '',
      status: b.bookingStatus?.toLowerCase() || 'pending',
      submittedAt: b.bookingDate,
      visitorId: b.visitorId,
      scheduleId: b.scheduleId,
    };
  }

  function mapLogFromApi(l: any): LogEntry {
    const firstName = l.visitorFirstName || '';
    const lastName  = l.visitorLastName || '';
    const visitorName = [firstName, lastName].filter(Boolean).join(' ');
    const departureTime = l.departureTime || undefined;
    return {
      id: l.logId,
      bookingRef: l.bookingId || l.walkInId || '',
      museum: enumToMuseum(l.museumSelection),
      visitDate: l.arrivalDate,
      timeSlot: l.scheduleTimeSlot || '',
      visitorName,
      groupSize: Number(l.visitorCount) || 0,
      entryType: l.entryType,
      arrivalTime: l.arrivalTime,
      arrivalDate: l.arrivalDate,
      departureTime,
      attendanceStatus: l.attendanceStatus,
      recordedBy: l.userId,
      isComplete: !!departureTime,
      walkInId: l.walkInId,
      scheduleId: l.scheduleId,
    };
  }

  function mapAssignmentFromApi(a: any): StaffAssignment {
    return {
      assignmentId: a.assignmentId,
      museumId: enumToMuseum(a.museumSelection),
      assignmentStatus: a.assignmentStatus,
      assignmentDate: a.assignmentDate,
      scheduleId: a.scheduleId,
      userId: a.userId,
    };
  }

  function mapNotificationFromApi(n: any): NotificationRecord {
    return {
      id: n.notificationId,
      notificationType: n.notificationType,
      bookingId: n.bookingId || undefined,
      assignmentId: n.assignmentId || undefined,
      scheduleId: n.scheduleId || undefined,
      logId: n.logId || undefined,
      museum: '',
      recipient: n.recipient,
      channel: n.notificationChannel,
      notificationStatus: n.notificationStatus,
      message: n.notificationType,
      createdAt: n.dateNotified,
      isRead: false,
    };
  }

  // ── Slot overrides ────────────────────────────────────────────────────────
  const setCellStatus = (museum: string, date: string, timeSlot: string, status: SlotStatus, reason?: string) => {
    const key = slotKey(museum, date, timeSlot);
    setOverrides(prev => ({ ...prev, [key]: { museum, date, timeSlot, status, capacity: prev[key]?.capacity ?? DEFAULT_CAPACITY, isAutoHoliday: false, reason: status === 'blocked' ? reason : undefined } }));
    api('POST', '/visit-schedules', {
      museumSelection: museumToEnum(museum),
      visitDate: date,
      timeSlot,
      maxCapacity: DEFAULT_CAPACITY,
      scheduleStatus: status === 'open' ? 'Open' : status === 'closed' ? 'Closed' : status === 'holiday' ? 'Holiday' : 'Unavailable',
    }).catch(() => {});
  };

  const bulkSetOverrides = (museum: string, cells: Array<{ date: string; timeSlot: string; status: SlotStatus }>) => {
    setOverrides(prev => {
      const next = { ...prev };
      cells.forEach(c => {
        const key = slotKey(museum, c.date, c.timeSlot);
        next[key] = { museum, date: c.date, timeSlot: c.timeSlot, status: c.status, capacity: next[key]?.capacity ?? DEFAULT_CAPACITY, isAutoHoliday: false };
      });
      return next;
    });
    cells.forEach(c => {
      api('POST', '/visit-schedules', {
        museumSelection: museumToEnum(museum),
        visitDate: c.date,
        timeSlot: c.timeSlot,
        maxCapacity: DEFAULT_CAPACITY,
        scheduleStatus: c.status === 'open' ? 'Open' : c.status === 'closed' ? 'Closed' : 'Unavailable',
      }).catch(() => {});
    });
  };

  // ── Booking CRUD ──────────────────────────────────────────────────────────
  const addBooking = async (b: PublicBooking): Promise<string> => {
    const visitor = await api<any>('POST', '/visitors', {
      lastName: b.name.split(' ').slice(1).join(' ') || b.name,
      firstName: b.name.split(' ')[0],
      contactNumber: b.contact,
      emailAddress: b.email,
      visitorType: b.visitorType || 'Guest',
    });
    const schedule = await api<any>('POST', '/visit-schedules', {
      museumSelection: museumToEnum(b.museum),
      visitDate: b.date,
      timeSlot: b.timeSlot,
      maxCapacity: 40,
      scheduleStatus: 'Open',
    });
    const result = await api<any>('POST', '/visitor-bookings', {
      museumSelection: museumToEnum(b.museum),
      bookingDate: b.date,
      bookingType: b.groupType,
      bookingStatus: 'Pending',
      numberOfVisitors: b.groupSize,
      specialRequest: b.specialRequirements || '',
      visitorId: visitor.visitorId,
      scheduleId: schedule.scheduleId,
    });
    setBookings(prev => [{ ...b, ref: result.bookingId, visitorId: visitor.visitorId, scheduleId: schedule.scheduleId }, ...prev]);
    return result.bookingId;
  };

  const updateBooking = (ref: string, updates: Partial<PublicBooking>) => {
    setBookings(prev => prev.map(b => b.ref === ref ? { ...b, ...updates } : b));
    const body: Record<string, unknown> = {};
    if (updates.status) body.bookingStatus = updates.status.charAt(0).toUpperCase() + updates.status.slice(1);
    if (updates.groupSize) body.numberOfVisitors = updates.groupSize;
    if (updates.specialRequirements !== undefined) body.specialRequest = updates.specialRequirements;
    if (Object.keys(body).length) api('PUT', `/visitor-bookings/${ref}`, body).catch(() => {});
  };

  const cancelBooking = (ref: string) => {
    setBookings(prev => prev.map(b => b.ref === ref ? { ...b, status: 'cancelled' as const } : b));
    api('PUT', `/visitor-bookings/${ref}`, { bookingStatus: 'Cancelled' }).catch(() => {});
  };

  const deleteBooking = (ref: string) => {
    setBookings(prev => prev.filter(b => b.ref !== ref));
    api('DELETE', `/visitor-bookings/${ref}`).catch(() => {});
  };

  const getBookingByRef = (ref: string) => bookings.find(b => b.ref === ref);

  const getBookingsByEmail = (email: string) => bookings.filter(b => b.email.toLowerCase() === email.toLowerCase());

  const addMyBookingRef = (ref: string) => {
    setMyBookingRefs(prev => {
      if (prev.includes(ref)) return prev;
      const next = [...prev, ref];
      try { localStorage.setItem('myBookingRefs', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // ── Log entry CRUD ────────────────────────────────────────────────────────
  const addLogEntry = async (entry: Omit<LogEntry, 'id'>): Promise<string> => {
    const scheduleId = entry.scheduleId && !entry.scheduleId.startsWith('SCH-')
      ? (await api<any>('POST', '/visit-schedules', {
          museumSelection: museumToEnum(entry.museum),
          visitDate: entry.arrivalDate,
          timeSlot: entry.timeSlot || entry.scheduleId,
          maxCapacity: 40,
          scheduleStatus: 'Open',
        })).scheduleId
      : entry.scheduleId;
    const body: Record<string, unknown> = {
      museumSelection: museumToEnum(entry.museum),
      arrivalDate: entry.arrivalDate,
      arrivalTime: entry.arrivalTime,
      departureTime: entry.departureTime || null,
      entryType: entry.entryType,
      attendanceStatus: entry.attendanceStatus,
      scheduleId: scheduleId || '',
      userId: entry.recordedBy,
    };
    if (entry.entryType === 'Pre-booked') body.bookingId = entry.bookingRef;
    if (entry.entryType === 'Walk-in') {
      const walkin = await api<any>('POST', '/walk-in-visitors', {
        museumSelection: museumToEnum(entry.museum),
        lastName: entry.lastName || '',
        firstName: entry.firstName || '',
        contactNumber: entry.contactNumber || '',
        numberOfVisitors: entry.groupSize || 1,
        registrationDate: entry.arrivalDate,
        registrationTime: entry.arrivalTime,
        scheduleId: scheduleId || '',
        recordingStaff: entry.recordedBy,
      });
      body.walkInId = walkin.walkInId;
    }
    const result = await api<any>('POST', '/attendance-logs', body);
    const newEntry: LogEntry = { ...entry, id: result.logId };
    setLogEntries(prev => [newEntry, ...prev]);
    return result.logId;
  };

  const updateLogEntry = (id: string, updates: Partial<LogEntry>) => {
    setLogEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    const body: Record<string, unknown> = {};
    if (updates.attendanceStatus) body.attendanceStatus = updates.attendanceStatus;
    if (updates.departureTime !== undefined) body.departureTime = updates.departureTime;
    if (Object.keys(body).length) api('PUT', `/attendance-logs/${id}`, body).catch(() => {});
  };

  const deleteLogEntry = (id: string) => setLogEntries(prev => prev.filter(e => e.id !== id));

  // ── Staff assignment CRUD ─────────────────────────────────────────────────
  const addStaffAssignment = async (a: Omit<StaffAssignment, 'assignmentId' | 'assignmentDate'>): Promise<string> => {
    const result = await api<any>('POST', '/staff-assignments', {
      museumSelection: museumToEnum(a.museumId),
      assignmentStatus: a.assignmentStatus,
      scheduleId: a.scheduleId,
      userId: a.userId,
    });
    const newA: StaffAssignment = { ...a, assignmentId: result.assignmentId, assignmentDate: new Date().toISOString().slice(0, 10) };
    setStaffAssignments(prev => [...prev, newA]);
    return result.assignmentId;
  };

  const removeStaffAssignment = (assignmentId: string) => {
    setStaffAssignments(prev => prev.map(a => a.assignmentId === assignmentId ? { ...a, assignmentStatus: 'Cancelled' as const } : a));
    api('PUT', `/staff-assignments/${assignmentId}`, { assignmentStatus: 'Cancelled' }).catch(() => {});
  };

  const updateStaffAssignment = (assignmentId: string, updates: Partial<StaffAssignment>) => {
    setStaffAssignments(prev => prev.map(a => a.assignmentId === assignmentId ? { ...a, ...updates } : a));
  };

  // ── Notification CRUD ─────────────────────────────────────────────────────
  const addNotification = (n: Omit<NotificationRecord, 'id' | 'createdAt' | 'isRead'>) => {
    const id = `NTF-${String(Date.now()).slice(-5)}`;
    const createdAt = new Date().toISOString();
    const record: NotificationRecord = { ...n, id, createdAt, isRead: false };
    setNotifications(prev => [record, ...prev]);
    api('POST', '/notifications', {
      notificationType: n.notificationType,
      notificationChannel: n.channel,
      recipient: n.recipient,
      dateNotified: createdAt,
      notificationStatus: n.notificationStatus,
      bookingId: n.bookingId || null,
      assignmentId: n.assignmentId || null,
      scheduleId: n.scheduleId || null,
      logId: n.logId || null,
    }).catch(() => {});
  };

  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const retryNotification = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, notificationStatus: 'Sent' as const } : n));

  // ── Derived queries ───────────────────────────────────────────────────────
  const getSlotStatus = useCallback((museum: string, date: string, timeSlot: string): { status: SlotStatus; holidayName?: string; capacity: number; reason?: string } => {
    const key = slotKey(museum, date, timeSlot);
    const override = overrides[key];
    if (override) return { status: override.status, holidayName: override.status === 'holiday' ? 'Holiday' : undefined, capacity: override.capacity, reason: override.reason };
    return { status: 'open', capacity: DEFAULT_CAPACITY };
  }, [overrides]);

  const getBookedCount = useCallback((museum: string, date: string, timeSlot: string): number =>
    bookings.filter(b => b.museum === museum && b.date === date && b.timeSlot === timeSlot && b.status !== 'cancelled').reduce((sum, b) => sum + b.groupSize, 0),
  [bookings]);

  const getDateState = useCallback((museum: string, date: string, today: string): DateState => {
    if (date < today) return 'past';
    const cells = DEFAULT_TIME_SLOTS.map(ts => ({ ts, ...getSlotStatus(museum, date, ts), booked: getBookedCount(museum, date, ts) }));
    const openCells = cells.filter(c => c.status === 'open');
    if (cells.every(c => c.status === 'holiday')) return 'holiday';
    if (cells.every(c => c.status === 'closed' || c.status === 'holiday' || c.status === 'blocked')) return 'closed';
    if (openCells.length === 0) return 'empty';
    const availableCells = openCells.filter(c => c.booked < c.capacity);
    if (availableCells.length === 0) return 'booked';
    if (availableCells.length < openCells.length) return 'partial';
    return 'available';
  }, [getSlotStatus, getBookedCount]);

  const getOpenSlotsForDate = useCallback((museum: string, date: string) =>
    DEFAULT_TIME_SLOTS.map(ts => {
      const key = slotKey(museum, date, ts);
      const override = overrides[key];
      const { status, capacity, reason } = getSlotStatus(museum, date, ts);
      const booked = getBookedCount(museum, date, ts);
      return { timeSlot: ts, capacity, booked, status, reason, scheduleId: override?.scheduleId };
    }).filter(s => s.status === 'open' || s.status === 'blocked'),
  [getSlotStatus, getBookedCount, overrides]);

  const detectConflicts = useCallback((museum: string, date: string, timeSlot: string, incomingGroupSize: number): string[] => {
    const conflicts: string[] = [];
    const { status, holidayName, capacity } = getSlotStatus(museum, date, timeSlot);
    if (status === 'holiday') conflicts.push(`Date is a holiday (${holidayName ?? 'blocked'}) — slot is not available.`);
    else if (status === 'blocked') {
      const { reason } = getSlotStatus(museum, date, timeSlot);
      conflicts.push(`Slot is blocked: ${reason ?? 'Unavailable.'}`);
    } else if (status === 'closed') conflicts.push('Slot is marked as closed by the curator.');
    else {
      const booked = getBookedCount(museum, date, timeSlot);
      const remaining = capacity - booked;
      if (incomingGroupSize > remaining) conflicts.push(`Capacity exceeded — ${remaining} remaining, ${incomingGroupSize} requested.`);
      else if (remaining > 0 && incomingGroupSize > remaining * 0.8) conflicts.push(`Near capacity — only ${remaining} spots left.`);
    }
    return conflicts;
  }, [getSlotStatus, getBookedCount]);

  const value = useMemo<SchedulingContextType>(() => ({
    overrides, setCellStatus, bulkSetOverrides,
    bookings, addBooking, updateBooking, cancelBooking, deleteBooking,
    myBookingRefs, addMyBookingRef, getBookingByRef, getBookingsByEmail,
    logEntries, addLogEntry, updateLogEntry, deleteLogEntry,
    staffAssignments, addStaffAssignment, removeStaffAssignment, updateStaffAssignment,
    notifications, addNotification, markNotificationRead, retryNotification,
    getSlotStatus, getBookedCount, getDateState, getOpenSlotsForDate, detectConflicts,
  }), [overrides, bookings, logEntries, staffAssignments, notifications, myBookingRefs,
      getSlotStatus, getBookedCount, getDateState, getOpenSlotsForDate, detectConflicts]);

  return <SchedulingContext.Provider value={value}>{children}</SchedulingContext.Provider>;
}
