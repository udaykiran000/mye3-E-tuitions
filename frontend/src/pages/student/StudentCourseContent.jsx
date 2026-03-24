import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { 
  Play, 
  BookOpen, 
  ChevronRight, 
  Loader2, 
  FileText, 
  MonitorPlay,
  ArrowLeft,
  Download,
  ExternalLink,
  Clock,
  Video,
  GraduationCap,
  Zap,
  Radio
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const StudentCourseContent = () => {
  const { courseName } = useParams();
  const [content, setContent] = useState({ recordings: [], materials: [] });
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
        
        // Filter live sessions for THIS course (bundle or subject)
        const cleanName = courseName.replace(' (Full Bundle)', '');
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
          <p className="text-slate-500 font-bold italic">Unlock this course to access premium videos and expert notes.</p>
       </div>
       <Link 
         to="/store" 
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
                     <GraduationCap className="w-4 h-4 text-indigo-500" /> Professional Curriculum
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

      {/* UNIFIED CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* LEFT: RECORDED LECTURES (Col 8) */}
         <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                  <MonitorPlay className="w-6 h-6 text-indigo-600" /> Recorded Lectures
               </h2>
               <span className="text-slate-400 font-bold text-sm italic">{content.recordings.length} Lessons available</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {content.recordings.length === 0 ? (
                 <div className="col-span-full py-20 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 text-center space-y-4">
                    <MonitorPlay className="w-16 h-16 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest">No recordings uploaded yet</p>
                 </div>
               ) : content.recordings.map((rec, idx) => (
                 <div key={idx} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 transition-all group flex flex-col">
                    <div className="aspect-video bg-slate-900 relative overflow-hidden group">
                       <ReactPlayer 
                         url={`https://www.youtube.com/watch?v=${rec.youtubeId}`}
                         width="100%"
                         height="100%"
                         controls={true}
                         light={`https://img.youtube.com/vi/${rec.youtubeId}/maxresdefault.jpg`}
                         playIcon={
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-2xl scale-90 group-hover:scale-100 transition-all">
                              <Play className="w-6 h-6 fill-current" />
                           </div>
                         }
                       />
                       <div className="absolute top-4 left-4 py-1 px-3 bg-red-600 rounded-lg text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Video className="w-3 h-3" /> Premium
                       </div>
                    </div>
                    <div className="p-8 space-y-5 flex-1 flex flex-col justify-between">
                       <div className="space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase text-indigo-500 tracking-widest">
                             <span className="bg-indigo-50 px-2 py-0.5 rounded-full">Lesson {idx + 1}</span>
                             <span className="text-slate-300">{new Date(rec.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">{rec.title}</h3>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* RIGHT: STUDY MATERIALS SIDEBAR (Col 4) */}
         <div className="lg:col-span-4 space-y-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
               <FileText className="w-6 h-6 text-indigo-600" /> Study Materials
            </h2>

            <div className="space-y-4">
               {content.materials.length === 0 ? (
                 <div className="py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 text-center space-y-4">
                    <FileText className="w-12 h-12 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-black text-xs italic uppercase tracking-widest">No study notes available</p>
                 </div>
               ) : content.materials.map((mat, idx) => (
                 <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col gap-6 hover:border-indigo-200 hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform flex-shrink-0">
                          <FileText className="w-6 h-6" />
                       </div>
                       <div className="min-w-0">
                          <h3 className="text-sm font-black text-slate-900 truncate">{mat.title}</h3>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">PDF • {mat.fileSize || '2.4 MB'}</p>
                       </div>
                    </div>
                    <a 
                      href={mat.fileUrl} 
                      download
                      className="w-full py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                       Download Notes <Download className="w-4 h-4" />
                    </a>
                 </div>
               ))}
            </div>

            {/* QUICK TIPS PANEL */}
            <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[40px] text-white space-y-6 shadow-2xl overflow-hidden relative">
               <Zap className="absolute top-0 right-0 w-32 h-32 text-white/5 -mr-16 -mt-16 rotate-12" />
               <h4 className="text-lg font-black uppercase tracking-widest relative z-10 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-400" /> Pro Learning
               </h4>
               <ul className="space-y-4 relative z-10">
                  {[
                    "Watch recordings in 1.25x for faster revision.",
                    "Download PDF notes before starting the video.",
                    "Attend LIVE sessions for doubt clearing."
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-3 text-xs font-bold text-white/70 leading-relaxed">
                       <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" /> {tip}
                    </li>
                  ))}
               </ul>
            </div>
         </div>

      </div>
    </div>
  );
};

export default StudentCourseContent;
