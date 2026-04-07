import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Search, User, Mail, GraduationCap, Calendar, ShieldCheck, X, 
  Loader2, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 px-2 md:px-0 max-w-6xl mx-auto animate-in fade-in duration-300">
      <Toaster position="top-right" />
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
         <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Student Enrollment</h1>
            <p className="text-sm font-medium text-slate-500">Manage learner accounts and manual course permissions</p>
         </div>
         <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by name or email..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md w-full outline-none font-medium text-slate-700 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm text-sm"
               />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-md font-medium shadow-sm hover:bg-indigo-700 transition-colors text-sm w-full sm:w-auto"
            >
               <Plus className="w-4 h-4" /> New Student
            </button>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
               <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-sm font-semibold text-slate-600">
                     <th className="px-5 py-3">Student Information</th>
                     <th className="px-5 py-3">Current Access</th>
                     <th className="px-5 py-3">Status</th>
                     <th className="px-5 py-3 text-right">Administrative Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-5 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-3">
                          <User className="w-8 h-8" />
                          <p className="font-medium text-sm">No students found</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentItems.map(student => {
                    const status = getStatus(student.activeSubscriptions);
                    return (
                      <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group align-top">
                         <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                  {student.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-semibold text-slate-800 text-base leading-tight">{student.name}</p>
                                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                                     <Mail className="w-3.5 h-3.5" /> {student.email}
                                  </div>
                               </div>
                            </div>
                         </td>
                         <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                                {student.activeSubscriptions?.length > 0 ? student.activeSubscriptions.map((sub, i) => {
                                  const daysLeft = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                                  const isNearExpiry = daysLeft <= 7 && daysLeft > 0;
                                  const isExpired = daysLeft <= 0;

                                  return (
                                    <div key={i} className="flex flex-col gap-1">
                                      <span className={`px-2 py-0.5 text-xs font-semibold rounded uppercase tracking-wide border whitespace-nowrap ${
                                        isExpired ? 'bg-slate-50 text-slate-400 border-slate-200 opacity-80' : 
                                        isNearExpiry ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                                        'bg-indigo-50 text-indigo-700 border-indigo-200'
                                      }`}>
                                         {sub.name}
                                      </span>
                                      <span className={`text-xs ml-0.5 font-medium ${
                                        isExpired ? 'text-slate-400' : isNearExpiry ? 'text-orange-600 animate-pulse' : 'text-slate-500'
                                      }`}>
                                        Exp: {new Date(sub.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                      </span>
                                    </div>
                                  );
                                }) : (
                                  <span className="text-sm text-slate-400 italic">No Manual Overrides</span>
                                )}
                            </div>
                         </td>
                         <td className="px-5 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                              status.label === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              status.label === 'Expired' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                              'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                               {status.icon}
                               {status.label}
                            </div>
                         </td>
                         <td className="px-5 py-4 text-right">
                            <button 
                              onClick={() => { setSelectedStudent(student); setShowGrantModal(true); }}
                              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
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

         {/* PAGINATION CONTROLS */}
         {totalPages > 1 && (
            <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
               <p className="text-xs text-slate-500">
                  Showing <span className="font-medium text-slate-800">{indexOfFirstItem + 1}</span> to <span className="font-medium text-slate-800">{Math.min(indexOfLastItem, filteredStudents.length)}</span> of <span className="font-medium text-slate-800">{filteredStudents.length}</span>
               </p>
               
               <div className="flex items-center gap-1">
                  <button
                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                     disabled={currentPage === 1}
                     className="p-1 rounded text-slate-400 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-0.5">
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                        if (totalPages > 5 && Math.abs(pg - currentPage) > 1 && pg !== 1 && pg !== totalPages) return pg === 2 || pg === totalPages - 1 ? <span key={pg} className="text-slate-300 mx-1 text-xs">...</span> : null;
                        
                        return (
                           <button
                              key={pg}
                              onClick={() => setCurrentPage(pg)}
                              className={`w-6 h-6 rounded text-xs font-medium transition-colors ${currentPage === pg ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white'}`}
                           >
                              {pg}
                           </button>
                        );
                     })}
                  </div>

                  <button
                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                     disabled={currentPage === totalPages}
                     className="p-1 rounded text-slate-400 hover:bg-white hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         )}
      </div>

      {/* MODALS SECTION */}
      
      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
           <div className="relative bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-base font-bold text-slate-800">New Learner Portal</h2>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-800 transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddStudent} className="p-4 space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 ml-1">Full Name</label>
                    <input required value={studentForm.name} onChange={(e) => setStudentForm({...studentForm, name: e.target.value})} type="text" placeholder="John Doe" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 transition-colors shadow-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 ml-1">Email Identity</label>
                    <input required value={studentForm.email} onChange={(e) => setStudentForm({...studentForm, email: e.target.value})} type="email" placeholder="john@example.com" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 transition-colors shadow-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 ml-1">Password</label>
                    <input required value={studentForm.password} onChange={(e) => setStudentForm({...studentForm, password: e.target.value})} type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 transition-colors shadow-sm" />
                 </div>
                 <div className="pt-2">
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md font-medium text-sm shadow-sm hover:bg-indigo-700 transition-colors">
                       Register Student
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* GRANT ACCESS MODAL */}
      {showGrantModal && selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowGrantModal(false)}></div>
           <div className="relative bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <div className="space-y-0.5">
                    <h2 className="text-base font-bold text-slate-800">Grant Course Access</h2>
                    <p className="text-xs font-medium text-indigo-600">Activating for: {selectedStudent.name}</p>
                 </div>
                 <button onClick={() => setShowGrantModal(false)} className="text-slate-400 hover:text-slate-800 transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleGrantAccess} className="p-4 space-y-6">
                 <div className="space-y-5">
                    {/* Category Selector */}
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         type="button" 
                         onClick={() => setGrantForm({...grantForm, type: 'bundle', referenceId: '', name: ''})}
                         className={`p-2.5 rounded-lg border transition-colors font-medium text-sm ${grantForm.type === 'bundle' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                       >
                          6-10 Bundle
                       </button>
                       <button 
                         type="button" 
                         onClick={() => setGrantForm({...grantForm, type: 'subject', referenceId: '', name: ''})}
                         className={`p-2.5 rounded-lg border transition-colors font-medium text-sm ${grantForm.type === 'subject' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                       >
                          11-12 Subject
                       </button>
                    </div>

                    {/* Course Selector */}
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-slate-600 ml-1 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" /> Select Course
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
                         className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 shadow-sm"
                       >
                          <option value="">Choose item...</option>
                          {grantForm.type === 'bundle' 
                            ? bundles.map(b => <option key={b._id} value={b._id}>{b.className}</option>)
                            : subjects.map(s => <option key={s._id} value={s._id}>{s.name} - Class {s.classLevel}</option>)
                          }
                       </select>
                    </div>

                    {/* Duration Slider/Input */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between px-1">
                          <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                             <Calendar className="w-3.5 h-3.5" /> Duration (Days)
                          </label>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-xs font-semibold">{grantForm.durationDays} Days</span>
                       </div>
                       <input 
                         type="range" 
                         min="1" 
                         max="365" 
                         value={grantForm.durationDays}
                         onChange={(e) => setGrantForm({...grantForm, durationDays: e.target.value})}
                         className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                       />
                    </div>
                 </div>

                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Calculated Expiry</p>
                          <p className="font-semibold text-slate-800 text-sm">
                            {new Date(Date.now() + grantForm.durationDays * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                       </div>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                       Activate
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
