import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
   BookOpen,
   Search,
   ChevronRight,
   Clock,
   Zap,
   Radio,
   FileText,
   Filter,
   Layers,
   Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePreview } from '../../context/PreviewContext';
import { useSelector } from 'react-redux';

const MyLearning = () => {
   const { activeView } = usePreview();
   const { userInfo } = useSelector((state) => state.auth);
   const [learning, setLearning] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState('');
   const [activeFilter, setActiveFilter] = useState('all');

   useEffect(() => {
      const fetchLearning = async () => {
         setLoading(true);
         try {
            const { data } = await axios.get('/student/my-learning');
            setLearning(data);

            // MOCK DATA FOR ADMIN PREVIEW
            const isStaff = activeView === 'admin' ||
               activeView === 'teacher' ||
               userInfo?.role?.toLowerCase() === 'admin' ||
               userInfo?.role?.toLowerCase() === 'teacher';

            if (isStaff && data.length === 0) {
               setLearning([
                  { name: 'Mathematics', type: 'subject', expiryDate: new Date(Date.now() + 5 * 86400000), originalBundleName: 'Class 10', isExpandedFromBundle: true },
                  { name: 'Physics', type: 'subject', expiryDate: new Date(Date.now() + 5 * 86400000), originalBundleName: 'Class 10', isExpandedFromBundle: true },
                  { name: 'Chemistry', type: 'subject', expiryDate: new Date(Date.now() + 5 * 86400000), originalBundleName: 'Class 10', isExpandedFromBundle: true },
                  { name: 'Biology (Class 12)', type: 'subject', expiryDate: new Date(Date.now() + 15 * 86400000), isExpired: false },
                  { name: 'Mathematics (Class 11)', type: 'subject', expiryDate: new Date(Date.now() - 5 * 86400000), isExpired: true }
               ]);
            }

            setLoading(false);
         } catch (error) {
            setLoading(false);
         }
      };
      fetchLearning();
   }, [activeView, userInfo]);

   const filteredLearning = learning.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (l.originalBundleName && l.originalBundleName.toLowerCase().includes(searchQuery.toLowerCase()));

      if (activeFilter === 'expired') return matchesSearch && (new Date(l.expiryDate) <= new Date());
      if (activeFilter === 'active') return matchesSearch && (new Date(l.expiryDate) > new Date());
      return matchesSearch;
   });

   // Group by "Source" (Class or Single Purchase)
   const groupedLearning = filteredLearning.reduce((acc, item) => {
      const key = item.originalBundleName || 'Single Subjects';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
   }, {});

   return (
      <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-24 p-4 md:p-8 lg:px-12 bg-slate-50/30">
         {/* Dynamic Header */}
         <div className="bg-[#002147] p-8 md:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full -mr-48 -mt-48 blur-[100px] opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full -ml-32 -mb-32 blur-[80px] opacity-10" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full w-fit border border-white/10">
                     <BookOpen className="w-4 h-4 text-orange-400" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">Course Overview</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none uppercase">
                     MY <span className="text-orange-500 not-italic">CLASSES</span>
                  </h1>
                  <p className="text-indigo-200/70 font-bold italic text-sm md:text-lg max-w-xl">
                     Access your subjects and study materials below.
                  </p>
               </div>

               <div className="flex flex-col gap-4">
                  {/* Search and Filters Removed as per request */}
               </div>
            </div>
         </div>

         {/* Main Container */}
         <div className="max-w-[1700px] mx-auto">
            {Object.keys(groupedLearning).length === 0 ? (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 text-center space-y-6 bg-white/50 backdrop-blur-sm rounded-[48px] border-2 border-dashed border-indigo-100/50"
               >
                  <div className="w-24 h-24 bg-indigo-50/50 text-indigo-200 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
                     <BookOpen className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-[#002147] uppercase tracking-tight italic">
                        No Class Found
                     </h3>
                     <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] max-w-sm mx-auto leading-relaxed">
                        Check your subscriptions for active classes.
                     </p>
                  </div>
               </motion.div>
            ) : Object.keys(groupedLearning).map((groupName, gIdx) => (
               <div key={gIdx} className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: `${gIdx * 0.15}s` }}>
                  {/* Group Header */}
                  <div className="flex items-center gap-8 mb-12">
                     <div className="flex items-center gap-4 px-8 py-4 bg-[#002147] text-white rounded-[24px] transform shadow-2xl shadow-indigo-900/10 border-b-4 border-indigo-600/30">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                           <BookOpen className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest leading-none mb-1 text-center sm:text-left">Class Access</p>
                           <h2 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase leading-none">{groupName}</h2>
                        </div>
                     </div>
                     <div className="flex-1 h-[1px] bg-gradient-to-r from-indigo-100 to-transparent" />
                  </div>

                  {/* Subject Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                     {groupedLearning[groupName].map((sub, sIdx) => {
                        const daysRemaining = Math.max(0, Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)));
                        const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
                        const isExpired = daysRemaining <= 0;

                        return (
                           <motion.div
                              key={sIdx}
                              whileHover={{ y: -12, scale: 1.02 }}
                              className={`group bg-white p-10 rounded-[56px] border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full ${isExpired ? 'border-rose-100 opacity-80 backdrop-blur-sm' :
                                 isExpiringSoon ? 'border-orange-500 shadow-3xl shadow-orange-900/10 ring-8 ring-orange-50' :
                                    'border-slate-50 hover:border-indigo-500/20 hover:shadow-[0_20px_50px_rgba(0,33,71,0.08)] shadow-indigo-900/5'
                                 }`}
                           >
                              {/* Decorative Elements */}
                              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-50 to-transparent rounded-full opacity-20 blur-2xl transition-all duration-700 group-hover:scale-150" />
                              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-transparent via-[#002147] to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />

                              <div className="relative z-10">
                                 <div className="flex items-start justify-between mb-10">
                                    <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center p-5 transition-all duration-700 group-hover:rotate-12 shadow-2xl relative ${isExpired ? 'bg-rose-50 text-rose-400' :
                                       isExpiringSoon ? 'bg-orange-50 text-orange-500 shadow-orange-900/10' :
                                          'bg-[#002147] text-white shadow-[#002147]/20 group-hover:bg-orange-500'
                                       }`}>
                                       <div className="absolute inset-0 bg-white/10 rounded-inherit backdrop-blur-sm ring-1 ring-white/20" />
                                       {isExpired ? <Clock className="w-10 h-10 relative z-10" /> : <FileText className="w-10 h-10 relative z-10" />}
                                    </div>
                                    <div className="text-right">
                                       <div className={`inline-flex px-4 py-1.5 rounded-full mb-2 ${isExpired ? 'bg-rose-50 text-rose-500' : isExpiringSoon ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                          }`}>
                                          <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isExpired ? 'Ended' : isExpiringSoon ? 'Renew' : 'Active'}</span>
                                       </div>
                                       <p className="text-base font-black text-[#002147] uppercase tracking-tighter tabular-nums italic">
                                          {isExpired ? 'Expired' : `${daysRemaining} Days`}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="space-y-3 mb-10">
                                    <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-[0.9] transition-colors text-[#002147] group-hover:text-indigo-600">
                                       {sub.name}
                                    </h3>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                                       Full Syllabus Access
                                    </p>
                                 </div>

                                 <div className="grid grid-cols-2 gap-6 pb-10 border-b-2 border-slate-50 mb-10">
                                    <div className="space-y-1.5">
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Resources</p>
                                       <div className="flex items-center gap-2.5 text-slate-700">
                                          <Zap className={`w-4 h-4 ${isExpired ? 'text-slate-300' : 'text-orange-500'}`} />
                                          <span className="text-[11px] font-black uppercase italic leading-none">Full Access</span>
                                       </div>
                                    </div>
                                    <div className="space-y-1.5">
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Sessions</p>
                                       <div className="flex items-center gap-2.5 text-slate-700">
                                          <Radio className={`w-4 h-4 ${isExpired ? 'text-slate-300' : 'text-rose-500 animate-pulse'}`} />
                                          <span className="text-[11px] font-black uppercase italic leading-none">Live Help</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>

                              <div className="relative z-10">
                                 {!isExpired ? (
                                    <Link
                                       to={`/student/classes/${sub.name}`}
                                       className={`w-full py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95 group/btn shadow-2xl relative overflow-hidden ${isExpiringSoon ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-900/30' : 'bg-[#002147] text-white shadow-[#002147]/20 hover:bg-orange-500'
                                          }`}
                                    >
                                       OPEN STUDY NOTES <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
                                    </Link>
                                 ) : (
                                    <Link
                                       to="/student/courses"
                                       className="w-full py-6 bg-white text-rose-600 border-2 border-rose-100 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-50 transition-all flex items-center justify-center gap-4 shadow-xl shadow-rose-900/5 group/renew active:scale-95"
                                    >
                                       RENEW ACCESS <Sparkles className="w-5 h-5 group-hover/renew:scale-125 transition-transform" />
                                    </Link>
                                 )}
                              </div>
                           </motion.div>
                        );
                     })}
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default MyLearning;
