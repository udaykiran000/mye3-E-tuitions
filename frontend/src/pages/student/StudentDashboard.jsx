import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Clock, 
  ChevronRight, 
  Zap, 
  Calendar,
  Star,
  Trophy,
  MonitorPlay,
  Play,
  CheckCircle2,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SessionRecapModal from '../../components/student/SessionRecapModal';
import logoImg from '../../assets/output-onlinepngtools.png';

const StudentDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
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
      setLearning(lRes.data || []);
      setLiveAlerts(aRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener('refresh-student-data', fetchData);
    return () => window.removeEventListener('refresh-student-data', fetchData);
  }, [fetchData]);

  const hasSubscriptions = (learning.length > 0) || (userInfo?.activeSubscriptions?.length > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-8 p-4 md:p-6 md:pt-0">
      
      {/* 0. SUBSCRIPTION EXPIRY WARNING */}
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
                <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                   <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Account Alert</p>
                   <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                      Your access for <span className="text-orange-600">{expiringSoon[0].name}</span> expires soon!
                   </h3>
                </div>
             </div>
             <Link to="/student/courses" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95">Renew Now</Link>
          </motion.div>
        );
      })()}

      {/* 1. STATE CARDS (STATS AT TOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         {[
            { icon: Clock, label: 'DAILY STREAK', val: '5 Days', color: 'bg-orange-50 text-[#f16126]' },
            { icon: Star, label: 'LEARNING POINTS', val: '12,450', color: 'bg-indigo-50 text-[#002147]' },
            { icon: Trophy, label: 'Certificates', val: '08', color: 'bg-emerald-50 text-emerald-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col justify-between group hover:border-[#f16126]/20 transition-all shadow-md relative overflow-hidden">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-2xl font-black text-[#002147] tracking-tight">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* 2. MAIN CONTENT HUB */}
      {!hasSubscriptions && !loading ? (
        <div className="pt-4 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[280px] bg-white rounded-[24px] border border-slate-100 shadow-2xl p-4 relative overflow-hidden group flex flex-col"
            >
               <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f16126]" />
               <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#f16126] text-white font-black text-[9px] uppercase tracking-widest rounded-bl-xl z-10">All Subjects</div>
               <div className="flex items-start justify-between mb-4 mt-1">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-2.5 border border-slate-100">
                     <img src={logoImg} alt="logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-right pt-2">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-0.5">Total Fee</p>
                     <p className="text-2xl font-black text-[#002147] italic tracking-tighter leading-none">₹200</p>
                  </div>
               </div>
               <div className="mb-4 flex-1">
                  <p className="text-[9px] font-black text-[#f16126] uppercase tracking-[0.25em] leading-none mb-2">{userInfo?.board} • Academy Pass</p>
                  <h3 className="text-[20px] md:text-[22px] font-black text-[#002147] leading-tight tracking-tighter uppercase italic mb-1">{userInfo?.className}</h3>
                  <div className="mt-4 space-y-2.5">
                     {['Mathematics', 'Science (PS/NS)', 'Social Studies', 'English Language'].map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-slate-600 transition-all group-hover:translate-x-1 duration-300">
                           <div className="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                              <ChevronRight className="w-2.5 h-2.5 text-emerald-500" />
                           </div>
                           <span className="text-[10px] font-bold italic uppercase tracking-wider text-slate-500">{sub}</span>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="pt-4 border-t border-slate-50">
                  <Link to="/student/courses?action=buy" className="w-full bg-[#002147] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#f16126] transition-all shadow-xl active:scale-95 group/btn">
                    Buy Now <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </motion.div>
            <div className="max-w-md w-full bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200 text-center mt-6">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Hey {userInfo?.username || userInfo?.name}! Join your class now to access full features.</p>
            </div>
        </div>
      ) : hasSubscriptions ? (
        <div className="space-y-8">
          {/* ENROLLED HERO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-[32px] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-3 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Access Active
                 </div>
                 <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">YOUR <span className="text-[#f16126]">CLASSROOM</span></h2>
                 <p className="text-slate-300 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] italic">Ready to join your current session or review schedules?</p>
              </div>
              <Link to="/student/live-schedule" className="w-full md:w-auto px-10 py-5 bg-[#f16126] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-xl hover:bg-white hover:text-[#002147] transition-all flex items-center justify-center gap-4 active:scale-95">
                Enter Live & Schedule Class <Play className="w-4 h-4 fill-current ml-2" />
              </Link>
            </div>
          </motion.div>

          {/* ACTIVE PLAN SUMMARY */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border-2 border-[#002147] flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-lg gap-6">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none hidden md:block">
                <MonitorPlay className="w-32 h-32 text-[#002147]" />
             </div>
             <div className="text-center md:text-left flex-1">
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1.5">
                   <Zap className="w-3 h-3 fill-current" /> Active Enrollment
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-[#002147] uppercase italic tracking-tighter leading-tight">{learning[0]?.originalBundleName || learning[0]?.name || 'My Academy Plan'}</h3>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Valid Until</p>
                   <p className="text-[11px] font-black text-[#002147] tabular-nums">{learning[0]?.expiryDate ? new Date(learning[0].expiryDate).toLocaleDateString('en-GB') : 'Full Session'}</p>
                </div>
             </div>
             <Link to="/student/notes" className="w-full md:w-auto px-10 py-5 bg-[#002147] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#f16126] transition-all shadow-xl text-center">SUBJECT NOTES</Link>
          </div>

          {/* SCHEDULE & RECAPS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* SCHEDULED */}
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[#002147] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#f16126]" /> Scheduled Class
                   </h3>
                   <Link to="/student/live-schedule" className="text-[9px] font-black text-indigo-600 hover:underline uppercase tracking-widest">View All</Link>
                </div>
                <div className="space-y-4">
                   {liveAlerts.filter(s => s.status === 'upcoming').length > 0 ? (
                     liveAlerts.filter(s => s.status === 'upcoming').slice(0, 3).map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-slate-100 hover:border-[#f16126]/30 transition-all group shadow-sm">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 bg-orange-50 text-[#f16126] rounded-xl flex items-center justify-center font-black text-xs italic group-hover:bg-[#f16126] group-hover:text-white transition-all">
                                {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                             <div className="space-y-0.5">
                                <p className="font-black text-[#002147] text-base leading-tight uppercase italic">{s.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none italic">{new Date(s.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                             </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#f16126] group-hover:translate-x-1 transition-all" />
                       </div>
                     ))
                   ) : <div className="p-10 bg-slate-50/50 rounded-[24px] text-center border-dashed border-2 border-slate-100 uppercase text-[10px] font-black text-slate-400 italic">No classes scheduled.</div>}
                </div>
             </div>

             {/* RECAPS */}
             <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black uppercase tracking-widest text-[#002147] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Recent Recaps
                   </h3>
                </div>
                <div className="space-y-4">
                   {liveAlerts.filter(s => s.status === 'ended').length > 0 ? (
                     liveAlerts.filter(s => s.status === 'ended').slice(0, 3).map((s, i) => (
                       <div key={i} className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-slate-100 hover:border-emerald-100 transition-all group shadow-sm">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xs italic group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                <MonitorPlay className="w-6 h-6" />
                             </div>
                             <div className="space-y-0.5">
                                <p className="font-black text-[#002147] text-base leading-tight uppercase italic">{s.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Recording Ready</p>
                             </div>
                          </div>
                          <Link to="/student/notes" className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all"><ChevronRight className="w-5 h-5" /></Link>
                       </div>
                     ))
                   ) : <div className="p-10 bg-slate-50/50 rounded-[24px] text-center border-dashed border-2 border-slate-100 uppercase text-[10px] font-black text-slate-400 italic">No recent sessions.</div>}
                </div>
             </div>
          </div>
        </div>
      ) : null}

      <SessionRecapModal 
        isOpen={recapModal.open}
        onClose={() => setRecapModal({ open: false, session: null })}
        session={recapModal.session}
      />
    </div>
  );
};

export default StudentDashboard;
