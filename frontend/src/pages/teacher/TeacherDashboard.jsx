import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Video, FileText, UserCircle, Calendar, GraduationCap } from 'lucide-react';

const TeacherDashboard = () => {
  const [assignedCount, setAssignedCount] = useState(0);

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const { data } = await axios.get('/teacher/my-classes');
        // MOCK IF EMPTY
        setAssignedCount(data.length || 4);
      } catch (error) {
        setAssignedCount(4); // Mock data fallback
      }
    };
    fetchAssigned();
  }, []);

  const stats = [
    { label: 'Assigned Courses', value: assignedCount, icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Upcoming Lives', value: '3', icon: Video, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Study Materials', value: '12', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Students', value: '245', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 p-4 md:p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Faculty Overview</h1>
            <p className="text-slate-500 font-bold italic text-sm md:text-base">Track academic performance and student engagements</p>
         </div>
         <div className="flex items-center gap-3 text-xs font-black text-slate-400 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-100 self-start md:self-center uppercase tracking-widest">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-6 group hover:translate-y-[-4px] transition-all">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0`}>
              <stat.icon className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1.5">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
         <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
               <Video className="w-5 h-5 md:w-6 md:h-6 text-teal-600" /> Recent Sessions
            </h2>
            <div className="space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="p-5 md:p-6 bg-slate-50 rounded-xl border border-transparent hover:border-teal-100 hover:bg-teal-50 shadow-sm cursor-pointer transition-all flex justify-between items-center group">
                    <div>
                       <p className="font-black text-slate-900 text-sm md:text-base mb-1">Calculus Integration Workshop</p>
                       <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Class 12 • Mathematics</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-lg uppercase tracking-widest shrink-0 ml-4 shadow-sm">Completed</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
