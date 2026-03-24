import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  GraduationCap, 
  FileBox, 
  Loader2, 
  CheckCircle2, 
  X,
  FileSearch,
  BookOpen
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { usePreview } from '../../context/PreviewContext';
import CustomSelect from '../../components/common/CustomSelect';

const TeacherMaterials = () => {
  const { activeView } = usePreview();
  const location = useLocation();
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'link'
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    courseString: '',
    title: '',
    fileUrl: '',
    type: 'notes'
  });

  // Handle passed state from MyAssignments
  useEffect(() => {
    if (location.state?.autoOpen && assignments.length > 0) {
      const { assignment } = location.state;
      const matched = assignments.find(a => 
        (a.id === assignment.id) || 
        (a.classLevel === assignment.classLevel && a.subjectName === assignment.subjectName)
      );
      
      if (matched) {
        setFormData(prev => ({ ...prev, courseString: JSON.stringify(matched) }));
        setShowModal(true);
      }
    }
  }, [location.state, assignments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, aRes] = await Promise.all([
          axios.get('/api/teacher/materials'),
          axios.get('/api/teacher/my-assignments')
        ]);
        
        setMaterials(mRes.data);

        // MOCK ASSIGNMENTS FOR ADMIN PREVIEW
        if (activeView === 'admin' && aRes.data.length === 0) {
          setAssignments([
            { id: 'mock1', name: 'Class 10 (Full Bundle)', classLevel: 'Class 10', subjectName: 'All Subjects', type: 'bundle' },
            { id: 'mock2', name: 'Physics (Class 12)', classLevel: 'Class 12', subjectName: 'Physics', type: 'subject' },
          ]);
        } else {
          setAssignments(aRes.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data');
        setLoading(false);
      }
    };
    fetchData();
  }, [activeView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseString) return toast.error('Please select a course');

    try {
      const course = JSON.parse(formData.courseString);
      
      const submitData = new FormData();
      submitData.append('assignmentId', course.id);
      submitData.append('classLevel', course.classLevel);
      submitData.append('subjectName', course.subjectName);
      submitData.append('title', formData.title);
      submitData.append('type', formData.type);
      
      if (uploadMode === 'upload' && selectedFile) {
        submitData.append('file', selectedFile);
      } else {
        submitData.append('fileUrl', formData.fileUrl);
      }

      const { data } = await axios.post('/api/teacher/materials', submitData);

      setMaterials([data.material, ...materials]);
      
      // SUCCESS ANIMATION TRIGGER
      setIsSuccess(true);
      toast.success('Material added successfully!');
      
      setTimeout(() => {
        setIsSuccess(false);
        setShowModal(false);
        setFormData({ courseString: '', title: '', fileUrl: '', type: 'notes' });
        setSelectedFile(null);
      }, 2000);
    } catch (error) {
      toast.error('Failed to add material');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await axios.delete(`/api/teacher/materials/${id}`);
      setMaterials(materials.filter(m => m._id !== id));
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <Toaster position="top-right" />
      
      {/* Header compact */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[30px] border border-slate-100 shadow-sm">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Study Materials Hub</h1>
            <p className="text-slate-400 text-sm font-bold">Manage resources for your assigned classes</p>
         </div>
         <button 
           onClick={() => setShowModal(true)}
           className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
         >
            <Plus className="w-4 h-4" /> Add Material
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {materials.length === 0 ? (
           <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] text-center space-y-4">
              <FileBox className="w-16 h-16 text-slate-200 mx-auto" />
              <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest">No materials uploaded yet</p>
           </div>
         ) : materials.map((m) => (
           <div key={m._id} className="bg-white rounded-[35px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-indigo-900/5 transition-all flex flex-col p-6">
              <div className="flex items-start justify-between mb-4">
                 <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileText className="w-6 h-6" />
                 </div>
                 <button 
                   onClick={() => handleDelete(m._id)}
                   className="p-2.5 bg-rose-50 text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 hover:text-white"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex-1 space-y-2">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black rounded uppercase tracking-tighter">
                       {m.type}
                    </span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                       {m.classLevel} • {m.subjectName}
                    </span>
                 </div>
                 <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-2">{m.title}</h3>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                 <p className="text-[9px] font-bold text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString('en-GB')}
                 </p>
                 <a 
                   href={m.fileUrl} 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center gap-1.5 text-indigo-600 font-black text-[9px] uppercase tracking-widest hover:underline"
                 >
                    View File <Download className="w-3 h-3" />
                 </a>
              </div>
           </div>
         ))}
      </div>

      {/* COMPACT UPLOAD MODAL */}
      <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setShowModal(false)}
             className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
           />
           <motion.div 
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
           >
              <div className="p-8 md:p-10 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                          <Plus className="w-6 h-6" />
                       </div>
                       <div>
                          <h2 className="text-xl font-black text-slate-900 leading-tight">Add New Notes</h2>
                          <p className="text-[11px] font-bold text-slate-400 italic">Select source and target course</p>
                       </div>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                       <X className="w-4 h-4" />
                    </button>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    {isSuccess ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-12 flex flex-col items-center justify-center space-y-4"
                      >
                         <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10" />
                         </div>
                         <h3 className="text-xl font-black text-slate-900 text-center">Successfully Uploaded!</h3>
                         <p className="text-[11px] text-slate-400 font-bold italic">Adding to your Faculty Hub...</p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           {/* 1. TARGET ASSIGNMENT */}
                           <div className="md:col-span-2">
                              <CustomSelect 
                                label="Targeted Course"
                                icon={GraduationCap}
                                placeholder="Choose Course..."
                                options={assignments.map(a => ({ ...a, value: JSON.stringify(a) }))}
                                value={formData.courseString}
                                onChange={(val) => setFormData({ ...formData, courseString: val })}
                              />
                           </div>

                           {/* 2. UPLOAD MODE TOGGLE */}
                           <div className="md:col-span-2 flex p-1 bg-slate-50 rounded-xl">
                              <button 
                                type="button"
                                onClick={() => setUploadMode('upload')}
                                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                              >
                                Upload PDF
                              </button>
                              <button 
                                type="button"
                                onClick={() => setUploadMode('link')}
                                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${uploadMode === 'link' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                              >
                                External Link
                              </button>
                           </div>

                           {/* 3. MATERIAL TITLE */}
                           <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                 <FileSearch className="w-3.5 h-3.5 text-indigo-500" /> Title / Description
                              </label>
                              <input 
                                required
                                type="text"
                                placeholder="e.g. Chapter 1: Calculus Basics"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-black text-slate-900 text-sm shadow-inner transition-all"
                              />
                           </div>

                           {/* 4. CONDITIONAL SOURCE */}
                           {uploadMode === 'upload' ? (
                             <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                   <Upload className="w-3.5 h-3.5 text-emerald-500" /> Select PDF
                                </label>
                                <div className="relative group">
                                   <input 
                                     required={uploadMode === 'upload' && !selectedFile}
                                     type="file"
                                     accept=".pdf"
                                     onChange={(e) => setSelectedFile(e.target.files[0])}
                                     className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                   />
                                   <div className={`w-full px-6 py-6 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center gap-2 ${selectedFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 group-hover:border-indigo-600'}`}>
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedFile ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white text-slate-400 shadow-sm'}`}>
                                         {selectedFile ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                                      </div>
                                      <p className="text-[10px] font-black text-slate-900 uppercase text-center truncate w-[90%]">
                                         {selectedFile ? selectedFile.name : 'Select PDF Material'}
                                      </p>
                                   </div>
                                </div>
                             </div>
                           ) : (
                             <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                   <Download className="w-3.5 h-3.5 text-indigo-500" /> External Link URL
                                </label>
                                <input 
                                  required={uploadMode === 'link'}
                                  type="url"
                                  placeholder="https://drive.google.com/..."
                                  value={formData.fileUrl}
                                  onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-black text-slate-900 text-sm shadow-inner transition-all"
                                />
                             </div>
                           )}

                           {/* 5. CONTENT TYPE */}
                           <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                 <BookOpen className="w-3.5 h-3.5 text-rose-500" /> Resource Category
                              </label>
                              <select 
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none font-black text-slate-900 text-sm appearance-none shadow-inner"
                              >
                                 <option value="notes">Lecture Notes</option>
                                 <option value="worksheet">Practice Worksheet</option>
                                 <option value="assignment">Class Assignment</option>
                                 <option value="other">Other Resource</option>
                              </select>
                           </div>
                        </div>

                        {/* 6. SUBMIT BUTTON */}
                        <div className="pt-2">
                           <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
                              Publish Material
                           </button>
                        </div>
                      </>
                    )}
                 </form>
              </div>
           </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherMaterials;
