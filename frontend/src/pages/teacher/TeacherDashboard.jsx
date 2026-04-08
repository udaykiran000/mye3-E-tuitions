import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Clock, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Activity,
  Zap,
  ArrowUpRight,
  MonitorPlay
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    liveCount: 0,
    upcomingCount: 0,
    endedCount: 0,
    studentCount: 0,
    totalAssigned: 0
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, sessionRes] = await Promise.all([
        axios.get('/teacher/dashboard-stats'),
        axios.get('/teacher/live-sessions')
      ]);
      setStats(statsRes.data);
      setSessions(sessionRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/teacher/live-sessions/${id}/status`, { status });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const statCards = [
    { label: 'Enrolled Students', value: stats.studentCount, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Real-time database count' },
    { label: 'Assigned Classes', value: stats.totalAssigned, icon: BookOpen, color: 'text-[#002147]', bg: 'bg-indigo-50', path: '/teacher/classes', sub: 'Across all grades' },
    { label: 'Active Sessions', value: stats.liveCount + stats.upcomingCount, icon: Video, color: 'text-[#f16126]', bg: 'bg-orange-50', path: '/teacher/classes', sub: 'Scheduled for today' },
    { label: 'Past Broadcasts', value: stats.endedCount, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/teacher/past-sessions', sub: 'Archive sessions' },
  ];

  const filteredSessions = sessions.filter(s => {
    if (activeTab === 'live') return s.status === 'live';
    if (activeTab === 'upcoming') return s.status === 'upcoming';
    if (activeTab === 'ended') return s.status === 'ended';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-4 md:p-6 lg:p-8 pb-24 bg-slate-50/30 min-h-screen">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-[#002147]/5 rounded-full w-fit border border-[#002147]/10">
               <Activity className="w-3.5 h-3.5 text-[#002147]" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#002147]">Faculty Command Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
               FACULTY <span className="text-[#f16126] not-italic">OVERVIEW</span>
            </h1>
            <p className="text-slate-500 font-bold italic text-sm md:text-lg max-w-xl">
               Manage your live broadcasts and monitor student enrollment performance.
            </p>
         </div>

         <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 self-start">
            <div className="w-12 h-12 bg-[#002147] rounded-xl flex items-center justify-center text-white shadow-lg shadow-navy-100">
               <Calendar className="w-6 h-6" />
            </div>
            <div className="pr-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Today's Date</p>
               <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
               </p>
            </div>
         </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={idx} 
            className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200 border-t-4 border-t-[#002147]"
          >
             <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0 shadow-md shadow-current/5`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.15em] leading-none mb-1.5">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                   <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none tracking-tighter italic">{stat.value}</p>
                   {stat.path && <ArrowUpRight className="w-4 h-4 text-[#f16126] opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />}
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-1.5 opacity-60">{stat.sub}</p>
             </div>
             {stat.path && <Link to={stat.path} className="absolute inset-0 z-10" />}
          </motion.div>
        ))}
      </div>

      {/* Live Hub Restructure */}
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#f16126] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-900/20">
                  <MonitorPlay className="w-6 h-6" />
               </div>
               <h2 className="text-2xl font-black text-[#002147] tracking-tighter uppercase italic">Live Management <span className="text-[#f16126]">Hub</span></h2>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
               {['all', 'live', 'upcoming', 'ended'].map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                     activeTab === tab ? 'bg-[#002147] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {filteredSessions.length === 0 ? (
              <div className="py-24 text-center space-y-4 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <Zap className="w-10 h-10" />
                 </div>
                 <p className="text-slate-400 font-black uppercase text-sm tracking-widest italic leading-relaxed">
                    No sessions match your current filter.<br/>Check your schedule or create a new session.
                 </p>
              </div>
            ) : (
              filteredSessions.map((s, i) => {
                const startTime = new Date(s.startTime);
                const isLive = s.status === 'live';
                const isEnded = s.status === 'ended';

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={i} 
                    className={`group bg-white p-5 md:p-6 rounded-2xl border transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8 ${
                      isLive ? 'border-[#f16126] shadow-xl shadow-orange-900/10 ring-4 ring-orange-50' : 
                      isEnded ? 'border-slate-100 opacity-60' : 'border-slate-100 hover:border-orange-200 hover:shadow-lg shadow-slate-100'
                    }`}
                  >
                     <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                        {/* Time Badge - Compact */}
                        <div className={`w-full md:w-24 h-24 rounded-2xl flex flex-col items-center justify-center p-3 shadow-lg transition-all duration-500 group-hover:scale-105 ${
                           isLive ? 'bg-[#f16126] text-white shadow-orange-900/20' : 
                           isEnded ? 'bg-slate-100 text-slate-400' : 'bg-[#002147] text-white shadow-navy-900/20'
                        }`}>
                           <p className="text-[8px] font-black uppercase tracking-widest opacity-80 mb-0.5">{startTime.toLocaleDateString('en-GB', { month: 'short' })}</p>
                           <p className="text-2xl font-black leading-none mb-0.5 tracking-tighter">{startTime.toLocaleDateString('en-GB', { day: '2-digit' })}</p>
                           <div className="w-6 h-[1.5px] bg-white/20 my-1" />
                           <p className="text-[9px] font-black">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>

                        <div className="space-y-3">
                           <div className="flex items-center gap-3">
                              <span className={`px-4 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-[0.2em] shadow-sm ${
                                isLive ? 'bg-white text-[#f16126] animate-pulse' :
                                isEnded ? 'bg-slate-200 text-slate-500' : 'bg-orange-50 text-orange-600'
                              }`}>
                                {isLive ? 'Broadcast Active' : isEnded ? 'Archive Ready' : 'Upcoming Session'}
                              </span>
                              <div className="flex items-center gap-2 text-slate-400">
                                 <Clock className="w-3.5 h-3.5" />
                                 <span className="text-[10px] font-black uppercase tracking-widest italic">Wait: {Math.max(0, Math.ceil((startTime - new Date()) / (1000 * 60)))} mins</span>
                              </div>
                           </div>
                           <h3 className="font-black text-slate-900 text-xl md:text-2xl tracking-tighter leading-none uppercase italic group-hover:text-[#002147] transition-colors">{s.title}</h3>
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                 <GraduationCap className="w-3.5 h-3.5" /> {s.classLevel}
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                 <BookOpen className="w-3.5 h-3.5" /> {s.subjectName}
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
                        {s.status === 'upcoming' && (
                          <button 
                            onClick={() => handleUpdateStatus(s._id, 'live')}
                            className="w-full lg:w-auto px-8 py-4 bg-[#002147] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-lg shadow-navy-100 flex items-center justify-center gap-2 group/btn hover:bg-[#f16126]"
                          >
                            GO LIVE NOW <Play className="w-3.5 h-3.5 fill-current group-hover/btn:scale-110 transition-transform" />
                          </button>
                        )}
                        {s.status === 'live' && (
                          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                           <a 
                               href={s.link} target="_blank" rel="noopener noreferrer"
                               className="w-full lg:w-auto px-6 py-4 bg-white text-[#f16126] border-2 border-orange-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                             >
                               Monitor Broadcast
                             </a>
                             <button 
                               onClick={() => handleUpdateStatus(s._id, 'ended')}
                               className="w-full lg:w-auto px-8 py-4 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 group/end"
                             >
                               End Session <CheckCircle2 className="w-3.5 h-3.5 group-hover/end:scale-110 transition-transform" />
                             </button>
                          </div>
                        )}
                        {isEnded && (
                          <div className="flex items-center gap-3 py-4 px-8 bg-slate-50 rounded-2xl border border-slate-100">
                             <CheckCircle2 className="w-5 h-5 text-slate-300" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Stream Finalized</span>
                          </div>
                        )}
                     </div>
                  </motion.div>
                );
              })
            )}
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
