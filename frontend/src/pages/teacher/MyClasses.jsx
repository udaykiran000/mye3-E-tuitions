import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Loader2, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [groupedClasses, setGroupedClasses] = useState({});
  const [loading, setLoading] = useState(true);
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
                <div className={`h-32 ${hasBundle ? 'bg-teal-600' : 'bg-slate-900'} relative p-6 md:p-8 text-white flex flex-col justify-end overflow-hidden shrink-0`}>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-all duration-700"></div>
                   <div className="relative z-10 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-white/20 rounded-md text-[7px] font-black uppercase tracking-widest text-white">
                          {hasBundle ? 'All Subjects' : 'Modular'}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black leading-none uppercase tracking-tighter">{lvl}</h3>
                   </div>
                </div>

                {/* CONTENT: DROPDOWN + ACTIONS */}
                <div className="p-8 space-y-8 flex-1 bg-slate-50/30">
                   <div className="space-y-4 flex-1">
                      <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-2">Select Subject</label>
                      <div className={`grid gap-2 ${items.length > 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                         {items.map((item, idx) => {
                            const isSelected = JSON.stringify(item) === JSON.stringify(currentSub);
                            return (
                               <button 
                                 key={idx} 
                                 onClick={() => handleLocalSubjectChange(lvl, item)}
                                 className={`group/sub relative w-full px-4 py-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                                    isSelected 
                                    ? 'bg-teal-50 border-teal-500 shadow-sm ring-4 ring-teal-500/10' 
                                    : 'bg-white border-slate-100 hover:border-teal-200 hover:bg-slate-50'
                                 }`}
                               >
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 transition-all ${
                                     isSelected ? 'bg-teal-600 text-white rotate-6' : 'bg-slate-100 text-slate-400 group-hover/sub:bg-teal-100 group-hover/sub:text-teal-600 group-hover/sub:-rotate-3'
                                  }`}>
                                     {item.subjectName?.charAt(0)}
                                  </div>
                                  <span className={`text-[11px] font-black uppercase tracking-tight truncate ${isSelected ? 'text-teal-900' : 'text-slate-500 group-hover/sub:text-teal-700'}`}>
                                     {item.subjectName}
                                  </span>
                                  {isSelected && (
                                     <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                  )}
                               </button>
                            );
                         })}
                      </div>
                   </div>

                    <div className="pt-6 mt-auto">
                      <Link 
                        to="/teacher/materials" 
                        className="w-full py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm flex items-center justify-center gap-3 group/act font-black text-xs uppercase tracking-widest"
                      >
                         <FileText className="w-5 h-5 group-hover/act:scale-110 transition-transform" /> 
                         <span>View Study Materials</span>
                      </Link>
                    </div>
                </div>
              </div>
            );
         })}
      </div>
    </div>
  );
};

export default MyClasses;
