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
  
  // Assignment States
  const [classes, setClasses] = useState([]); // Both bundles and 11-12 subjects
  const [category, setCategory] = useState(null); // 'bundle' or 'subject'
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignmentSubjects, setAssignmentSubjects] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({
    subjectName: ''
  });

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
        ...bundles.map(b => ({ ...b, type: 'bundle', displayName: b.className })),
        ...subjects1112.map(s => ({ ...s, type: 'subject', displayName: `Class ${s.classLevel} - ${s.name}` }))
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
    if (!selectedClass || !assignmentForm.subjectName) return toast.error('Please select both class and subject');

    try {
      const payload = {
        assignmentType: category,
        classLevel: selectedClass.type === 'bundle' ? selectedClass.className : `Class ${selectedClass.classLevel}`,
        subjectName: assignmentForm.subjectName,
        subjectId: category === 'subject' ? selectedClass._id : null
      };

      const { data } = await axios.put(`/admin/teachers/${selectedTeacher._id}/assign`, payload);
      toast.success(`Assigned ${assignmentForm.subjectName} to ${selectedTeacher.name}`);
      // Refresh teacher in the list to update tags immediately
      setTeachers(prev => prev.map(t => t._id === data._id ? data : t));
      setSelectedTeacher(data); // Stay in modal to add more if needed
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
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

  const handleClassSelection = (classId) => {
    const cls = classes.find(c => c._id === classId);
    setSelectedClass(cls);
    if (!cls) return setAssignmentSubjects([]);

    if (cls.type === 'bundle') {
      setAssignmentSubjects(cls.subjects);
      setAssignmentForm({ subjectName: cls.subjects[0] || '' });
    } else {
      setAssignmentSubjects([cls.name]);
      setAssignmentForm({ subjectName: cls.name });
    }
  };

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
                 <tr key={teacher._id} className="hover:bg-slate-50/50 transition-all group">
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
                       <div className="flex flex-wrap gap-2 max-w-sm">
                          {teacher.assignedSubjects?.length > 0 ? teacher.assignedSubjects.map((sub, i) => (
                            <span 
                              key={i} 
                              className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider border flex items-center gap-2 ${
                                sub.assignmentType === 'bundle' 
                                ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                                : 'bg-blue-50 text-blue-600 border-blue-100'
                              }`}
                            >
                               {sub.classLevel}: {sub.subjectName}
                               <button 
                                 onClick={() => handleRemoveAssignment(teacher._id, sub._id)}
                                 className="hover:scale-125 transition-all"
                               >
                                  <X className="w-3 h-3" />
                               </button>
                            </span>
                          )) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No assignments</span>
                          )}
                          <button 
                            onClick={() => { setSelectedTeacher(teacher); setCategory(null); setSelectedClass(null); setAssignmentSubjects([]); setShowAssignModal(true); }}
                            className="w-7 h-7 bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center"
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
                          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all">
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
                 <button onClick={() => setShowModal(false)} className="p-2 text-slate-300 hover:text-slate-900"><X className="w-8 h-8" /></button>
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

      {/* ASSIGN SUBJECT MODAL */}
      {showAssignModal && selectedTeacher && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-500">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                 <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900">Assign Subject</h2>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Faculty: {selectedTeacher.name}</p>
                 </div>
                 <button onClick={() => setShowAssignModal(false)} className="p-3 text-slate-300 hover:text-slate-900"><X className="w-8 h-8" /></button>
              </div>

              <form onSubmit={handleAssignSubmit} className="p-10 space-y-8">
                 <div className="space-y-4">
                    {/* Category Selection */}
                    <div className="flex gap-4">
                       <button 
                         type="button" 
                         onClick={() => { setCategory('bundle'); setSelectedClass(null); setAssignmentSubjects([]); }}
                         className={`flex-1 p-4 rounded-3xl border-2 transition-all font-black text-xs uppercase tracking-widest ${category === 'bundle' ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                       >
                          6-10 Bundle
                       </button>
                       <button 
                         type="button" 
                         onClick={() => { setCategory('subject'); setSelectedClass(null); setAssignmentSubjects([]); }}
                         className={`flex-1 p-4 rounded-3xl border-2 transition-all font-black text-xs uppercase tracking-widest ${category === 'subject' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'}`}
                       >
                          11-12 Individual
                       </button>
                    </div>

                    {category && (
                      <>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                              {category === 'bundle' ? 'Select Class Bundle' : 'Select Individual Subject'}
                           </label>
                           <select 
                             required
                             onChange={(e) => handleClassSelection(e.target.value)}
                             className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none font-black text-slate-900 appearance-none cursor-pointer"
                           >
                              <option value="">Select an option...</option>
                              {classes.filter(c => c.type === category).map(c => (
                                <option key={c._id} value={c._id}>{c.displayName}</option>
                              ))}
                           </select>
                        </div>

                        {category === 'bundle' && selectedClass && (
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                                Select Subject from Bundle
                             </label>
                             <select 
                               required
                               value={assignmentForm.subjectName}
                               onChange={(e) => setAssignmentForm({ subjectName: e.target.value })}
                               className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-3xl outline-none font-black text-slate-900 appearance-none cursor-pointer"
                             >
                                {assignmentSubjects.map((s, i) => (
                                  <option key={i} value={s}>{s}</option>
                                ))}
                             </select>
                          </div>
                        )}
                      </>
                    )}
                 </div>

                 {/* Current Assignments Preview */}
                 <div className="flex flex-wrap gap-2">
                    {selectedTeacher.assignedSubjects?.map((sub, i) => (
                       <span key={i} className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider border ${sub.assignmentType === 'bundle' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                          {sub.classLevel}: {sub.subjectName}
                       </span>
                    ))}
                 </div>

                 <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[28px] font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                    Add Assignment
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
