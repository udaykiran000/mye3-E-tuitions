import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, FileText, ChevronRight, Loader2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScheduleLiveModal from '../../components/teacher/ScheduleLiveModal';

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [groupedClasses, setGroupedClasses] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjectSelection, setSubjectSelection] = useState({}); // { classLevel: selectedSubjectObject }

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get('/teacher/my-classes');
        
        // Group by classLevel
        const grouped = data.reduce((acc, curr) => {
          if (!acc[curr.classLevel]) acc[curr.classLevel] = [];
          acc[curr.classLevel].push(curr);
          return acc;
        }, {});

        setGroupedClasses(grouped);
        setClasses(data);

        // Default selection for each class card
        const initialSelection = {};
        Object.keys(grouped).forEach(lvl => {
          initialSelection[lvl] = grouped[lvl][0];
        });
        setSubjectSelection(initialSelection);

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

  const handleLocalSubjectChange = (lvl, subjectObj) => {
    setSubjectSelection(prev => ({ ...prev, [lvl]: subjectObj }));
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
    </div>
  );

  const classLevels = Object.keys(groupedClasses).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 p-4 md:p-8 pb-20 font-sans">
      <div className="space-y-1">
         <div className="inline-flex py-1 px-3 bg-teal-50 rounded-lg text-teal-600 text-[10px] font-black uppercase tracking-widest gap-2 items-center mb-2 border border-teal-100">
            <GraduationCap className="w-3 h-3" />
            Teacher Dashboard
         </div>
         <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Faculty Portal</h1>
         <p className="text-slate-400 font-bold italic text-xs md:text-sm tracking-tight opacity-70">Direct access to your assigned grades and subjects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
         {classLevels.length === 0 ? (
           <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-4">
              <BookOpen className="w-16 h-16 text-slate-200 mx-auto" />
              <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest px-6">No assigned classes found</p>
           </div>
         ) : classLevels.map((lvl) => {
            const items = groupedClasses[lvl];
            const hasBundle = items.some(i => i.assignmentType === 'bundle');
            const currentSub = subjectSelection[lvl] || items[0];

            return (
              <div key={lvl} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-teal-900/10 transition-all flex flex-col h-full ring-1 ring-slate-100">
                {/* HEADER */}
                <div className={`h-40 md:h-44 ${hasBundle ? 'bg-teal-600' : 'bg-slate-900'} relative p-8 md:p-10 text-white flex flex-col justify-end overflow-hidden shrink-0`}>
                   <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-all duration-700"></div>
                   <div className="relative z-10 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-white">
                          {hasBundle ? 'All Subjects Access' : 'Modular Access'}
                        </span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black leading-none uppercase tracking-tighter">{lvl}</h3>
                   </div>
                </div>

                {/* CONTENT: DROPDOWN + ACTIONS */}
                <div className="p-8 space-y-8 flex-1 bg-slate-50/30">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-1">Select Subject</label>
                      <select 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-teal-600 font-black text-slate-900 uppercase text-xs shadow-sm transition-all cursor-pointer hover:border-teal-300"
                        value={currentSub ? JSON.stringify(currentSub) : ''}
                        onChange={(e) => handleLocalSubjectChange(lvl, JSON.parse(e.target.value))}
                      >
                         {items.map((item, idx) => (
                            <option key={idx} value={JSON.stringify(item)}>
                               {item.subjectName}
                            </option>
                         ))}
                      </select>
                   </div>

                   <div className="grid grid-cols-5 gap-3 pt-4 border-t border-slate-100">
                      <Link 
                        to="/teacher/materials" 
                        title="Notes"
                        className="col-span-2 p-5 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm flex flex-col items-center justify-center gap-2 group/act"
                      >
                         <FileText className="w-5 h-5 group-hover/act:scale-110 transition-transform" /> 
                         <span className="text-[8px] font-black uppercase tracking-widest">Notes</span>
                      </Link>
                      
                      <button 
                        onClick={() => currentSub && handleOpenSchedule(currentSub)}
                        className="col-span-3 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-teal-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group/live"
                      >
                         <span>Go Live</span>
                         <ChevronRight className="w-4 h-4 group-hover/live:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              </div>
            );
         })}
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
