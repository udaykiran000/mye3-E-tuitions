import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  Clock, 
  ChevronRight, 
  Zap, 
  Calendar,
  Layers,
  Star,
  Trophy,
  ArrowUpRight,
  MonitorPlay,
  Play,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePreview } from '../../context/PreviewContext';
import SessionRecapModal from '../../components/student/SessionRecapModal';
import { useCallback } from 'react';

const StudentDashboard = () => {
  const { activeView } = usePreview();
  const [learning, setLearning] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recapModal, setRecapModal] = useState({ open: false, session: null });

  const fetchData = useCallback(async () => {
    try {
      const [lRes, aRes] = await Promise.all([
        axios.get('/student/my-learning'),
        axios.get('/student/live-alerts')
      ]);
      
      setLearning(lRes.data);
      setLiveAlerts(aRes.data);

      // MOCK DATA FOR ADMIN PREVIEW
      if ((activeView === 'admin' || activeView === 'teacher') && lRes.data.length === 0) {
        setLearning([
          { name: 'Class 10 Bundle', type: 'bundle', expiryDate: new Date(Date.now() + 30 * 86400000), isExpired: false },
          { name: 'Physics (Class 12)', type: 'subject', expiryDate: new Date(Date.now() + 15 * 86400000), isExpired: false }
        ]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data');
      setLoading(false);
    }
  }, [activeView]);

  useEffect(() => {
    fetchData();

    // Listen for custom refresh events from Layout (Socket updates)
    window.addEventListener('refresh-student-data', fetchData);
    return () => {
      window.removeEventListener('refresh-student-data', fetchData);
    };
  }, [fetchData]);

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-20 p-4 md:p-8 lg:px-10">
      
      {/* 0. SUBSCRIPTION EXPIRY WARNING (IF ANY) */}
      {(() => {
        const expiringSoon = learning.filter(sub => {
          const days = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days <= 7 && days > 0;
        });

        if (expiringSoon.length === 0) return null;

        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-900/5"
          >
             <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-900/20 shrink-0">
                   <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Account Alert</p>
                   <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                      Your access for <span className="text-orange-600">{expiringSoon[0].name}</span> {expiringSoon.length > 1 ? `& ${expiringSoon.length - 1} others` : ''} expires soon!
                   </h3>
                   <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Renew within 7 days to maintain uninterrupted learning access.</p>
                </div>
             </div>
             <Link 
               to="/student/courses" 
               className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-center"
             >
                Renew Subscription
             </Link>
          </motion.div>
        );
      })()}

      {/* 1. LIVE SESSIONS SECTION (LIVE, UPCOMING, RECENT) */}
      <div className="space-y-6">
        {/* LIVE NOW ALERT (IF ANY) */}
        <AnimatePresence mode="wait">
          {liveAlerts.filter(s => s.status === 'live').map((s, i) => (
            <motion.div 
              key={`live-${s._id}`}
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-[#002147] rounded-[24px] p-6 md:p-10 text-white relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,33,71,0.2)] border-t-4 border-[#f16126]">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-[#f16126]/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
                 
                 <div className="flex items-center gap-6 md:gap-8 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl">
                         <Video className="w-8 h-8 md:w-10 h-10 text-[#f16126]" />
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-[#f16126] rounded-full border-2 border-[#002147] shadow-[0_0_15px_#f16126]"
                      />
                    </div>
                    <div>
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f16126]/20 rounded-full mb-3 border border-[#f16126]/30">
                          <span className="w-1.5 h-1.5 bg-[#f16126] rounded-full animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f16126]">Broadcast Active</span>
                       </div>
                       <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none italic">
                         {s.title} <span className="text-[#f16126]">Live!</span>
                       </h2>
                       <p className="text-slate-400 font-bold italic text-sm md:text-lg mt-2">Professional training with {s.teacherId?.name}.</p>
                    </div>
                 </div>

                 <a 
                   href={s.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full md:w-auto px-10 py-5 bg-[#f16126] text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] shadow-[0_10px_30px_rgba(241,97,38,0.3)] hover:bg-white hover:text-[#002147] transition-all flex items-center justify-center gap-4 group relative z-10 scale-100 active:scale-95"
                 >
                    Join Classroom <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
                 </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* UPCOMING & RECENT GRID */}
        {(liveAlerts.some(s => s.status !== 'live')) && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UPCOMING CLASSES */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#002147] mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#f16126]" /> Upcoming Schedule
                 </h3>
                 <div className="space-y-4">
                    {liveAlerts.filter(s => s.status === 'upcoming').length > 0 ? (
                      liveAlerts.filter(s => s.status === 'upcoming').slice(0, 3).map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-transparent hover:border-[#f16126]/20 transition-all">
                           <div className="space-y-1">
                              <p className="font-black text-[#002147] text-sm leading-tight">{s.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {new Date(s.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                           </div>
                           <div className="bg-teal-50 text-teal-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Scheduled</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">No upcoming classes scheduled.</p>
                    )}
                 </div>
              </div>

              {/* RECENTLY COMPLETED */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-widest text-[#002147] mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Session Recaps
                 </h3>
                 <div className="space-y-4">
                    {liveAlerts.filter(s => s.status === 'ended').length > 0 ? (
                      liveAlerts.filter(s => s.status === 'ended').slice(0, 3).map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                           <div className="space-y-1">
                              <p className="font-black text-[#002147] text-sm leading-tight">{s.title}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Available in Recordings</p>
                           </div>
                           <Link 
                             to={`/student/classes/${s.classLevel}`}
                             className="text-[#f16126] font-black text-[9px] uppercase tracking-widest hover:underline hover:scale-105 transition-all outline-none"
                           >
                              View Notes
                           </Link>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">No recent sessions found.</p>
                    )}
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* 2. STATS ROW (NAVY THEME) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
         {[
            { icon: Clock, label: 'Learning Streak', val: '5 Days', color: 'bg-orange-50 text-[#f16126]' },
            { icon: Star, label: 'Academic XP', val: '12,450', color: 'bg-slate-50 text-[#002147]' },
            { icon: Trophy, label: 'Certificates', val: '08', color: 'bg-emerald-50 text-emerald-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 flex items-center gap-6 group hover:border-[#002147]/10 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className={`w-14 h-14 md:w-16 md:h-16 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0 shadow-sm border border-black/5`}>
                 <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div>
                 <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">{stat.label}</p>
                 <p className="text-xl md:text-2xl font-black text-[#002147] leading-none tracking-tight">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* 3. MY LEARNING GRID (PREMIUM CARDS) */}
      <div className="space-y-8">
         <div className="flex items-center justify-between gap-4 border-l-4 border-[#002147] pl-6 py-1">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#002147] tracking-tighter uppercase leading-none">
                Your <span className="text-[#f16126]">Curriculum</span>
              </h2>
              <p className="text-[#64748b] font-bold text-xs uppercase tracking-widest mt-2">Active Subscriptions & Learning Path</p>
            </div>
            <Link to="/courses" className="text-[10px] font-black text-[#f16126] bg-orange-50 px-5 py-2 rounded-full uppercase tracking-widest hover:bg-[#002147] hover:text-white transition-all flex items-center gap-2 shrink-0 shadow-sm">
               Store <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {learning.length === 0 ? (
               <div className="col-span-full py-20 md:py-32 bg-white border-2 border-dashed border-slate-100 rounded-[32px] text-center space-y-6">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <MonitorPlay className="w-10 h-10 md:w-12 md:h-12 text-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-900 font-extrabold text-xl uppercase tracking-tight px-6 italic">Unlock Your Potential</p>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest px-6">Explore professional courses in the store</p>
                  </div>
                  <Link to="/courses" className="inline-block py-4 px-10 bg-[#002147] text-white rounded-xl font-black text-xs uppercase tracking-[0.25em] hover:bg-[#f16126] transition-all shadow-xl shadow-navy-100">Browse Store</Link>
               </div>
            ) : learning.map((sub, i) => (
               <Link 
                 to={`/student/classes/${sub.name}`} 
                 key={i} 
                 className={`group relative bg-white rounded-[24px] border-t-4 ${sub.type === 'bundle' ? 'border-t-[#002147]' : 'border-t-[#f16126]'} border-x border-b border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-2xl hover:shadow-navy-900/10 transition-all flex flex-col ${sub.isExpired ? 'opacity-70' : ''}`}
               >
                  <div className={`h-40 md:h-48 relative flex items-center justify-center overflow-hidden transition-all duration-700 bg-slate-50`}>
                     <div className="absolute inset-0 opacity-20 pointer-events-none p-10 flex items-center justify-center">
                        <div className="w-full h-full border-2 border-dashed border-[#002147]/10 rounded-full animate-[spin_20s_linear_infinite]" />
                     </div>
                     <BookOpen className={`w-16 h-16 md:w-20 md:h-20 ${sub.type === 'bundle' ? 'text-[#002147]/20' : 'text-[#f16126]/20'} relative z-10 group-hover:scale-110 transition-transform duration-500`} />
                     
                     <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${sub.type === 'bundle' ? 'bg-[#002147] text-white border-[#002147]' : 'bg-white text-[#f16126] border-orange-100'}`}>
                        {sub.type === 'bundle' ? 'School Full Access' : 'Single Subject'}
                     </div>

                     {sub.isExpired && (
                       <div className="absolute inset-0 bg-[#002147]/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                          <span className="px-6 py-2 bg-rose-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-xl ring-4 ring-rose-600/20">Membership Expired</span>
                       </div>
                     )}
                  </div>

                  <div className="p-6 md:p-8 space-y-6 flex-1">
                     <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em]">
                        <span className="text-[#64748b]">Academy Resource</span>
                        <span className="text-[#002147]">Ends: {new Date(sub.expiryDate).toLocaleDateString('en-GB')}</span>
                     </div>
                     <h3 className="text-2xl font-black text-[#002147] leading-tight group-hover:text-[#f16126] transition-colors uppercase tracking-tight line-clamp-2 italic">{sub.name}</h3>
                     
                     {!sub.isExpired ? (
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Content Unlocked
                           </div>
                           <span className="w-12 h-12 bg-[#002147] text-white rounded-2xl flex items-center justify-center group-hover:bg-[#f16126] transition-all shadow-lg shadow-navy-100 group-active:scale-90">
                              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                           </span>
                        </div>
                     ) : (
                        <div className="pt-6 border-t border-slate-50">
                           <button className="w-full py-4 bg-orange-50 text-[#f16126] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#f16126] hover:text-white transition-all shadow-sm">Renew Subscription</button>
                        </div>
                     )}
                  </div>
               </Link>
            ))}
         </div>
      </div>
      <SessionRecapModal 
        isOpen={recapModal.open}
        onClose={() => setRecapModal({ open: false, session: null })}
        session={recapModal.session}
      />
    </div>
  );
};

export default StudentDashboard;
