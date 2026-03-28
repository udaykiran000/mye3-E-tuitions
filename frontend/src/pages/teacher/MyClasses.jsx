import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Video, FileText, Upload, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get('/teacher/my-classes');
        setClasses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classes');
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 p-4 md:p-6 pb-20">
      <div className="space-y-1">
         <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Assigned Subjects</h1>
         <p className="text-slate-500 font-bold italic text-sm md:text-base">List of classes and subjects assigned to your faculty portal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
         {classes.length === 0 ? (
           <div className="col-span-full py-16 md:py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-4">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mx-auto" />
              <p className="text-slate-400 font-black text-base md:text-lg italic uppercase tracking-widest px-6">No assigned content found</p>
           </div>
         ) : classes.map((cls, idx) => (
           <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-teal-900/5 transition-all flex flex-col">
              <div className={`h-36 md:h-40 ${cls.assignmentType === 'bundle' ? 'bg-teal-600' : 'bg-slate-900'} relative p-6 md:p-8 text-white flex flex-col justify-end overflow-hidden`}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700"></div>
                 <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{cls.assignmentType === 'bundle' ? 'Annual Bundle' : 'Individual Course'}</p>
                    <h3 className="text-xl md:text-2xl font-black mt-1 leading-tight uppercase tracking-tight">{cls.classLevel}: {cls.subjectName}</h3>
                 </div>
              </div>
              <div className="p-6 md:p-8 space-y-6 flex-1">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Curriculum Assets</span>
                    <span className="text-slate-900 border-b-2 border-teal-500 pb-0.5">Active</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <Link to="/teacher/recordings" className="flex items-center justify-center gap-2 py-3 bg-teal-50 text-teal-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                       <Upload className="w-3.5 h-3.5" /> Videos
                    </Link>
                    <Link to="/teacher/materials" className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                       <FileText className="w-3.5 h-3.5" /> Notes
                    </Link>
                 </div>

                 <Link 
                   to="/teacher/schedule-live" 
                   className="w-full flex items-center justify-between bg-white border-2 border-slate-900 text-slate-900 p-5 md:p-6 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all group/btn shadow-lg"
                 >
                    <span>Go Live Now</span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default MyClasses;
