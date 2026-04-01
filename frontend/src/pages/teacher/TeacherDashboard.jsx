import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, UserCircle, Calendar, GraduationCap } from 'lucide-react';

const TeacherDashboard = () => {
  const [assignedCount, setAssignedCount] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [classRes, sessionRes] = await Promise.all([
        axios.get('/teacher/my-classes'),
        axios.get('/teacher/live-sessions')
      ]);
      setAssignedCount(classRes.data.length || 0);
      setSessions(sessionRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/teacher/live-sessions/${id}/status`, { status });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const stats = [
    { label: 'My Classes', value: assignedCount, icon: BookOpen, color: 'text-teal-600', bg: 'bg-teal-50', path: '/teacher/classes' },
    { label: 'Class', value: sessions.filter(s => s.status !== 'ended').length, icon: Video, color: 'text-rose-600', bg: 'bg-rose-50', path: '/teacher/classes' },
    { label: 'Past Sessions', value: sessions.filter(s => s.status === 'ended').length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/teacher/past-sessions' },
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
        {stats.map((stat, idx) => {
          const CardContent = (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 md:gap-6 group-hover:translate-y-[-4px] transition-all h-full">
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0`}>
                <stat.icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1.5">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
              </div>
            </div>
          );

          return stat.path ? (
            <Link key={idx} to={stat.path} className="group min-h-[120px]">
               {CardContent}
            </Link>
          ) : (
            <div key={idx} className="min-h-[120px]">
               {CardContent}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8 md:gap-10">
         <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 md:w-6 md:h-6 text-teal-600" /> Live Management Hub
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage Session Broadcasting</p>
            </h2>
            <div className="space-y-6">
               {sessions.length === 0 ? (
                 <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs">No sessions scheduled yet.</p>
               ) : (
                 sessions.map((s, i) => (
                  <div key={i} className={`p-6 md:p-8 rounded-2xl border-2 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                    s.status === 'live' ? 'bg-rose-50 border-rose-100' : 
                    s.status === 'ended' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm'
                  }`}>
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase tracking-widest ${
                             s.status === 'live' ? 'bg-rose-600 text-white animate-pulse' :
                             s.status === 'ended' ? 'bg-slate-400 text-white' : 'bg-teal-600 text-white'
                           }`}>
                             {s.status}
                           </span>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             {new Date(s.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </div>
                        <p className="font-black text-slate-900 text-xl tracking-tight leading-none">{s.title}</p>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">{s.classLevel} • {s.subjectName}</p>
                     </div>
                     
                     <div className="flex items-center gap-4 w-full md:w-auto">
                        {s.status === 'upcoming' && (
                          <button 
                            onClick={() => handleUpdateStatus(s._id, 'live')}
                            className="flex-1 md:flex-none px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-xl"
                          >
                            START LIVE CLASS
                          </button>
                        )}
                        {s.status === 'live' && (
                          <div className="flex items-center gap-3 w-full">
                             <a 
                               href={s.link} target="_blank" rel="noopener noreferrer"
                               className="flex-1 md:flex-none px-6 py-3 bg-white text-rose-600 border border-rose-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                             >
                               Join Class
                             </a>
                             <button 
                               onClick={() => handleUpdateStatus(s._id, 'ended')}
                               className="flex-1 md:flex-none px-8 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-xl"
                             >
                               End Class
                             </button>
                          </div>
                        )}
                        {s.status === 'ended' && (
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Broadcast Finished</span>
                        )}
                     </div>
                  </div>
                 ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
