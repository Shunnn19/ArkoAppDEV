import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SchedulingPublicView } from './SchedulingPublicView';
import { SchedulingStaffView } from './SchedulingStaffView';
import { SchedulingCuratorView } from './SchedulingCuratorView';
import { MUSEUMS_LIST } from './MuseumSelector';

type Role = 'public' | 'staff' | 'curator';

export function SchedulingApp() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('public');
  const [staffAuthed, setStaffAuthed] = useState(false);
  const [curatorAuthed, setCuratorAuthed] = useState(false);
  const [loginRole, setLoginRole] = useState<'staff' | 'curator' | null>(null);
  const [loginPass, setLoginPass] = useState('');
  const [loginMuseum, setLoginMuseum] = useState('');
  const [loginError, setLoginError] = useState('');
  const [staffMuseum, setStaffMuseum] = useState('');
  const [curatorMuseum, setCuratorMuseum] = useState('');

  const handleAuth = () => {
    if (!loginMuseum) { setLoginError('Please select a museum.'); return; }
    if (loginPass.length < 1) { setLoginError('Please enter a password.'); return; }
    if (loginRole === 'staff') { setStaffAuthed(true); setStaffMuseum(loginMuseum); setRole('staff'); }
    if (loginRole === 'curator') { setCuratorAuthed(true); setCuratorMuseum(loginMuseum); setRole('curator'); }
    setLoginRole(null);
    setLoginPass('');
    setLoginMuseum('');
    setLoginError('');
  };

  const switchRole = (newRole: Role) => {
    if (newRole === 'staff' && !staffAuthed) { setLoginRole('staff'); return; }
    if (newRole === 'curator' && !curatorAuthed) { setLoginRole('curator'); return; }
    setRole(newRole);
  };

  const handleSignOut = () => {
    if (role === 'staff') { setStaffAuthed(false); setStaffMuseum(''); }
    else { setCuratorAuthed(false); setCuratorMuseum(''); }
    setRole('public');
  };

  const resetLogin = () => {
    setLoginRole(null);
    setLoginPass('');
    setLoginMuseum('');
    setLoginError('');
  };

  const inputCls = (hasError: boolean) =>
    `w-full border rounded-lg px-3 py-2 text-[13px] text-[#1e293b] focus:outline-none transition-colors ${hasError ? 'border-[#AC0000]' : 'border-[#e2e8f0] focus:border-[#334155]'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Module Top Header */}
      <header className="bg-[#1e293b] sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span className="text-[13px]">Portal</span>
            </button>
            <span className="text-[rgba(255,255,255,0.3)] text-sm">/</span>
            <span className="font-semibold text-white text-[14px]">Visitor Scheduling & Management</span>
          </div>
        </div>
      </header>

      {/* Role Context Banner */}
      {role !== 'public' && (
        <div className={`py-2 px-6 text-center text-[12px] font-semibold ${role === 'curator' ? 'bg-[rgba(172,0,0,0.1)] text-[#AC0000]' : 'bg-[rgba(51,65,85,0.1)] text-[#334155]'}`}>
          {role === 'staff' ? '🔒 Staff View — Authenticated' : '🔒 Curator View — Authenticated'}
          <button onClick={handleSignOut} className="ml-3 underline opacity-70 hover:opacity-100 font-normal">Sign out</button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {role === 'public'  && <SchedulingPublicView />}
        {role === 'staff'   && <SchedulingStaffView museum={staffMuseum} />}
        {role === 'curator' && <SchedulingCuratorView museum={curatorMuseum} />}
      </div>

      {/* Login Modal */}
      {loginRole && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={resetLogin}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[rgba(51,65,85,0.1)] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#334155]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1e293b] text-[20px] leading-[28px]">
                {loginRole === 'staff' ? 'Staff Login' : 'Curator Login'}
              </h3>
              <p className="text-[#64748b] text-[13px] mt-1">
                Enter your credentials to access the {loginRole} interface.
              </p>
            </div>

            <div className="space-y-4">

              {/* Account Type — read-only */}
              <div>
                <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">Account Type</label>
                <div className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-[13px] text-[#64748b] bg-[#f8fafc] capitalize select-none">
                  {loginRole}
                </div>
              </div>

              {/* Museum */}
              <div>
                <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">
                  Museum <span className="text-[#AC0000]">*</span>
                </label>
                <select
                  value={loginMuseum}
                  onChange={e => { setLoginMuseum(e.target.value); setLoginError(''); }}
                  className={inputCls(!!loginError && !loginMuseum)}
                >
                  <option value="">Select museum…</option>
                  {MUSEUMS_LIST.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-[#1e293b] text-[13px] mb-1">
                  Password <span className="text-[#AC0000]">*</span>
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={e => { setLoginPass(e.target.value); setLoginError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleAuth()}
                  placeholder="Enter any password to demo"
                  className={inputCls(!!loginError && !!loginMuseum && loginPass.length < 1)}
                />
                {loginError && <p className="mt-1 text-[#AC0000] text-[12px]">{loginError}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={handleAuth}
                  className="flex-1 bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors shadow-[0px_1px_3px_rgba(0,0,0,0.1)]">
                  Sign In
                </button>
                <button onClick={resetLogin}
                  className="flex-1 h-10 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc] transition-colors">
                  Cancel
                </button>
              </div>

              <p className="text-[#64748b] text-[11px] text-center leading-[16px]">
                Demo mode: any password grants access to the {loginRole} interface.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
