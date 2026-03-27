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
        const { data } = await axios.get('/api/student/my-learning');
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl" />
         <div className="space-y-2 relative z-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <MonitorPlay className="w-8 h-8 text-indigo-600" /> My Learning Hub
            </h1>
            <p className="text-slate-400 font-bold italic">Manage your active enrollments and access classrooms.</p>
         </div>

         <div className="relative group w-full md:w-96 relative z-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search your courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[24px] outline-none font-black text-slate-900 text-sm shadow-inner transition-all"
            />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredLearning.length === 0 && !loading && (
           <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
             <BookOpen className="w-16 h-16 text-slate-200 mx-auto" />
             <p className="text-slate-400 font-black italic uppercase tracking-widest leading-relaxed">
               No enrollments found.<br />
               <Link to="/courses" className="text-indigo-600 hover:underline">Browse Courses</Link> to get started.
             </p>
           </div>
         )}
         
         {filteredLearning.map((sub, i) => (
           <div key={i} className={`group bg-white rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 transition-all overflow-hidden flex flex-col p-8 ${sub.isExpired ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between mb-8">
                 <div className={`w-16 h-16 ${sub.type === 'bundle' ? 'bg-indigo-600' : 'bg-slate-900'} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <BookOpen className="w-8 h-8" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status</p>
                    <p className={`text-xs font-black uppercase tracking-widest ${sub.isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {sub.isExpired ? 'Expired' : 'Active'}
                    </p>
                 </div>
              </div>

              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
                      {sub.type === 'bundle' ? 'Full Course Access' : 'Individual Subject'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-300">Exp: {new Date(sub.expiryDate).toLocaleDateString()}</span>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors uppercase truncate">{sub.name}</h3>
                 
                 <div className="space-y-2 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                       <Radio className="w-4 h-4 text-rose-500 animate-pulse" /> Active Live Dashboard
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                       <Star className="w-4 h-4 text-indigo-500" /> Premium Study Notes
                    </div>
                 </div>
              </div>

              <div className="mt-10">
                 {!sub.isExpired ? (
                   <Link 
                     to={`/student/classes/${sub.name}`}
                     className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 hover:scale-[1.02] shadow-xl transition-all active:scale-95"
                   >
                      Enter Classroom <ChevronRight className="w-4 h-4" />
                   </Link>
                 ) : (
                   <Link 
                     to="/courses"
                     className="w-full py-5 bg-white text-rose-600 border-2 border-rose-50 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-3"
                   >
                      Renew Subscription <Clock className="w-4 h-4" />
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
