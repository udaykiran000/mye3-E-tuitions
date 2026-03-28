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
    };
    fetchData();
  }, [activeView]);

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 pb-20 p-4 md:p-6">
      
      {/* 1. LIVE NOW ALERT */}
      <AnimatePresence>
        {liveAlerts.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-indigo-600 rounded-2xl p-6 md:p-8 text-white relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-900/20">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
               
               <div className="flex items-center gap-4 md:gap-6 relative z-10 text-center md:text-left flex-col md:flex-row">
                  <div className="relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                       <Video className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-600"
                    />
                  </div>
                  <div>
                     <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Session Live!</h2>
                     <p className="text-indigo-100 font-bold italic text-sm">Join {liveAlerts[0].teacherId?.name}'s class now.</p>
                  </div>
               </div>

               <a 
                 href={liveAlerts[0].link}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="w-full md:w-auto px-8 py-4 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group relative z-10"
               >
                  Join Now <Play className="w-4 h-4 fill-current group-hover:translate-x-1 transition-transform" />
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
         {[
            { icon: Clock, label: 'Learning Streak', val: '5 Days', color: 'bg-amber-50 text-amber-600' },
            { icon: Star, label: 'XP Points', val: '12,450', color: 'bg-indigo-50 text-indigo-600' },
            { icon: Trophy, label: 'Badges', val: '08', color: 'bg-emerald-50 text-emerald-600' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 flex items-center gap-4 md:gap-6 group hover:border-indigo-200 transition-all shadow-sm">
              <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.color} rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0`}>
                 <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                 <p className="text-lg md:text-xl font-black text-slate-900 leading-none">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* 3. MY LEARNING GRID */}
      <div className="space-y-6">
         <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 md:gap-3">
               <Layers className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> Your Courses
            </h2>
            <Link to="/courses" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1 shrink-0">
               Explore <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {learning.length === 0 ? (
               <div className="col-span-full py-16 md:py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-4">
                  <MonitorPlay className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mx-auto" />
                  <p className="text-slate-400 font-black text-base md:text-lg italic uppercase tracking-widest px-6">No active courses found</p>
                  <Link to="/courses" className="inline-block py-3.5 px-8 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all">Browse Curriculum</Link>
               </div>
            ) : learning.map((sub, i) => (
               <Link 
                 to={`/student/classes/${sub.name}`} 
                 key={i} 
                 className={`group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-indigo-900/5 transition-all flex flex-col ${sub.isExpired ? 'opacity-70' : ''}`}
               >
                  <div className={`h-36 md:h-40 relative flex items-center justify-center overflow-hidden transition-all duration-700 ${sub.type === 'bundle' ? 'bg-gradient-to-br from-indigo-600 to-indigo-900' : 'bg-gradient-to-br from-slate-800 to-slate-900'}`}>
                     <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
                     </div>
                     <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-white/20 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                     
                     <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                        {sub.type === 'bundle' ? 'Full Pack' : 'Individual'}
                     </div>

                     {sub.isExpired && (
                       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="px-4 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">Expired</span>
                       </div>
                     )}
                  </div>

                  <div className="p-5 md:p-6 space-y-4 flex-1">
                     <div className="flex items-center justify-between text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                        <span className="opacity-60">LMS Curriculum</span>
                        <span>Exp: {new Date(sub.expiryDate).toLocaleDateString('en-GB')}</span>
                     </div>
                     <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{sub.name}</h3>
                     
                     {!sub.isExpired ? (
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wide">
                              <Zap className="w-3.5 h-3.5 text-amber-500" /> Active
                           </div>
                           <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-md">
                              <ChevronRight className="w-4 h-4" />
                           </span>
                        </div>
                     ) : (
                        <div className="pt-4 border-t border-slate-50">
                           <button className="w-full py-3.5 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Renew Access</button>
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
