import { useState, useMemo } from 'react';
import { MuseumContextBanner } from './MuseumSelector';
import { useScheduling, DEFAULT_TIME_SLOTS } from './SchedulingContext';
import type { PublicBooking, LogEntry } from './SchedulingContext';
import { NotificationCenter } from './NotificationCenter';
import { COUNTRY_CODES } from './countryCodes';

const MAX_LOCAL_DIGITS: Record<string, number> = {
  '+63': 10, '+1': 10, '+44': 10, '+61': 9, '+64': 9, '+81': 10, '+82': 10,
  '+86': 11, '+91': 10, '+92': 10, '+60': 10, '+65': 8, '+66': 9, '+62': 12,
  '+84': 10, '+880': 10, '+49': 11, '+33': 9, '+39': 10, '+34': 9, '+31': 9,
  '+32': 9, '+41': 9, '+43': 10, '+46': 9, '+47': 8, '+45': 8, '+358': 9,
  '+353': 9, '+48': 9, '+7': 10, '+380': 9, '+90': 10, '+55': 11, '+52': 10,
  '+54': 10, '+57': 10, '+56': 9, '+27': 9, '+20': 10, '+234': 10, '+254': 9,
  '+966': 9, '+971': 9, '+972': 9,
};
const getMaxLocal = (dialCode: string) =>
  MAX_LOCAL_DIGITS[dialCode] ?? Math.max(7, 15 - (dialCode.length - 1));

type StaffTab = 'dashboard' | 'bookings' | 'logbook' | 'reports' | 'notifications';

const TIME_SLOTS_OPTIONS = ['09:00–10:00', '10:00–11:00', '11:00–12:00', '13:00–14:00', '14:00–15:00', '15:00–16:00', '16:00–17:00'];
const GROUP_TYPES        = ['Individual', 'School Group', 'Senior Group', 'Private Tour', 'Government Group', 'Educational Institution'];
const STAFF_OPTIONS      = ['Luz Reyes', 'Jose Bautista', 'Ana Garcia', 'Carlo Mendoza'];
const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late'] as const;

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const styles: Record<string, string> = {
    confirmed: 'bg-[rgba(15,118,110,0.1)] text-[#0f766e] border border-[rgba(15,118,110,0.2)]',
    pending:   'bg-[rgba(245,158,11,0.1)] text-[#b45309] border border-[rgba(245,158,11,0.2)]',
    cancelled: 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]',
    present:   'bg-[rgba(15,118,110,0.1)] text-[#0f766e] border border-[rgba(15,118,110,0.2)]',
    absent:    'bg-[rgba(172,0,0,0.1)] text-[#AC0000] border border-[rgba(172,0,0,0.2)]',
    late:      'bg-[rgba(245,158,11,0.1)] text-[#b45309] border border-[rgba(245,158,11,0.2)]',
    'pre-booked': 'bg-[rgba(51,65,85,0.1)] text-[#334155] border border-[rgba(51,65,85,0.2)]',
    'walk-in':    'bg-[rgba(99,102,241,0.1)] text-[#6366f1] border border-[rgba(99,102,241,0.2)]',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${styles[lower] ?? styles.pending}`}>
      {status}
    </span>
  );
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-[200] bg-white border border-[rgba(15,118,110,0.3)] rounded-xl shadow-xl px-5 py-4 flex items-start gap-3 max-w-sm">
      <div className="w-8 h-8 bg-[rgba(15,118,110,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[#1e293b] text-[13px]">Success</p>
        <p className="text-[#64748b] text-[12px] mt-0.5 leading-[18px]">{msg}</p>
      </div>
      <button onClick={onClose} className="text-[#94a3b8] hover:text-[#1e293b]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

function ErrorBanner({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="mb-4 bg-[rgba(172,0,0,0.05)] border border-[rgba(172,0,0,0.2)] rounded-lg px-4 py-3 flex items-start gap-3">
      <svg className="w-5 h-5 text-[#AC0000] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <p className="text-[#AC0000] text-[13px] leading-[20px] flex-1">{msg}</p>
      <button onClick={onClose} className="text-[#AC0000] hover:text-[#8b0000]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

function Modal({ title, onClose, children, wide, xl }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean; xl?: boolean }) {
  const sizeClass = xl ? 'max-w-4xl' : wide ? 'max-w-2xl' : 'max-w-lg';
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto ${sizeClass}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] sticky top-0 bg-white z-10">
          <h3 className="font-bold text-[#1e293b] text-[18px]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel, danger, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel?: string; danger?: boolean;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[150] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${danger ? 'bg-[rgba(172,0,0,0.1)]' : 'bg-[rgba(245,158,11,0.1)]'}`}>
          <svg className={`w-5 h-5 ${danger ? 'text-[#AC0000]' : 'text-[#b45309]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="font-bold text-[#1e293b] text-[17px] text-center mb-2">{title}</h3>
        <p className="text-[#64748b] text-[13px] leading-[20px] text-center mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className={`flex-1 text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors ${danger ? 'bg-[#AC0000] hover:bg-[#8b0000]' : 'bg-[#334155] hover:bg-[#1e293b]'}`}>{confirmLabel ?? 'Confirm'}</button>
          <button onClick={onCancel} className="flex-1 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
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

const inputCls = (err?: string) =>
  `w-full border rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none transition-colors ${err ? 'border-[#AC0000] bg-[rgba(172,0,0,0.02)]' : 'border-[#e2e8f0] focus:border-[#334155] bg-white'}`;

// ─── View Booking Modal ───────────────────────────────────────────────────────
function ViewBookingModal({ booking, onClose }: { booking: PublicBooking; onClose: () => void }) {
  return (
    <Modal title="Booking Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-[#f8fafc] rounded-lg p-4 flex items-center justify-between">
          <span className="font-bold text-[#334155] text-[18px]">{booking.ref}</span>
          <StatusBadge status={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Visitor Name', booking.name], ['Email', booking.email || '—'], ['Contact', booking.contact],
            ['Group Type', booking.groupType], ['Group Size', String(booking.groupSize)],
            ['Visit Date', booking.date], ['Time Slot', booking.timeSlot],
            ['Museum', booking.museum], ['Assigned Staff', booking.assignedStaff || '—'],
            ['Booking Type', booking.bookingType || 'Pre-booked'], ['Submitted', booking.submittedAt?.slice(0,10) || '—'],
          ].map(([l, v]) => (
            <div key={l} className={l === 'Museum' ? 'col-span-2' : ''}>
              <p className="font-semibold text-[#64748b] text-[11px] mb-0.5">{l}</p>
              <p className="text-[#1e293b] text-[13px] break-all">{v}</p>
            </div>
          ))}
          {booking.specialRequirements && (
            <div className="col-span-2">
              <p className="font-semibold text-[#64748b] text-[11px] mb-0.5">Special Requirements</p>
              <p className="text-[#1e293b] text-[13px]">{booking.specialRequirements}</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="w-full bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors mt-2">Close</button>
      </div>
    </Modal>
  );
}

// ─── Edit Booking Modal ───────────────────────────────────────────────────────
function EditBookingModal({ booking, onSave, onClose }: {
  booking: PublicBooking;
  onSave: (updates: Partial<PublicBooking>) => void;
  onClose: () => void;
}) {
  // Parse existing contact to initialise dial code and local part
  const initDialAndLocal = (() => {
    const raw = booking.contact ?? '';
    const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
    const match = sorted.find(c => raw.startsWith(c.code));
    if (match) return { code: match.code, local: raw.slice(match.code.length).replace(/\D/g, '') };
    // Legacy local format (09XXXXXXXXX) — default to PH, strip leading 0
    const digits = raw.replace(/\D/g, '');
    return { code: '+63', local: digits.startsWith('0') ? digits.slice(1) : digits };
  })();

  const [editDialCode, setEditDialCode] = useState(initDialAndLocal.code);
  const [editLocalNumber, setEditLocalNumber] = useState(initDialAndLocal.local);

  const [form, setForm] = useState({
    name:               booking.name,
    email:              booking.email,
    groupSize:          String(booking.groupSize),
    groupType:          booking.groupType,
    visitDate:          booking.date,
    timeSlot:           booking.timeSlot,
    assignedStaff:      booking.assignedStaff ?? '',
    status:             booking.status,
    specialRequirements: booking.specialRequirements,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const up = (field: string, val: string) => {
    setForm(p => ({ ...p, [field]: val }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Visitor name is required.';
    const expectedLocal = getMaxLocal(editDialCode);
    if (!editLocalNumber) {
      e.contact = 'Contact number is required.';
    } else if (editLocalNumber.length !== expectedLocal) {
      e.contact = `Enter exactly ${expectedLocal} digit${expectedLocal === 1 ? '' : 's'} after the country code.`;
    } else if (!/^\+[1-9]\d{1,14}$/.test(editDialCode + editLocalNumber)) {
      e.contact = 'Enter a valid contact number.';
    }
    if (!form.groupSize || isNaN(Number(form.groupSize)) || Number(form.groupSize) < 1) e.groupSize = 'Group size must be at least 1.';
    if (!form.visitDate) e.visitDate = 'Visit date is required.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      name:               form.name.trim(),
      email:              form.email.trim(),
      contact:            editDialCode + editLocalNumber,
      groupSize:          Number(form.groupSize),
      groupType:          form.groupType,
      date:               form.visitDate,
      timeSlot:           form.timeSlot,
      assignedStaff:      form.assignedStaff,
      status:             form.status as PublicBooking['status'],
      specialRequirements: form.specialRequirements,
    });
  };

  return (
    <Modal title={`Edit Booking — ${booking.ref}`} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Visitor / Group Name" required error={errors.name}>
              <input value={form.name} onChange={e => up('name', e.target.value)} className={inputCls(errors.name)} placeholder="Full name or group name" />
            </Field>
          </div>
          <Field label="Email Address" error={errors.email}>
            <input type="email" value={form.email} onChange={e => up('email', e.target.value)} className={inputCls(errors.email)} placeholder="visitor@email.com" />
          </Field>
          <Field label="Contact Number" required error={errors.contact}>
            <div className={`flex border rounded-lg overflow-hidden transition-colors ${errors.contact ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus-within:border-[#334155]'}`}>
              <select
                value={editDialCode}
                onChange={e => {
                  const newCode = e.target.value;
                  setEditDialCode(newCode);
                  setEditLocalNumber(n => n.slice(0, getMaxLocal(newCode)));
                  setErrors(p => ({ ...p, contact: '' }));
                }}
                className="shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] px-2 py-2 text-[13px] text-[#1e293b] focus:outline-none cursor-pointer"
                style={{ maxWidth: '140px' }}>
                {COUNTRY_CODES.map(c => (
                  <option key={c.code + c.name} value={c.code}>{c.flag} {c.code} {c.name}</option>
                ))}
              </select>
              <input
                type="tel"
                inputMode="numeric"
                value={editLocalNumber}
                maxLength={getMaxLocal(editDialCode)}
                onChange={e => {
                  let digits = e.target.value.replace(/[^\d]/g, '');
                  if (digits.startsWith('0')) digits = digits.slice(1);
                  setEditLocalNumber(digits.slice(0, getMaxLocal(editDialCode)));
                  setErrors(p => ({ ...p, contact: '' }));
                }}
                placeholder={editDialCode === '+63' ? '9171234567' : 'Local number'}
                className="flex-1 min-w-0 px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none bg-white"
              />
            </div>
            {editLocalNumber && (
              <p className="mt-0.5 text-[#64748b] text-[11px]">Stored as: {editDialCode}{editLocalNumber}</p>
            )}
          </Field>
          <Field label="Group Size" required error={errors.groupSize}>
            <input type="number" min={1} max={9999} value={form.groupSize} onChange={e => up('groupSize', e.target.value)} className={inputCls(errors.groupSize)} />
          </Field>
          <Field label="Group Type">
            <select value={form.groupType} onChange={e => up('groupType', e.target.value)} className={inputCls()}>
              {GROUP_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Visit Date" required error={errors.visitDate}>
            <input type="date" value={form.visitDate} onChange={e => up('visitDate', e.target.value)} className={inputCls(errors.visitDate)} />
          </Field>
          <Field label="Time Slot">
            <select value={form.timeSlot} onChange={e => up('timeSlot', e.target.value)} className={inputCls()}>
              {TIME_SLOTS_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Assigned Staff">
            <select value={form.assignedStaff} onChange={e => up('assignedStaff', e.target.value)} className={inputCls()}>
              <option value="">— None —</option>
              {STAFF_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Booking Status">
            <div className={`${inputCls()} bg-[#f8fafc] text-[#64748b] cursor-not-allowed capitalize`}>
              {form.status}
            </div>
          </Field>
          <div className="col-span-2">
            <Field label="Special Requirements">
              <textarea rows={2} value={form.specialRequirements} onChange={e => up('specialRequirements', e.target.value)} maxLength={300}
                className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none resize-none" />
              <p className="text-right text-[11px] text-[#94a3b8] mt-0.5">{form.specialRequirements.length}/300</p>
            </Field>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="submit" className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">Save Changes</button>
          <button type="button" onClick={onClose} className="px-5 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

// ─── New Booking Modal ────────────────────────────────────────────────────────
const BOOKING_TYPES_STAFF = ['Individual', 'Group', 'School', 'Senior', 'Private Tour'] as const;
const SPECIAL_REQ_ALLOWED = /^[A-Za-z0-9.,!? ]*$/;

function NewBookingModal({ museumName, onSave, onClose }: {
  museumName: string;
  onSave: (b: PublicBooking) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    lastName: '', firstName: '', middleName: '',
    email: '', localNumber: '',
    visitorType: 'Guest' as 'Guest' | 'Registered',
    numberOfVisitors: '',
    bookingType: 'Individual' as string,
    specialRequirements: '',
    visitDate: '', timeSlot: TIME_SLOTS_OPTIONS[0],
    assignedStaff: STAFF_OPTIONS[0],
  });
  const [dialCode, setDialCode] = useState('+63');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    const nameOnly = /^[A-Za-z ]*$/;

    if (!form.lastName.trim())  e.lastName  = 'Last name is required.';
    else if (!nameOnly.test(form.lastName.trim()))  e.lastName  = 'Last name must contain letters only.';

    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    else if (!nameOnly.test(form.firstName.trim())) e.firstName = 'First name must contain letters only.';

    if (form.middleName.trim() && !nameOnly.test(form.middleName.trim())) e.middleName = 'Middle name must contain letters only.';

    if (form.email.trim()) {
      if (!/^[A-Za-z0-9.@_-]{1,100}$/.test(form.email.trim())) e.email = 'Email must only contain letters, digits, ., @, _, or -.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    }

    const localDigits = form.localNumber.replace(/\D/g, '');
    const expectedLocal = getMaxLocal(dialCode);
    if (!localDigits) {
      e.contact = 'Contact number is required.';
    } else if (localDigits.length !== expectedLocal) {
      e.contact = `Enter exactly ${expectedLocal} digit${expectedLocal === 1 ? '' : 's'} after the country code.`;
    } else if (!/^\+[1-9]\d{1,14}$/.test(dialCode + localDigits)) {
      e.contact = 'Enter a valid contact number.';
    }

    const n = Number(form.numberOfVisitors);
    if (!form.numberOfVisitors)                    e.numberOfVisitors = 'Number of visitors is required.';
    else if (!Number.isInteger(n) || n < 1)        e.numberOfVisitors = 'Must be at least 1 visitor.';
    else if (n > 9999)                             e.numberOfVisitors = 'Cannot exceed 9,999 visitors.';

    if (!form.visitDate) e.visitDate = 'Visit date is required.';

    if (form.specialRequirements.trim() && !SPECIAL_REQ_ALLOWED.test(form.specialRequirements))
      e.specialRequirements = 'Only letters, digits, and . , ! ? are allowed.';

    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const e164 = dialCode + form.localNumber.replace(/\D/g, '');
    const fullName = [form.firstName.trim(), form.middleName.trim(), form.lastName.trim()].filter(Boolean).join(' ');
    const ref = 'NCM-' + Math.floor(100000 + Math.random() * 900000);
    onSave({
      ref, museum: museumName, date: form.visitDate, timeSlot: form.timeSlot,
      groupSize: Number(form.numberOfVisitors), name: fullName,
      email: form.email.trim(), contact: e164,
      groupType: form.bookingType, specialRequirements: form.specialRequirements.trim(),
      status: 'confirmed', submittedAt: new Date().toISOString(),
      assignedStaff: form.assignedStaff, bookingType: 'Pre-booked', visitorType: form.visitorType,
    });
  };

  const errCls = 'mt-1 text-[#AC0000] text-[12px]';

  return (
    <Modal title={`New Booking — ${museumName}`} onClose={onClose} wide>

      {/* Staff notice */}
      <div className="bg-[#f1f5f9] border-l-4 border-[#334155] rounded-lg p-4 mb-6">
        <p className="font-semibold text-[#1e293b] text-[13px] mb-1">On-Site Booking — Staff Assisted</p>
        <p className="text-[#64748b] text-[13px] leading-[22px]">Fill in the visitor's details below. This booking will be recorded as a pre-booked, staff-assisted entry and the visitor will be issued a booking reference upon completion.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Visitor Information ── */}
        <div>
          <p className="font-semibold text-[#64748b] text-[11px] uppercase tracking-widest mb-3">Visitor Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Last Name <span className="text-[#AC0000]">*</span></label>
              <input maxLength={50} value={form.lastName}
                onChange={e => setField('lastName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                placeholder="e.g. Dela Cruz" className={inputCls(errors.lastName)} />
              {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">First Name <span className="text-[#AC0000]">*</span></label>
              <input maxLength={50} value={form.firstName}
                onChange={e => setField('firstName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                placeholder="e.g. Juan" className={inputCls(errors.firstName)} />
              {errors.firstName && <p className={errCls}>{errors.firstName}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Middle Name <span className="text-[#64748b] font-normal">(optional)</span></label>
              <input maxLength={50} value={form.middleName}
                onChange={e => setField('middleName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                placeholder="e.g. Santos" className={inputCls(errors.middleName)} />
              {errors.middleName && <p className={errCls}>{errors.middleName}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Visitor Type <span className="text-[#AC0000]">*</span></label>
              <select value={form.visitorType}
                onChange={e => setField('visitorType', e.target.value as 'Guest' | 'Registered')}
                className={inputCls()}>
                <option value="Guest">Guest</option>
                <option value="Registered">Registered</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">
                Contact Number <span className="text-[#AC0000]">*</span>{' '}
                <span className="text-[#64748b] font-normal text-[12px]">(International format)</span>
              </label>
              <div className={`flex border rounded-lg overflow-hidden transition-colors ${errors.contact ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus-within:border-[#334155]'}`}>
                <select value={dialCode}
                  onChange={e => {
                    const newCode = e.target.value;
                    setDialCode(newCode);
                    setForm(p => ({ ...p, localNumber: p.localNumber.slice(0, getMaxLocal(newCode)) }));
                    setErrors(p => ({ ...p, contact: '' }));
                  }}
                  className="shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] px-2 py-2 text-[13px] text-[#1e293b] focus:outline-none cursor-pointer"
                  style={{ maxWidth: '140px' }}>
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code + c.name} value={c.code}>{c.flag} {c.code} {c.name}</option>
                  ))}
                </select>
                <input type="tel" inputMode="numeric" value={form.localNumber}
                  maxLength={getMaxLocal(dialCode)}
                  onChange={e => {
                    let digits = e.target.value.replace(/[^\d]/g, '');
                    if (digits.startsWith('0')) digits = digits.slice(1);
                    setForm(p => ({ ...p, localNumber: digits.slice(0, getMaxLocal(dialCode)) }));
                    setErrors(p => ({ ...p, contact: '' }));
                  }}
                  placeholder={dialCode === '+63' ? '9171234567' : 'Local number'}
                  className="flex-1 min-w-0 px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none bg-white" />
              </div>
              {dialCode && form.localNumber && (
                <p className="mt-0.5 text-[#64748b] text-[11px]">Stored as: {dialCode}{form.localNumber.replace(/\D/g, '')}</p>
              )}
              {errors.contact && <p className={errCls}>{errors.contact}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Email Address <span className="text-[#64748b] font-normal">(optional)</span></label>
              <input type="email" maxLength={100} value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                placeholder="visitor@example.com" className={inputCls(errors.email)} />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>

          </div>
        </div>

        {/* ── Booking Details ── */}
        <div>
          <p className="font-semibold text-[#64748b] text-[11px] uppercase tracking-widest mb-3">Booking Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Number of Visitors <span className="text-[#AC0000]">*</span></label>
              <input type="number" min={1} max={9999} value={form.numberOfVisitors}
                onChange={e => { setForm(p => ({ ...p, numberOfVisitors: e.target.value })); setErrors(p => ({ ...p, numberOfVisitors: '' })); }}
                placeholder="1 – 9999" className={inputCls(errors.numberOfVisitors)} />
              {errors.numberOfVisitors && <p className={errCls}>{errors.numberOfVisitors}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Booking Type <span className="text-[#AC0000]">*</span></label>
              <select value={form.bookingType} onChange={e => setField('bookingType', e.target.value)} className={inputCls()}>
                {BOOKING_TYPES_STAFF.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Visit Date <span className="text-[#AC0000]">*</span></label>
              <input type="date" value={form.visitDate}
                onChange={e => { setForm(p => ({ ...p, visitDate: e.target.value })); setErrors(p => ({ ...p, visitDate: '' })); }}
                className={inputCls(errors.visitDate)} />
              {errors.visitDate && <p className={errCls}>{errors.visitDate}</p>}
            </div>

            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Time Slot <span className="text-[#AC0000]">*</span></label>
              <select value={form.timeSlot} onChange={e => setField('timeSlot', e.target.value)} className={inputCls()}>
                {TIME_SLOTS_OPTIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">
                Special Request <span className="text-[#64748b] font-normal">(optional)</span>
              </label>
              <textarea rows={3} value={form.specialRequirements}
                onChange={e => {
                  const val = e.target.value;
                  if (SPECIAL_REQ_ALLOWED.test(val) && val.length <= 300) {
                    setForm(p => ({ ...p, specialRequirements: val }));
                    setErrors(p => ({ ...p, specialRequirements: '' }));
                  }
                }}
                placeholder="Accessibility needs, group arrangements, or any other special requests..."
                className={`w-full border rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none resize-none transition-colors ${errors.specialRequirements ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus:border-[#334155]'}`} />
              <div className="flex justify-between mt-0.5">
                {errors.specialRequirements ? <p className={errCls}>{errors.specialRequirements}</p> : <span />}
                <span className={`text-[11px] ${form.specialRequirements.length > 280 ? 'text-[#AC0000]' : 'text-[#94a3b8]'}`}>
                  {form.specialRequirements.length}/300
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Staff Details ── */}
        <div>
          <p className="font-semibold text-[#64748b] text-[11px] uppercase tracking-widest mb-3">Staff Details</p>
          <div>
            <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Assigned Staff <span className="text-[#AC0000]">*</span></label>
            <select value={form.assignedStaff} onChange={e => setField('assignedStaff', e.target.value)} className={inputCls()}>
              {STAFF_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            Confirm Booking
          </button>
          <button type="button" onClick={onClose} className="px-6 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
            Cancel
          </button>
        </div>

      </form>
    </Modal>
  );
}

// ─── Log Arrival Modal ────────────────────────────────────────────────────────
function LogArrivalModal({ booking, onLog, onClose }: {
  booking: PublicBooking;
  onLog: (entry: Omit<LogEntry, 'id'>) => void;
  onClose: () => void;
}) {
  const now = new Date();
  const defaultTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const today = now.toISOString().slice(0, 10);
  const [arrivalTime, setArrivalTime] = useState(defaultTime);
  const [departureTime, setDepartureTime] = useState('');
  const [staffName, setStaffName]     = useState(booking.assignedStaff ?? STAFF_OPTIONS[0]);
  const [attendanceStatus, setAttendanceStatus] = useState<'Present' | 'Absent' | 'Late'>('Present');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arrivalTime) { setError('Arrival time is required.'); return; }
    onLog({
      bookingRef: booking.ref,
      museum: booking.museum,
      visitDate: booking.date,
      timeSlot: booking.timeSlot,
      visitorName: booking.name,
      groupSize: booking.groupSize,
      entryType: 'Pre-booked',
      arrivalTime,
      arrivalDate: today,
      departureTime: departureTime || undefined,
      attendanceStatus,
      recordedBy: staffName,
      notes: notes.trim() || undefined,
      isComplete: !!departureTime,
    });
  };

  return (
    <Modal title="Log Visitor Arrival" onClose={onClose}>
      <div className="bg-[#f1f5f9] rounded-lg p-4 mb-5">
        <p className="font-semibold text-[#1e293b] text-[13px]">{booking.ref} — {booking.name}</p>
        <p className="text-[#64748b] text-[13px]">{booking.museum} · {booking.groupType} · {booking.groupSize} visitors · {booking.timeSlot}</p>
      </div>
      <form onSubmit={handleLog} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Arrival Time" required error={error}>
            <input type="time" value={arrivalTime} onChange={e => { setArrivalTime(e.target.value); setError(''); }} className={inputCls(error)} />
          </Field>
          <Field label="Att. Status">
            <select value={attendanceStatus} onChange={e => setAttendanceStatus(e.target.value as typeof attendanceStatus)} className={inputCls()}>
              {ATTENDANCE_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Departure Time (optional)">
            <input type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} className={inputCls()} />
          </Field>
        </div>
        <Field label="Recording Staff">
          <select value={staffName} onChange={e => setStaffName(e.target.value)} className={inputCls()}>
            {STAFF_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Notes (optional)">
          <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} maxLength={300} placeholder="Any notes about this arrival…"
            className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none resize-none" />
        </Field>
        <div className="flex gap-3 pt-1">
          <button type="submit" className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">Record Arrival</button>
          <button type="button" onClick={onClose} className="px-5 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Walk-in Entry Modal ──────────────────────────────────────────────────────
function generateWalkInId(): string {
  return 'WLK-' + String(Math.floor(Math.random() * 90000) + 10000);
}

function WalkInModal({ museumName, onSave, onClose }: {
  museumName: string;
  onSave: (entry: Omit<LogEntry, 'id'>) => void;
  onClose: () => void;
}) {
  const now   = new Date();
  const today = now.toISOString().slice(0, 10);
  const defaultTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const { overrides, getBookedCount } = useScheduling();

  const [form, setForm] = useState({
    lastName:         '',
    firstName:        '',
    middleName:       '',
    contactNumber:    '',
    emailAddress:     '',
    numberOfVisitors: '',
    scheduleId:       '',
    arrivalTime:      defaultTime,
    attendanceStatus: 'Present' as 'Present' | 'Absent' | 'Late',
    staffName:        '',
  });

  const visitorCount = Number(form.numberOfVisitors) || 0;
  const scheduleOptions = useMemo(() =>
    DEFAULT_TIME_SLOTS.map(ts => {
      const key = `${museumName}||${today}||${ts}`;
      const override = overrides[key];
      const capacity = override?.capacity ?? 40;
      const booked = getBookedCount(museumName, today, ts);
      const remaining = capacity - booked;
      return {
        id:         ts,
        scheduleId: override?.scheduleId,
        timeSlot:   ts,
        capacity,
        booked,
        remaining,
        label:      `${ts} · ${remaining} of ${capacity} spots remaining`,
      };
    }).filter(s => s.remaining >= visitorCount),
  [overrides, getBookedCount, museumName, today, visitorCount]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const up = (f: string, v: string) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => ({ ...p, [f]: '' }));
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.lastName.trim())  e.lastName  = 'Last name is required.';
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    {
      const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
      const matched = sorted.find(c => form.contactNumber.startsWith(c.code));
      const wCode = matched?.code ?? '+63';
      const wLocal = (matched ? form.contactNumber.slice(wCode.length) : form.contactNumber).replace(/\D/g, '');
      const expectedLocal = getMaxLocal(wCode);
      if (!wLocal) {
        e.contactNumber = 'Contact number is required.';
      } else if (wLocal.length !== expectedLocal) {
        e.contactNumber = `Enter exactly ${expectedLocal} digit${expectedLocal === 1 ? '' : 's'} after the country code.`;
      } else if (!/^\+[1-9]\d{1,14}$/.test(wCode + wLocal)) {
        e.contactNumber = 'Enter a valid contact number.';
      }
    }
    if (form.emailAddress && !/^[A-Za-z0-9.@_-]{1,100}$/.test(form.emailAddress))
      e.emailAddress = 'Invalid email format.';
    const n = Number(form.numberOfVisitors);
    if (!form.numberOfVisitors || isNaN(n) || n < 1 || n > 9999)
      e.numberOfVisitors = 'Must be a whole number between 1 and 9999.';
    if (!form.scheduleId)
      e.scheduleId = 'Please select a visit schedule.';
    if (!form.arrivalTime) e.arrivalTime = 'Arrival time is required.';
    if (!form.staffName) e.staffName = 'Recording staff is required.';
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const selected         = scheduleOptions.find(s => s.id === form.scheduleId);
    const walkInId         = generateWalkInId();
    const resolvedScheduleId = selected?.scheduleId || form.scheduleId;
    const registrationDate = today;
    const registrationTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const fullName         = [form.firstName.trim(), form.middleName.trim(), form.lastName.trim()].filter(Boolean).join(' ');

    onSave({
      bookingRef:        walkInId,
      museum:            museumName,
      visitDate:         today,
      timeSlot:          selected?.timeSlot ?? form.scheduleId,
      visitorName:       fullName,
      groupSize:         Number(form.numberOfVisitors),
      entryType:         'Walk-in',
      arrivalTime:       form.arrivalTime,
      arrivalDate:       today,
      attendanceStatus:  form.attendanceStatus,
      recordedBy:        form.staffName,
      isComplete:        false,
      // WALK_IN_VISITOR entity fields
      walkInId,
      lastName:          form.lastName.trim(),
      firstName:         form.firstName.trim(),
      middleName:        form.middleName.trim() || undefined,
      contactNumber:     form.contactNumber,
      emailAddress:      form.emailAddress.trim() || undefined,
      numberOfVisitors:  Number(form.numberOfVisitors),
      scheduleId:        resolvedScheduleId,
      registrationDate,
      registrationTime,
    });
  };

  return (
    <Modal title={`Walk-in Entry — ${museumName}`} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Auto-generated reference banner */}

        {/* Visitor Information */}
        <div>
          <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-widest mb-2">Visitor Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Last Name" required error={errors.lastName}>
              <input
                value={form.lastName}
                onChange={e => up('lastName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                placeholder="e.g. Santos"
                maxLength={50}
                className={inputCls(errors.lastName)}
              />
            </Field>
            <Field label="First Name" required error={errors.firstName}>
              <input
                value={form.firstName}
                onChange={e => up('firstName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                placeholder="e.g. Maria"
                maxLength={50}
                className={inputCls(errors.firstName)}
              />
            </Field>
            <Field label="Middle Name" error={errors.middleName}>
              <input
                value={form.middleName}
                onChange={e => up('middleName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                placeholder="e.g. Cruz (optional)"
                maxLength={50}
                className={inputCls()}
              />
            </Field>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-widest mb-2">Contact Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Contact Number" required error={errors.contactNumber}>
              {(() => {
                const val = form.contactNumber;
                const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
                const matched = sorted.find(c => val.startsWith(c.code));
                const dialCode = matched?.code ?? '+63';
                const localPart = matched ? val.slice(dialCode.length) : '';
                return (
                  <>
                    <div className={`flex border rounded-lg overflow-hidden transition-colors ${errors.contactNumber ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus-within:border-[#334155]'}`}>
                      <select
                        value={dialCode}
                        onChange={e => {
                          const code = e.target.value;
                          let trimmed = localPart.replace(/^0/, '').slice(0, getMaxLocal(code));
                          up('contactNumber', code + trimmed);
                        }}
                        className="shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] px-2 py-2 text-[13px] text-[#1e293b] focus:outline-none cursor-pointer"
                        style={{ maxWidth: '140px' }}>
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code + c.name} value={c.code}>{c.flag} {c.code} {c.name}</option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={localPart}
                        maxLength={getMaxLocal(dialCode)}
                        onChange={e => {
                          let digits = e.target.value.replace(/[^\d]/g, '');
                          if (digits.startsWith('0')) digits = digits.slice(1);
                          up('contactNumber', dialCode + digits.slice(0, getMaxLocal(dialCode)));
                        }}
                        placeholder={dialCode === '+63' ? '9171234567' : 'Local number'}
                        className="flex-1 min-w-0 px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none bg-white"
                      />
                    </div>
                    {localPart && (
                      <p className="mt-0.5 text-[#64748b] text-[11px]">Stored as: {dialCode}{localPart}</p>
                    )}
                  </>
                );
              })()}
            </Field>
            <Field label="Email Address" error={errors.emailAddress}>
              <input
                type="email"
                value={form.emailAddress}
                onChange={e => up('emailAddress', e.target.value.slice(0, 100))}
                placeholder="e.g. visitor@email.com (optional)"
                maxLength={100}
                className={inputCls(errors.emailAddress)}
              />
            </Field>
          </div>
        </div>

        {/* Visit Details */}
        <div>
          <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-widest mb-2">Visit Details</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Number of Visitors" required error={errors.numberOfVisitors}>
              <input
                type="number"
                min={1}
                max={9999}
                value={form.numberOfVisitors}
                onChange={e => up('numberOfVisitors', e.target.value)}
                placeholder="e.g. 3"
                className={inputCls(errors.numberOfVisitors)}
              />
            </Field>
            <Field label="Arrival Time" required error={errors.arrivalTime}>
              <div className="flex gap-2">
                <span className="flex items-center px-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[13px] text-[#64748b] whitespace-nowrap select-none">
                  {today}
                </span>
                <input type="time" value={form.arrivalTime} onChange={e => up('arrivalTime', e.target.value)} className={`flex-1 ${inputCls(errors.arrivalTime)}`} />
              </div>
            </Field>
            <div className="col-span-2">
              <Field label="Schedule ID" required error={errors.scheduleId}>
                <select
                  value={form.scheduleId}
                  onChange={e => up('scheduleId', e.target.value)}
                  className={inputCls(errors.scheduleId)}
                >
                  <option value="">Select a visit schedule…</option>
                  {scheduleOptions.length === 0 && (
                    <option disabled>No open slots available for today</option>
                  )}
                  {scheduleOptions.map(s => (
                    <option key={s.id} value={s.id}>{s.id} — {s.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* Recording Staff */}
        <Field label="Recording Staff" required error={errors.staffName}>
          <select value={form.staffName} onChange={e => up('staffName', e.target.value)} className={inputCls(errors.staffName)}>
            <option value="">Select staff…</option>
            {STAFF_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>

        <div className="flex gap-3 pt-1">
          <button type="submit" className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">
            Save Walk-in Entry
          </button>
          <button type="button" onClick={onClose} className="px-5 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── View Logbook Entry Modal ─────────────────────────────────────────────────
function ViewLogModal({ entry, onClose }: { entry: LogEntry; onClose: () => void }) {
  return (
    <Modal title="Logbook Entry Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-[#f8fafc] rounded-lg p-4 flex items-center justify-between">
          <span className="font-bold text-[#334155] text-[16px]">{entry.bookingRef}</span>
          <div className="flex gap-2">
            <StatusBadge status={entry.entryType} />
            <StatusBadge status={entry.attendanceStatus} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Visitor Name', entry.visitorName], ['Museum', entry.museum],
            ['Visit Date', entry.visitDate], ['Time Slot', entry.timeSlot],
            ['Group Size', String(entry.groupSize)], ['Entry Type', entry.entryType],
            ['Arrival Time', entry.arrivalTime], ['Departure Time', entry.departureTime ?? '—'],
            ['Attendance Status', entry.attendanceStatus], ['Recorded By', entry.recordedBy],
            ['Arrival Date', entry.arrivalDate], ['Status', entry.isComplete ? 'Complete' : 'Incomplete'],
          ].map(([l, v]) => (
            <div key={l} className={l === 'Museum' ? 'col-span-2' : ''}>
              <p className="font-semibold text-[#64748b] text-[11px] mb-0.5">{l}</p>
              <p className="text-[#1e293b] text-[13px]">{v}</p>
            </div>
          ))}
          {entry.notes && (
            <div className="col-span-2">
              <p className="font-semibold text-[#64748b] text-[11px] mb-0.5">Notes</p>
              <p className="text-[#1e293b] text-[13px]">{entry.notes}</p>
            </div>
          )}
        </div>
        <button onClick={onClose} className="w-full bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors mt-2">Close</button>
      </div>
    </Modal>
  );
}

// ─── Edit Logbook Entry Modal ─────────────────────────────────────────────────
function EditLogModal({ entry, onSave, onClose }: {
  entry: LogEntry;
  onSave: (updates: Partial<LogEntry>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    arrivalTime:      entry.arrivalTime,
    departureTime:    entry.departureTime ?? '',
    attendanceStatus: entry.attendanceStatus,
    recordedBy:       entry.recordedBy,
    notes:            entry.notes ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const up = (f: string, v: string) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.arrivalTime) errs.arrivalTime = 'Arrival time is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      arrivalTime:      form.arrivalTime,
      departureTime:    form.departureTime || undefined,
      attendanceStatus: form.attendanceStatus as LogEntry['attendanceStatus'],
      recordedBy:       form.recordedBy,
      notes:            form.notes.trim() || undefined,
      isComplete:       !!form.departureTime,
    });
  };

  return (
    <Modal title={`Edit Logbook — ${entry.bookingRef}`} onClose={onClose}>
      <div className="bg-[#f1f5f9] rounded-lg p-3 mb-4">
        <p className="font-semibold text-[#1e293b] text-[13px]">{entry.visitorName} — {entry.museum}</p>
        <p className="text-[#64748b] text-[12px]">{entry.visitDate} · {entry.timeSlot} · {entry.groupSize} visitors</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Arrival Time" required error={errors.arrivalTime}>
            <input type="time" value={form.arrivalTime} onChange={e => up('arrivalTime', e.target.value)} className={inputCls(errors.arrivalTime)} />
          </Field>
          <Field label="Departure Time">
            <input type="time" value={form.departureTime} onChange={e => up('departureTime', e.target.value)} className={inputCls()} />
          </Field>
          <Field label="Attendance Status">
            <select value={form.attendanceStatus} onChange={e => up('attendanceStatus', e.target.value)} className={inputCls()}>
              {ATTENDANCE_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Recorded By">
            <select value={form.recordedBy} onChange={e => up('recordedBy', e.target.value)} className={inputCls()}>
              {STAFF_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Notes (optional)">
          <textarea rows={2} value={form.notes} onChange={e => up('notes', e.target.value)} maxLength={300}
            className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none resize-none" />
        </Field>
        <div className="flex gap-3 pt-1">
          <button type="submit" className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">Save Changes</button>
          <button type="button" onClick={onClose} className="px-5 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Staff Dashboard ──────────────────────────────────────────────────────────
function StaffDashboard({ onNavigate, museumName }: { onNavigate: (tab: StaffTab) => void; museumName: string }) {
  const { bookings, logEntries } = useScheduling();
  const today = new Date().toISOString().slice(0, 10);

  const todayBookings    = bookings.filter(b => b.museum === museumName && b.date === today && b.status !== 'cancelled');
  const walkInsToday     = logEntries.filter(e => e.museum === museumName && e.arrivalDate === today && e.entryType === 'Walk-in');
  const incompleteEntries = logEntries.filter(e => e.museum === museumName && !e.departureTime);
  const onSiteFromLogs   = logEntries
    .filter(e => e.museum === museumName && e.arrivalDate === today && (e.attendanceStatus === 'Present' || e.attendanceStatus === 'Late') && !e.departureTime)
    .reduce((s, e) => s + e.groupSize, 0);

  const stats = [
    { value: String(todayBookings.length), label: "Today's Bookings" },
    { value: String(onSiteFromLogs),        label: 'On-Site Visitors' },
    { value: String(incompleteEntries.length), label: 'Pending Logbook Entries', alert: incompleteEntries.length > 0 },
    { value: String(walkInsToday.length),   label: "Today's Walk-ins" },
  ];

  return (
    <div className="p-8">
      <h2 className="font-bold text-[#1e293b] text-[28px] leading-[36px] mb-2">Staff Dashboard</h2>
      <p className="text-[#64748b] text-[16px] leading-[29px] mb-8">
        Today's overview for <strong>{museumName}</strong> — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={s.label} className={`bg-[#334155] rounded-xl p-6 flex flex-col items-center ${s.alert ? 'border-l-4 border-[#AC0000]' : ''}`}>
            <span className="font-bold text-[30px] leading-[36px] text-white">{s.value}</span>
            <span className="font-semibold text-[13px] leading-[20px] text-[#d1d5dc] mt-1 text-center">{s.label}</span>
            {s.alert && <span className="mt-2 px-2 py-0.5 rounded-full bg-[rgba(172,0,0,0.2)] text-[#fca5a5] text-[10px] font-semibold">Needs Attention</span>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "View Today's Bookings", tab: 'bookings' as StaffTab, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          { label: 'Open Logbook',          tab: 'logbook'  as StaffTab, icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' },
          { label: 'Attendance Reports',    tab: 'reports'  as StaffTab, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        ].map(({ label, tab, icon }) => (
          <button key={tab} onClick={() => onNavigate(tab)} className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-left hover:shadow-md hover:border-[#334155] transition-all duration-200 group">
            <div className="w-10 h-10 bg-[rgba(51,65,85,0.1)] rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
            </div>
            <span className="font-semibold text-[#1e293b] text-[14px]">{label}</span>
            <svg className="w-4 h-4 text-[#64748b] mt-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>

      {incompleteEntries.length > 0 && (
        <div className="bg-white border-l-4 border-[#AC0000] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 bg-[rgba(172,0,0,0.1)] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[#AC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
            <span className="font-semibold text-[#1e293b] text-[14px]">Incomplete Logbook Entries ({incompleteEntries.length})</span>
          </div>
          <p className="text-[#64748b] text-[13px] leading-[22.75px]">
            {incompleteEntries.slice(0,2).map(e => `${e.bookingRef} (${e.visitorName})`).join(', ')} — missing departure time. Please complete the logbook entries.
          </p>
          <button onClick={() => onNavigate('logbook')} className="mt-3 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-9 px-4 rounded-[6px] transition-colors">Go to Logbook</button>
        </div>
      )}

      {todayBookings.length > 0 && (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm mt-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-8 bg-[rgba(15,118,110,0.1)] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </span>
            <span className="font-semibold text-[#1e293b] text-[14px]">Today's Bookings</span>
          </div>
          <p className="text-[#64748b] text-[13px] leading-[22.75px]">
            {todayBookings.length} booking{todayBookings.length !== 1 ? 's' : ''} at {museumName} today, totalling {todayBookings.reduce((s, b) => s + b.groupSize, 0)} visitors.
            {todayBookings[0] && ` Next: ${todayBookings[0].name} (${todayBookings[0].groupType}, ${todayBookings[0].groupSize} visitors) at ${todayBookings[0].timeSlot}.`}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Booking Management ───────────────────────────────────────────────────────
function BookingManagement({ museumName }: { museumName: string }) {
  const scheduling = useScheduling();
  const museumBookings = scheduling.bookings.filter(b => b.museum === museumName);

  const [search,          setSearch]          = useState('');
  const [statusFilter,    setStatusFilter]    = useState('');
  const [dateFilter,      setDateFilter]      = useState('');
  const [groupTypeFilter, setGroupTypeFilter] = useState('');

  type ModalMode = 'new' | 'view' | 'edit' | 'arrival' | 'cancel' | 'delete' | null;
  const [modal,         setModal]         = useState<ModalMode>(null);
  const [activeBooking, setActiveBooking] = useState<PublicBooking | null>(null);
  const [toast,         setToast]         = useState('');
  const [errorMsg,      setErrorMsg]      = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const filtered = museumBookings.filter(b =>
    (!search || b.name.toLowerCase().includes(search.toLowerCase()) || b.ref.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter    || b.status === statusFilter) &&
    (!dateFilter      || b.date === dateFilter) &&
    (!groupTypeFilter || b.groupType === groupTypeFilter)
  );

  const clearFilters = () => { setSearch(''); setStatusFilter(''); setDateFilter(''); setGroupTypeFilter(''); };
  const hasFilters   = !!(search || statusFilter || dateFilter || groupTypeFilter);

  const open = (mode: ModalMode, b?: PublicBooking) => { setActiveBooking(b ?? null); setModal(mode); setErrorMsg(''); };
  const closeModal = () => { setModal(null); setActiveBooking(null); setErrorMsg(''); };

  const handleNewSave = (b: PublicBooking) => {
    scheduling.addBooking(b);
    scheduling.addNotification({
      notificationType: 'Booking Confirmation',
      bookingId: b.ref,
      museum: museumName,
      recipient: b.email || b.contact,
      channel: b.email ? 'Email' : 'SMS',
      notificationStatus: 'Sent',
      message: `Booking ${b.ref} confirmed for ${b.name} — ${b.date}, ${b.timeSlot}.`,
    });
    closeModal();
    showToast(`Booking ${b.ref} created successfully for ${b.name}.`);
  };

  const handleEditSave = (updates: Partial<PublicBooking>) => {
    if (!activeBooking) return;
    scheduling.updateBooking(activeBooking.ref, updates);
    if (updates.status && updates.status !== activeBooking.status) {
      scheduling.addNotification({
        notificationType: 'Booking Update',
        bookingId: activeBooking.ref,
        museum: museumName,
        recipient: activeBooking.email || activeBooking.contact,
        channel: activeBooking.email ? 'Email' : 'SMS',
        notificationStatus: 'Sent',
        message: `Booking ${activeBooking.ref} status updated to ${updates.status}.`,
      });
    }
    closeModal();
    showToast(`Booking ${activeBooking.ref} updated successfully.`);
  };

  const handleCancel = () => {
    if (!activeBooking) return;
    scheduling.cancelBooking(activeBooking.ref);
    scheduling.addNotification({
      notificationType: 'Booking Update',
      bookingId: activeBooking.ref,
      museum: museumName,
      recipient: activeBooking.email || activeBooking.contact,
      channel: activeBooking.email ? 'Email' : 'SMS',
      notificationStatus: 'Sent',
      message: `Booking ${activeBooking.ref} has been cancelled by museum staff.`,
    });
    closeModal();
    showToast(`Booking ${activeBooking.ref} has been cancelled.`);
  };

  const handleDelete = () => {
    if (!activeBooking) return;
    scheduling.deleteBooking(activeBooking.ref);
    closeModal();
    showToast(`Booking ${activeBooking.ref} has been deleted.`);
  };

  const handleArrivalLog = (entry: Omit<typeof scheduling.logEntries[0], 'id'>) => {
    scheduling.addLogEntry(entry);
    if (!activeBooking) return;
    scheduling.updateBooking(activeBooking.ref, { assignedStaff: entry.recordedBy });
    scheduling.addNotification({
      notificationType: 'Booking Update',
      bookingId: activeBooking.ref,
      museum: museumName,
      recipient: activeBooking.email || activeBooking.contact,
      channel: 'System Alert',
      notificationStatus: 'Sent',
      message: `Arrival logged for ${activeBooking.name} at ${entry.arrivalTime}.`,
    });
    closeModal();
    showToast(`Arrival recorded for ${entry.visitorName} at ${entry.arrivalTime}.`);
  };

  const uniqueGroupTypes = [...new Set(museumBookings.map(b => b.groupType))];

  return (
    <div className="p-8">
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-[#1e293b] text-[22px] leading-[28px]">Booking Management</h2>
          <p className="text-[#64748b] text-[14px] mt-1">All bookings for <strong>{museumName}</strong> — {museumBookings.length} total</p>
        </div>
        <button onClick={() => open('new')} className="bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 px-5 rounded-[6px] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Booking
        </button>
      </div>

      {errorMsg && <ErrorBanner msg={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Filters */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Visitor name or reference…" className="w-full pl-9 pr-3 py-2 border border-[#e2e8f0] focus:border-[#334155] rounded-lg text-[13px] text-[#1e293b] focus:outline-none" />
            </div>
          </div>
          <div className="min-w-[155px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Visit Date</label>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none" />
          </div>
          <div className="min-w-[145px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Group Type</label>
            <select value={groupTypeFilter} onChange={e => setGroupTypeFilter(e.target.value)} className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none">
              <option value="">All Types</option>
              {uniqueGroupTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="min-w-[125px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none">
              <option value="">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          {hasFilters && <button onClick={clearFilters} className="h-[38px] px-4 border border-[#e2e8f0] rounded-lg font-semibold text-[#64748b] text-[12px] bg-white hover:bg-[#f8fafc] self-end whitespace-nowrap">Clear</button>}
        </div>
        <p className="mt-2 text-[#64748b] text-[12px]">Showing {filtered.length} of {museumBookings.length} bookings{hasFilters && <span className="ml-1 text-[#334155] font-semibold">— filtered</span>}</p>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {['Reference', 'Visitor Name', 'Group Type', 'Size', 'Date', 'Time Slot', 'Staff', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold text-[#64748b] text-[12px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-[#cbd5e1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <p className="text-[#64748b] text-[13px]">No bookings match the selected filters.</p>
                    {hasFilters && <button onClick={clearFilters} className="text-[#334155] font-semibold text-[12px] underline">Clear filters</button>}
                  </div>
                </td></tr>
              ) : filtered.map(b => (
                <tr key={b.ref} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-4 py-3 font-semibold text-[#334155] text-[13px] whitespace-nowrap">{b.ref}</td>
                  <td className="px-4 py-3 text-[#1e293b] text-[13px] whitespace-nowrap">{b.name}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px] whitespace-nowrap">{b.groupType}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px]">{b.groupSize}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px] whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px] whitespace-nowrap">{b.timeSlot}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px] whitespace-nowrap">{b.assignedStaff || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status.charAt(0).toUpperCase() + b.status.slice(1)} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => open('view', b)} className="h-7 px-2 border border-[#e2e8f0] rounded-md font-semibold text-[#1e293b] text-[11px] bg-white hover:bg-[#f8fafc]">View</button>
                      <button onClick={() => open('edit', b)} className="h-7 px-2 border border-[#e2e8f0] rounded-md font-semibold text-[#1e293b] text-[11px] bg-white hover:bg-[#f8fafc]">Edit</button>
                      {b.status === 'confirmed' && (
                        <button onClick={() => open('arrival', b)} className="h-7 px-2 border border-[rgba(15,118,110,0.3)] rounded-md font-semibold text-[#0f766e] text-[11px] bg-white hover:bg-[rgba(15,118,110,0.05)] whitespace-nowrap">Log Arrival</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'new'     && <NewBookingModal museumName={museumName} onSave={handleNewSave} onClose={closeModal} />}
      {modal === 'view'    && activeBooking && <ViewBookingModal booking={activeBooking} onClose={closeModal} />}
      {modal === 'edit'    && activeBooking && <EditBookingModal booking={activeBooking} onSave={handleEditSave} onClose={closeModal} />}
      {modal === 'arrival' && activeBooking && <LogArrivalModal booking={activeBooking} onLog={handleArrivalLog} onClose={closeModal} />}
      {modal === 'cancel'  && activeBooking && (
        <ConfirmModal
          title="Cancel Booking?"
          message={`Are you sure you want to cancel booking ${activeBooking.ref} for ${activeBooking.name}? The visitor will be notified. This action cannot be undone.`}
          confirmLabel="Confirm Cancellation"
          danger
          onConfirm={handleCancel}
          onCancel={closeModal}
        />
      )}
      {modal === 'delete'  && activeBooking && (
        <ConfirmModal
          title="Delete Booking?"
          message={`Permanently delete booking ${activeBooking.ref} for ${activeBooking.name}? This cannot be undone.`}
          confirmLabel="Delete Booking"
          danger
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

// ─── Logbook Interface ────────────────────────────────────────────────────────
function LogbookInterface({ museumName }: { museumName: string }) {
  const scheduling = useScheduling();
  const museumEntries = scheduling.logEntries.filter(e => e.museum === museumName);

  const [showWalkIn,       setShowWalkIn]       = useState(false);
  const [logSearch,        setLogSearch]        = useState('');
  const [dateFilter,       setDateFilter]       = useState('');
  const [entryTypeFilter,  setEntryTypeFilter]  = useState('');
  const [statusFilter,     setStatusFilter]     = useState('');
  const [toast,            setToast]            = useState('');
  const [departureInputs,  setDepartureInputs]  = useState<Record<string, string>>({});

  type LogModal = 'view' | 'edit' | 'delete' | null;
  const [logModal,    setLogModal]    = useState<LogModal>(null);
  const [activeEntry, setActiveEntry] = useState<LogEntry | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const openLogModal = (mode: LogModal, e: LogEntry) => { setActiveEntry(e); setLogModal(mode); };
  const closeLogModal = () => { setLogModal(null); setActiveEntry(null); };

  const filtered = museumEntries.filter(e =>
    (!logSearch       || e.visitorName.toLowerCase().includes(logSearch.toLowerCase()) || e.bookingRef.toLowerCase().includes(logSearch.toLowerCase())) &&
    (!dateFilter      || e.visitDate === dateFilter) &&
    (!entryTypeFilter || e.entryType === entryTypeFilter) &&
    (!statusFilter    || (statusFilter === 'complete' ? e.isComplete : !e.isComplete))
  );

  const clearFilters = () => { setLogSearch(''); setDateFilter(''); setEntryTypeFilter(''); setStatusFilter(''); };
  const hasFilters   = !!(logSearch || dateFilter || entryTypeFilter || statusFilter);

  const handleRecordDeparture = (id: string) => {
    const time = departureInputs[id];
    if (!time) return;
    scheduling.updateLogEntry(id, { departureTime: time, isComplete: true });
    setDepartureInputs(prev => { const n = { ...prev }; delete n[id]; return n; });
    showToast(`Departure time ${time} recorded successfully.`);
  };

  const handleWalkInSave = async (entry: Omit<LogEntry, 'id'>) => {
    try {
      await scheduling.addLogEntry(entry);
      showToast(`Walk-in entry saved for ${entry.visitorName} at ${entry.arrivalTime}.`);
      scheduling.addNotification({
        notificationType: 'Booking Confirmation',
        museum: museumName,
        recipient: 'staff@arko.ph',
        channel: 'System Alert',
        notificationStatus: 'Sent',
        message: `Walk-in visitor "${entry.visitorName}" (${entry.groupSize} persons) logged at ${entry.arrivalTime} by ${entry.recordedBy}.`,
      });
    } catch {
      showToast('Failed to save walk-in entry. Please try again.');
    } finally {
      setShowWalkIn(false);
    }
  };

  const handleEditSave = (updates: Partial<LogEntry>) => {
    if (!activeEntry) return;
    scheduling.updateLogEntry(activeEntry.id, updates);
    if (!updates.isComplete && !activeEntry.isComplete) {
      scheduling.addNotification({
        notificationType: 'Incomplete Logbook',
        logId: activeEntry.id,
        museum: museumName,
        recipient: 'staff@arko.ph',
        channel: 'System Alert',
        notificationStatus: 'Sent',
        message: `Logbook entry for ${activeEntry.visitorName} updated by staff.`,
      });
    }
    closeLogModal();
    showToast(`Logbook entry for ${activeEntry.visitorName} updated.`);
  };

  const handleDelete = () => {
    if (!activeEntry) return;
    scheduling.deleteLogEntry(activeEntry.id);
    closeLogModal();
    showToast(`Logbook entry for ${activeEntry.visitorName} deleted.`);
  };

  return (
    <div className="p-8">
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-[#1e293b] text-[22px] leading-[28px]">Visitor Logbook</h2>
          <p className="text-[#64748b] text-[14px] mt-1">Arrivals, departures, and walk-ins at <strong>{museumName}</strong>. {museumEntries.length} total entries.</p>
        </div>
        <button onClick={() => setShowWalkIn(true)} className="bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 px-5 rounded-[6px] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Walk-in Entry
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Visitor name or booking ref…" className="w-full pl-9 pr-3 py-2 border border-[#e2e8f0] focus:border-[#334155] rounded-lg text-[13px] text-[#1e293b] focus:outline-none" />
            </div>
          </div>
          <div className="min-w-[155px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Visit Date</label>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none" />
          </div>
          <div className="min-w-[140px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Entry Type</label>
            <select value={entryTypeFilter} onChange={e => setEntryTypeFilter(e.target.value)} className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none">
              <option value="">All</option>
              <option value="Pre-booked">Pre-booked</option>
              <option value="Walk-in">Walk-in</option>
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block font-semibold text-[#1e293b] text-[12px] mb-1">Completion</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none">
              <option value="">All</option>
              <option value="complete">Complete</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          {hasFilters && <button onClick={clearFilters} className="h-[38px] px-4 border border-[#e2e8f0] rounded-lg font-semibold text-[#64748b] text-[12px] bg-white hover:bg-[#f8fafc] self-end whitespace-nowrap">Clear</button>}
        </div>
        <p className="mt-2 text-[#64748b] text-[12px]">Showing {filtered.length} of {museumEntries.length} entries{hasFilters && <span className="ml-1 text-[#334155] font-semibold">— filtered</span>}</p>
      </div>

      {/* Logbook entries */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-10 text-center shadow-sm">
          <svg className="w-10 h-10 text-[#cbd5e1] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          <p className="font-semibold text-[#1e293b] text-[14px] mb-1">No logbook entries found</p>
          <p className="text-[#64748b] text-[13px]">{hasFilters ? 'Try adjusting your filters.' : 'No logbook entries recorded yet for this museum.'}</p>
          {hasFilters && <button onClick={clearFilters} className="mt-3 text-[#334155] font-semibold text-[12px] underline">Clear filters</button>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(entry => (
            <div key={entry.id} className={`bg-white border rounded-xl p-5 shadow-sm ${!entry.isComplete ? 'border-l-4 border-[#AC0000] border-r border-t border-b border-[#e2e8f0]' : 'border-[#e2e8f0]'}`}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-[#334155] text-[13px]">{entry.bookingRef}</span>
                    <StatusBadge status={entry.entryType} />
                    <StatusBadge status={entry.attendanceStatus} />
                    {!entry.isComplete
                      ? <span className="px-2 py-0.5 bg-[rgba(172,0,0,0.1)] text-[#AC0000] text-[10px] font-semibold rounded-full border border-[rgba(172,0,0,0.2)]">Missing Departure</span>
                      : <span className="px-2 py-0.5 bg-[rgba(15,118,110,0.1)] text-[#0f766e] text-[10px] font-semibold rounded-full border border-[rgba(15,118,110,0.2)]">Complete</span>
                    }
                  </div>
                  <span className="text-[#1e293b] text-[14px] font-semibold">{entry.visitorName}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openLogModal('view', entry)} className="h-7 px-2.5 border border-[#e2e8f0] rounded-md font-semibold text-[#1e293b] text-[11px] bg-white hover:bg-[#f8fafc]">View</button>
                  <button onClick={() => openLogModal('edit', entry)} className="h-7 px-2.5 border border-[#e2e8f0] rounded-md font-semibold text-[#1e293b] text-[11px] bg-white hover:bg-[#f8fafc]">Edit</button>
                  {entry.entryType !== 'Walk-in' && (
                    <button onClick={() => openLogModal('delete', entry)} className="h-7 px-2.5 border border-[rgba(172,0,0,0.3)] rounded-md font-semibold text-[#AC0000] text-[11px] bg-white hover:bg-[rgba(172,0,0,0.05)]">Delete</button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
                {[
                  ['Museum', entry.museum],
                  ['Group Size', String(entry.groupSize)],
                  ['Arrival', entry.arrivalTime],
                  ['Departure', entry.departureTime || '—'],
                  ['Time Slot', entry.timeSlot],
                  ['Recorded By', entry.recordedBy],
                ].map(([l, v]) => (
                  <div key={l} className={l === 'Museum' ? 'col-span-2' : ''}>
                    <p className="font-semibold text-[#64748b] text-[11px] mb-0.5">{l}</p>
                    <p className={`text-[#1e293b] text-[13px] ${!entry.departureTime && l === 'Departure' ? 'text-[#AC0000] font-semibold' : ''}`}>{v}</p>
                  </div>
                ))}
              </div>
              {entry.notes && (
                <p className="mt-2 text-[#64748b] text-[12px] italic border-t border-[#f1f5f9] pt-2">{entry.notes}</p>
              )}
              {!entry.isComplete && (
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex gap-2 items-center flex-wrap">
                  <label className="font-semibold text-[#1e293b] text-[12px] shrink-0">Record departure time:</label>
                  <input type="time"
                    value={departureInputs[entry.id] ?? ''}
                    onChange={e => setDepartureInputs(prev => ({ ...prev, [entry.id]: e.target.value }))}
                    className="border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-1.5 text-[13px] text-[#1e293b] focus:outline-none" />
                  <button
                    onClick={() => handleRecordDeparture(entry.id)}
                    disabled={!departureInputs[entry.id]}
                    className="bg-[#334155] hover:bg-[#1e293b] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[12px] h-8 px-3 rounded-[6px] transition-colors">
                    Save Departure
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showWalkIn      && <WalkInModal museumName={museumName} onSave={handleWalkInSave} onClose={() => setShowWalkIn(false)} />}
      {logModal === 'view'   && activeEntry && <ViewLogModal   entry={activeEntry} onClose={closeLogModal} />}
      {logModal === 'edit'   && activeEntry && <EditLogModal   entry={activeEntry} onSave={handleEditSave} onClose={closeLogModal} />}
      {logModal === 'delete' && activeEntry && (
        <ConfirmModal
          title="Delete Logbook Entry?"
          message={`Permanently delete the logbook entry for ${activeEntry.visitorName} (${activeEntry.bookingRef})? This cannot be undone.`}
          confirmLabel="Delete Entry"
          danger
          onConfirm={handleDelete}
          onCancel={closeLogModal}
        />
      )}
    </div>
  );
}

// ─── Attendance Reports ───────────────────────────────────────────────────────
function AttendanceReports({ museumName }: { museumName: string }) {
  const { bookings, logEntries } = useScheduling();
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const museumBookings = bookings.filter(b => b.museum === museumName && b.status !== 'cancelled');
  const museumLogs     = logEntries.filter(e => e.museum === museumName);

  const totalVisitors  = museumBookings.reduce((s, b) => s + b.groupSize, 0)
                       + museumLogs.filter(e => e.entryType === 'Walk-in').reduce((s, e) => s + e.groupSize, 0);
  const preBooked      = museumBookings.reduce((s, b) => s + b.groupSize, 0);
  const walkIns        = museumLogs.filter(e => e.entryType === 'Walk-in').reduce((s, e) => s + e.groupSize, 0);
  const incomplete     = museumLogs.filter(e => !e.departureTime).length;

  const allGalleries = [
    { name: 'Peñafrancia Museum',            capacity: 120 },
    { name: 'Museo del Seminario Conciliar',  capacity: 90  },
    { name: 'UNC Museum',                     capacity: 75  },
    { name: 'Jesse M. Robredo Museum',        capacity: 60  },
    { name: 'Museo Hayskulano',               capacity: 50  },
  ];
  const gallery = allGalleries.find(g => g.name === museumName) ?? allGalleries[0];
  const arrived = museumLogs.reduce((s, e) => s + e.groupSize, 0);
  const departed = museumLogs.filter(e => e.departureTime).reduce((s, e) => s + e.groupSize, 0);
  const onSiteNow = Math.max(0, arrived - departed);
  const pct = Math.round((onSiteNow / gallery.capacity) * 100);

  return (
    <div className="p-8">
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-[#1e293b] text-[22px] leading-[28px]">Attendance Reports</h2>
          <p className="text-[#64748b] text-[14px] mt-1">Visitor counts and capacity for <strong>{museumName}</strong>.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('CSV export prepared.')} className="h-10 px-4 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Export CSV
          </button>
          <button onClick={() => showToast('PDF report prepared.')} className="h-10 px-4 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          [String(totalVisitors), 'Total Visitors'],
          [String(preBooked),     'Pre-booked'],
          [String(walkIns),       'Walk-ins'],
          [String(incomplete),    'Incomplete Entries', incomplete > 0],
        ].map(([v, l, alert]) => (
          <div key={String(l)} className={`bg-white border rounded-xl p-5 text-center shadow-sm ${alert ? 'border-[#AC0000]' : 'border-[#e2e8f0]'}`}>
            <p className={`font-bold text-[28px] leading-[36px] ${alert ? 'text-[#AC0000]' : 'text-[#1e293b]'}`}>{v}</p>
            <p className="text-[#64748b] text-[13px] leading-[22.75px] mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-[#1e293b] text-[16px] leading-[28px] mb-4">Capacity Status — {museumName}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-[#1e293b] text-[14px]">{museumName}</span>
          <span className="text-[#64748b] text-[13px]">{onSiteNow} / {gallery.capacity}</span>
        </div>
        <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden mb-1">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct >= 80 ? '#AC0000' : pct >= 60 ? '#b45309' : '#0f766e' }} />
        </div>
        <p className="text-[#64748b] text-[12px]">{pct}% capacity filled</p>
      </div>

      {/* Log summary table */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h3 className="font-semibold text-[#1e293b] text-[15px]">Logbook Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                {['Visitor Name', 'Booking Ref', 'Arrival', 'Departure', 'Group Size', 'Type', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold text-[#64748b] text-[12px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {museumLogs.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[#64748b] text-[13px]">No logbook entries for this museum.</td></tr>
              ) : museumLogs.map(e => (
                <tr key={e.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-4 py-3 font-semibold text-[#1e293b] text-[13px]">{e.visitorName}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px]">{e.bookingRef}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px]">{e.arrivalTime}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px]">{e.departureTime ?? '—'}</td>
                  <td className="px-4 py-3 text-[#64748b] text-[13px]">{e.groupSize}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.entryType} /></td>
                  <td className="px-4 py-3">
                    {e.isComplete
                      ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(15,118,110,0.1)] text-[#0f766e] border border-[rgba(15,118,110,0.2)]">Complete</span>
                      : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(172,0,0,0.1)] text-[#AC0000] border border-[rgba(172,0,0,0.2)]">Incomplete</span>
                    }
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

// ─── Main exported component ──────────────────────────────────────────────────
export function SchedulingStaffView({ museum }: { museum: string }) {
  const [tab, setTab] = useState<StaffTab>('dashboard');
  const { notifications } = useScheduling();

  const unreadNotifCount = notifications.filter(n => n.museum === museum && !n.isRead).length;

  const tabs: { id: StaffTab; label: string; badge?: number }[] = [
    { id: 'dashboard',     label: 'Dashboard'                                            },
    { id: 'bookings',      label: 'Booking Management'                                   },
    { id: 'logbook',       label: 'Logbook'                                              },
    { id: 'reports',       label: 'Attendance Reports'                                   },
    { id: 'notifications', label: 'Notifications', badge: unreadNotifCount || undefined  },
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
              {t.badge ? <span className="w-4 h-4 bg-[#AC0000] rounded-full text-white text-[9px] font-bold flex items-center justify-center">{t.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>
      {tab === 'dashboard'     && <StaffDashboard    onNavigate={setTab} museumName={museum} />}
      {tab === 'bookings'      && <BookingManagement  museumName={museum} />}
      {tab === 'logbook'       && <LogbookInterface   museumName={museum} />}
      {tab === 'reports'       && <AttendanceReports  museumName={museum} />}
      {tab === 'notifications' && <NotificationCenter museumName={museum} />}
    </div>
  );
}
