import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
  Video, 
  Clock, 
  Calendar, 
  ChevronRight, 
  History, 
  Play, 
  Search,
  MonitorPlay,
  UserCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentLiveSchedule = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        const { data } = await axios.get('/student/live-alerts');
        setLiveSessions(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching live sessions');
        setLoading(false);
      }
    };
    fetchLiveSessions();
  }, []);

  const filteredUpcoming = liveSessions.filter(s => 
    (s.status === 'live' || s.status === 'upcoming') &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPast = liveSessions.filter(s => 
    s.status === 'ended' &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <MonitorPlay className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-20 p-4 md:p-10 lg:px-12 bg-slate-50/30">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[#002147] tracking-tighter uppercase italic leading-none">
            Live & <span className="text-[#f16126]">Schedule</span> Class
          </h1>
          <p className="text-slate-400 font-bold italic mt-2 text-sm md:text-base uppercase tracking-widest leading-none">Access your virtual classroom and upcoming sessions.</p>
        </div>

        <div className="relative group w-full lg:w-96 shadow-2xl shadow-[#002147]/5">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#f16126] transition-colors" />
          <input 
            type="text" 
            placeholder="Search classes or subjects..." 
            className="w-full pl-14 pr-8 py-5 bg-white rounded-3xl border-2 border-transparent focus:border-[#f16126] focus:outline-none text-[11px] font-black uppercase tracking-widest shadow-inner transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-2.5 h-2.5 bg-[#f16126] rounded-full animate-ping" />
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#002147]">Active & Upcoming</h2>
          </div>
          
          {filteredUpcoming.length === 0 ? (
            <div className="py-24 bg-white/50 backdrop-blur-sm rounded-[48px] border-2 border-dashed border-slate-100 text-center space-y-4">
               <Video className="w-12 h-12 text-slate-200 mx-auto" />
               <p className="text-slate-400 font-black text-xs uppercase tracking-widest italic">No sessions scheduled for your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {filteredUpcoming.map((session, idx) => (
                  <div key={idx} className={`p-8 md:p-10 rounded-[48px] border-2 transition-all group relative overflow-hidden flex flex-col justify-between h-full ${
                     session.status === 'live' ? 'bg-[#002147] border-[#002147] text-white shadow-3xl shadow-[#002147]/30' : 'bg-white border-slate-50 hover:border-[#f16126]/20 shadow-xl shadow-indigo-900/5'
                  }`}>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                     
                     <div className="space-y-8 relative z-10">
                        <div className="flex items-center justify-between gap-4">
                           <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              session.status === 'live' ? 'bg-[#f16126] text-white border-white/10' : 'bg-orange-50 text-[#f16126] border-orange-100'
                           }`}>
                              {session.status === 'live' ? 'LIVE NOW' : 'UPCOMING'}
                           </div>
                           <div className="flex items-center gap-2 group-hover:scale-110 transition-transform">
                              <Clock className={`w-4 h-4 ${session.status === 'live' ? 'text-indigo-300' : 'text-slate-300'}`} />
                              <span className={`text-xs font-black italic tracking-tighter ${session.status === 'live' ? 'text-white' : 'text-[#002147]'}`}>
                                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <p className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${session.status === 'live' ? 'text-indigo-300' : 'text-[#f16126]'}`}>
                              {(() => {
                                const level = String(session.classLevel || '').replace(/class/gi, '').trim();
                                if (level === '11') return 'Inter 1st Year';
                                if (level === '12') return 'Inter 2nd Year';
                                return `Class ${level}`;
                              })()}
                              <span className="mx-2 opacity-30">|</span>
                              {session.subjectName || 'Expert Subject'}
                           </p>
                           <h3 className={`text-2xl md:text-3xl font-black truncate uppercase tracking-tighter leading-none ${session.status === 'live' ? 'text-white' : 'text-[#002147]'}`}>{session.title}</h3>
                        </div>

                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              session.status === 'live' ? 'bg-white/10 border-white/10' : 'bg-slate-50 border-slate-100'
                           }`}>
                              <UserCircle className="w-5 h-5" />
                           </div>
                           <div className="min-w-0">
                              <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${session.status === 'live' ? 'text-indigo-200' : 'text-slate-400'}`}>Lead Faculty</p>
                              <p className="font-extrabold text-sm uppercase italic truncate">{session.teacherId?.name || 'Academic Expert'}</p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-10 relative z-10">
                        {session.status === 'live' ? (
                           <a 
                             href={session.link}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full py-6 bg-white text-[#002147] rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:bg-[#f16126] hover:text-white transition-all active:scale-95"
                           >
                              Enter Classroom <Play className="w-5 h-5 fill-current" />
                           </a>
                        ) : (
                           <div className="w-full py-6 bg-slate-50 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 border border-slate-100">
                              Starts in {Math.max(0, Math.ceil((new Date(session.startTime) - new Date()) / (1000 * 60)))} Mins
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#002147]">Past Sessions Archive</h2>
          </div>
          
          {filteredPast.length === 0 ? (
            <div className="py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100 text-center space-y-4">
               <History className="w-12 h-12 text-slate-200 mx-auto" />
               <p className="text-slate-400 font-black text-xs uppercase tracking-widest italic">No past sessions found for your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredPast.map((session, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[36px] border border-slate-50 hover:border-indigo-100 hover:shadow-xl transition-all group overflow-hidden relative">
                  <div className="flex items-start gap-6 relative z-10">
                     <div className="w-16 h-16 bg-slate-50 text-[#002147] rounded-3xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:rotate-6 transition-transform">
                        <Play className="w-7 h-7 fill-current opacity-50" />
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                           <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md text-[8px] font-black uppercase tracking-widest shrink-0">Ended</span>
                           <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
                              {(() => {
                                const level = String(session.classLevel || '').replace(/class/gi, '').trim();
                                if (level === '11') return 'Inter 1st Year';
                                if (level === '12') return 'Inter 2nd Year';
                                return `Class ${level}`;
                              })()}
                              <span className="opacity-30">|</span>
                              <span className="italic">{session.board || 'Mye3 Board'}</span>
                           </div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-[#002147] truncate uppercase tracking-tighter leading-none mb-3 group-hover:text-indigo-600 transition-colors">
                          {session.title}
                        </h3>
                        <div className="flex items-center gap-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <UserCircle className="w-4 h-4 text-indigo-400" /> {session.teacherId?.name || 'Expert Mentor'}
                          </p>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest tabular-nums italic">
                             {new Date(session.startTime).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLiveSchedule;
