import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Calendar, ShieldCheck, MoreVertical, CreditCard, Loader2, Save, X, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');

  const fetchStudents = async () => {
    try {
      const { data } = await axios.get('/api/admin/students');
      setStudents(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch students');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleExtend = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/students/${selectedStudent._id}/extend`, {
        subscriptionId: selectedSubId,
        newExpiryDate
      });
      toast.success('Subscription extended successfully!');
      setShowExtendModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to extend');
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-10">
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900">Student Administration</h1>
            <p className="text-slate-500 font-bold">Monitor enrollments and manage subscription cycles</p>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-3 bg-white text-slate-900 border border-slate-100 px-6 py-4 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all">
               <CreditCard className="w-5 h-5 text-indigo-600" /> Recent Payments
            </button>
            <button className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
               <UserPlus className="w-5 h-5" /> Grant Access
            </button>
         </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
               <tr className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">
                  <th className="px-8 py-6">Student Details</th>
                  <th className="px-8 py-6">Active Subscriptions</th>
                  <th className="px-8 py-6">Recent Status</th>
                  <th className="px-8 py-6 text-right">Access Control</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {students.map(student => (
                 <tr key={student._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             {student.name.charAt(0)}
                          </div>
                          <div>
                             <p className="font-black text-slate-900">{student.name}</p>
                             <p className="text-xs font-bold text-slate-400">{student.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-2">
                          {student.activeSubscriptions?.length > 0 ? student.activeSubscriptions.map((sub, i) => (
                            <div key={i} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
                               <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase text-indigo-600">{sub.type} Access</span>
                                  <button 
                                    onClick={() => {
                                      setSelectedStudent(student);
                                      setSelectedSubId(sub._id);
                                      setNewExpiryDate(new Date(sub.expiryDate).toISOString().split('T')[0]);
                                      setShowExtendModal(true);
                                    }}
                                    className="text-[8px] font-black bg-white px-2 py-0.5 rounded border border-slate-200 hover:border-indigo-300 transition-all uppercase"
                                  >
                                    Extend
                                  </button>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span className="text-xs font-bold font-mono">Expires: {new Date(sub.expiryDate).toLocaleDateString()}</span>
                               </div>
                            </div>
                          )) : (
                            <span className="text-xs font-bold text-slate-300 italic">No active subscriptions</span>
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                         student.activeSubscriptions?.length > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'
                       }`}>
                          {student.activeSubscriptions?.length > 0 ? 'Active' : 'Inactive'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100">
                          <X className="w-4 h-4" /> Revoke All
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* EXTEND MODAL */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-900">Extend Access</h2>
                 <button onClick={() => setShowExtendModal(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-all"><X className="w-6 h-6" /></button>
              </div>
              
              <form onSubmit={handleExtend} className="p-10 space-y-8">
                 <div className="p-6 bg-indigo-50 rounded-3xl space-y-2">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Selected Student</p>
                    <p className="text-lg font-black text-indigo-900">{selectedStudent?.name}</p>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                       <Calendar className="w-4 h-4" /> New Expiry Date
                    </label>
                    <input 
                       required
                       type="date"
                       value={newExpiryDate}
                       onChange={(e) => setNewExpiryDate(e.target.value)}
                       className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-2xl outline-none font-black text-slate-900 shadow-inner"
                    />
                 </div>

                 <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                    <Save className="w-6 h-6" /> Confirm Extension
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
