import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Video, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Radio,
  History,
  UserCircle,
  Play,
  FileText,
  Search,
  BookOpen,
  MonitorPlay
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentLiveSchedule = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('/student/live-alerts');
        setSessions(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching live schedule');
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

   const upcomingSessions = sessions
    .filter(s => s.status === 'live' || s.status === 'upcoming')
    .sort((a, b) => {
      // Live first
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (a.status !== 'live' && b.status === 'live') return 1;
      // Then by start time
      return new Date(a.startTime) - new Date(b.startTime);
    });

  const pastSessions = sessions.filter(s => s.status === 'ended');

  const filteredPast = pastSessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.classLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 p-4 md:p-8 lg:px-10 bg-slate-50/30 min-h-screen">
      
      {/* CSS FOR BLINK */}
      <style>{`
        @keyframes custom-blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-live-blink {
          animation: custom-blink 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 max-w-[1400px] mx-auto pt-2">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-50 rounded-xl border border-indigo-100">
             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Broadcast Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Live & <span className="text-indigo-600">Schedule</span> Class
          </h1>
          <p className="text-slate-400 font-bold italic text-xs md:text-sm max-w-xl">
             access real-time classrooms and browse archive sessions.
          </p>
        </div>
      </div>

      {/* UPCOMING & LIVE SECTION */}
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-4 py-1">
           <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">Active Schedule</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {upcomingSessions.length === 0 ? (
            <div className="py-16 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center space-y-4">
               <Calendar className="w-8 h-8 text-slate-200 mx-auto" />
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic">No sessions scheduled.</p>
            </div>
          ) : upcomingSessions.map((session, idx) => (
            <div key={idx} className={`rounded-[32px] p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-2 transition-all group overflow-hidden relative ${
              session.status === 'live' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-indigo-900/20 ring-4 ring-indigo-500/10' : 'bg-white border-slate-50 shadow-sm'
            }`}>
               {session.status === 'live' && (
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none opacity-40" />
               )}

               <div className="flex items-center gap-6 md:gap-8 min-w-0 flex-1 relative z-10">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xl ${session.status === 'live' ? 'bg-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                     {session.status === 'live' ? (
                        <Radio className="w-8 h-8 md:w-10 md:h-10 text-white animate-live-blink" />
                     ) : (
                        <Clock className="w-8 h-8 md:w-10 md:h-10" />
                     )}
                  </div>

                  <div className="space-y-2 min-w-0">
                     <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                           session.status === 'live' ? 'bg-indigo-500 text-white animate-live-blink' : 'bg-slate-100 text-slate-500'
                        }`}>
                           {session.status === 'live' ? 'LIVE NOW' : 'UPCOMING'}
                        </span>
                        <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${session.status === 'live' ? 'text-white/40' : 'text-slate-400'}`}>
                           {new Date(session.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                     </div>
                     <h3 className={`text-xl md:text-3xl font-black truncate uppercase tracking-tighter leading-none ${session.status === 'live' ? 'text-white' : 'text-slate-900'}`}>{session.title}</h3>
                     <div className="flex items-center gap-4">
                        <p className={`font-bold italic text-xs md:text-sm flex items-center gap-2 ${session.status === 'live' ? 'text-white/70' : 'text-slate-500'}`}>
                           <UserCircle className="w-4 h-4" /> {session.teacherId?.name || 'Faculty'}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <p className={`font-black uppercase tracking-widest text-[8px] md:text-[9px] ${session.status === 'live' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                           {session.classLevel} Syllabus
                        </p>
                     </div>
                  </div>
               </div>

               <div className="w-full lg:w-auto relative z-10 flex flex-col gap-3">
                  {session.status === 'live' ? (
                     <a 
                       href={session.link}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="w-full lg:w-auto px-12 py-4 bg-white text-slate-900 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-3 group/btn"
                     >
                        Join Room <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                     </a>
                  ) : (
                     <div className="w-full lg:min-w-[180px] px-8 py-4 bg-slate-100 rounded-[20px] text-slate-400 font-black text-[10px] uppercase tracking-widest cursor-default flex items-center justify-center gap-3">
                        <Clock className="w-4 h-4" /> Waiting
                     </div>
                  )}
                  <Link 
                    to={`/student/classes/${session.classLevel}`}
                    className={`w-full text-center py-2 text-[9px] font-black uppercase tracking-widest hover:underline ${session.status === 'live' ? 'text-white/30 hover:text-white' : 'text-slate-400 hover:text-indigo-600'}`}
                  >
                     Syllabus hub
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAST SESSIONS SECTION */}
      <div className="space-y-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-slate-200 pl-4 py-1">
           <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <History className="w-6 h-6 text-slate-400" /> Past Sessions Archive
           </h2>
           <div className="relative w-full md:w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search sessions or classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all outline-none"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredPast.length === 0 ? (
            <div className="col-span-full py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100 text-center space-y-4">
               <History className="w-12 h-12 text-slate-200 mx-auto" />
               <p className="text-slate-400 font-black text-xs uppercase tracking-widest italic">No past sessions found for your search.</p>
            </div>
          ) : filteredPast.map((session, idx) => (
            <div key={idx} className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-50 flex flex-col gap-10 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all group relative overflow-hidden h-full">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-30" />
               
               <div className="flex items-start gap-6 relative z-10">
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform shrink-0">
                     <Play className="w-7 h-7 fill-current" />
                  </div>
                  <div className="min-w-0">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0">Ended</span>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{session.classLevel}</p>
                     </div>
                     <h3 className="text-lg md:text-xl font-black text-slate-900 truncate uppercase tracking-tighter leading-none mb-2">{session.title}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(session.startTime).toLocaleDateString()} • {session.teacherId?.name || 'Tutor'}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-4 relative z-10 mt-auto">
                  <a 
                    href={session.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95 px-4"
                  >
                     Session Recap <MonitorPlay className="w-4 h-4" />
                  </a>
                  <Link 
                    to={`/student/classes/${session.classLevel}`}
                    className="w-16 py-5 bg-slate-900 text-white rounded-2xl font-black transition-all flex items-center justify-center hover:bg-slate-800 shadow-xl active:scale-95"
                    title="View Class Notes"
                  >
                     <FileText className="w-5 h-5" />
                  </Link>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* SYLLABUS HUB AD */}
      <div className="max-w-[1600px] mx-auto">
         <div className="bg-slate-900 rounded-[50px] p-10 md:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-indigo-600/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl -ml-64 -mb-64" />
            
            <div className="space-y-8 flex-1 relative z-10 text-center lg:text-left">
               <h4 className="text-3xl md:text-4xl font-black uppercase tracking-widest leading-none">
                  Academic <span className="text-indigo-400">Vault</span> Access
               </h4>
               <p className="text-slate-400 font-bold text-sm md:text-xl max-w-xl">
                  Missed something in the live session? Every broadcast is recorded and categorized within your curriculum library for 24/7 access.
               </p>
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                  <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-white/20 transition-all">
                     <BookOpen className="w-6 h-6 text-indigo-400" />
                     <p className="text-[11px] font-black uppercase tracking-widest">Syllabus Mapping</p>
                  </div>
                  <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-white/20 transition-all">
                     <FileText className="w-6 h-6 text-amber-400" />
                     <p className="text-[11px] font-black uppercase tracking-widest">Expert PDF Notes</p>
                  </div>
               </div>
            </div>

            <Link 
              to="/student/classes"
              className="px-14 py-8 bg-indigo-600 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-white hover:text-indigo-900 active:scale-95 transition-all text-center relative z-10 whitespace-nowrap"
            >
               Go to My Classes
            </Link>
         </div>
      </div>
    </div>
  );
};

export default StudentLiveSchedule;
