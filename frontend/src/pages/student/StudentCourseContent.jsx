import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  GraduationCap
} from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const StudentCourseContent = () => {
  const { courseName } = useParams();
  const [activeTab, setActiveTab] = useState('Videos');
  const [content, setContent] = useState({ recordings: [], materials: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`/api/student/content/${courseName}`);
        setContent(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data || { message: 'Failed to fetch content' });
        setLoading(false);
      }
    };
    fetchContent();
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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <Link to="/student/dashboard" className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
               <ArrowLeft />
            </Link>
            <div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">{courseName}</h1>
               <p className="text-slate-400 font-bold flex items-center gap-2 mt-1">
                  <GraduationCap className="w-4 h-4 text-indigo-500" /> Professional Curriculum
               </p>
            </div>
         </div>
         
         <div className="flex bg-white p-2 rounded-[28px] border border-slate-100 shadow-sm">
            {['Videos', 'Study Notes'].map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-8 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {activeTab === 'Videos' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {content.recordings.length === 0 ? (
                 <div className="col-span-full py-20 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 text-center space-y-4">
                    <MonitorPlay className="w-16 h-16 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest">No recordings uploaded yet</p>
                 </div>
               ) : content.recordings.map((rec, idx) => (
                 <div key={idx} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 transition-all group">
                    <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                       <img 
                         src={`https://img.youtube.com/vi/${rec.youtubeId}/maxresdefault.jpg`} 
                         className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                         alt={rec.title}
                       />
                       <a 
                         href={`https://youtube.com/watch?v=${rec.youtubeId}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-2xl relative z-10 group-hover:scale-110 transition-all active:scale-90"
                       >
                          <Play className="w-6 h-6 fill-current" />
                       </a>
                       <div className="absolute bottom-4 left-6 py-1 px-3 bg-red-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <Video className="w-3 h-3" /> YouTube Premium
                       </div>
                    </div>
                    <div className="p-8 space-y-4">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase text-indigo-500 tracking-widest">
                          <span>Lecture Video</span>
                          <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                       </div>
                       <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{rec.title}</h3>
                       <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                             <Clock className="w-3.5 h-3.5" /> 45:20 Mins
                          </div>
                          <button className="text-indigo-600 font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                             Watch Now <ChevronRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         ) : (
            <div className="space-y-4">
               {content.materials.length === 0 ? (
                 <div className="py-20 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 text-center space-y-4">
                    <FileText className="w-16 h-16 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest">No study notes available</p>
                 </div>
               ) : content.materials.map((mat, idx) => (
                 <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between hover:border-indigo-200 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                          <FileText className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-slate-900">{mat.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                             <span>PDF Format</span>
                             <span>•</span>
                             <span>{mat.fileSize || '2.4 MB'}</span>
                          </div>
                       </div>
                    </div>
                    <a 
                      href={mat.fileUrl} 
                      download
                      className="px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-3"
                    >
                       Download <Download className="w-4 h-4" />
                    </a>
                 </div>
               ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default StudentCourseContent;
