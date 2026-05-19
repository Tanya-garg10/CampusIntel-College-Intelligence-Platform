import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

const Calendar = () => {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const events = [
    { title: "TCS Ninja Registration Closes", date: "Oct 15, 2026", type: "Placement", urgency: "high" },
    { title: "Mid-Semester Exams Begin", date: "Oct 20, 2026", type: "Academics", urgency: "medium" },
    { title: "Google Generation Scholarship", date: "Nov 5, 2026", type: "Scholarship", urgency: "high" },
    { title: "GDSC Cloud Study Jam", date: "Nov 12, 2026", type: "Clubs", urgency: "low" }
  ];

  const handleSync = () => {
    setSyncing(true);
    setSynced(false);

    // Simulate Google Calendar Sync API Process (Perfect for Hackathon Demos)
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSynced(false);
      }, 5000);
    }, 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2>Smart Academic Calendar</h2>
        
        <button 
          onClick={handleSync} 
          className="btn btn-outline" 
          disabled={syncing}
          style={{ minWidth: '180px', position: 'relative' }}
        >
          {syncing ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              Syncing to Google...
            </span>
          ) : synced ? (
            <span className="flex items-center gap-2" style={{ color: 'var(--success)' }}>
              <CheckCircle size={18} />
              Synced!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CalendarIcon size={18} />
              Sync to Google
            </span>
          )}
        </button>
      </div>

      {/* Styled Inline Keyframes for Spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Beautiful Dynamic Alert Banner */}
      {synced && (
        <div 
          className="mb-6 flex items-center gap-3" 
          style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid rgba(16, 185, 129, 0.3)', 
            color: 'var(--success)', 
            padding: '1rem', 
            borderRadius: '0.75rem',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          <CheckCircle size={20} />
          <div>
            <strong>Google Calendar Synced!</strong> All 4 campus deadlines have been successfully added to your linked Google account.
          </div>
        </div>
      )}

      <div className="glass-panel">
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: '0.75rem', top: 0, bottom: 0, width: '2px', background: 'var(--border-color)' }}></div>
          
          {events.map((ev, idx) => (
            <div key={idx} className="mb-6" style={{ position: 'relative' }}>
              {/* Timeline Dot */}
              <div style={{ 
                position: 'absolute', left: '-2.3rem', top: '0.25rem', width: '1rem', height: '1rem', 
                borderRadius: '50%', background: ev.urgency === 'high' ? 'var(--danger)' : ev.urgency === 'medium' ? 'var(--warning)' : 'var(--success)',
                border: '3px solid var(--bg-card)'
              }}></div>
              
              <div className="card">
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{fontSize: '1.25rem'}}>{ev.title}</h3>
                  <span className={`badge badge-${ev.urgency}`}>{ev.urgency}</span>
                </div>
                
                <div className="flex gap-4 text-secondary mt-3" style={{ fontSize: '0.875rem' }}>
                  <span className="flex items-center gap-1"><Clock size={14} /> {ev.date}</span>
                  <span className="badge badge-outline">{ev.type}</span>
                </div>

                {ev.urgency === 'high' && (
                  <div className="mt-3 text-danger flex items-center gap-2" style={{ fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.25rem' }}>
                    <AlertTriangle size={14} /> High predictive risk of students missing this deadline.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
