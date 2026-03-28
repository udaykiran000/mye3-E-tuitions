import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  ChevronRight, 
  Loader2, 
  FileText, 
  MonitorPlay,
  ArrowLeft,
  Download,
  GraduationCap,
  Zap,
  Radio,
  Clock
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const StudentCourseContent = () => {
  const { courseName } = useParams();
  const [content, setContent] = useState({ materials: [] });
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, liveRes] = await Promise.all([
          axios.get(`/student/content/${courseName}`),
          axios.get('/student/live-alerts')
        ]);
        
        setContent(contentRes.data);
        
        // Filter live sessions for THIS course
        const cleanName = courseName.replace(' (Full Course)', '');
        const currentLive = liveRes.data.filter(s => 
          s.classLevel === cleanName || s.subjectName === cleanName || 
          s.classLevel === courseName || s.subjectName === courseName
        );
        setLiveSessions(currentLive);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data || { message: 'Failed to fetch classroom data' });
        setLoading(false);
      }
    };
    fetchData();
  }, [courseName]);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
       <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
          <BookOpen className="w-12 h-12" />
       </div>
       <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900">{error.message}</h2>
          <p className="text-slate-500 font-bold italic">Unlock this course to access premium LIVE sessions and expert notes.</p>
       </div>
       <Link 
         to="/courses" 
         className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[28px] font-black text-lg uppercase tracking-widest shadow-2xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all"
       >
          {error.type === 'renew' ? 'Renew Subscription' : 'Upgrade to Premium'} <ChevronRight />
       </Link>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 pb-20 p-4 md:p-6 lg:px-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
         <div className="flex items-center gap-4 md:gap-6">
            <Link to="/student/dashboard" className="w-12 h-12 md:w-14 md:h-14 bg-white border border-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm shrink-0">
               <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
            <div>
               <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase tracking-tight">{courseName}</h1>
               <div className="flex items-center gap-3 md:gap-4 mt-1">
                  <p className="text-slate-400 font-bold flex items-center gap-2 text-xs md:text-sm">
                     <GraduationCap className="w-4 h-4 text-indigo-500" /> Professional Live Curriculum
                  </p>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <p className="text-indigo-600 font-black text-[9px] md:text-[10px] uppercase tracking-widest">Active Access</p>
               </div>
            </div>
         </div>
      </div>

      {/* LIVE SESSION PULSE (If any) */}
      {liveSessions.length > 0 && (
        <div className="bg-indigo-600 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden group shadow-xl shadow-indigo-900/10">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="flex items-center gap-6 md:gap-8 w-full">
                 <div className="relative shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                       <Radio className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-indigo-600 rounded-full animate-ping" />
                 </div>
                 <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                       <span className="px-2.5 py-1 bg-white text-indigo-600 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest shrink-0">Live Now</span>
                       <h2 className="text-xl md:text-2xl font-black tracking-tight truncate uppercase">{liveSessions[0].topic}</h2>
                    </div>
                    <p className="text-white/70 font-bold italic text-xs md:text-sm">Join the broadcast with your mentor right now!</p>
                 </div>
              </div>
              <a 
                href={liveSessions[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-10 py-4 bg-white text-indigo-600 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3 text-center whitespace-nowrap"
              >
                 Join Virtual Room <ChevronRight className="w-4 h-4" />
              </a>
           </div>
        </div>
      )}

      {/* STUDY MATERIALS SECTION (Now Main Content) */}
      <div className="space-y-6 md:space-y-8">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-xl shadow-indigo-900/5 gap-4">
            <div className="space-y-1">
               <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <FileText className="w-6 h-6 md:w-7 md:h-7 text-indigo-600" /> Learning Assets
               </h2>
               <p className="text-slate-400 font-bold italic text-xs md:text-sm">Premium PDF resources and study materials hub.</p>
            </div>
            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest text-center">
               {content.materials.length} Active Files
            </span>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {content.materials.length === 0 ? (
               <div className="col-span-full py-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                     <FileText className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black text-xs md:text-sm italic uppercase tracking-widest px-6">No study materials uploaded for this course yet</p>
               </div>
            ) : content.materials.map((mat, idx) => (
               <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 flex flex-col gap-6 md:gap-8 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/5 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                  
                  <div className="flex items-center gap-4 md:gap-6 relative z-10">
                     <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform shrink-0">
                        <FileText className="w-6 h-6 md:w-7 md:h-7" />
                     </div>
                     <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-black text-slate-900 truncate uppercase leading-tight">{mat.title}</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">PDF • {mat.fileSize || 'Syncing...'}</p>
                     </div>
                  </div>

                  <a 
                    href={mat.fileUrl} 
                    download
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 shadow-lg transition-all flex items-center justify-center gap-2 relative z-10 active:scale-95 group/down"
                  >
                     Secure Download <Download className="w-3.5 h-3.5 group-hover/down:translate-y-0.5 transition-transform" />
                  </a>
               </div>
            ))}
         </div>
      </div>

      {/* QUICK TIPS PANEL */}
      <div className="p-8 md:p-12 bg-indigo-950 rounded-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
         <div className="space-y-6 md:space-y-8 flex-1 relative z-10">
            <h4 className="text-xl md:text-2xl font-black uppercase tracking-widest flex items-center gap-4">
               <Zap className="w-6 h-6 md:w-8 md:h-8 text-amber-400" /> Pro Student Tips
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
               {[
                 "Attend LIVE sessions for real-time doubt clearing.",
                 "Download PDF notes at least 10 mins before class.",
                 "Set a calendar reminder for upcoming schedules.",
                 "Engage with the tutor during the interactive session."
               ].map((tip, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-white/20 transition-all">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                    <p className="text-[10px] md:text-xs font-black text-white/60 leading-relaxed uppercase tracking-tight">{tip}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentCourseContent;
