import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Clock, 
  MonitorPlay,
  Zap,
  Star,
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

        // MOCK DATA FOR ADMIN PREVIEW OR IF ENROLLMENTS ARE EMPTY
        const isStaff = activeView === 'admin' || 
                        activeView === 'teacher' || 
                        userInfo?.role?.toLowerCase() === 'admin' || 
                        userInfo?.role?.toLowerCase() === 'teacher';

        if (isStaff && data.length === 0) {
          setLearning([
            { name: 'Class 10 (Full Course)', type: 'bundle', expiryDate: new Date(Date.now() + 30 * 86400000), isExpired: false },
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
            <p className="text-slate-400 font-bold italic text-sm md:text-base">Quick access to your enrolled curriculum and academic materials.</p>
         </div>

         <div className="relative group w-full lg:w-[400px] relative z-10">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
         {filteredLearning.length === 0 && !loading && (
           <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mx-auto" />
             <p className="text-slate-400 font-black italic uppercase tracking-widest leading-relaxed text-sm md:text-base px-6">
               No enrollments found.<br />
               <Link to="/courses" className="text-indigo-600 hover:underline">Explore the Store</Link> to enroll.
             </p>
           </div>
         )}
         
         {filteredLearning.map((sub, i) => (
           <div key={i} className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all overflow-hidden flex flex-col p-6 md:p-8 ${sub.isExpired ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between mb-8">
                 <div className={`w-12 h-12 md:w-14 md:h-14 ${sub.type === 'bundle' ? 'bg-indigo-600' : 'bg-slate-900'} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
                    <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Status</p>
                    <p className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${sub.isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {sub.isExpired ? 'Expired' : 'Verified'}
                    </p>
                 </div>
              </div>

              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest leading-none">
                      {sub.type === 'bundle' ? 'Full Access' : 'Single Access'}
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Exp: {new Date(sub.expiryDate).toLocaleDateString('en-GB')}</span>
                 </div>
                 <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-2">{sub.name}</h3>
                 
                 <div className="space-y-2.5 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-tight">
                       <Radio className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-500 animate-pulse" /> Live Dashboard
                    </div>
                    <div className="flex items-center gap-3 text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-tight">
                       <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" /> Premium Assets
                    </div>
                 </div>
              </div>

              <div className="mt-8 md:mt-10">
                 {!sub.isExpired ? (
                   <Link 
                     to={`/student/classes/${sub.name}`}
                     className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 shadow-xl transition-all active:scale-95 group"
                   >
                      Enter Classroom <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </Link>
                 ) : (
                   <Link 
                     to="/courses"
                     className="w-full py-4 md:py-5 bg-white text-rose-600 border border-rose-100 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-3"
                   >
                      Renew Membership <Clock className="w-4 h-4" />
                   </Link>
                 )}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default MyLearning;
