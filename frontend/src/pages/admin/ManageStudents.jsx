import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, User, Mail, GraduationCap, Calendar, ShieldCheck, X, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form States
  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '' });
  const [grantForm, setGrantForm] = useState({
    type: 'bundle',
    referenceId: '',
    name: '',
    durationDays: 30
  });

  // Selection Data
  const [bundles, setBundles] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchData = async () => {
    try {
      const [studentRes, bundleRes, subjectRes] = await Promise.all([
        axios.get('/admin/students'),
        axios.get('/admin/classes'),
        axios.get('/subjects')
      ]);
      setStudents(studentRes.data);
      setBundles(bundleRes.data.sort((a, b) => {
        const numB = parseInt(b.className.replace(/\D/g, '')) || 0;
        const numA = parseInt(a.className.replace(/\D/g, '')) || 0;
        return numA - numB;
      }));
      setSubjects(subjectRes.data.sort((a, b) => (a.classLevel || 0) - (b.classLevel || 0)));
      setLoading(false);
    } catch (error) {
      toast.error('Failed to sync data with server');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/admin/students', studentForm);
      toast.success('Student account created!');
      setShowAddModal(false);
      setStudentForm({ name: '', email: '', password: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Creation failed');
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!grantForm.referenceId) return toast.error('Please select a course');

    try {
      await axios.put(`/admin/students/assign-subscription/${selectedStudent._id}`, grantForm);
      toast.success(`Access granted for ${grantForm.name}`);
      setShowGrantModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to grant access');
    }
  };

  const getStatus = (subscriptions) => {
    if (!subscriptions || subscriptions.length === 0) return { label: 'No Access', color: 'bg-slate-100 text-slate-500', icon: <Clock className="w-3 h-3" /> };
    
    const now = new Date();
    const active = subscriptions.some(sub => new Date(sub.expiryDate) > now);
    
    if (active) return { label: 'Active', color: 'bg-emerald-50 text-emerald-600', icon: <CheckCircle2 className="w-3 h-3" /> };
    return { label: 'Expired', color: 'bg-rose-50 text-rose-600', icon: <AlertCircle className="w-3 h-3" /> };
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Enrollment</h1>
            <p className="text-slate-500 font-bold">Manage learner accounts and manual course permissions</p>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-all" />
               <input 
                 type="text" 
                 placeholder="Search by name or email..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl w-full md:w-80 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
               />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
            >
               <Plus className="w-5 h-5" /> New Student
            </button>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                     <th className="px-8 py-6">Student Information</th>
                     <th className="px-8 py-6">Current Access</th>
                     <th className="px-8 py-6">Status</th>
                     <th className="px-8 py-6 text-right">Administrative Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                          <User className="w-16 h-16" />
                          <p className="font-black text-xl">No students found</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudents.map(student => {
                    const status = getStatus(student.activeSubscriptions);
                    return (
                      <tr key={student._id} className="hover:bg-slate-50/30 transition-all group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg">
                                  {student.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 text-base">{student.name}</p>
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                     <Mail className="w-3 h-3" /> {student.email}
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex flex-wrap gap-2 max-w-xs">
                                {student.activeSubscriptions?.length > 0 ? student.activeSubscriptions.map((sub, i) => {
                                  const daysLeft = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                                  const isNearExpiry = daysLeft <= 7 && daysLeft > 0;
                                  const isExpired = daysLeft <= 0;

                                  return (
                                    <div key={i} className="flex flex-col gap-1">
                                      <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-wider border whitespace-nowrap ${
                                        isExpired ? 'bg-slate-50 text-slate-400 border-slate-100 opacity-60' : 
                                        isNearExpiry ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                        'bg-indigo-50 text-indigo-600 border-indigo-100'
                                      }`}>
                                         {sub.name}
                                      </span>
                                      <span className={`text-[8px] font-black uppercase tracking-widest pl-1 leading-none ${
                                        isExpired ? 'text-slate-300' : isNearExpiry ? 'text-orange-500 animate-pulse' : 'text-slate-400'
                                      }`}>
                                        Exp: {new Date(sub.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                      </span>
                                    </div>
                                  );
                                }) : (
                                  <span className="text-[10px] font-black text-slate-300 uppercase italic">No Manual Overrides</span>
                                )}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                               {status.icon}
                               {status.label}
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => { setSelectedStudent(student); setShowGrantModal(true); }}
                              className="px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-95"
                            >
                               Grant Access
                            </button>
                         </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {/* MODALS SECTION */}
      
      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
           <div className="relative bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-900">New Learner Portal</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-300 hover:text-slate-900"><X className="w-8 h-8" /></button>
              </div>
              <form onSubmit={handleAddStudent} className="p-10 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                       <input required value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} type="text" placeholder="John Doe" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Identity</label>
                       <input required value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} type="email" placeholder="john@example.com" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Password</label>
                       <input required value={studentForm.password} onChange={(e) => setStudentForm({...studentForm, password: e.target.value})} type="password" placeholder="••••••••" className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold" />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[28px] font-black text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                    Register Student
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* GRANT ACCESS MODAL */}
      {showGrantModal && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg" onClick={() => setShowGrantModal(false)}></div>
           <div className="relative bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">Grant Course Access</h2>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest tracking-widest">Activating for: {selectedStudent.name}</p>
                 </div>
                 <button onClick={() => setShowGrantModal(false)} className="p-3 text-slate-300 hover:text-slate-900"><X className="w-8 h-8" /></button>
              </div>

              <form onSubmit={handleGrantAccess} className="p-10 space-y-8">
                 <div className="space-y-6">
                    {/* Category Selector */}
                    <div className="grid grid-cols-2 gap-4">
                       <button 
                         type="button" 
                         onClick={() => setGrantForm({...grantForm, type: 'bundle', referenceId: '', name: ''})}
                         className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${grantForm.type === 'bundle' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 border-transparent text-slate-400'}`}
                       >
                          6-10 Bundle
                       </button>
                       <button 
                         type="button" 
                         onClick={() => setGrantForm({...grantForm, type: 'subject', referenceId: '', name: ''})}
                         className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${grantForm.type === 'subject' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-50 border-transparent text-slate-400'}`}
                       >
                          11-12 Subject
                       </button>
                    </div>

                    {/* Course Selector */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                          <GraduationCap className="w-3 h-3" /> Select Course
                       </label>
                       <select 
                         required
                         onChange={(e) => {
                           const val = e.target.value;
                           const item = grantForm.type === 'bundle' 
                             ? bundles.find(b => b._id === val)
                             : subjects.find(s => s._id === val);
                           setGrantForm({
                             ...grantForm, 
                             referenceId: val, 
                             name: item ? (grantForm.type === 'bundle' ? item.className : `${item.name} (Cls ${item.classLevel})`) : ''
                           });
                         }}
                         className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none font-black text-slate-900 appearance-none cursor-pointer"
                       >
                          <option value="">Choose item...</option>
                          {grantForm.type === 'bundle' 
                            ? bundles.map(b => <option key={b._id} value={b._id}>{b.className}</option>)
                            : subjects.map(s => <option key={s._id} value={s._id}>{s.name} - Class {s.classLevel}</option>)
                          }
                       </select>
                    </div>

                    {/* Duration Slider/Input */}
                    <div className="space-y-4">
                       <div className="flex items-center justify-between px-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Calendar className="w-3 h-3" /> Duration (Days)
                          </label>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-black text-sm">{grantForm.durationDays} Days</span>
                       </div>
                       <input 
                         type="range" 
                         min="1" 
                         max="365" 
                         value={grantForm.durationDays}
                         onChange={(e) => setGrantForm({...grantForm, durationDays: e.target.value})}
                         className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                       />
                    </div>
                 </div>

                 <div className="p-6 bg-slate-900 rounded-[32px] text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Calculated Expiry</p>
                          <p className="font-black">
                            {new Date(Date.now() + grantForm.durationDays * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                       </div>
                    </div>
                    <button type="submit" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all">
                       Activate Access
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
