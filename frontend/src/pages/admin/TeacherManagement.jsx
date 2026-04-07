import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, User, Mail, Shield, Save, X, Loader2, BookOpen, GraduationCap, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
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

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);

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
    <div className="space-y-6 animate-in fade-in duration-300 px-2 md:px-0 max-w-6xl mx-auto">
      <Toaster position="top-right" />
      
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-0.5">
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">Faculty Management</h1>
             <p className="text-slate-500 font-medium text-xs">Manage academic staff and subject assignments</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
             <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search faculty..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md w-full outline-none font-medium text-slate-700 focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm text-sm"
                />
             </div>
             <button 
               onClick={() => { setEditingTeacher(null); setFormData({name:'', email:'', password:''}); setShowModal(true); }}
               className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-md font-medium shadow-sm hover:bg-indigo-700 transition-colors text-sm w-full sm:w-auto"
             >
                <Plus className="w-4 h-4" /> Add Teacher
             </button>
          </div>
       </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
         <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 border-b border-slate-100">
               <tr className="text-sm font-semibold text-slate-600">
                  <th className="px-5 py-3">Faculty Profile</th>
                  <th className="px-5 py-3">Assigned Subjects</th>
                  <th className="px-5 py-3 text-right">Controls</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {currentItems.length === 0 ? (
                 <tr>
                    <td colSpan="3" className="px-5 py-12 text-center text-slate-400">
                       <div className="flex flex-col items-center gap-3">
                          <User className="w-8 h-8" />
                          <p className="font-medium text-sm">No faculty found</p>
                       </div>
                    </td>
                 </tr>
               ) : currentItems.map(teacher => (
                 <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors align-top group">
                    <td className="px-5 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                             {teacher.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-semibold text-slate-800 text-base leading-tight">{teacher.name}</p>
                             <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                                <Mail className="w-3.5 h-3.5" /> {teacher.email}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="space-y-3 min-w-[300px]">
                          {teacher.assignedSubjects?.length > 0 ? (
                            Object.entries(
                               teacher.assignedSubjects.reduce((acc, sub) => {
                                  if (!acc[sub.classLevel]) acc[sub.classLevel] = [];
                                  acc[sub.classLevel].push(sub);
                                  return acc;
                               }, {})
                            ).map(([level, subs], i) => (
                              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-3">
                                 <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase self-start whitespace-nowrap mt-0.5 border border-slate-200">
                                    {level}
                                 </div>
                                 <div className="flex flex-wrap gap-1.5 text-sm text-slate-600">
                                    {subs.map((sub, j) => (
                                      <span 
                                        key={j} 
                                        className={`px-2.5 py-0.5 text-xs rounded border flex items-center gap-1.5 group/tag transition-colors hover:border-slate-300 ${
                                          sub.assignmentType === 'bundle' 
                                          ? 'bg-purple-50 text-purple-700 border-purple-200 font-medium' 
                                          : 'bg-white text-slate-600 border-slate-200 shadow-sm font-medium'
                                        }`}
                                      >
                                         {sub.subjectName}
                                         <button 
                                           onClick={() => handleRemoveAssignment(teacher._id, sub._id)}
                                           className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                                           title="Remove subject"
                                         >
                                            <X className="w-3.5 h-3.5" />
                                         </button>
                                      </span>
                                    ))}
                                 </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-slate-400 italic">No assignments configured</span>
                          )}
                          <button 
                            onClick={() => { setSelectedTeacher(teacher); setSelectedAssignments([]); setShowAssignModal(true); }}
                            className="mt-1 px-3 py-1.5 text-xs font-medium bg-white text-indigo-600 border border-slate-200 rounded-md hover:bg-slate-50 hover:border-indigo-200 transition-colors flex items-center gap-1.5 w-fit shadow-sm"
                          >
                             <Plus className="w-3.5 h-3.5" /> Assign Subjects
                          </button>
                       </div>
                    </td>
                    <td className="px-5 py-4">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setFormData({ name: teacher.name, email: teacher.email, password: '' });
                              setShowModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors"
                            title="Edit Profile"
                          >
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setTeacherToDelete(teacher); setShowDeleteConfirm(true); }}
                            className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded transition-colors"
                            title="Remove Faculty"
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

         {/* PAGINATION CONTROLS */}
         {totalPages > 1 && (
            <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
               <p className="text-xs text-slate-500">
                  Showing <span className="font-medium text-slate-800">{indexOfFirstItem + 1}</span> to <span className="font-medium text-slate-800">{Math.min(indexOfLastItem, filteredTeachers.length)}</span> of <span className="font-medium text-slate-800">{filteredTeachers.length}</span>
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

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 shadow-2xl">
           <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                 <h2 className="text-base font-bold text-slate-800">{editingTeacher ? 'Update Faculty' : 'New Teacher Account'}</h2>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800"><X className="w-5 h-5" /></button>
              </div>
               <form onSubmit={handleSubmit} className="p-4 space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 ml-1">Full Name</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 transition-colors shadow-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 ml-1">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 transition-colors shadow-sm" />
                 </div>
                 {!editingTeacher && (
                   <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600 ml-1">Password</label>
                      <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 transition-colors shadow-sm" />
                   </div>
                 )}
                 <div className="pt-2">
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md font-medium text-sm shadow-sm hover:bg-indigo-700 transition-colors">
                       {editingTeacher ? 'Save Changes' : 'Create Account'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* FLEXIBLE ASSIGNMENT MODAL (NEW) */}
      {showAssignModal && selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
               <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                 <div>
                    <h2 className="text-base font-bold text-slate-800">Manage Assignments</h2>
                    <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                       <Shield className="w-3.5 h-3.5 text-indigo-500" /> {selectedTeacher.name}
                    </p>
                 </div>
                 <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-800"><X className="w-5 h-5" /></button>
              </div>

              {/* Selection Header */}
              <div className="p-3 bg-white border-b border-slate-100 shrink-0">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search grade or subject..." 
                      value={assignmentSearch}
                      onChange={(e) => setAssignmentSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-md outline-none font-medium text-sm text-slate-800 transition-colors shadow-sm"
                    />
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-sm">
                 {Object.entries(groupedClasses)
                   .filter(([level, items]) => 
                      level.toLowerCase().includes(assignmentSearch.toLowerCase()) || 
                      items.some(i => i.subjectName.toLowerCase().includes(assignmentSearch.toLowerCase()))
                   )
                   .map(([level, items]) => {
                    const allSelected = items.every(item => selectedAssignments.some(a => a.classLevel === item.classLevel && a.subjectName === item.subjectName));
                    return (
                      <div key={level} className="space-y-3">
                         <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                            <h3 className="text-sm font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{level}</h3>
                            <button 
                              type="button"
                              onClick={() => toggleFullClass(level, items)}
                              className={`text-xs font-medium px-2.5 py-1 rounded transition-colors border ${allSelected ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                            >
                               {allSelected ? 'Deselect All' : 'Select All'}
                            </button>
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                            {items.map((item, idx) => {
                               const isSelected = selectedAssignments.some(a => a.classLevel === item.classLevel && a.subjectName === item.subjectName);
                               return (
                                 <button
                                   key={idx}
                                   type="button"
                                   onClick={() => toggleAssignment(item)}
                                   className={`flex items-center justify-between p-2.5 rounded-md border transition-colors shadow-sm ${isSelected ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                                 >
                                    <span className="text-xs font-medium truncate pr-2">{item.subjectName}</span>
                                    <div className={`shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
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

              <div className="p-4 bg-slate-50/50 border-t border-slate-100 shrink-0">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-xs text-slate-500 font-medium">Selected</p>
                       <p className="text-sm font-bold text-slate-800">{selectedAssignments.length} Subjects</p>
                    </div>
                    <button 
                      onClick={handleAssignSubmit}
                      disabled={selectedAssignments.length === 0}
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-md font-medium text-xs shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:shadow-none"
                    >
                       Save Assignments
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && teacherToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
           <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center space-y-4">
                 <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <Trash2 className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-base font-bold text-slate-800">Remove Teacher?</h2>
                    <p className="text-sm text-slate-500 mt-1">
                       Are you sure you want to remove <span className="font-semibold text-slate-700">{teacherToDelete.name}</span>? This cannot be undone.
                    </p>
                 </div>
                 <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => { setShowDeleteConfirm(false); setTeacherToDelete(null); }}
                      className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                       Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="flex-1 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium shadow-sm hover:bg-red-700 transition-colors"
                    >
                       Delete Account
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
