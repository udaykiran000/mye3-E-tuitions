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
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100">Your Learning Gateway</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none uppercase">
                MY <span className="text-orange-500 not-italic">CLASSES</span> HUB
             </h1>
             <p className="text-indigo-200/70 font-bold italic text-sm md:text-lg max-w-xl">
                Access your premium subject cards and expert study notes below.
             </p>
          </div>

          <div className="flex flex-col gap-4">
             <div className="relative group w-full lg:w-[400px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search by subject or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-white/5 border-2 border-white/10 focus:border-orange-500 focus:bg-white/10 rounded-2xl outline-none font-black text-white text-sm backdrop-blur-sm transition-all placeholder:text-indigo-300/50"
                />
             </div>
             <div className="flex gap-2">
                {['all', 'active', 'expired'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      activeFilter === f ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/5 text-indigo-200 hover:bg-white/10'
                    }`}
                  >
                    {f}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto space-y-16">
         {Object.keys(groupedLearning).length === 0 ? (
           <div className="py-32 text-center space-y-6 bg-white rounded-[40px] border-2 border-dashed border-slate-100 shadow-inner">
             <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="w-12 h-12" />
             </div>
             <p className="text-slate-400 font-bold italic uppercase tracking-widest leading-relaxed text-sm md:text-lg px-6 max-w-md mx-auto">
                No enrollments found for your search. Check our <Link to="/courses" className="text-orange-600 underline">Academic Store</Link> for new classes.
             </p>
           </div>
         ) : Object.keys(groupedLearning).map((groupName, gIdx) => (
           <div key={gIdx} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${gIdx * 0.1}s` }}>
              {/* Group Header */}
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 px-6 py-3 bg-[#002147] text-white rounded-2xl transform shadow-xl shadow-indigo-900/10">
                    <BookOpen className="w-5 h-5 text-orange-400" />
                    <h2 className="text-xl font-black italic tracking-tight uppercase leading-none">{groupName}</h2>
                 </div>
                 <div className="flex-1 h-[2px] bg-indigo-50" />
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
                         whileHover={{ y: -10 }}
                         className={`group bg-white p-8 rounded-[40px] border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full ${
                           isExpired ? 'border-rose-100 opacity-80' : 
                           isExpiringSoon ? 'border-orange-200 shadow-2xl shadow-orange-900/5 ring-4 ring-orange-50' : 
                           'border-slate-50 hover:border-indigo-200 hover:shadow-2xl shadow-indigo-900/5'
                         }`}
                       >
                          {/* Corner Indicator */}
                          <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-12 -translate-y-12 rotate-45 transition-all duration-700 opacity-5 ${
                            isExpired ? 'bg-rose-600' : isExpiringSoon ? 'bg-orange-600' : 'bg-indigo-600'
                          }`} />

                          <div className="relative z-10">
                             <div className="flex items-center justify-between mb-8">
                                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center p-4 transition-all duration-500 group-hover:scale-110 shadow-2xl ${
                                   isExpired ? 'bg-rose-50 text-rose-400' : 
                                   isExpiringSoon ? 'bg-orange-50 text-orange-500 shadow-orange-900/10' : 
                                   'bg-[#002147] text-white shadow-indigo-900/20 group-hover:bg-orange-500'
                                }`}>
                                   {isExpired ? <Clock className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                                </div>
                                <div className="text-right">
                                   <p className={`text-[9px] font-black uppercase tracking-widest leading-none mb-1 ${isExpired ? 'text-rose-400' : isExpiringSoon ? 'text-orange-500' : 'text-slate-400'}`}>
                                      {isExpired ? 'Access Ended' : isExpiringSoon ? 'Renewal Needed' : 'Active Status'}
                                   </p>
                                   <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                                      {isExpired ? 'Expired' : `${daysRemaining} Days Left`}
                                   </p>
                                </div>
                             </div>

                             <div className="space-y-2 mb-8">
                                <h3 className={`text-2xl font-black uppercase italic tracking-tighter transition-colors ${isExpired ? 'text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                                   {sub.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${isExpired ? 'text-slate-300' : 'text-indigo-400'}`}>
                                      Strategic Curriculum
                                   </span>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-4 pb-8 border-b border-slate-50 mb-8">
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Materials</p>
                                   <div className="flex items-center gap-2 text-slate-600">
                                      <Zap className={`w-3.5 h-3.5 ${isExpired ? 'text-slate-300' : 'text-amber-500'}`} />
                                      <span className="text-[11px] font-bold uppercase italic">Full Sets</span>
                                   </div>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Classes</p>
                                   <div className="flex items-center gap-2 text-slate-600">
                                      <Radio className={`w-3.5 h-3.5 ${isExpired ? 'text-slate-300' : 'text-rose-500 animate-pulse'}`} />
                                      <span className="text-[11px] font-bold uppercase italic">Live Now</span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="relative z-10 pt-4">
                             {!isExpired ? (
                               <Link 
                                 to={`/student/classes/${sub.name}`}
                                 className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 transition-all active:scale-95 group/btn shadow-2xl ${
                                   isExpiringSoon ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-900/20' : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-indigo-600'
                                 }`}
                               >
                                  Enter Notes <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                             ) : (
                               <Link 
                                 to="/courses"
                                 className="w-full py-5 bg-white text-rose-600 border-2 border-rose-100 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-3 shadow-xl shadow-rose-900/5 group/renew"
                               >
                                  Renew Now <Sparkles className="w-4 h-4 group-hover/renew:scale-110 transition-transform" />
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
