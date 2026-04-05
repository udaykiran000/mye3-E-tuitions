import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings, 
  Loader2, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PricingManagement = () => {
  const [juniorClasses, setJuniorClasses] = useState([]);
  const [seniorSubjects, setSeniorSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [addClassForm, setAddClassForm] = useState({
    className: '',
    board: 'TS Board',
    pricing: { oneMonth: 0, threeMonths: 0, sixMonths: 0, twelveMonths: 0 }
  });

  const fetchData = async () => {
    try {
      const [resClasses, resSubjects] = await Promise.all([
        axios.get('/admin/classes'),
        axios.get('/admin/subjects')
      ]);
      setJuniorClasses(resClasses.data);
      setSeniorSubjects(resSubjects.data.sort((a,b) => (a.classLevel || 0) - (b.classLevel || 0)));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (type, id, currentStatus) => {
    try {
      await axios.put('/admin/toggle-status', { type, id, isActive: !currentStatus });
      toast.success('Status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateJuniorPrice = async (id, payload) => {
    try {
      await axios.put(`/admin/classes/${id}`, payload);
      toast.success('Pricing updated!');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleUpdateSeniorPrice = async (id, updatedSubject) => {
    try {
      await axios.put(`/admin/subjects/${id}`, updatedSubject);
      toast.success('Pricing updated!');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    try {
      const allBoards = ['TS Board', 'AP Board', 'CBSE Board', 'ICSE Board'];
      await Promise.all(allBoards.map(board => 
        axios.post('/admin/classes', { ...addClassForm, board })
      ));
      toast.success(`${addClassForm.className} created successfully for all boards!`);
      setIsAddClassModalOpen(false);
      setAddClassForm({
        className: '',
        board: 'TS Board',
        pricing: { oneMonth: 0, threeMonths: 0, sixMonths: 0, twelveMonths: 0 }
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create class');
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
       <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  const classLevels = juniorClasses.sort((a, b) => {
    const numA = parseInt(a.className.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.className.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  return (
    <div className="space-y-6 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 font-sans">
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 mb-4">
         <div className="space-y-0">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
               <Settings className="w-5 h-5 text-indigo-600" /> Pricing Management
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.15em]">Control course fees and subscription tiers</p>
         </div>
      </div>

      {/* SECTIONS WRAPPER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pb-12">
        
        {/* JUNIOR SECTION (6-10) */}
        <section className="space-y-4">
         <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md">
               Classes 6 - 10
            </div>
            <h2 className="text-base md:text-lg font-black text-slate-900">Junior Pricing</h2>
            <button 
              onClick={() => setIsAddClassModalOpen(true)}
              className="ml-auto px-5 py-2 bg-indigo-600/10 text-indigo-600 border border-indigo-200 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
            >
               + New Class
            </button>
         </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/5 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                       <tr className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                          <th className="px-6 py-4 w-[15%]">Grade</th>
                          <th className="px-6 py-4 w-[55%]">Pricing (1m / 3m / 6m / 12m)</th>
                          <th className="px-6 py-4 w-[15%] text-center">Status</th>
                          <th className="px-6 py-4 w-[15%] text-right">Actions</th>
                       </tr>
                    </thead>
                  <tbody className="divide-y divide-slate-50">
                     {classLevels.map((cls) => (
                       <React.Fragment key={cls._id}>
                         <tr className="group hover:bg-slate-50/50 transition-all">
                           <td className="px-6 py-4 font-black text-slate-900">{cls.className}</td>
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-100">
                                 <input type="number" id={`p1-${cls._id}`} title="1m" defaultValue={cls.pricing?.oneMonth || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                 <input type="number" id={`p3-${cls._id}`} title="3m" defaultValue={cls.pricing?.threeMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                 <input type="number" id={`p6-${cls._id}`} title="6m" defaultValue={cls.pricing?.sixMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                 <input type="number" id={`p12-${cls._id}`} title="12m" defaultValue={cls.pricing?.twelveMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                               </div>
                               <button 
                                 onClick={() => {
                                   const pricing = {
                                     oneMonth: Number(document.getElementById(`p1-${cls._id}`).value),
                                     threeMonths: Number(document.getElementById(`p3-${cls._id}`).value),
                                     sixMonths: Number(document.getElementById(`p6-${cls._id}`).value),
                                     twelveMonths: Number(document.getElementById(`p12-${cls._id}`).value)
                                   };
                                   handleUpdateJuniorPrice(cls._id, { pricing });
                                 }}
                                 className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm"
                               >
                                 <CheckCircle2 className="w-4 h-4" />
                               </button>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-center">
                             <button onClick={() => handleToggleStatus('class', cls._id, cls.isActive)} className={cls.isActive ? 'text-emerald-500' : 'text-slate-300'}>
                               <CheckCircle2 className="w-5 h-5 mx-auto" />
                             </button>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <button onClick={() => setExpandedId(expandedId === cls._id ? null : cls._id)} className="text-indigo-600">
                               {expandedId === cls._id ? <ChevronUp /> : <ChevronDown />}
                             </button>
                           </td>
                         </tr>
                         {expandedId === cls._id && (
                           <tr className="bg-slate-50/50">
                             <td colSpan="4" className="px-4 md:px-10 py-6 md:py-10">
                                <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-inner space-y-6">
                                   <div className="flex items-center justify-between">
                                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                                         <BookOpen className="w-4 h-4 text-indigo-500" /> Linked Subjects
                                      </h4>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {(cls.subjects || []).map((sub, idx) => (
                                        <div key={idx} className="p-5 bg-slate-50 rounded-xl border border-slate-100 group transition-all relative">
                                           <button 
                                             onClick={() => {
                                               if (window.confirm('Remove this subject?')) {
                                                 const updatedSubjects = cls.subjects.filter((_, i) => i !== idx);
                                                 handleUpdateJuniorPrice(cls._id, { subjects: updatedSubjects });
                                               }
                                             }}
                                             className="absolute top-2 right-2 p-1.5 text-rose-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                                           >
                                              <X className="w-3 h-3" />
                                           </button>
                                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{sub.name}</label>
                                           <div className="mt-2 text-[10px] font-bold text-indigo-500/50 uppercase italic">Part of Full Package</div>
                                        </div>
                                      ))}
                                      
                                      {/* QUICK ADD SUBJECT */}
                                      <div className="p-5 bg-indigo-600/5 rounded-xl border-2 border-dashed border-indigo-200 flex flex-col justify-center gap-4 hover:bg-white hover:border-indigo-600 transition-all">
                                         <input 
                                           id={`new-sub-name-${cls._id}`}
                                           type="text" 
                                           placeholder="Enter Subject Name..."
                                           className="w-full bg-transparent border-b-2 border-indigo-100 focus:border-indigo-600 outline-none py-1 font-black text-slate-900 text-xs placeholder:text-indigo-200"
                                         />
                                         <button 
                                           onClick={() => {
                                             const nameInput = document.getElementById(`new-sub-name-${cls._id}`);
                                             const name = nameInput.value;
                                             if (!name) return toast.error('Enter name');
                                             const updatedSubjects = [...(cls.subjects || []), { name, singleSubjectPrice: 0 }];
                                             handleUpdateJuniorPrice(cls._id, { subjects: updatedSubjects });
                                             nameInput.value = '';
                                           }}
                                           className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                                         >
                                            Link New Subject
                                         </button>
                                      </div>
                                   </div>
                                </div>
                             </td>
                           </tr>
                         )}
                       </React.Fragment>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
        </section>

        {/* INTER SECTION */}
        <div className="space-y-12">
            {/* INTER 1st YEAR */}
            <section className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 bg-indigo-900 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md">
                     First Year
                  </div>
                  <h2 className="text-base md:text-lg font-black text-slate-900 leading-none">Inter 1st Year</h2>
               </div>

               <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/5 overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                           <tr className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                              <th className="px-6 py-4 w-[25%]">Subject</th>
                              <th className="px-6 py-4 w-[50%] text-center">Pricing</th>
                              <th className="px-6 py-4 w-[25%] text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {seniorSubjects.filter(s => Number(s.classLevel) === 11).map((sub) => (
                              <tr key={sub._id} className="group hover:bg-slate-50/50 transition-all">
                                 <td className="px-6 py-4">
                                    <p className="font-black text-slate-900 text-sm whitespace-nowrap">{sub.name}</p>
                                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest leading-none">{sub.board}</span>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 justify-center">
                                       <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-100">
                                          <input type="number" id={`sp1-${sub._id}`} title="1m" defaultValue={sub.pricing?.oneMonth || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                          <input type="number" id={`sp3-${sub._id}`} title="3m" defaultValue={sub.pricing?.threeMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                          <input type="number" id={`sp6-${sub._id}`} title="6m" defaultValue={sub.pricing?.sixMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                          <input type="number" id={`sp12-${sub._id}`} title="12m" defaultValue={sub.pricing?.twelveMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                       </div>
                                       <button onClick={() => {
                                          const pricing = {
                                            oneMonth: Number(document.getElementById(`sp1-${sub._id}`).value),
                                            threeMonths: Number(document.getElementById(`sp3-${sub._id}`).value),
                                            sixMonths: Number(document.getElementById(`sp6-${sub._id}`).value),
                                            twelveMonths: Number(document.getElementById(`sp12-${sub._id}`).value)
                                          };
                                          handleUpdateSeniorPrice(sub._id, { pricing });
                                       }} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm"><CheckCircle2 className="w-4 h-4" /></button>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       <button onClick={() => handleToggleStatus('subject', sub._id, sub.isActive)} className={sub.isActive ? 'text-emerald-500' : 'text-slate-300'}><CheckCircle2 className="w-5 h-5 mx-auto" /></button>
                                       <button onClick={async () => { if(window.confirm('Delete?')){ await axios.delete(`/admin/subjects/${sub._id}`); fetchData(); } }} className="text-rose-300 hover:text-rose-600"><X className="w-4 h-4 mx-auto" /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </section>

            {/* INTER 2nd YEAR */}
            <section className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 bg-orange-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md">
                     Second Year
                  </div>
                  <h2 className="text-base md:text-lg font-black text-slate-900 leading-none">Inter 2nd Year</h2>
               </div>

               <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/5 overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                           <tr className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                              <th className="px-6 py-4 w-[25%]">Subject</th>
                              <th className="px-6 py-4 w-[50%] text-center">Pricing</th>
                              <th className="px-6 py-4 w-[25%] text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {seniorSubjects.filter(s => Number(s.classLevel) === 12).map((sub) => (
                              <tr key={sub._id} className="group hover:bg-slate-50/50 transition-all">
                                 <td className="px-6 py-4">
                                    <p className="font-black text-slate-900 text-sm whitespace-nowrap">{sub.name}</p>
                                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest leading-none">{sub.board}</span>
                                 </td>
                                 <td className="px-6 py-4 text-center">
                                    <div className="flex items-center gap-2 justify-center">
                                       <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-100">
                                          <input type="number" id={`sp2-1-${sub._id}`} title="1m" defaultValue={sub.pricing?.oneMonth || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                          <input type="number" id={`sp2-3-${sub._id}`} title="3m" defaultValue={sub.pricing?.threeMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                          <input type="number" id={`sp2-6-${sub._id}`} title="6m" defaultValue={sub.pricing?.sixMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                          <input type="number" id={`sp2-12-${sub._id}`} title="12m" defaultValue={sub.pricing?.twelveMonths || 0} className="w-12 text-center bg-white border rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-600" />
                                       </div>
                                       <button onClick={() => {
                                          const pricing = {
                                            oneMonth: Number(document.getElementById(`sp2-1-${sub._id}`).value),
                                            threeMonths: Number(document.getElementById(`sp2-3-${sub._id}`).value),
                                            sixMonths: Number(document.getElementById(`sp2-6-${sub._id}`).value),
                                            twelveMonths: Number(document.getElementById(`sp2-12-${sub._id}`).value)
                                          };
                                          handleUpdateSeniorPrice(sub._id, { pricing });
                                       }} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-sm"><CheckCircle2 className="w-4 h-4" /></button>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       <button onClick={() => handleToggleStatus('subject', sub._id, sub.isActive)} className={sub.isActive ? 'text-emerald-500' : 'text-slate-300'}><CheckCircle2 className="w-5 h-5" /></button>
                                       <button onClick={async () => { if(window.confirm('Delete?')){ await axios.delete(`/admin/subjects/${sub._id}`); fetchData(); } }} className="text-rose-300 hover:text-rose-600"><X className="w-4 h-4" /></button>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </section>

            {/* ADD SUBJECT BLOCK */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-black text-sm uppercase tracking-widest">Link Inter Subject</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <input id="new-senior-name" type="text" placeholder="Subject Name..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-indigo-500 placeholder:text-white/20" />
                        <div className="flex gap-2">
                            <select id="new-senior-level" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-2 py-3 font-bold text-[10px] outline-none">
                                <option value="11">Inter 1st Year (11)</option>
                                <option value="12">Inter 2nd Year (12)</option>
                            </select>
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold text-[10px] text-white/50 flex items-center justify-center uppercase tracking-widest">
                                All Boards
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-2">
                           <div className="space-y-1"><label className="text-[8px] font-black text-white/40 uppercase text-center block">1m</label><input type="number" id="np1" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center text-xs font-bold" /></div>
                           <div className="space-y-1"><label className="text-[8px] font-black text-white/40 uppercase text-center block">3m</label><input type="number" id="np3" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center text-xs font-bold" /></div>
                           <div className="space-y-1"><label className="text-[8px] font-black text-white/40 uppercase text-center block">6m</label><input type="number" id="np6" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center text-xs font-bold" /></div>
                           <div className="space-y-1"><label className="text-[8px] font-black text-white/40 uppercase text-center block">12m</label><input type="number" id="np12" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-center text-xs font-bold" /></div>
                        </div>
                        <button onClick={async () => {
                           const name = document.getElementById('new-senior-name').value;
                           const level = document.getElementById('new-senior-level').value;
                           const pricing = {
                             oneMonth: Number(document.getElementById('np1').value),
                             threeMonths: Number(document.getElementById('np3').value),
                             sixMonths: Number(document.getElementById('np6').value),
                             twelveMonths: Number(document.getElementById('np12').value)
                           };
                           if (!name) return toast.error('Enter name');
                           try {
                             const allBoards = ['TS Board', 'AP Board', 'CBSE Board', 'ICSE Board'];
                             await Promise.all(allBoards.map(board => 
                               axios.post('/admin/subjects', { name, classLevel: level, board, pricing })
                             ));
                             toast.success('Subject Linked to all boards!');
                             document.getElementById('new-senior-name').value = '';
                             fetchData();
                           } catch (error) { toast.error('Failed'); }
                        }} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Create New Subject</button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddClassModalOpen(false)}></div>
           <div className="relative bg-white rounded-[40px] w-full max-w-xl shadow-2xl p-10">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-3xl font-black text-slate-900">Create New Class</h2>
                 <button onClick={() => setIsAddClassModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900"><X className="w-8 h-8" /></button>
              </div>
              <form onSubmit={handleAddClass} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Class Name</label>
                    <input required type="text" placeholder="e.g. Class 5" value={addClassForm.className} onChange={(e) => setAddClassForm({...addClassForm, className: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Board</label>
                    <div className="w-full px-6 py-4 bg-slate-100 border-2 rounded-2xl font-bold text-slate-400 uppercase text-xs tracking-widest flex items-center justify-center">
                       Auto-Applied to All Boards
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tiered Pricing (₹)</label>
                    <div className="grid grid-cols-2 gap-4">
                       <input type="number" placeholder="1 Month" required value={addClassForm.pricing.oneMonth} onChange={e => setAddClassForm({...addClassForm, pricing: {...addClassForm.pricing, oneMonth: e.target.value}})} className="px-5 py-4 bg-slate-50 border rounded-xl font-bold" />
                       <input type="number" placeholder="3 Months" required value={addClassForm.pricing.threeMonths} onChange={e => setAddClassForm({...addClassForm, pricing: {...addClassForm.pricing, threeMonths: e.target.value}})} className="px-5 py-4 bg-slate-50 border rounded-xl font-bold" />
                       <input type="number" placeholder="6 Months" required value={addClassForm.pricing.sixMonths} onChange={e => setAddClassForm({...addClassForm, pricing: {...addClassForm.pricing, sixMonths: e.target.value}})} className="px-5 py-4 bg-slate-50 border rounded-xl font-bold" />
                       <input type="number" placeholder="12 Months" required value={addClassForm.pricing.twelveMonths} onChange={e => setAddClassForm({...addClassForm, pricing: {...addClassForm.pricing, twelveMonths: e.target.value}})} className="px-5 py-4 bg-slate-50 border rounded-xl font-bold" />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]">Create Class Bundle</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default PricingManagement;
