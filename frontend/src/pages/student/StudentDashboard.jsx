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
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePreview } from '../../context/PreviewContext';

const StudentDashboard = () => {
  const { activeView } = usePreview();
  const [learning, setLearning] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lRes, aRes] = await Promise.all([
          axios.get('/api/student/my-learning'),
          axios.get('/api/student/live-alerts')
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
    };
    fetchData();
  }, [activeView]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* 1. LIVE NOW ALERT */}
      <AnimatePresence>
        {liveAlerts.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-indigo-600 rounded-[35px] p-6 md:p-10 text-white relative flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-900/40">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
               
               <div className="flex items-center gap-6 relative z-10 text-center md:text-left">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                       <Video className="w-8 h-8" />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-indigo-600"
                    />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black uppercase tracking-tight">Live Session Active!</h2>
                     <p className="text-indigo-100 font-bold italic">Join {liveAlerts[0].teacherId?.name}'s {liveAlerts[0].subjectName || liveAlerts[0].classLevel} class now.</p>
                  </div>
               </div>

               <a 
                 href={liveAlerts[0].link}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="px-10 py-5 bg-white text-indigo-600 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group relative z-10"
               >
                  Join Class <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { icon: Clock, label: 'Learning Streak', val: '5 Days', color: 'bg-amber-50 text-amber-600' },
           { icon: Star, label: 'XP Points', val: '12,450', color: 'bg-indigo-50 text-indigo-600' },
           { icon: Trophy, label: 'Badges Earned', val: '08', color: 'bg-emerald-50 text-emerald-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center gap-6 group hover:border-indigo-200 transition-all shadow-sm">
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-xl font-black text-slate-900 leading-none mt-0.5">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* 3. MY LEARNING GRID */}
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <Layers className="w-6 h-6 text-indigo-600" /> Quick Start: Your Courses
            </h2>
            <Link to="/courses" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
               Explore Courses <ArrowUpRight className="w-4 h-4" />
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {learning.length === 0 ? (
               <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[50px] text-center space-y-4">
                  <MonitorPlay className="w-16 h-16 text-slate-200 mx-auto" />
                  <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest">No active courses found</p>
                  <Link to="/courses" className="inline-block py-4 px-10 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Browse Curriculum</Link>
               </div>
            ) : learning.map((sub, i) => (
               <Link 
                 to={`/student/classes/${sub.name}`} 
                 key={i} 
                 className={`group relative bg-white rounded-[45px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/10 transition-all flex flex-col ${sub.isExpired ? 'opacity-70' : ''}`}
               >
                  <div className={`h-40 relative flex items-center justify-center overflow-hidden transition-all duration-700 ${sub.type === 'bundle' ? 'bg-gradient-to-br from-indigo-600 to-indigo-900' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
                     <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-700" />
                     </div>
                     <BookOpen className="w-16 h-16 text-white/30 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                     
                     <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/20">
                        {sub.type === 'bundle' ? 'Full Pack' : 'Individual'}
                     </div>

                     {sub.isExpired && (
                       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="px-5 py-2 bg-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl">Expired</span>
                       </div>
                     )}
                  </div>

                  <div className="p-8 space-y-4 flex-1">
                     <div className="flex items-center justify-between text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <span>LMS Curriculum</span>
                        <span>Exp: {new Date(sub.expiryDate).toLocaleDateString('en-GB')}</span>
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{sub.name}</h3>
                     
                     {!sub.isExpired ? (
                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                              <Zap className="w-4 h-4 text-amber-500" /> 24 Lessons Left
                           </div>
                           <span className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-lg">
                              <ChevronRight className="w-5 h-5" />
                           </span>
                        </div>
                     ) : (
                        <div className="pt-6 border-t border-slate-50">
                           <button className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Renew Access</button>
                        </div>
                     )}
                  </div>
               </Link>
            ))}
         </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
