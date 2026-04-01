import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, User, Mail, Shield, Save, X, Loader2, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  
  // Assignment States
  const [classes, setClasses] = useState([]); 
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [assignmentSearch, setAssignmentSearch] = useState('');

  const fetchTeachers = async () => {
    try {
      const { data } = await axios.get('/admin/teachers-list');
      setTeachers(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch teachers');
      setLoading(false);
    }
  };

  const fetchClassesAndSubjects = async () => {
    try {
      const { data: bundles } = await axios.get('/admin/classes');
      const { data: subjects1112 } = await axios.get('/subjects');
      
      const allClasses = [
        ...bundles.map(b => ({ ...b, type: 'bundle', displayName: b.className, level: b.className })),
        ...subjects1112.map(s => ({ ...s, type: 'subject', displayName: s.name, level: `Class ${s.classLevel}` }))
      ];
      setClasses(allClasses);
    } catch (error) {
      toast.error('Failed to load classes');
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchClassesAndSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacher) {
        await axios.put(`/admin/users/${editingTeacher._id}`, formData);
        toast.success('Teacher updated!');
      } else {
        await axios.post('/admin/teachers', formData);
        toast.success('Teacher account created!');
      }
      setShowModal(false);
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (selectedAssignments.length === 0) return toast.error('Please select at least one assignment');

    const loadingToast = toast.loading('Assigning subjects...');
    try {
      const { data } = await axios.put(`/admin/teachers/${selectedTeacher._id}/assign`, {
        assignments: selectedAssignments
      });
      toast.success(`Successfully assigned ${selectedAssignments.length} items to ${selectedTeacher.name}`, { id: loadingToast });
      setTeachers(prev => prev.map(t => t._id === data._id ? data : t));
      setSelectedTeacher(data);
      setSelectedAssignments([]); // Clear selection
      setShowAssignModal(false); // Close the modal
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed', { id: loadingToast });
    }
  };

  const handleRemoveAssignment = async (teacherId, assignmentId) => {
    try {
      const { data } = await axios.delete(`/admin/teachers/${teacherId}/assign/${assignmentId}`);
      setTeachers(prev => prev.map(t => t._id === data._id ? data : t));
      if (selectedTeacher && selectedTeacher._id === teacherId) setSelectedTeacher(data);
      toast.success('Assignment removed');
    } catch (error) {
      toast.error('Failed to remove assignment');
    }
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    const loadingToast = toast.loading('Removing faculty member...');
    try {
      await axios.delete(`/admin/users/${teacherToDelete._id}`);
      toast.success(`${teacherToDelete.name} removed successfully`, { id: loadingToast });
      setShowDeleteConfirm(false);
      setTeacherToDelete(null);
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove teacher', { id: loadingToast });
    }
  };

  const toggleAssignment = (item) => {
    const isSelected = selectedAssignments.some(a => a.classLevel === item.classLevel && a.subjectName === item.subjectName);
    if (isSelected) {
      setSelectedAssignments(prev => prev.filter(a => !(a.classLevel === item.classLevel && a.subjectName === item.subjectName)));
    } else {
      setSelectedAssignments(prev => [...prev, item]);
    }
  };

  const toggleFullClass = (level, items) => {
    const allSelected = items.every(item => selectedAssignments.some(a => a.classLevel === item.classLevel && a.subjectName === item.subjectName));
    if (allSelected) {
      // Remove all
      setSelectedAssignments(prev => prev.filter(a => a.classLevel !== level));
    } else {
      // Add missing
      const newItems = items.filter(item => !selectedAssignments.some(a => a.classLevel === item.classLevel && a.subjectName === item.subjectName));
      setSelectedAssignments(prev => [...prev, ...newItems]);
    }
  };

  // Group classes for the UI
  const groupedClasses = classes.reduce((acc, curr) => {
    const level = curr.level;
    if (!acc[level]) acc[level] = [];
    
    if (curr.type === 'bundle') {
      curr.subjects.forEach(sub => acc[level].push({
        assignmentType: 'bundle',
        classLevel: level,
        subjectName: sub.name,
        subjectId: sub._id
      }));
    } else {
      acc[level].push({
        assignmentType: 'subject',
        classLevel: level,
        subjectName: curr.displayName,
        subjectId: curr._id
      });
    }
    return acc;
  }, {});

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900">Faculty Management</h1>
            <p className="text-slate-500 font-bold">Manage academic staff and subject assignments</p>
         </div>
         <button 
           onClick={() => { setEditingTeacher(null); setFormData({name:'', email:'', password:''}); setShowModal(true); }}
           className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
         >
            <Plus className="w-5 h-5" /> Add New Teacher
         </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
               <tr className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
                  <th className="px-8 py-6">Faculty Profile</th>
                  <th className="px-8 py-6">Assigned Subjects</th>
                  <th className="px-8 py-6 text-right">Operational Controls</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {teachers.map(teacher => (
                 <tr key={teacher._id} className="hover:bg-slate-50/50 transition-all group align-top">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {teacher.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-black text-slate-900 text-base">{teacher.name}</p>
                             <p className="text-xs font-bold text-slate-400">{teacher.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="max-w-sm space-y-4">
                          {teacher.assignedSubjects?.length > 0 ? (
                            Object.entries(
                               teacher.assignedSubjects.reduce((acc, sub) => {
                                  if (!acc[sub.classLevel]) acc[sub.classLevel] = [];
                                  acc[sub.classLevel].push(sub);
                                  return acc;
                               }, {})
                            ).map(([level, subs], i) => (
                              <div key={i} className="space-y-1.5">
                                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                                    {level}
                                 </div>
                                 <div className="flex flex-wrap gap-1.5 pl-3">
                                    {subs.map((sub, j) => (
                                      <span 
                                        key={j} 
                                        className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border flex items-center gap-2 ${
                                          sub.assignmentType === 'bundle' 
                                          ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100' 
                                          : 'bg-blue-50/50 text-blue-600 border-blue-100'
                                        }`}
                                      >
                                         {sub.subjectName}
                                         <button 
                                           onClick={() => handleRemoveAssignment(teacher._id, sub._id)}
                                           className="hover:scale-125 transition-all outline-none opacity-40 hover:opacity-100"
                                         >
                                            <X className="w-3 h-3" />
                                         </button>
                                      </span>
                                    ))}
                                 </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No assignments</span>
                          )}
                          <button 
                            onClick={() => { setSelectedTeacher(teacher); setSelectedAssignments([]); setShowAssignModal(true); }}
                            className="mt-2 w-7 h-7 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center border-dashed border-2 border-slate-200"
                          >
                             <Plus className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setFormData({ name: teacher.name, email: teacher.email, password: '' });
                              setShowModal(true);
                            }}
                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                          >
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setTeacherToDelete(teacher); setShowDeleteConfirm(true); }}
                            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all font-bold"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-900">{editingTeacher ? 'Update Faculty' : 'New Teacher Account'}</h2>
                 <button onClick={() => setShowModal(false)} className="p-2 text-slate-300 hover:text-slate-900 outline-none"><X className="w-8 h-8" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold" />
                 </div>
                 {!editingTeacher && (
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Password</label>
                      <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold" />
                   </div>
                 )}
                 <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
                    {editingTeacher ? 'Save Changes' : 'Create Account'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* FLEXIBLE ASSIGNMENT MODAL (NEW) */}
      {showAssignModal && selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between shrink-0">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">Manage Assignments</h2>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                       <Shield className="w-4 h-4" /> Faculty: {selectedTeacher.name}
                    </p>
                 </div>
                 <button onClick={() => setShowAssignModal(false)} className="p-3 text-slate-300 hover:text-slate-900 outline-none"><X className="w-8 h-8" /></button>
              </div>

              {/* Selection Header */}
              <div className="px-10 py-6 bg-white border-b border-slate-50 shrink-0">
                 <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      placeholder="Search for grade or subject..." 
                      value={assignmentSearch}
                      onChange={(e) => setAssignmentSearch(e.target.value)}
                      className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-bold text-sm transition-all"
                    />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                 {Object.entries(groupedClasses)
                   .filter(([level, items]) => 
                      level.toLowerCase().includes(assignmentSearch.toLowerCase()) || 
                      items.some(i => i.subjectName.toLowerCase().includes(assignmentSearch.toLowerCase()))
                   )
                   .map(([level, items]) => {
                    const allSelected = items.every(item => selectedAssignments.some(a => a.classLevel === item.classLevel && a.subjectName === item.subjectName));
                    return (
                      <div key={level} className="space-y-4">
                         <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{level}</h3>
                            <button 
                              type="button"
                              onClick={() => toggleFullClass(level, items)}
                              className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest transition-all ${allSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            >
                               {allSelected ? 'All Selected' : 'Select All'}
                            </button>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            {items.map((item, idx) => {
                               const isSelected = selectedAssignments.some(a => a.classLevel === item.classLevel && a.subjectName === item.subjectName);
                               return (
                                 <button
                                   key={idx}
                                   type="button"
                                   onClick={() => toggleAssignment(item)}
                                   className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${isSelected ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-slate-50'}`}
                                 >
                                    <span className="text-[11px] font-bold uppercase tracking-tight line-clamp-1">{item.subjectName}</span>
                                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 group-hover:border-slate-400 bg-white'}`}>
                                       {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                                    </div>
                                 </button>
                               );
                            })}
                         </div>
                      </div>
                    );
                 })}
              </div>

              <div className="p-10 bg-slate-50/50 border-t border-slate-50 shrink-0">
                 <div className="flex items-center justify-between gap-6">
                    <div className="space-y-1">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Selected Items</p>
                       <p className="text-xl font-black text-slate-900">{selectedAssignments.length} Subjects</p>
                    </div>
                    <button 
                      onClick={handleAssignSubmit}
                      disabled={selectedAssignments.length === 0}
                      className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                       Confirm Assignments
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && teacherToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-10 text-center space-y-6">
                 <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                    <Trash2 className="w-10 h-10" />
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900">Remove Teacher?</h2>
                    <p className="text-sm font-bold text-slate-500 line-clamp-2">
                       Are you sure you want to delete <span className="text-slate-900 underline decoration-rose-200">{teacherToDelete.name}</span>? 
                       This action cannot be undone.
                    </p>
                 </div>
                 <div className="flex flex-col gap-3 pt-4">
                    <button 
                      onClick={handleDelete}
                      className="w-full py-5 bg-rose-600 text-white rounded-[24px] font-black shadow-xl shadow-rose-100 hover:scale-105 active:scale-95 transition-all"
                    >
                       Yes, Delete Account
                    </button>
                    <button 
                      onClick={() => { setShowDeleteConfirm(false); setTeacherToDelete(null); }}
                      className="w-full py-5 bg-slate-100 text-slate-500 rounded-[24px] font-black hover:bg-slate-200 transition-all font-black"
                    >
                       No, Keep Member
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
