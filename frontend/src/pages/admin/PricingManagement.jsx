import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  IndianRupee, 
  Settings, 
  ToggleRight, 
  ToggleLeft, 
  Save, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Loader2, 
  ChevronRight, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  CheckCircle2, 
  Calendar, 
  Database,
  Info,
  X
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PricingManagement = () => {
  const [juniorClasses, setJuniorClasses] = useState([]);
  const [seniorSubjects, setSeniorSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Manual Grant State
  const [grantForm, setGrantForm] = useState({
    email: '',
    type: 'bundle',
    referenceId: '',
    name: '',
    subscriptionType: 'full',
    durationDays: 365
  });

  const fetchData = async () => {
    try {
      const [resClasses, resSubjects] = await Promise.all([
        axios.get('/api/admin/classes'),
        axios.get('/api/admin/subjects')
      ]);
      setJuniorClasses(resClasses.data);
      setSeniorSubjects(resSubjects.data);
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
      await axios.put('/api/admin/toggle-status', { type, id, isActive: !currentStatus });
      toast.success('Status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateJuniorPrice = async (id, payload) => {
    try {
      await axios.put(`/api/admin/classes/${id}`, payload);
      toast.success('Junior pricing updated!');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleUpdateSeniorPrice = async (id, updatedSubject) => {
    try {
      await axios.put(`/api/admin/subjects/${id}`, updatedSubject);
      toast.success('Senior pricing updated!');
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/grant-access', grantForm);
      toast.success('Manual access granted!');
      setGrantForm({ ...grantForm, email: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Grant failed');
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
       <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
         <div className="space-y-2 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <Settings className="w-10 h-10 text-slate-900" /> Revenue & Pricing Manager
            </h1>
            <p className="text-slate-500 font-bold italic">Configure tuition fees, subject rates, and administrative overrides.</p>
         </div>
      </div>

      {/* JUNIOR SECTION (6-10) */}
      <section className="space-y-6">
         <div className="flex items-center gap-4">
            <div className="px-5 py-2 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100">
               Junior Grades
            </div>
            <h2 className="text-xl font-black text-slate-900">Classes 6th - 10th (Full Course Model)</h2>
         </div>

         <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                     <th className="px-10 py-6">Grade / Section</th>
                     <th className="px-10 py-6">Full Course Price</th>
                     <th className="px-10 py-6">System Status</th>
                     <th className="px-10 py-6 text-right">Settings</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {juniorClasses.map((cls) => (
                    <React.Fragment key={cls._id}>
                      <tr className={`hover:bg-slate-50/50 transition-all ${expandedId === cls._id ? 'bg-indigo-50/30' : ''}`}>
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-slate-50">
                                  {cls.className.split(' ')[1]}
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 text-lg">{cls.className}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cls.subjects.length} Subjects Linked</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-2 group max-w-[140px]">
                               <IndianRupee className="w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                               <input 
                                 type="number"
                                 defaultValue={cls.price}
                                 onBlur={(e) => handleUpdateJuniorPrice(cls._id, { ...cls, price: e.target.value })}
                                 className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-xl px-3 py-2 font-black text-slate-900 outline-none transition-all"
                               />
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <button 
                              onClick={() => handleToggleStatus('class', cls._id, cls.isActive)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${cls.isActive ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}
                            >
                               {cls.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                               {cls.isActive ? 'Active' : 'Halted'}
                            </button>
                         </td>
                         <td className="px-10 py-8 text-right">
                            <button 
                              onClick={() => setExpandedId(expandedId === cls._id ? null : cls._id)}
                              className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-white hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-900/10 transition-all border border-transparent hover:border-indigo-50"
                            >
                               {expandedId === cls._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                         </td>
                      </tr>
                      {expandedId === cls._id && (
                        <tr className="bg-slate-50/50">
                          <td colSpan="4" className="px-10 py-10">
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-inner space-y-6">
                               <div className="flex items-center justify-between">
                                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                                     <BookOpen className="w-4 h-4 text-indigo-500" /> Subject-Wise Pricing (Single Selection)
                                  </h4>
                                  <span className="text-[10px] font-bold text-slate-300 italic">Auto-saves on input focus out</span>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {cls.subjects.map((sub, idx) => (
                                    <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group border-transparent focus-within:border-indigo-600 transition-all relative">
                                       <button 
                                         onClick={() => {
                                           const updatedSubjects = cls.subjects.filter((_, i) => i !== idx);
                                           handleUpdateJuniorPrice(cls._id, { subjects: updatedSubjects });
                                         }}
                                         className="absolute top-2 right-2 p-1.5 bg-white text-rose-300 hover:text-rose-600 hover:shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-rose-50"
                                       >
                                          <X className="w-3 h-3" />
                                       </button>
                                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{sub.name}</label>
                                       <div className="flex items-center gap-2">
                                          <div className="p-2 bg-indigo-600 text-white rounded-lg"><IndianRupee className="w-3 h-3" /></div>
                                          <input 
                                            type="number"
                                            defaultValue={sub.singleSubjectPrice}
                                            onBlur={(e) => {
                                              const updatedSubjects = [...cls.subjects];
                                              updatedSubjects[idx].singleSubjectPrice = Number(e.target.value);
                                              handleUpdateJuniorPrice(cls._id, { subjects: updatedSubjects });
                                            }}
                                            className="w-full bg-white rounded-xl px-4 py-2 font-black text-slate-900 outline-none shadow-sm"
                                          />
                                       </div>
                                    </div>
                                  ))}
                                  
                                  {/* QUICK ADD SUBJECT CARD */}
                                  <div className="p-5 bg-indigo-600/5 rounded-2xl border-2 border-dashed border-indigo-200 flex flex-col justify-center gap-4 hover:bg-white hover:border-indigo-600 transition-all group/add">
                                     <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                           <div className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center"><BookOpen className="w-3.5 h-3.5" /></div>
                                           <input 
                                             id={`new-sub-name-${cls._id}`}
                                             type="text" 
                                             placeholder="Link Subject Name..."
                                             className="w-full bg-transparent border-b-2 border-indigo-100 focus:border-indigo-600 outline-none py-1 font-black text-slate-900 text-xs placeholder:text-indigo-200"
                                           />
                                        </div>
                                        <div className="flex items-center gap-2">
                                           <div className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center"><IndianRupee className="w-3.5 h-3.5" /></div>
                                           <input 
                                             id={`new-sub-price-${cls._id}`}
                                             type="number" 
                                             placeholder="Single Price (₹)"
                                             className="w-full bg-transparent border-b-2 border-emerald-100 focus:border-emerald-600 outline-none py-1 font-black text-slate-900 text-xs placeholder:text-emerald-200"
                                           />
                                        </div>
                                     </div>
                                     <button 
                                       onClick={() => {
                                         const nameInput = document.getElementById(`new-sub-name-${cls._id}`);
                                         const priceInput = document.getElementById(`new-sub-price-${cls._id}`);
                                         const name = nameInput.value;
                                         const price = Number(priceInput.value);
                                         
                                         if (!name) return toast.error('Enter subject name');
                                         
                                         const updatedSubjects = [...cls.subjects, { name, singleSubjectPrice: price }];
                                         handleUpdateJuniorPrice(cls._id, { subjects: updatedSubjects });
                                         
                                         nameInput.value = '';
                                         priceInput.value = '';
                                       }}
                                       className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
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
      </section>

      {/* SENIOR SECTION (11-12) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
         <section className="xl:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
               <div className="px-5 py-2 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                  Senior Grades
               </div>
               <h2 className="text-xl font-black text-slate-900">Classes 11th - 12th (Individual Subject Model)</h2>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                     <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                        <th className="px-8 py-6">Subject / Class</th>
                        <th className="px-8 py-6">Price Point</th>
                        <th className="px-8 py-6">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                     {seniorSubjects.map((sub) => (
                       <tr key={sub._id} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-6">
                             <div>
                                <p className="font-black text-slate-900">{sub.subjectName}</p>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Grade {sub.classLevel}</p>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 max-w-[120px]">
                                <input 
                                  type="number"
                                  defaultValue={sub.price}
                                  onBlur={(e) => handleUpdateSeniorPrice(sub._id, { ...sub, price: e.target.value })}
                                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-xl px-3 py-2 font-black text-slate-900 outline-none transition-all"
                                />
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                               <button 
                                 onClick={() => handleToggleStatus('subject', sub._id, sub.isActive)}
                                 className={`p-2 rounded-xl transition-all ${sub.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}
                               >
                                  <CheckCircle2 className={`w-6 h-6 ${sub.isActive ? 'fill-emerald-50' : ''}`} />
                               </button>
                               <button 
                                 onClick={async () => {
                                   if (window.confirm('Delete this senior subject?')) {
                                     try {
                                       await axios.delete(`/api/admin/subjects/${sub._id}`);
                                       toast.success('Subject removed');
                                       fetchData();
                                     } catch (error) {
                                       toast.error('Delete failed');
                                     }
                                   }
                                 }}
                                 className="p-2 text-rose-300 hover:text-rose-600 transition-all"
                               >
                                  <X className="w-5 h-5" />
                               </button>
                             </div>
                          </td>
                       </tr>
                     ))}
                     
                     {/* QUICK ADD SENIOR SUBJECT ROW */}
                     <tr className="bg-indigo-50/20">
                        <td className="px-8 py-6">
                           <input 
                             id="new-senior-name"
                             type="text" 
                             placeholder="New Subject Name (Physics...)"
                             className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none py-1 font-black text-slate-900 text-xs placeholder:text-indigo-200"
                           />
                           <select 
                             id="new-senior-level"
                             className="mt-2 w-full bg-transparent border-b border-indigo-100 font-extrabold text-[10px] text-slate-400 focus:text-indigo-600 transition-colors uppercase outline-none"
                           >
                             <option value="11">Grade 11</option>
                             <option value="12">Grade 12</option>
                           </select>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 max-w-[120px]">
                              <IndianRupee className="w-3 h-3 text-slate-300" />
                              <input 
                                id="new-senior-price"
                                type="number" 
                                placeholder="Price"
                                className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none py-1 font-black text-slate-900 text-xs placeholder:text-indigo-200"
                              />
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <button 
                             onClick={async () => {
                               const name = document.getElementById('new-senior-name').value;
                               const level = document.getElementById('new-senior-level').value;
                               const price = document.getElementById('new-senior-price').value;
                               
                               if (!name || !price) return toast.error('Fill name and price');
                               
                               try {
                                 await axios.post('/api/admin/subjects', { 
                                   subjectName: name, 
                                   classLevel: level, 
                                   price: Number(price) 
                                 });
                                 toast.success('Senior Subject Created!');
                                 document.getElementById('new-senior-name').value = '';
                                 document.getElementById('new-senior-price').value = '';
                                 fetchData();
                               } catch (error) {
                                 toast.error('Action failed');
                               }
                             }}
                             className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-100"
                           >
                              Link Subject
                           </button>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>

         {/* MANUAL OVERRIDE SECTION */}
         <section className="space-y-6">
            <div className="flex items-center gap-4 pl-4 border-l-4 border-indigo-600">
               <h2 className="text-xl font-black text-slate-900 tracking-tight">Access Override</h2>
            </div>
            
            <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
               
               <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                     <p className="inline-flex px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Admin Utility</p>
                     <h3 className="text-2xl font-black leading-tight">Grant Free Course Access</h3>
                     <p className="text-indigo-400 font-bold text-xs">Enter a student's registered email to bypass payment.</p>
                  </div>

                  <form onSubmit={handleGrantAccess} className="space-y-5">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Student Email</label>
                        <div className="relative">
                           <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                           <input 
                              required
                              type="email"
                              value={grantForm.email}
                              onChange={(e) => setGrantForm({...grantForm, email: e.target.value})}
                              placeholder="student@example.com"
                              className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 rounded-2xl pl-12 pr-6 py-4 font-bold outline-none transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest ml-1">Course Assignment</label>
                        <select 
                           required
                           className="w-full bg-white/5 border border-white/10 focus:border-indigo-400 rounded-2xl px-6 py-4 font-bold outline-none appearance-none"
                           onChange={(e) => {
                             const data = JSON.parse(e.target.value);
                             setGrantForm({
                               ...grantForm, 
                               referenceId: data.id, 
                               name: data.name, 
                               type: data.type,
                               subscriptionType: data.type === 'bundle' ? 'full' : 'single'
                             });
                           }}
                        >
                           <option value="">Select Target Course...</option>
                           <optgroup label="Full Courses (6-10)" className="bg-slate-800">
                             {juniorClasses.map(c => (
                               <option key={c._id} value={JSON.stringify({id: c._id, name: c.className, type: 'bundle'})}>{c.className}</option>
                             ))}
                           </optgroup>
                           <optgroup label="Senior Subjects (11-12)" className="bg-slate-800">
                             {seniorSubjects.map(s => (
                               <option key={s._id} value={JSON.stringify({id: s._id, name: s.subjectName, type: 'subject'})}>{s.subjectName} ({s.classLevel})</option>
                             ))}
                           </optgroup>
                        </select>
                     </div>

                     <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex gap-4">
                        <Info className="w-5 h-5 text-indigo-400 mt-1 shrink-0" />
                        <p className="text-[10px] font-bold text-indigo-300 leading-relaxed uppercase tracking-wide">
                           Manual grants expire in 1 year by default. This action is logged for audit purposes.
                        </p>
                     </div>

                     <button type="submit" className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95">
                        <ShieldCheck className="w-5 h-5" /> Execute Grant Logic
                     </button>
                  </form>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default PricingManagement;
