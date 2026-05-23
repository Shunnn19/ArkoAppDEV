import { useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { useScheduling, PH_HOLIDAYS } from './SchedulingContext';
import type { PublicBooking } from './SchedulingContext';
import { COUNTRY_CODES } from './countryCodes';

type PublicView = 'browser' | 'booking-form' | 'confirmation' | 'lookup' | 'modification' | 'faq';

interface TimeSlot {
  id: string;
  gallery: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  status: 'open' | 'blocked';
  reason?: string;
}

interface Booking {
  reference: string;   // BK-[0-9]{4}-[0-9]{3}
  visitorId: string;   // VIS-[0-9]{5}
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;       // optional (NA)
  contact: string;     // E.164 format
  visitorType: 'Guest' | 'Registered';
  numberOfVisitors: number;
  visitDate: string;
  timeSlot: string;
  bookingType: 'Individual' | 'Group' | 'School' | 'Senior' | 'Private Tour';
  specialRequest: string;  // optional, max 300 chars
  gallery: string;
  status: string;
}

// ─── Museum catalogue ─────────────────────────────────────────────────────────
const MUSEUMS = [
  {
    id: 'm1',
    name: 'Peñafrancia Museum',
    type: 'Regional History & Culture',
    desc: 'Explore the devotional heritage and cultural history of the Bicolano people centered around the miraculous Nuestra Señora de Peñafrancia.',
    hours: 'Mon–Sun · 8:00 AM – 6:00 PM',
    img: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHtAMo6RJaA2VErmNRbu--rbPhUXhypILAvvNZwNEGgGMERmz5MOziBfv_6ocs1zyiI6T8m6q2SlInrfKRyrsOzrnhlmxbOVI7iing3X553XYoOJCinG-hFDo7PL1qIisWtEkI8=s1360-w1360-h1020-rw',
    imgAlt: 'Peñafrancia Museum, Naga City',
    accent: '#7B1F1F',
    initials: 'PM',
  },
  {
    id: 'm2',
    name: 'Museo del Seminario Conciliar',
    type: 'Ecclesiastical History',
    desc: 'A repository of ecclesiastical art, religious artifacts, and the institutional history of the Catholic Church in Naga City.',
    hours: 'Mon–Sat · 9:00 AM – 5:00 PM',
    img: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAE4WNc2XCOXcT8-b6Y54HQU7oVQfK1BeKYh_66FhPvyR7UerzoAodaQgVM-MzR4WcXKRaeqh1M8XCiBHP4BE9BC2F0kdaqb8EjqO8_SFOVYKE3TuLhdJ-tnb4kF-2KKiUjhTQ3eQg=s1360-w1360-h1020-rw',
    imgAlt: 'Museo del Seminario Conciliar, Naga City',
    accent: '#2D3561',
    initials: 'MSC',
  },
  {
    id: 'm3',
    name: 'UNC Museum',
    type: 'Academic Heritage',
    desc: 'Showcasing the academic legacy and cultural contributions of the University of Nueva Caceres, including student and faculty artwork.',
    hours: 'Mon–Fri · 8:00 AM – 5:00 PM',
    img: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHah5OQ4kmuoru1kXUty7VkpGjuIjNtsS5jaQZ-QOam0uIzmQMgchwoog_qN56n1Yz6MkX5BNV6mDTZ3DvZIfic-_cQsx4TnvMJlOhg_7P4tEMlZMjACIsMvZRzLqYYH_xipyuyAQ=s1360-w1360-h1020-rw',
    imgAlt: 'University of Nueva Caceres — UNC Museum',
    accent: '#8B0000',
    initials: 'UNC',
  },
  {
    id: 'm4',
    name: 'Jesse M. Robredo Museum',
    type: 'Political & Social History',
    desc: 'Dedicated to the life, legacy, and public service of DILG Secretary Jesse M. Robredo, a beloved son of Naga City.',
    hours: 'Tue–Sun · 9:00 AM – 5:00 PM',
    img: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGScLtOzlt-1AL8GG8cXVZOuadW51l9UZxvp0I-QkcPplLafMjIJABZi8LgxRtfcF_wsGRuRWYnzSc0Ny81l265kpgAuHPLYzpDCCu5JijgQX3iAKyrRZ8qDE9F_3Bng6SNGRSv7g=s1360-w1360-h1020-rw',
    imgAlt: 'Jesse M. Robredo Museum, Naga City',
    accent: '#1A3A5C',
    initials: 'JRM',
  },
  {
    id: 'm5',
    name: 'Museo Hayskulano',
    type: 'Education History',
    desc: "A tribute to the educational heritage of Naga City's high schools, featuring memorabilia, sports trophies, and alumni stories.",
    hours: 'Mon–Sat · 8:00 AM – 5:00 PM',
    img: 'https://alchetron.com/cdn/camarines-sur-national-high-school-40186de1-5af7-45a0-867f-cd842f49799-resize-750.jpg',
    imgAlt: 'Museo Hayskulano, Naga City',
    accent: '#1B4D2E',
    initials: 'MH',
  },
];

const FAQ_ITEMS = [
  { q: 'How do I book a visit?',               a: 'First select your museum, then browse available time slots in the Schedule Browser, select a slot that fits your schedule, and complete the Booking Form. You will receive a confirmation email with your reference number within 30 seconds.' },
  { q: 'What is the cancellation policy?',     a: 'Bookings may be cancelled or modified up to 24 hours before the scheduled visit time. Cancellations within the 24-hour window cannot be processed online — please contact the museum directly. All cancellations trigger an automatic confirmation email.' },
  { q: 'What should I bring on visit day?',    a: 'Please bring a printed or digital copy of your booking confirmation email showing your reference number. A valid ID may be requested. Arrive 10 minutes before your scheduled slot.' },
  { q: 'How are accessibility needs accommodated?', a: 'All museums in the network provide wheelchair access, audio guides, and tactile exhibits. Indicate your accessibility needs in the Special Requirements field when booking, and our team will ensure appropriate arrangements are in place.' },
  { q: 'Can I modify my booking after submission?', a: 'Yes. Use the My Booking page to retrieve your booking with your reference number or email, then select "Modify Booking." You can change group size, visit date/time (subject to availability), group type, and special requirements.' },
  { q: 'What are the museum visit guidelines?', a: 'Photography without flash is permitted in most galleries. Food and beverages are not allowed inside exhibit halls. Please keep noise to a minimum. Children under 12 must be accompanied by an adult. Group sizes above 20 must be coordinated with museum staff.' },
];

// ─── Museum Selection Gate ────────────────────────────────────────────────────

function MuseumGateView({ onSelect }: { onSelect: (museumName: string) => void }) {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-[#f8fafc]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#e2e8f0] sticky top-[56px] z-10">
        <div className="max-w-[1400px] mx-auto px-6 h-[52px] flex items-center justify-between">
          <span className=" font-semibold text-[#1e293b] text-[14px]">Visitor Scheduling</span>
          <button onClick={() => navigate('/')} className="text-[13px] text-[#64748b] hover:text-[#1e293b] transition-colors">
            ← Back to Portal
          </button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[rgba(172,0,0,0.08)] border border-[rgba(172,0,0,0.15)] px-5 py-2.5 rounded-full mb-5">
            <svg className="w-4 h-4 text-[#AC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className=" font-semibold text-[#AC0000] text-[12px] tracking-[0.35px] uppercase">Step 1 of 2 — Select a Museum</span>
          </div>
          <h1 className=" font-bold text-[#1e293b] text-[36px] leading-[44px] mb-3">
            Which museum would you like to visit?
          </h1>
          <p className=" text-[#64748b] text-[16px] leading-[28px] max-w-[580px] mx-auto">
            Select a museum below. All scheduling, availability data, and booking submissions will be scoped exclusively to your chosen museum.
          </p>
        </div>

        {/* Museum cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MUSEUMS.map(museum => (
            <button
              key={museum.id}
              onClick={() => onSelect(museum.name)}
              className="group bg-white border border-[#e2e8f0] rounded-xl text-left hover:border-[#334155] hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
            >
              {/* Museum photo — replace `img` URL in MUSEUMS array with the real official photo */}
              <div
                className="w-full h-44 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${museum.accent}cc, ${museum.accent}66)` }}
              >
                <img
                  src={museum.img}
                  alt={museum.imgAlt}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                {/* Initials overlay — visible only when photo fails to load */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/20 text-5xl font-bold tracking-widest select-none">{museum.initials}</span>
                </div>
                {/* Subtle bottom gradient for readability */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block px-3 py-1 bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] rounded-full text-[11px] font-semibold mb-4">
                  {museum.type}
                </span>
                <h3 className=" font-bold text-[#1e293b] text-[17px] leading-[24px] mb-2 group-hover:text-[#334155] transition-colors">
                  {museum.name}
                </h3>
                <p className=" text-[#64748b] text-[13px] leading-[22px] flex-1 mb-4">
                  {museum.desc}
                </p>
                <div className="flex items-center gap-1.5 text-[#64748b] text-[12px] mb-4">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="">{museum.hours}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
                  <span className=" font-semibold text-[#334155] text-[13px] group-hover:text-[#1e293b]">
                    Select & Continue
                  </span>
                  <svg className="w-4 h-4 text-[#64748b] group-hover:text-[#334155] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-[#94a3b8] text-[13px] mt-8">
          You can change your selected museum at any time by clicking "Change Museum" in the scheduling interface.
        </p>
      </div>
    </div>
  );
}

// ─── Availability helpers ────────────────────────────────────────────────────
// DateState is now 'available'|'partial'|'booked'|'holiday'|'closed'|'past'|'empty'
// getDateState is provided by SchedulingContext — no local version needed

// ─── Calendar Panel ───────────────────────────────────────────────────────────

function CalendarPanel({
  selectedDate,
  onSelectDate,
  museumName,
}: {
  selectedDate: string;
  onSelectDate: (d: string) => void;
  museumName: string;
}) {
  const scheduling = useScheduling();
  const today = new Date().toISOString().slice(0, 10);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(4); // May 2026

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('en-US', { month: 'long' });
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = (day: number) => `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;

  const stateStyle: Record<string, string> = {
    available: 'bg-[#0f766e] text-white hover:bg-[#0d6460] cursor-pointer',
    partial:   'bg-[rgba(245,158,11,0.15)] text-[#92400e] hover:bg-[rgba(245,158,11,0.25)] cursor-pointer',
    booked:    'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed line-through',
    past:      'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed',
    empty:     'text-[#64748b] hover:bg-[#f8fafc] cursor-pointer',
    holiday:   'bg-[rgba(172,0,0,0.12)] text-[#AC0000] cursor-not-allowed',
    closed:    'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed',
  };

  const [statusMsg, setStatusMsg] = useState('');

  const handleDateClick = (day: number) => {
    const ds = dateStr(day);
    const state = scheduling.getDateState(museumName, ds, today);
    if (state === 'holiday') {
      const name = PH_HOLIDAYS[ds] ?? 'Holiday';
      setStatusMsg(`${name} — this date is not available for bookings.`);
      return;
    }
    if (state === 'closed') { setStatusMsg('This date has been closed. Please select another date.'); return; }
    if (state === 'booked') { setStatusMsg('All slots are fully booked on this date. Please select another date.'); return; }
    if (state === 'past')   { setStatusMsg(''); return; }
    setStatusMsg('');
    onSelectDate(ds);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded-md text-[#1e293b] hover:bg-[#f8fafc] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h3 className=" font-semibold text-[#1e293b] text-[17px]">{monthName} {viewYear}</h3>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center border border-[#e2e8f0] rounded-md text-[#1e293b] hover:bg-[#f8fafc] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="h-8 flex items-center justify-center font-semibold text-[#94a3b8] text-[11px]">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const ds = dateStr(day);
          const state = scheduling.getDateState(museumName, ds, today);
          const selected = ds === selectedDate;
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              title={state === 'holiday' ? (PH_HOLIDAYS[ds] ?? 'Holiday') : undefined}
              className={`h-9 w-full flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors relative ${selected ? 'ring-2 ring-[#334155] ring-offset-1' : ''} ${stateStyle[state] ?? ''}`}
            >
              {day}
              {state === 'holiday' && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#AC0000]" />}
            </button>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex flex-wrap gap-2 justify-center">
        {[
          { color: 'bg-[#0f766e]',              label: 'Available' },
          { color: 'bg-[rgba(245,158,11,0.6)]', label: 'Limited'   },
          { color: 'bg-[#f1f5f9]',              label: 'Unavailable'},
          { color: 'bg-[rgba(172,0,0,0.5)]',    label: 'Holiday'   },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-[3px] ${item.color} border border-[rgba(0,0,0,0.08)]`} />
            <span className=" text-[#64748b] text-[12px]">{item.label}</span>
          </div>
        ))}
      </div>
      {statusMsg && (
        <p className="mt-3 text-[#64748b] text-[13px] text-center">{statusMsg}</p>
      )}
    </div>
  );
}

// ─── Schedule Browser (museum-scoped) ────────────────────────────────────────

function ScheduleBrowser({ onSelectSlot, museumName }: { onSelectSlot: (slot: TimeSlot) => void; museumName: string }) {
  const scheduling = useScheduling();
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(today);

  // Use context: real-time curator-managed slots
  const contextSlots = scheduling.getOpenSlotsForDate(museumName, selectedDate);
  const filtered: TimeSlot[] = contextSlots.map(s => {
    const parts = s.timeSlot.split('–').map((t: string) => t.trim());
    return {
      id: `${museumName}|${selectedDate}|${s.timeSlot}`,
      gallery: museumName, date: selectedDate,
      startTime: parts[0] ?? '', endTime: parts[1] ?? '',
      capacity: s.capacity, booked: s.booked,
      status: s.status as 'open' | 'blocked',
      reason: s.reason,
    };
  });
  const openCount = filtered.filter(s => s.status === 'open').length;

  // Show holiday info if date is a holiday
  const holidayNameForDate = PH_HOLIDAYS[selectedDate];

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="w-full px-4 sm:px-8 py-6 sm:py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[rgba(15,118,110,0.1)] border border-[rgba(15,118,110,0.2)] px-6 py-3 rounded-full mb-5">
          <div className="bg-[#0f766e] rounded-full size-2" />
          <span className=" font-semibold text-[#0f766e] text-[13px] tracking-[0.35px]">Live Availability</span>
        </div>
        <h2 className=" font-bold text-[#1e293b] text-[24px] sm:text-[34px] leading-[1.2] sm:leading-[40px] mb-3">Browse Available Visit Slots</h2>
        <p className=" text-[#64748b] text-[16.6px] leading-[29.25px] max-w-[600px] mx-auto">
          Click a date on the calendar to view slots for <strong>{museumName}</strong>. Select a slot to begin booking.
        </p>
      </div>

      {/* Two-panel */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-8 items-start">

        {/* LEFT — slot list */}
        <div className="flex-1 min-w-0 w-full">
          <div className="mb-4">
            <h3 className=" font-semibold text-[#1e293b] text-[16px] leading-[28px]">{formattedDate}</h3>
            <p className=" text-[#64748b] text-[13px]">
              {openCount} slot{openCount !== 1 ? 's' : ''} available for {museumName}
              {filtered.length > openCount && <span className="ml-1 text-[#b45309]">· {filtered.length - openCount} blocked</span>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className={`border rounded-xl p-8 text-center shadow-sm ${holidayNameForDate ? 'bg-[rgba(172,0,0,0.04)] border-[rgba(172,0,0,0.2)]' : 'bg-white border-[#e2e8f0]'}`}>
              <svg className={`w-10 h-10 mx-auto mb-3 ${holidayNameForDate ? 'text-[rgba(172,0,0,0.4)]' : 'text-[#cbd5e1]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={holidayNameForDate ? 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' : 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'} />
              </svg>
              {holidayNameForDate ? (
                <>
                  <p className=" font-semibold text-[#AC0000] text-[14px] mb-1">Holiday — {holidayNameForDate}</p>
                  <p className=" text-[#64748b] text-[13px]">This date is a Philippine/Naga City holiday and is not open for bookings. Please select another date.</p>
                </>
              ) : (
                <>
                  <p className=" font-semibold text-[#1e293b] text-[14px] mb-1">No Slots on This Date</p>
                  <p className=" text-[#64748b] text-[13px]">Select a highlighted date on the calendar to see available time slots.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(slot => {
                if (slot.status === 'blocked') {
                  return (
                    <div key={slot.id} className="bg-[rgba(180,83,9,0.04)] border border-[rgba(180,83,9,0.2)] rounded-xl p-5 shadow-sm cursor-not-allowed">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#b45309] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          <span className="font-semibold text-[#b45309] text-[13px]">{slot.startTime} – {slot.endTime}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(180,83,9,0.08)] text-[#b45309] border border-[rgba(180,83,9,0.25)] shrink-0">Unavailable</span>
                      </div>
                      {slot.reason && (
                        <p className="text-[#92400e] text-[12px] mt-1 leading-[18px]">
                          <span className="font-semibold">Reason: </span>{slot.reason}
                        </p>
                      )}
                    </div>
                  );
                }
                const isFull = slot.booked >= slot.capacity;
                const remaining = slot.capacity - slot.booked;
                const nearFull = remaining <= Math.ceil(slot.capacity * 0.2) && !isFull;
                const pct = slot.capacity > 0 ? Math.round((slot.booked / slot.capacity) * 100) : 0;
                const pctFull = slot.booked >= slot.capacity;
                const pctNear = (slot.capacity - slot.booked) <= Math.ceil(slot.capacity * 0.2) && !pctFull;
                return (
                  <div key={slot.id}
                    className={`bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 ${isFull ? 'opacity-60 cursor-not-allowed border-[#e2e8f0]' : 'cursor-pointer hover:shadow-md hover:border-[#334155] border-[#e2e8f0]'}`}
                    onClick={() => !isFull && onSelectSlot(slot)}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className=" font-semibold text-[#1e293b] text-[14px] leading-[20px] flex-1">{slot.gallery}</h4>
                      {isFull ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] shrink-0">Fully Booked</span>
                      ) : nearFull ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(245,158,11,0.1)] text-[#b45309] border border-[rgba(245,158,11,0.2)] shrink-0">Almost Full — {remaining} left</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(15,118,110,0.1)] text-[#0f766e] border border-[rgba(15,118,110,0.2)] shrink-0 self-center">
                          {remaining} of {slot.capacity} remaining
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-4 text-[#64748b] text-[13px]">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {slot.startTime} – {slot.endTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {slot.booked}/{slot.capacity} booked
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: pctFull ? '#AC0000' : pctNear ? '#b45309' : '#0f766e' }} />
                        </div>
                        <p className=" text-[#94a3b8] text-[11px] mt-0.5">{pct}% capacity filled</p>
                      </div>
                    </div>
                    {!isFull ? (
                      <button tabIndex={0}
                        className="mt-4 w-full bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1)]"
                        onClick={e => { e.stopPropagation(); onSelectSlot(slot); }}>
                        Select This Slot
                      </button>
                    ) : (
                      <button tabIndex={-1} disabled
                        className="mt-4 w-full bg-[#f1f5f9] text-[#94a3b8] font-semibold text-[13px] py-2.5 rounded-lg cursor-not-allowed">
                        Fully Booked
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — calendar (fixed width, rightmost) */}
        <div className="w-full xl:w-[380px] xl:flex-none xl:sticky xl:top-[112px]">
          <CalendarPanel selectedDate={selectedDate} onSelectDate={setSelectedDate} museumName={museumName} />
        </div>
      </div>
    </div>
  );
}

// ─── Per-country max local subscriber digits ──────────────────────────────────
// Values represent digits AFTER the country code (i.e., the local number only).
// Source: ITU-T E.164 national numbering plans.
const MAX_LOCAL_DIGITS: Record<string, number> = {
  '+63':   10, // Philippines     (+63 XXXXXXXXXX   = 12 total)
  '+1':    10, // US / Canada      (+1  XXXXXXXXXX   = 11 total)
  '+44':   10, // United Kingdom   (+44 XXXXXXXXXX   = 12 total)
  '+61':    9, // Australia        (+61 XXXXXXXXX    = 11 total)
  '+64':    9, // New Zealand      (+64 XXXXXXXXX    = 11 total)
  '+81':   10, // Japan            (+81 XXXXXXXXXX   = 12 total)
  '+82':   10, // South Korea      (+82 XXXXXXXXXX   = 12 total)
  '+86':   11, // China            (+86 XXXXXXXXXXX  = 13 total)
  '+91':   10, // India            (+91 XXXXXXXXXX   = 12 total)
  '+92':   10, // Pakistan         (+92 XXXXXXXXXX   = 12 total)
  '+93':    9, // Afghanistan
  '+94':    9, // Sri Lanka
  '+95':    9, // Myanmar
  '+852':   8, // Hong Kong
  '+853':   8, // Macau
  '+855':   9, // Cambodia
  '+856':   9, // Laos
  '+60':   10, // Malaysia
  '+65':    8, // Singapore
  '+66':    9, // Thailand
  '+62':   12, // Indonesia        (up to 12 local digits)
  '+84':   10, // Vietnam
  '+880':  10, // Bangladesh
  '+977':  10, // Nepal
  '+975':   8, // Bhutan
  '+960':   7, // Maldives
  '+976':   8, // Mongolia
  '+966':   9, // Saudi Arabia
  '+971':   9, // UAE
  '+972':   9, // Israel
  '+973':   8, // Bahrain
  '+974':   8, // Qatar
  '+968':   8, // Oman
  '+962':   9, // Jordan
  '+961':   8, // Lebanon
  '+963':   9, // Syria
  '+964':  10, // Iraq
  '+965':   8, // Kuwait
  '+967':   9, // Yemen
  '+20':   10, // Egypt
  '+27':    9, // South Africa
  '+234':  10, // Nigeria
  '+254':   9, // Kenya
  '+255':   9, // Tanzania
  '+256':   9, // Uganda
  '+251':   9, // Ethiopia
  '+233':   9, // Ghana
  '+212':   9, // Morocco
  '+216':   8, // Tunisia
  '+213':   9, // Algeria
  '+218':   9, // Libya
  '+249':   9, // Sudan
  '+52':   10, // Mexico
  '+55':   11, // Brazil
  '+54':   10, // Argentina
  '+56':    9, // Chile
  '+57':   10, // Colombia
  '+51':    9, // Peru
  '+58':   10, // Venezuela
  '+593':   9, // Ecuador
  '+591':   8, // Bolivia
  '+595':   9, // Paraguay
  '+598':   8, // Uruguay
  '+49':   11, // Germany          (up to 11 local digits)
  '+33':    9, // France
  '+39':   10, // Italy
  '+34':    9, // Spain
  '+351':   9, // Portugal
  '+31':    9, // Netherlands
  '+32':    9, // Belgium
  '+41':    9, // Switzerland
  '+43':   10, // Austria
  '+45':    8, // Denmark
  '+46':    9, // Sweden
  '+47':    8, // Norway
  '+358':   9, // Finland
  '+353':   9, // Ireland
  '+48':    9, // Poland
  '+7':    10, // Russia / Kazakhstan
  '+380':   9, // Ukraine
  '+90':   10, // Turkey
  '+30':   10, // Greece
  '+36':    9, // Hungary
  '+40':   10, // Romania
  '+420':   9, // Czech Republic
  '+421':   9, // Slovakia
  '+385':   9, // Croatia
  '+381':   9, // Serbia
  '+375':   9, // Belarus
  '+370':   8, // Lithuania
  '+371':   8, // Latvia
  '+372':   8, // Estonia
};

function getMaxLocal(dialCode: string): number {
  if (MAX_LOCAL_DIGITS[dialCode] !== undefined) return MAX_LOCAL_DIGITS[dialCode];
  // Fallback: E.164 max 15 total digits minus the code digits (excluding '+')
  return 15 - (dialCode.length - 1);
}

// ─── Booking Form ─────────────────────────────────────────────────────────────

// Generates a booking ID in format BK-[0-9]{4}-[0-9]{3}
function generateBookingId(): string {
  const a = String(Math.floor(Math.random() * 9000) + 1000);
  const b = String(Math.floor(Math.random() * 900) + 100);
  return `BK-${a}-${b}`;
}

// Generates a visitor ID in format VIS-[0-9]{5}
function generateVisitorId(): string {
  return 'VIS-' + String(Math.floor(Math.random() * 90000) + 10000);
}

const BOOKING_TYPES = ['Individual', 'Group', 'School', 'Senior', 'Private Tour'] as const;
const SPECIAL_REQUEST_ALLOWED = /^[A-Za-z0-9.,!? ]*$/;

function BookingFormView({ slot, onConfirm, onCancel }: { slot: TimeSlot; onConfirm: (b: Booking) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    firstName:     '',
    middleName:    '',
    lastName:      '',
    email:         '',
    localNumber:   '',
    visitorType:   'Guest' as 'Guest' | 'Registered',
    numberOfVisitors: '',
    bookingType:   'Individual' as typeof BOOKING_TYPES[number],
    specialRequest: '',
  });
  const [dialCode, setDialCode] = useState('+63');
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const setField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm(p => ({ ...p, [key]: value }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    // --- VISITOR fields ---
    const nameOnly = /^[A-Za-z ]*$/;
    if (!form.lastName.trim())                                           e.lastName   = 'Last name is required.';
    else if (!nameOnly.test(form.lastName.trim()))                       e.lastName   = 'Last name must contain letters only.';
    else if (form.lastName.trim().length > 50)                          e.lastName   = 'Last name must not exceed 50 characters.';

    if (!form.firstName.trim())                                          e.firstName  = 'First name is required.';
    else if (!nameOnly.test(form.firstName.trim()))                      e.firstName  = 'First name must contain letters only.';
    else if (form.firstName.trim().length > 50)                         e.firstName  = 'First name must not exceed 50 characters.';

    if (form.middleName.trim()) {
      if (!nameOnly.test(form.middleName.trim()))                        e.middleName = 'Middle name must contain letters only.';
      else if (form.middleName.trim().length > 50)                      e.middleName = 'Middle name must not exceed 50 characters.';
    }

    // email is optional (NA) but must be valid if provided
    if (form.email.trim()) {
      if (!/^[A-Za-z0-9.@_-]{1,100}$/.test(form.email.trim()))         e.email      = 'Email must only contain letters, digits, ., @, _, or -.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))  e.email      = 'Please enter a valid email address.';
      else if (form.email.trim().length > 100)                          e.email      = 'Email must not exceed 100 characters.';
    }

    // contact: required, exact per-country digit count + E.164 format
    const localDigits = form.localNumber.replace(/\D/g, '');
    const expectedLocal = getMaxLocal(dialCode);
    if (!localDigits) {
      e.contact = 'Contact number is required.';
    } else if (localDigits.length !== expectedLocal) {
      e.contact = `Enter exactly ${expectedLocal} digit${expectedLocal === 1 ? '' : 's'} after the country code.`;
    } else if (!/^\+[1-9]\d{1,14}$/.test(dialCode + localDigits)) {
      e.contact = 'Enter a valid contact number.';
    }

    // --- VISITOR_BOOKING fields ---
    const n = Number(form.numberOfVisitors);
    if (!form.numberOfVisitors)                                          e.numberOfVisitors = 'Number of visitors is required.';
    else if (!Number.isInteger(n) || n < 1)                             e.numberOfVisitors = 'Must be at least 1 visitor.';
    else if (n > 9999)                                                  e.numberOfVisitors = 'Cannot exceed 9,999 visitors.';
    else if (n > slot.capacity - slot.booked)                           e.numberOfVisitors = `Exceeds remaining capacity of ${slot.capacity - slot.booked}.`;

    if (form.specialRequest.trim()) {
      if (!SPECIAL_REQUEST_ALLOWED.test(form.specialRequest))           e.specialRequest   = 'Only letters, digits, and . , ! ? are allowed.';
      else if (form.specialRequest.length > 300)                        e.specialRequest   = 'Special request must not exceed 300 characters.';
    }

    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const e164 = dialCode + form.localNumber.replace(/\D/g, '');
    onConfirm({
      reference:        generateBookingId(),
      visitorId:        generateVisitorId(),
      firstName:        form.firstName.trim(),
      middleName:       form.middleName.trim(),
      lastName:         form.lastName.trim(),
      email:            form.email.trim(),
      contact:          e164,
      visitorType:      form.visitorType,
      numberOfVisitors: Number(form.numberOfVisitors),
      visitDate:        slot.date,
      timeSlot:         `${slot.startTime} – ${slot.endTime}`,
      bookingType:      form.bookingType,
      specialRequest:   form.specialRequest.trim(),
      gallery:          slot.gallery,
      status:           'Pending',
    });
  };

  const inputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none transition-colors ${errors[field] ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus:border-[#334155]'}`;

  const errCls = "mt-1 text-[#AC0000] text-[12px]";

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <button onClick={onCancel} className="flex items-center gap-2 text-[#64748b] text-[13px] font-semibold mb-6 hover:text-[#1e293b] transition-colors">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <span className="truncate">Back to Schedule Browser</span>
      </button>

      <h2 className=" font-bold text-[#1e293b] text-[22px] sm:text-[28px] leading-[1.2] sm:leading-[36px] mb-2">Book Your Visit</h2>

      {/* Slot summary */}
      <div className="bg-[#f1f5f9] border-l-4 border-[#0f766e] rounded-lg p-4 mb-4">
        <p className=" font-semibold text-[#1e293b] text-[13px] mb-1">{slot.gallery}</p>
        <p className=" text-[#64748b] text-[13px]">
          {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · {slot.startTime} – {slot.endTime} · {slot.capacity - slot.booked} spots remaining
        </p>
      </div>

      {/* Privacy notice */}
      <div className="bg-[#f1f5f9] border-l-4 border-[#334155] rounded-lg p-4 mb-6">
        <p className=" font-semibold text-[#1e293b] text-[13px] mb-1">Privacy Notice</p>
        <p className=" text-[#64748b] text-[13px] leading-[22.75px]">We collect only the minimum information required to process your museum booking. This data is used solely to manage your reservation and send you booking notifications. It is stored securely and never shared with third parties.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Visitor Information ──────────────────────────────────────── */}
        <div>
          <p className=" font-semibold text-[#64748b] text-[11px] uppercase tracking-widest mb-3">Visitor Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Last Name */}
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Last Name <span className="text-[#AC0000]">*</span></label>
              <input type="text" maxLength={50} value={form.lastName}
                onChange={e => setField('lastName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                className={inputCls('lastName')} placeholder="e.g. Dela Cruz" />
              {errors.lastName && <p className={errCls}>{errors.lastName}</p>}
            </div>

            {/* First Name */}
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">First Name <span className="text-[#AC0000]">*</span></label>
              <input type="text" maxLength={50} value={form.firstName}
                onChange={e => setField('firstName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                className={inputCls('firstName')} placeholder="e.g. Juan" />
              {errors.firstName && <p className={errCls}>{errors.firstName}</p>}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Middle Name <span className="text-[#64748b] font-normal">(optional)</span></label>
              <input type="text" maxLength={50} value={form.middleName}
                onChange={e => setField('middleName', e.target.value.replace(/[^A-Za-z ]/g, ''))}
                className={inputCls('middleName')} placeholder="e.g. Santos" />
              {errors.middleName && <p className={errCls}>{errors.middleName}</p>}
            </div>

            {/* Visitor Type */}
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Visitor Type <span className="text-[#AC0000]">*</span></label>
              <select value={form.visitorType}
                onChange={e => setField('visitorType', e.target.value as 'Guest' | 'Registered')}
                className={inputCls('visitorType')}>
                <option value="Guest">Guest</option>
                <option value="Registered">Registered</option>
              </select>
            </div>

            {/* Contact Number */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Contact Number <span className="text-[#AC0000]">*</span> <span className="text-[#64748b] font-normal text-[12px]">(International format)</span></label>
              <div className={`flex border rounded-lg overflow-hidden transition-colors ${errors.contact ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus-within:border-[#334155]'}`}>
                <select
                  value={dialCode}
                  onChange={e => {
                    const newCode = e.target.value;
                    setDialCode(newCode);
                    setForm(p => ({ ...p, localNumber: p.localNumber.slice(0, getMaxLocal(newCode)) }));
                    setErrors(p => ({ ...p, contact: '' }));
                  }}
                  className="shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] px-2 py-2 text-[13px] text-[#1e293b] focus:outline-none cursor-pointer"
                  style={{ maxWidth: '140px' }}
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code + c.name} value={c.code}>{c.flag} {c.code} {c.name}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={form.localNumber}
                  maxLength={getMaxLocal(dialCode)}
                  onChange={e => {
                    let digits = e.target.value.replace(/[^\d]/g, '');
                    if (digits.startsWith('0')) digits = digits.slice(1);
                    setForm(p => ({ ...p, localNumber: digits.slice(0, getMaxLocal(dialCode)) }));
                    setErrors(p => ({ ...p, contact: '' }));
                  }}
                  placeholder={dialCode === '+63' ? '9171234567' : 'Local number'}
                  className="flex-1 min-w-0 px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none bg-white"
                />
              </div>
              {dialCode && form.localNumber && (
                <p className="mt-0.5 text-[#64748b] text-[11px]">Stored as: {dialCode}{form.localNumber.replace(/\D/g, '')}</p>
              )}
              {errors.contact && <p className={errCls}>{errors.contact}</p>}
            </div>

            {/* Email Address — optional */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Email Address <span className="text-[#64748b] font-normal">(optional)</span></label>
              <input type="email" maxLength={100} value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                className={inputCls('email')} placeholder="juan@example.com" />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>

          </div>
        </div>

        {/* ── Booking Details ──────────────────────────────────────────── */}
        <div>
          <p className=" font-semibold text-[#64748b] text-[11px] uppercase tracking-widest mb-3">Booking Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Number of Visitors */}
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Number of Visitors <span className="text-[#AC0000]">*</span></label>
              <input type="number" min={1} max={9999} value={form.numberOfVisitors}
                onChange={e => { setForm(p => ({ ...p, numberOfVisitors: e.target.value })); setErrors(p => ({ ...p, numberOfVisitors: '' })); }}
                className={inputCls('numberOfVisitors')} placeholder="1 – 9999" />
              {errors.numberOfVisitors && <p className={errCls}>{errors.numberOfVisitors}</p>}
            </div>

            {/* Booking Type */}
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Booking Type <span className="text-[#AC0000]">*</span></label>
              <select value={form.bookingType}
                onChange={e => setField('bookingType', e.target.value as typeof BOOKING_TYPES[number])}
                className={inputCls('bookingType')}>
                {BOOKING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Special Request */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">
                Special Request <span className="text-[#64748b] font-normal">(optional)</span>
              </label>
              <textarea rows={3} value={form.specialRequest}
                onChange={e => {
                  const val = e.target.value;
                  if (SPECIAL_REQUEST_ALLOWED.test(val) && val.length <= 300) {
                    setForm(p => ({ ...p, specialRequest: val }));
                    setErrors(p => ({ ...p, specialRequest: '' }));
                  }
                }}
                placeholder="Accessibility needs, group arrangements, or any other special requests..."
                className={`w-full border rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none resize-none transition-colors ${errors.specialRequest ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus:border-[#334155]'}`} />
              <div className="flex justify-between mt-0.5">
                {errors.specialRequest
                  ? <p className={errCls}>{errors.specialRequest}</p>
                  : <span />}
                <span className={`text-[11px] ${form.specialRequest.length > 280 ? 'text-[#AC0000]' : 'text-[#94a3b8]'}`}>
                  {form.specialRequest.length}/300
                </span>
              </div>
            </div>

          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            Submit Booking
          </button>
          <button type="button" onClick={onCancel} className="px-6 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13.25px] bg-white hover:bg-[#f8fafc] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Booking Confirmation ─────────────────────────────────────────────────────

function BookingConfirmationView({ booking, onNewBooking }: { booking: Booking; onNewBooking: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-[640px] mx-auto px-6 py-10">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#334155] px-8 py-6 text-white text-center">
          <div className="w-12 h-12 bg-[rgba(255,255,255,0.2)] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className=" font-bold text-[22px] leading-[28px]">Booking Confirmed!</h2>
          <p className=" text-[rgba(255,255,255,0.8)] text-[14px] mt-1">
            {booking.email ? `A confirmation email has been sent to ${booking.email}` : 'Your booking has been received.'}
          </p>
        </div>
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <p className=" text-[#64748b] text-[13px] mb-1">Booking Reference</p>
            <p className=" font-bold text-[#1e293b] text-[36px] leading-[1] tracking-wider">{booking.reference}</p>
          </div>
          <div className="border-t border-[#e2e8f0] pt-5 space-y-3">
            {[
              ['Visitor Name', [booking.firstName, booking.middleName, booking.lastName].filter(Boolean).join(' ')],
              ['Visitor Type', booking.visitorType],
              ['Gallery', booking.gallery],
              ['Visit Date', new Date(booking.visitDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
              ['Time Slot', booking.timeSlot],
              ['No. of Visitors', String(booking.numberOfVisitors)],
              ['Booking Type', booking.bookingType],
              ...(booking.specialRequest ? [['Special Request', booking.specialRequest]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <span className=" font-semibold text-[#64748b] text-[13px] shrink-0">{label}</span>
                <span className=" text-[#1e293b] text-[13px] text-right">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[#e2e8f0]">
            <div className="bg-[#f1f5f9] rounded-lg p-4 mb-4">
              <p className=" text-[#64748b] text-[13px] leading-[22.75px]">Please bring this confirmation (printed or digital) with a valid ID on your visit day. Arrive 10 minutes early.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onNewBooking} className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
                Book Another Visit
              </button>
              <button onClick={() => navigate('/')} className="flex-1 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Booking Lookup ───────────────────────────────────────────────────────────

function BookingCard({ booking, onCancel, onModify }: {
  booking: PublicBooking;
  onCancel: () => void;
  onModify: () => void;
}) {
  const isCancelled = booking.status === 'cancelled';
  const statusStyles: Record<string, string> = {
    confirmed: 'bg-[rgba(15,118,110,0.1)] text-[#0f766e] border-[rgba(15,118,110,0.2)]',
    pending:   'bg-[rgba(245,158,11,0.1)] text-[#b45309] border-[rgba(245,158,11,0.2)]',
    cancelled: 'bg-[#f1f5f9] text-[#64748b] border-[#e2e8f0]',
  };
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-[#f1f5f9] px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <span className=" font-bold text-[#1e293b] text-[20px]">{booking.ref}</span>
        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${statusStyles[booking.status] ?? statusStyles.pending}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
      <div className="px-6 py-5 space-y-3">
        {([
          ['Visitor Name', booking.name],
          ['Museum', booking.museum],
          ['Visit Date', new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
          ['Time Slot', booking.timeSlot],
          ['Group Size', String(booking.groupSize)],
          ['Group Type', booking.groupType],
          ['Contact', booking.contact],
          ...(booking.email ? [['Email', booking.email]] : []),
          ...(booking.specialRequirements ? [['Special Requirements', booking.specialRequirements]] : []),
        ] as [string, string][]).map(([l, v]) => (
          <div key={l} className="flex justify-between items-start gap-4">
            <span className=" font-semibold text-[#64748b] text-[13px] shrink-0">{l}</span>
            <span className=" text-[#1e293b] text-[13px] text-right">{v}</span>
          </div>
        ))}
      </div>
      {!isCancelled && (
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex gap-3">
          <button onClick={onModify}
            className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
            Request Modification
          </button>
          <button onClick={onCancel}
            className="flex-1 h-10 border border-[rgba(172,0,0,0.3)] rounded-[6px] font-semibold text-[#AC0000] text-[13px] bg-white hover:bg-[rgba(172,0,0,0.05)] transition-colors">
            Cancel Booking
          </button>
        </div>
      )}
      {isCancelled && (
        <div className="px-6 py-4 border-t border-[#e2e8f0]">
          <p className=" text-[#64748b] text-[13px] text-center">This booking has been cancelled.</p>
        </div>
      )}
    </div>
  );
}

function ModifyModal({ booking, onSave, onClose }: {
  booking: PublicBooking;
  onSave: (updates: Partial<PublicBooking>) => void;
  onClose: () => void;
}) {
  const GROUP_TYPES = ['Individual', 'School Group', 'Senior Group', 'Private Tour', 'Government Group'];
  const TIME_SLOTS  = ['09:00–10:00', '10:00–11:00', '11:00–12:00', '13:00–14:00', '14:00–15:00', '15:00–16:00', '16:00–17:00'];
  const [form, setForm] = useState({
    groupSize:           String(booking.groupSize),
    groupType:           booking.groupType,
    date:                booking.date,
    timeSlot:            booking.timeSlot,
    specialRequirements: booking.specialRequirements,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const up = (f: string, v: string) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.groupSize || Number(form.groupSize) < 1) errs.groupSize = 'Group size must be at least 1.';
    if (!form.date) errs.date = 'Visit date is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ groupSize: Number(form.groupSize), groupType: form.groupType, date: form.date, timeSlot: form.timeSlot, specialRequirements: form.specialRequirements });
  };

  const iCls = (err?: string) => `w-full border rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none transition-colors ${err ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus:border-[#334155]'}`;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h3 className=" font-bold text-[#1e293b] text-[18px]">Modify Booking — {booking.ref}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Group Size <span className="text-[#AC0000]">*</span></label>
              <input type="number" min={1} max={9999} value={form.groupSize} onChange={e => up('groupSize', e.target.value)} className={iCls(errors.groupSize)} />
              {errors.groupSize && <p className="mt-1 text-[#AC0000] text-[12px]">{errors.groupSize}</p>}
            </div>
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Group Type</label>
              <select value={form.groupType} onChange={e => up('groupType', e.target.value)} className={iCls()}>
                {GROUP_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Visit Date <span className="text-[#AC0000]">*</span></label>
              <input type="date" value={form.date} onChange={e => up('date', e.target.value)} className={iCls(errors.date)} />
              {errors.date && <p className="mt-1 text-[#AC0000] text-[12px]">{errors.date}</p>}
            </div>
            <div>
              <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Time Slot</label>
              <select value={form.timeSlot} onChange={e => up('timeSlot', e.target.value)} className={iCls()}>
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Special Requirements <span className="font-normal text-[#64748b]">(optional)</span></label>
            <textarea rows={2} value={form.specialRequirements} onChange={e => up('specialRequirements', e.target.value)} maxLength={300}
              className="w-full border border-[#e2e8f0] focus:border-[#334155] rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none resize-none" />
            <p className="text-right text-[11px] text-[#94a3b8] mt-0.5">{form.specialRequirements.length}/300</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">Save Changes</button>
            <button type="button" onClick={onClose} className="px-5 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookingLookupView() {
  const scheduling = useScheduling();
  const [cancelRef, setCancelRef] = useState<string | null>(null);
  const [modifyRef, setModifyRef] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const myRefs = scheduling.myBookingRefs;
  const foundBookings = myRefs
    .map(ref => scheduling.getBookingByRef(ref))
    .filter((b): b is PublicBooking => b !== undefined);

  const bookingToCancel = cancelRef ? scheduling.getBookingByRef(cancelRef) ?? null : null;
  const bookingToModify = modifyRef ? scheduling.getBookingByRef(modifyRef) ?? null : null;

  const handleCancel = () => {
    if (!bookingToCancel) return;
    scheduling.cancelBooking(bookingToCancel.ref);
    scheduling.addNotification({
      notificationType: 'Booking Update',
      bookingId: bookingToCancel.ref,
      museum: bookingToCancel.museum,
      recipient: bookingToCancel.email || bookingToCancel.contact,
      channel: bookingToCancel.email ? 'Email' : 'SMS',
      notificationStatus: 'Sent',
      message: `Booking ${bookingToCancel.ref} has been cancelled by the visitor.`,
    });
    setCancelRef(null);
    showToast(`Booking ${bookingToCancel.ref} has been cancelled.`);
  };

  const handleModifySave = (updates: Partial<PublicBooking>) => {
    if (!bookingToModify) return;
    const isReset = bookingToModify.status === 'confirmed';
    if (isReset) {
      updates.status = 'pending';
    }
    scheduling.updateBooking(bookingToModify.ref, updates);
    scheduling.addNotification({
      notificationType: 'Booking Update',
      bookingId: bookingToModify.ref,
      museum: bookingToModify.museum,
      recipient: bookingToModify.email || bookingToModify.contact,
      channel: bookingToModify.email ? 'Email' : 'SMS',
      notificationStatus: 'Sent',
      message: `Booking ${bookingToModify.ref} has been modified by the visitor${isReset ? ' and is pending re-approval' : ''}.`,
    });
    setModifyRef(null);
    showToast(`Booking ${bookingToModify.ref} updated${isReset ? ' and pending re-approval' : ''}.`);
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-10">
      {toast && (
        <div className="fixed top-6 right-6 z-[200] bg-white border border-[rgba(15,118,110,0.3)] rounded-xl shadow-xl px-5 py-4 flex items-start gap-3 max-w-sm">
          <div className="w-8 h-8 bg-[rgba(15,118,110,0.1)] rounded-full flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="flex-1 text-[#64748b] text-[13px] mt-1">{toast}</p>
          <button onClick={() => setToast('')} className="text-[#94a3b8] hover:text-[#1e293b]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <h2 className="font-bold text-[#1e293b] text-[28px] leading-[36px] mb-2">My Booking</h2>
      <p className="text-[#64748b] text-[16px] leading-[29px] mb-8">
        Your bookings appear here after you submit them. Each booking is private to your session.
      </p>

      {foundBookings.length === 0 && (
        <div className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl p-12 text-center">
          <svg className="w-12 h-12 text-[#cbd5e1] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className=" font-semibold text-[#1e293b] text-[16px] mb-2">No bookings yet</p>
          <p className=" text-[#64748b] text-[14px] leading-[22px] max-w-sm mx-auto">
            Go to the Schedule Browser, select a museum, date, and time slot, then fill out the booking form to create your first visit.
          </p>
        </div>
      )}

      {foundBookings.length > 0 && (
        <div className="space-y-4">
          {foundBookings.map(b => (
            <BookingCard
              key={b.ref}
              booking={b}
              onCancel={() => setCancelRef(b.ref)}
              onModify={() => setModifyRef(b.ref)}
            />
          ))}
        </div>
      )}

      {cancelRef && bookingToCancel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setCancelRef(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 bg-[rgba(172,0,0,0.1)] rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-[#AC0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className=" font-bold text-[#1e293b] text-[18px] text-center mb-2">Cancel Your Booking?</h3>
            <p className=" text-[#64748b] text-[13px] leading-[22px] text-center mb-1">
              Booking <strong>{bookingToCancel.ref}</strong> for <strong>{bookingToCancel.name}</strong> will be permanently cancelled.
            </p>
            <p className=" text-[#64748b] text-[13px] leading-[22px] text-center mb-5">
              This action cannot be undone. A cancellation notice will be sent to your contact.
            </p>
            <div className="flex gap-3">
              <button onClick={handleCancel}
                className="flex-1 bg-[#AC0000] hover:bg-[#8b0000] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">
                Confirm Cancellation
              </button>
              <button onClick={() => setCancelRef(null)}
                className="flex-1 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {modifyRef && bookingToModify && (
        <ModifyModal
          booking={bookingToModify}
          onSave={handleModifySave}
          onClose={() => setModifyRef(null)}
        />
      )}
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQView() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="max-w-[800px] mx-auto px-6 py-10">
      <h2 className=" font-bold text-[#1e293b] text-[28px] leading-[36px] mb-2">Frequently Asked Questions</h2>
      <p className=" text-[#64748b] text-[16px] leading-[29px] mb-8">Everything you need to know about planning your museum visit.</p>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
              <span className=" font-semibold text-[#1e293b] text-[14px]">{item.q}</span>
              <svg className={`w-4 h-4 text-[#64748b] shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open === i && (
              <div className="px-6 pb-4 border-t border-[#f1f5f9]">
                <p className=" text-[#64748b] text-[14px] leading-[22.75px] pt-3">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

export function SchedulingPublicView() {
  const navigate = useNavigate();
  const scheduling = useScheduling();
  const [selectedMuseum, setSelectedMuseum] = useState<string | null>(null);
  const [view, setView] = useState<PublicView>('browser');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const tabs: { id: PublicView; label: string }[] = [
    { id: 'browser', label: 'Schedule Browser' },
    { id: 'lookup',  label: 'My Booking' },
    { id: 'faq',     label: 'FAQ & Help' },
  ];

  const handleSlotSelect   = (slot: TimeSlot) => { setSelectedSlot(slot); setView('booking-form'); };
  const handleConfirm      = async (b: Booking) => {
    const displayName = [b.firstName, b.middleName, b.lastName].filter(Boolean).join(' ');
    try {
      const bookingId = await scheduling.addBooking({
        ref:                 b.reference,
        museum:              b.gallery,
        date:                b.visitDate,
        timeSlot:            b.timeSlot.replace(' – ', '–'),
        groupSize:           b.numberOfVisitors,
        name:                displayName,
        email:               b.email,
        contact:             b.contact,
        groupType:           b.bookingType,
        specialRequirements: b.specialRequest,
        status:              'pending',
        submittedAt:         new Date().toISOString(),
        bookingType:         'Pre-booked',
        visitorType:         b.visitorType,
      });
      scheduling.addMyBookingRef(bookingId);
      if (b.email) {
        scheduling.addNotification({
          notificationType:   'Booking Confirmation',
          bookingId:          bookingId,
          museum:             b.gallery,
          recipient:          b.email,
          channel:            'Email',
          notificationStatus: 'Sent',
          message: `Booking ${bookingId} confirmed for ${displayName} — ${b.visitDate}, ${b.timeSlot.replace(' – ', '–')} at ${b.gallery}.`,
        });
      }
      setConfirmedBooking(b); setView('confirmation');
    } catch {
      alert('Failed to submit booking. Please check your connection and try again.');
    }
  };
  const handleNewBooking   = ()               => { setSelectedSlot(null); setConfirmedBooking(null); setView('browser'); };
  const handleChangeMuseum = ()               => { setSelectedMuseum(null); setView('browser'); setSelectedSlot(null); setConfirmedBooking(null); };

  // ── Step 1: Museum selection gate ─────────────────────────────────────────
  if (!selectedMuseum) {
    return <MuseumGateView onSelect={setSelectedMuseum} />;
  }

  // ── Step 2: Full scheduling interface (scoped to chosen museum) ───────────
  return (
    <div className="w-full min-h-screen bg-[#f8fafc]">

      {/* Museum context banner */}
      <div className="bg-[#1e293b] px-6 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[rgba(255,255,255,0.7)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className=" text-[rgba(255,255,255,0.6)] text-[12px]">Selected Museum:</span>
            <span className=" font-semibold text-white text-[13px]">{selectedMuseum}</span>
          </div>
          <button onClick={handleChangeMuseum} className="text-[rgba(255,255,255,0.65)] hover:text-white text-[12px] font-semibold underline underline-offset-2 transition-colors whitespace-nowrap">
            Change Museum
          </button>
        </div>
      </div>

      {/* Tab navigation — true centered tabs, back button on right */}
      <div className="bg-white border-b border-[#e2e8f0] sticky top-[56px] z-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-stretch">
            {/* Left spacer */}
            <div className="flex-1" />
            {/* Centered tabs */}
            <div className="flex items-center">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setView(tab.id)}
                  className={`px-6 py-4 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    view === tab.id || (view === 'booking-form' && tab.id === 'browser') || (view === 'confirmation' && tab.id === 'browser')
                      ? 'border-[#334155] text-[#1e293b]'
                      : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Right spacer + back button */}
            <div className="flex-1 flex items-center justify-end">
              <button onClick={() => navigate('/')} className="text-[13px] text-[#64748b] hover:text-[#1e293b] transition-colors whitespace-nowrap">
                ← Back to Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-[1400px] mx-auto w-full">
        {view === 'browser'      && <ScheduleBrowser onSelectSlot={handleSlotSelect} museumName={selectedMuseum} />}
        {view === 'booking-form' && selectedSlot     && <BookingFormView slot={selectedSlot} onConfirm={handleConfirm} onCancel={() => setView('browser')} />}
        {view === 'confirmation' && confirmedBooking && <BookingConfirmationView booking={confirmedBooking} onNewBooking={handleNewBooking} />}
        {view === 'lookup'       && <BookingLookupView />}
        {view === 'faq'          && <FAQView />}
      </div>
    </div>
  );
}
