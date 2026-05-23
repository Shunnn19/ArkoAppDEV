import { useState } from 'react';
import type React from 'react';
import { useScheduling } from './SchedulingContext';
import type { NotificationRecord } from './SchedulingContext';

type NotifFilterKey =
  | 'all'
  | 'unread'
  | 'Booking Confirmation'
  | 'Booking Update'
  | 'Staff Assignment'
  | 'Scheduling Conflict'
  | 'Incomplete Logbook'
  | 'High Visitor Load'
  | 'Template Update'
  | 'Upcoming Visit';

const TYPE_STYLES: Record<string, string> = {
  'Booking Confirmation': 'bg-[rgba(15,118,110,0.1)] text-[#0f766e] border-[rgba(15,118,110,0.2)]',
  'Booking Update':       'bg-[rgba(51,65,85,0.1)] text-[#334155] border-[rgba(51,65,85,0.2)]',
  'Staff Assignment':     'bg-[rgba(99,102,241,0.1)] text-[#6366f1] border-[rgba(99,102,241,0.2)]',
  'Scheduling Conflict':  'bg-[rgba(172,0,0,0.1)] text-[#AC0000] border-[rgba(172,0,0,0.2)]',
  'Incomplete Logbook':   'bg-[rgba(245,158,11,0.1)] text-[#b45309] border-[rgba(245,158,11,0.2)]',
  'High Visitor Load':    'bg-[rgba(245,158,11,0.1)] text-[#b45309] border-[rgba(245,158,11,0.2)]',
  'Template Update':      'bg-[rgba(51,65,85,0.1)] text-[#334155] border-[rgba(51,65,85,0.2)]',
  'Upcoming Visit':       'bg-[rgba(99,102,241,0.1)] text-[#6366f1] border-[rgba(99,102,241,0.2)]',
};

const STATUS_STYLE = (s: string) =>
  s === 'Sent'
    ? 'bg-[rgba(15,118,110,0.1)] text-[#0f766e] border-[rgba(15,118,110,0.2)]'
    : s === 'Failed'
    ? 'bg-[rgba(172,0,0,0.1)] text-[#AC0000] border-[rgba(172,0,0,0.2)]'
    : 'bg-[rgba(245,158,11,0.1)] text-[#b45309] border-[rgba(245,158,11,0.2)]';

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-[200] bg-white border border-[rgba(15,118,110,0.3)] rounded-xl shadow-xl px-5 py-4 flex items-start gap-3 max-w-sm">
      <div className="w-8 h-8 bg-[rgba(15,118,110,0.1)] rounded-full flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <p className="flex-1 text-[#64748b] text-[13px] mt-1">{msg}</p>
      <button onClick={onClose} className="text-[#94a3b8] hover:text-[#1e293b]">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
}

function DetailModal({ notif, onClose, onRetry }: {
  notif: NotificationRecord;
  onClose: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#1e293b] text-[18px]">Notification Details</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${TYPE_STYLES[notif.notificationType] ?? TYPE_STYLES['Booking Update']}`}>
              {notif.notificationType}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLE(notif.notificationStatus)}`}>
              {notif.notificationStatus}
            </span>
          </div>
          <div className="bg-[#f8fafc] rounded-lg p-4">
            <p className="text-[#1e293b] text-[13px] leading-[22px]">{notif.message}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([
              ['Link', notif.bookingId || notif.assignmentId || notif.scheduleId || '—'],
              ['Museum', notif.museum],
              ['Recipient', notif.recipient],
              ['Channel', notif.channel],
              ['Date / Time', notif.createdAt.slice(0, 16).replace('T', ' ')],
              ['Read', notif.isRead ? 'Yes' : 'No'],
            ] as [string, string][]).map(([l, v]) => (
              <div key={l}>
                <p className="font-semibold text-[#64748b] text-[11px] mb-0.5">{l}</p>
                <p className="text-[#1e293b] text-[13px] break-all">{v}</p>
              </div>
            ))}
          </div>
          {notif.notificationStatus === 'Failed' && (
            <button onClick={onRetry}
              className="w-full bg-[#334155] hover:bg-[#1e293b] text-white font-semibold text-[13px] h-10 rounded-[6px] transition-colors">
              Retry Notification
            </button>
          )}
          <button onClick={onClose}
            className="w-full h-9 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#1e293b] text-[13px] bg-white hover:bg-[#f8fafc]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter({ museumName }: { museumName: string }) {
  const scheduling = useScheduling();
  const [filter, setFilter] = useState<NotifFilterKey>('all');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const museumNotifs = scheduling.notifications
    .filter(n => n.museum === museumName)
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const filtered = museumNotifs.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter !== 'all') return n.notificationType === filter;
    return true;
  });

  const unreadCount = museumNotifs.filter(n => !n.isRead).length;
  const detailNotif = detailId ? scheduling.notifications.find(n => n.id === detailId) ?? null : null;

  const filterTabs: { key: NotifFilterKey; label: string }[] = [
    { key: 'all',                  label: 'All'                                    },
    { key: 'unread',               label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { key: 'Booking Confirmation', label: 'Booking'                                },
    { key: 'Staff Assignment',     label: 'Assignment'                             },
    { key: 'Scheduling Conflict',  label: 'Conflict'                               },
    { key: 'Incomplete Logbook',   label: 'Attendance'                             },
  ];

  const handleOpen = (n: NotificationRecord) => {
    setDetailId(n.id);
    if (!n.isRead) scheduling.markNotificationRead(n.id);
  };

  const handleRetry = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    scheduling.retryNotification(id);
    showToast('Notification resent successfully.');
  };

  const markAllRead = () => {
    museumNotifs.filter(n => !n.isRead).forEach(n => scheduling.markNotificationRead(n.id));
    showToast('All notifications marked as read.');
  };

  return (
    <div className="p-8">
      {toast && <Toast msg={toast} onClose={() => setToast('')} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-[#1e293b] text-[22px] leading-[28px]">Notification Center</h2>
          <p className="text-[#64748b] text-[14px] mt-1">
            System alerts and messages for <strong>{museumName}</strong>.
            {unreadCount > 0 && <span className="text-[#AC0000] font-semibold ml-1">{unreadCount} unread.</span>}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="h-9 px-4 border border-[#e2e8f0] rounded-[6px] font-semibold text-[#64748b] text-[12px] bg-white hover:bg-[#f8fafc] transition-colors">
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filterTabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-colors ${
              filter === t.key
                ? 'bg-[#334155] text-white border-[#334155]'
                : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#334155] hover:text-[#1e293b]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-10 text-center shadow-sm">
          <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="font-semibold text-[#1e293b] text-[14px] mb-1">No notifications</p>
          <p className="text-[#64748b] text-[13px]">
            {filter !== 'all' ? 'No notifications match this filter.' : 'No notifications recorded for this museum yet.'}
          </p>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="mt-3 text-[#334155] font-semibold text-[12px] underline">
              View all notifications
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id}
              onClick={() => handleOpen(n)}
              className={`bg-white rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                !n.isRead ? 'border-l-4 border-[#334155] border border-[#e2e8f0]' : 'border border-[#e2e8f0]'
              }`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 mt-0.5 ${TYPE_STYLES[n.notificationType] ?? TYPE_STYLES['Booking Update']}`}>
                    {n.notificationType}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] leading-[20px] ${!n.isRead ? 'font-semibold text-[#1e293b]' : 'text-[#1e293b]'}`}>
                      {n.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {n.channel === 'System Alert' ? (
                        <>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border border-[#334155]/20 bg-[#334155]/5 text-[#334155]">Curator only</span>
                          <span className="text-[#64748b] text-[11px]">Internal</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#64748b] text-[11px]">To: {n.recipient}</span>
                          <span className="text-[#64748b] text-[11px]">via {n.channel}</span>
                        </>
                      )}
                      <span className="text-[#64748b] text-[11px]">{n.createdAt.slice(0, 16).replace('T', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLE(n.notificationStatus)}`}>
                    {n.notificationStatus}
                  </span>
                  {n.notificationStatus === 'Failed' && (
                    <button onClick={e => handleRetry(e, n.id)}
                      className="h-7 px-2.5 border border-[rgba(172,0,0,0.3)] rounded-md font-semibold text-[#AC0000] text-[11px] bg-white hover:bg-[rgba(172,0,0,0.05)] transition-colors">
                      Retry
                    </button>
                  )}
                  {!n.isRead && <div className="w-2 h-2 bg-[#334155] rounded-full shrink-0" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detailNotif && (
        <DetailModal
          notif={detailNotif}
          onClose={() => setDetailId(null)}
          onRetry={() => {
            scheduling.retryNotification(detailNotif.id);
            showToast('Notification resent.');
            setDetailId(null);
          }}
        />
      )}
    </div>
  );
}
