import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, BookOpen, Clock, Loader2 } from 'lucide-react';

const LiveSchedule = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const { data } = await axios.get('/teacher/live-sessions');
      setSessions(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/teacher/live-sessions/${id}/status`, { status });
      fetchSessions();
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 p-4 md:p-8 pb-20">
      <div className="space-y-1">
         <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight italic uppercase">My Live Classes</h1>
         <p className="text-slate-500 font-bold italic text-sm md:text-base">View your assigned live broadcasts and upcoming sessions</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-teal-900/5">
          <div className="space-y-6">
              {sessions.length === 0 ? (
                <div className="py-20 text-center bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-100">
                   <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic">No sessions found in your schedule.</p>
                </div>
              ) : (
                sessions.filter(s => s.status !== 'ended').map((s, i) => (
                  <div key={i} className={`p-6 md:p-10 rounded-[24px] border-2 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 ${
                    s.status === 'live' ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100 shadow-sm'
                  }`}>
                    <div className="space-y-3 min-w-0 flex-1">
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 text-[9px] font-black rounded-lg uppercase tracking-widest ${
                            s.status === 'live' ? 'bg-rose-600 text-white animate-pulse' : 'bg-teal-600 text-white'
                          }`}>
                            {s.status === 'live' ? 'Live Now' : 'Upcoming'}
                          </span>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {new Date(s.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <p className="font-black text-slate-900 text-2xl md:text-3xl tracking-tight leading-none truncate uppercase">{s.title}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic flex items-center gap-2">
                           <BookOpen className="w-3.5 h-3.5" /> {s.classLevel} • {s.subjectName}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        {s.status === 'upcoming' && (
                          <button 
                            onClick={() => handleUpdateStatus(s._id, 'live')}
                            className="w-full lg:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-teal-600 transition-all shadow-2xl"
                          >
                            START LIVE CLASS
                          </button>
                        )}
                        {s.status === 'live' && (
                          <div className="flex items-center gap-4 w-full">
                             <a 
                               href={s.link} target="_blank" rel="noopener noreferrer"
                               className="flex-1 lg:flex-none px-8 py-5 bg-white text-rose-600 border-2 border-rose-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-rose-50 transition-all text-center"
                             >
                               Join Class
                             </a>
                             <button 
                               onClick={() => handleUpdateStatus(s._id, 'ended')}
                               className="flex-1 lg:flex-none px-10 py-5 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-rose-700 transition-all shadow-2xl"
                             >
                               End Class
                             </button>
                          </div>
                        )}
                    </div>
                  </div>
                ))
              )}
          </div>
      </div>
    </div>
  );
};

export default LiveSchedule;
