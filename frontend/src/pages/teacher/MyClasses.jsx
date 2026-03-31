import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Video, FileText, Upload, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScheduleLiveModal from '../../components/teacher/ScheduleLiveModal';

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

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

  const handleOpenSchedule = (cls) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 p-4 md:p-8 pb-20">
      <div className="space-y-1">
         <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight italic">Assigned Classes</h1>
         <p className="text-slate-500 font-bold italic text-sm md:text-base">List of classes and subjects assigned by Admin to your faculty portal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
         {classes.length === 0 ? (
           <div className="col-span-full py-16 md:py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-4">
              <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mx-auto" />
              <p className="text-slate-400 font-black text-base md:text-lg italic uppercase tracking-widest px-6">No assigned classes found</p>
           </div>
         ) : classes.map((cls, idx) => (
           <div key={idx} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-teal-900/5 transition-all flex flex-col h-full">
              <div className={`h-40 md:h-44 ${cls.assignmentType === 'bundle' ? 'bg-teal-600' : 'bg-slate-900'} relative p-8 text-white flex flex-col justify-end overflow-hidden`}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700"></div>
                 <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">{cls.assignmentType === 'bundle' ? 'Full Access Bundle' : 'Single Subject'}</p>
                    <h3 className="text-xl md:text-2xl font-black leading-tight uppercase tracking-tight">{cls.classLevel}: {cls.subjectName}</h3>
                 </div>
              </div>
              <div className="p-8 space-y-8 flex-1 flex flex-col">
                 <div className="grid grid-cols-2 gap-4">
                    <Link to="/teacher/recordings" className="flex items-center justify-center gap-3 py-4 bg-teal-50 text-teal-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all shadow-sm">
                       <Upload className="w-4 h-4" /> Videos
                    </Link>
                    <Link to="/teacher/materials" className="flex items-center justify-center gap-3 py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                       <FileText className="w-4 h-4" /> Notes
                    </Link>
                 </div>

                 <div className="mt-auto pt-6 border-t border-slate-50">
                    <button 
                      onClick={() => handleOpenSchedule(cls)}
                      className="w-full flex items-center justify-between bg-white border-2 border-slate-900 text-slate-900 p-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all group/btn shadow-xl active:scale-95"
                    >
                      <span>SCHEDULE LIVE CLASS</span>
                      <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <ScheduleLiveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedClass={selectedClass}
      />
    </div>
  );
};

export default MyClasses;
