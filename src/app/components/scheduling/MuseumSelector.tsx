// Shared museum catalogue and gate component for Staff & Curator scheduling views

export const MUSEUMS_LIST = [
  { id: 'm1', name: 'Peñafrancia Museum',            type: 'Regional History & Culture', hours: 'Mon–Sun · 8:00 AM – 6:00 PM' },
  { id: 'm2', name: 'Museo del Seminario Conciliar',  type: 'Ecclesiastical History',      hours: 'Mon–Sat · 9:00 AM – 5:00 PM' },
  { id: 'm3', name: 'UNC Museum',                     type: 'Academic Heritage',           hours: 'Mon–Fri · 8:00 AM – 5:00 PM' },
  { id: 'm4', name: 'Jesse M. Robredo Museum',        type: 'Political & Social History',  hours: 'Tue–Sun · 9:00 AM – 5:00 PM' },
  { id: 'm5', name: 'Museo Hayskulano',               type: 'Education History',           hours: 'Mon–Sat · 8:00 AM – 5:00 PM' },
];

interface MuseumSelectorGateProps {
  onSelect: (name: string) => void;
  role: 'staff' | 'curator';
}

export function MuseumSelectorGate({ onSelect, role }: MuseumSelectorGateProps) {
  const roleLabel  = role === 'curator' ? 'Curator' : 'Staff';
  const roleColor  = role === 'curator' ? '#AC0000' : '#334155';
  const roleBorder = role === 'curator' ? 'rgba(172,0,0,0.15)' : 'rgba(51,65,85,0.15)';
  const roleBg     = role === 'curator' ? 'rgba(172,0,0,0.08)' : 'rgba(51,65,85,0.08)';

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-5 border"
            style={{ background: roleBg, borderColor: roleBorder }}>
            <svg className="w-4 h-4" style={{ color: roleColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className=" font-semibold text-[12px] tracking-[0.35px] uppercase"
              style={{ color: roleColor }}>
              {roleLabel} Portal — Select Active Museum
            </span>
          </div>
          <h1 className=" font-bold text-[#1e293b] text-[32px] leading-[40px] mb-3">
            Which museum are you working at today?
          </h1>
          <p className=" text-[#64748b] text-[15px] leading-[27px] max-w-[520px] mx-auto">
            Select your active museum. All logbook entries, staff assignments, attendance reports, and scheduling views will be scoped exclusively to this museum until you change it.
          </p>
        </div>

        {/* Museum cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MUSEUMS_LIST.map(museum => (
            <button
              key={museum.id}
              onClick={() => onSelect(museum.name)}
              className="group bg-white border border-[#e2e8f0] rounded-xl p-5 text-left hover:border-[#334155] hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <span className="inline-block px-2.5 py-1 bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] rounded-full text-[10px]  font-semibold mb-3">
                {museum.type}
              </span>
              <h3 className=" font-bold text-[#1e293b] text-[15px] leading-[22px] mb-2 group-hover:text-[#334155] transition-colors flex-1">
                {museum.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[#64748b] text-[12px] mb-4">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="">{museum.hours}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
                <span className=" font-semibold text-[#334155] text-[13px] group-hover:text-[#1e293b]">
                  Set as Active
                </span>
                <svg className="w-4 h-4 text-[#64748b] group-hover:text-[#334155] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center  text-[#94a3b8] text-[12px] mt-8">
          You can change your active museum at any time using the "Change Museum" control in the interface header.
        </p>
      </div>
    </div>
  );
}

/** Compact context banner shown at the top of staff/curator scheduling interfaces */
export function MuseumContextBanner({ museumName, onChange }: { museumName: string; onChange?: () => void }) {
  return (
    <div className="bg-[#1e293b] px-6 py-2.5">
      <div className="flex items-center justify-between gap-4 max-w-full">
        <div className="flex items-center gap-2.5">
          <svg className="w-4 h-4 text-[rgba(255,255,255,0.7)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className=" text-[rgba(255,255,255,0.6)] text-[12px]">Active Museum:</span>
          <span className=" font-semibold text-white text-[13px]">{museumName}</span>
        </div>
        {onChange && (
          <button onClick={onChange}
            className="text-[rgba(255,255,255,0.65)] hover:text-white text-[12px] font-semibold underline underline-offset-2 transition-colors whitespace-nowrap">
            Change Museum
          </button>
        )}
      </div>
    </div>
  );
}
