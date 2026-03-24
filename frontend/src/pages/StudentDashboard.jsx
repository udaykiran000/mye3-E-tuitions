import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Play, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Video, 
  ChevronRight, 
  Calendar,
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subRes, liveRes] = await Promise.all([
          axios.get('/api/student/subscriptions'),
          axios.get('/api/student/live-alerts')
        ]);
        
        // MOCK DATA INJECTION FOR ADMIN PREVIEW
        if (subRes.data.length === 0) {
           setSubscriptions([
              { name: 'Class 10 Bundle (Mock)', expiryDate: new Date(Date.now() + 86400000 * 300) },
              { name: 'Physics 11-12 (Mock)', expiryDate: new Date(Date.now() - 86400000 * 5) }
           ]);
        } else {
           setSubscriptions(subRes.data);
        }

        if (liveRes.data.length === 0) {
           setLiveAlerts([{
              title: 'Mock Live Session: Quadratic Equations',
              subjectName: 'Mathematics',
              classLevel: 'Class 10',
              teacherId: { name: 'Dr. Preview' },
              link: 'https://zoom.us'
           }]);
        } else {
           setLiveAlerts(liveRes.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data');
        // Fallback for demo
        setSubscriptions([
           { name: 'Demo Course 1', expiryDate: new Date() },
           { name: 'Demo Course 2', expiryDate: new Date(Date.now() + 1000000) }
        ]);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Live class alert */}
      {liveAlerts.length > 0 && liveAlerts.map((alert, idx) => (
        <div key={idx} className="bg-rose-600 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-rose-900/20">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-125 transition-all duration-1000"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 bg-white/20 rounded-[32px] flex items-center justify-center relative">
                    <Video className="w-10 h-10" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                       <div className="w-3 h-3 bg-rose-600 rounded-full animate-ping"></div>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Live Now</span>
                       <span className="text-rose-100 font-bold text-sm tracking-wide">{alert.subjectName} • {alert.classLevel}</span>
                    </div>
                    <h2 className="text-3xl font-black">{alert.title}</h2>
                    <p className="text-rose-100 font-bold italic">By {alert.teacherId?.name}</p>
                 </div>
              </div>
              <a 
                href={alert.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-5 bg-white text-rose-600 rounded-[28px] font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 group/btn flex items-center gap-3"
              >
                 Join Broadcast <Zap className="w-5 h-5 group-hover/btn:animate-pulse" />
              </a>
           </div>
        </div>
      ))}

      {/* Hero Stats Section */}
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Academic Pulse</h1>
            <p className="text-slate-500 font-bold">Track your learning progress and upcoming milestones</p>
         </div>
         <div className="hidden lg:flex items-center gap-3 text-sm font-bold text-slate-400 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            {/* Active Subscriptions Grid */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">Enrolled Courses</h3>
                  <Link to="/store" className="text-xs font-black text-indigo-600 hover:underline">Browse More</Link>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {subscriptions.length === 0 ? (
                    <div className="col-span-full py-16 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center space-y-4">
                       <BookOpen className="w-12 h-12 text-slate-200 mx-auto" />
                       <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No active enrollments</p>
                       <Link to="/store" className="inline-block px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl">Purchase Course</Link>
                    </div>
                  ) : subscriptions.map((sub, idx) => {
                    const isExpired = new Date() > new Date(sub.expiryDate);
                    return (
                      <div key={idx} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all group flex flex-col h-full relative overflow-hidden">
                         {isExpired && (
                           <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-10 flex items-center justify-center p-8">
                              <Link to="/store" className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest text-center animate-bounce">
                                 Renew Access
                              </Link>
                           </div>
                         )}
                         <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[20px] flex items-center justify-center">
                                  <BookOpen className="w-7 h-7" />
                               </div>
                               <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isExpired ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                  {isExpired ? 'Expired' : 'Active'}
                               </span>
                            </div>
                            <div>
                               <h4 className="text-2xl font-black text-slate-900 leading-tight">{sub.name}</h4>
                               <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5" /> Expiry: {new Date(sub.expiryDate).toLocaleDateString()}
                               </p>
                            </div>
                         </div>
                         <Link 
                           to={`/student/classes/${sub.name}`}
                           className="mt-8 flex items-center justify-between bg-slate-50 hover:bg-indigo-600 hover:text-white p-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all group/btn"
                         >
                            <span>Open Classroom</span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                         </Link>
                      </div>
                    );
                  })}
               </div>
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-10">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-10">
               <div>
                  <h3 className="text-lg font-black text-slate-900">Learning Insights</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Course engagement metrics</p>
               </div>
               
               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-7 h-7" />
                     </div>
                     <div>
                        <p className="text-2xl font-black text-slate-900">84%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Zap className="w-7 h-7" />
                     </div>
                     <div>
                        <p className="text-2xl font-black text-slate-900">12h</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Watch Time</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                     Tip: Join live sessions to earn "Participation Badges" and boost your academic score.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
