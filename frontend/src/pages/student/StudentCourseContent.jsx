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
          axios.get(`/api/student/content/${courseName}`),
          axios.get('/api/student/live-alerts')
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
         <div className="flex items-center gap-6">
            <Link to="/student/dashboard" className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
               <ArrowLeft />
            </Link>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">{courseName}</h1>
               <div className="flex items-center gap-4 mt-1">
                  <p className="text-slate-400 font-bold flex items-center gap-2 text-sm">
                     <GraduationCap className="w-4 h-4 text-indigo-500" /> Professional Live Curriculum
                  </p>
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Enrollment Active</p>
               </div>
            </div>
         </div>
      </div>

      {/* LIVE SESSION PULSE (If any) */}
      {liveSessions.length > 0 && (
        <div className="bg-indigo-600 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/20">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-700" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                 <div className="relative">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center animate-pulse">
                       <Radio className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-4 border-indigo-600 rounded-full animate-ping" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Live Now</span>
                       <h2 className="text-2xl font-black tracking-tight">{liveSessions[0].topic}</h2>
                    </div>
                    <p className="text-white/70 font-bold italic">Join the active session with your expert mentor right now!</p>
                 </div>
              </div>
              <a 
                href={liveSessions[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 bg-white text-indigo-600 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                 Join Virtual Classroom <ChevronRight className="w-4 h-4" />
              </a>
           </div>
        </div>
      )}

      {/* STUDY MATERIALS SECTION (Now Main Content) */}
      <div className="space-y-8">
         <div className="flex items-center justify-between bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="space-y-1">
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                  <FileText className="w-8 h-8 text-indigo-600" /> Study Materials Hub
               </h2>
               <p className="text-slate-400 font-bold italic">Premium PDF notes and resources for this subject.</p>
            </div>
            <span className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-inner">
               {content.materials.length} Resources Active
            </span>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.materials.length === 0 ? (
               <div className="col-span-full py-32 bg-slate-50 rounded-[60px] border-2 border-dashed border-slate-200 text-center space-y-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                     <FileText className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest">No study materials uploaded for this course yet</p>
               </div>
            ) : content.materials.map((mat, idx) => (
               <div key={idx} className="bg-white p-8 rounded-[48px] border border-slate-100 flex flex-col gap-8 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-900/10 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                     <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                        <FileText className="w-8 h-8" />
                     </div>
                     <div className="min-w-0">
                        <h3 className="text-lg font-black text-slate-900 truncate leading-tight uppercase">{mat.title}</h3>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">PDF Document • {mat.fileSize || '3.5 MB'}</p>
                     </div>
                  </div>

                  <a 
                    href={mat.fileUrl} 
                    download
                    className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all flex items-center justify-center gap-3 relative z-10 active:scale-95"
                  >
                     Secure Download <Download className="w-4 h-4" />
                  </a>
               </div>
            ))}
         </div>
      </div>

      {/* QUICK TIPS PANEL */}
      <div className="p-10 bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[50px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
         <div className="space-y-6 flex-1 relative z-10">
            <h4 className="text-2xl font-black uppercase tracking-widest flex items-center gap-4">
               <Zap className="w-8 h-8 text-amber-400" /> Pro Learning Tips
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {[
                 "Attend LIVE sessions for real-time doubt clearing.",
                 "Download PDF notes at least 10 mins before class.",
                 "Set a calendar reminder for upcoming schedules.",
                 "Engage with the tutor during the interactive session."
               ].map((tip, i) => (
                 <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-xs font-bold text-white/70 leading-relaxed">{tip}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentCourseContent;
