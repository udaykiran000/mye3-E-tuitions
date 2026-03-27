import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Video, FileText, UserCircle, Calendar, GraduationCap } from 'lucide-react';

const TeacherDashboard = () => {
  const [assignedCount, setAssignedCount] = useState(0);

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const { data } = await axios.get('/api/teacher/my-classes');
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
    <div className="space-y-10">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Faculty Overview</h1>
            <p className="text-slate-500 font-bold">Academic performance and scheduled student engagements</p>
         </div>
         <div className="flex items-center gap-3 text-sm font-bold text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
            <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
               <Video className="text-teal-600" /> Recent Live History
            </h2>
            <div className="space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-slate-100 transition-all">
                    <div>
                       <p className="font-black text-slate-900">Calculus Integration Workshop</p>
                       <p className="text-xs font-bold text-slate-400">Class 12 • Mathematics</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Completed</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
