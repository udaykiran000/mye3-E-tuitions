import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Clock, 
  Zap,
  Radio
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

  useEffect(() => {
    const fetchLearning = async () => {
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
            { name: 'Class 10 (All Subjects)', type: 'bundle', expiryDate: new Date(Date.now() + 5 * 86400000), isExpired: false, isExpandedFromBundle: true, originalBundleName: 'Class 10' },
            { name: 'Physics (Class 12)', type: 'subject', expiryDate: new Date(Date.now() + 15 * 86400000), isExpired: false },
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

  const filteredLearning = learning.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 pb-20 p-4 md:p-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
         <div className="space-y-1 md:space-y-2 relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" /> My Classes Hub
            </h1>
            <p className="text-slate-400 font-bold italic text-sm md:text-base">Quick access to your enrolled curriculum and academic notes.</p>
         </div>

         <div className="relative group w-full lg:w-[400px] z-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-4 md:py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl md:rounded-2xl outline-none font-black text-slate-900 text-sm shadow-inner transition-all"
            />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
         {filteredLearning.length === 0 && !loading && (
           <div className="py-20 text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mx-auto" />
             <p className="text-slate-400 font-black italic uppercase tracking-widest leading-relaxed text-sm md:text-base px-6">
                No enrollments found. <Link to="/courses" className="text-indigo-600 underline">Browse Store</Link>
             </p>
           </div>
         )}
         
         {filteredLearning.map((sub, index) => {
            const daysRemaining = Math.max(0, Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)));
            const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
            const isExpired = daysRemaining <= 0;

            return (
               <div 
                 key={index} 
                 className={`group bg-white rounded-[40px] p-6 md:p-10 border-2 transition-all duration-500 flex flex-col md:flex-row gap-8 relative overflow-hidden ${
                   isExpired ? 'border-rose-100 opacity-80' : 
                   isExpiringSoon ? 'border-orange-200 shadow-xl shadow-orange-900/5 ring-4 ring-orange-50' : 
                   'border-slate-50 hover:border-indigo-100 hover:shadow-2xl shadow-indigo-900/5'
                 }`}
               >
                  {isExpiringSoon && (
                     <div className="absolute top-0 right-0 px-6 py-2 bg-orange-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-bl-2xl shadow-lg z-20 animate-pulse">
                        Expiring Soon: {daysRemaining} Days
                     </div>
                  )}
                  {isExpired && (
                     <div className="absolute top-0 right-0 px-6 py-2 bg-rose-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-bl-2xl shadow-lg z-20">
                        Access Expired
                     </div>
                  )}

                  <div className="w-full md:w-48 h-48 bg-slate-900 rounded-[32px] shrink-0 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700 shadow-2xl">
                     <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-indigo-600/0 transition-colors duration-700" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/10 rounded-full blur-2xl animate-pulse" />
                        <BookOpen className={`w-16 h-16 ${isExpired ? 'text-rose-400' : isExpiringSoon ? 'text-orange-400' : 'text-indigo-400'} relative z-10 drop-shadow-2xl`} />
                     </div>
                  </div>

                  <div className="flex-1 space-y-6">
                     <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none ${sub.isExpandedFromBundle ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {sub.isExpandedFromBundle ? sub.originalBundleName : 'Single Pass'}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-widest italic ${isExpired ? 'text-rose-600' : isExpiringSoon ? 'text-orange-600' : 'text-slate-300'}`}>
                           Term: {new Date(sub.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                     
                     <div className="space-y-1">
                        <h3 className={`text-2xl md:text-3xl font-black leading-none uppercase tracking-tighter transition-colors ${isExpired ? 'text-slate-400' : 'text-slate-900 group-hover:text-indigo-600'}`}>{sub.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Full Syllabus Access</p>
                     </div>

                     <div className="space-y-3 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Zap className={`w-4 h-4 ${isExpired ? 'text-slate-300' : 'text-amber-500'}`} /> Strategic Notes
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Radio className={`w-4 h-4 ${isExpired ? 'text-slate-300' : 'text-rose-500 animate-pulse'}`} /> Live Sessions
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 md:mt-10">
                     {!isExpired ? (
                       <Link 
                         to={`/student/classes/${sub.name}`}
                         className={`w-full lg:w-72 py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 group/btn ${
                           isExpiringSoon ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-900/20' : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-indigo-600'
                         }`}
                       >
                          Enter Classroom <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                     ) : (
                       <Link 
                         to="/courses"
                         className="w-full lg:w-72 py-5 bg-white text-rose-600 border-2 border-rose-100 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-3 shadow-lg shadow-rose-900/5"
                       >
                          Renew Membership <Clock className="w-4 h-4" />
                       </Link>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );
};

export default MyLearning;
