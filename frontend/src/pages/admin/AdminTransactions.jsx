import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  Clock,
  Loader2,
  User,
  X,
  Receipt,
  Calendar,
  Hash,
  IndianRupee
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/admin/transactions');
        setTransactions(res.data);
      } catch (err) {
        toast.error('Failed to load platform transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.studentId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 p-6">
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 px-2 md:px-0">
         <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Fee Payments</h1>
            <p className="text-slate-500 font-bold italic mt-1 text-sm md:text-base">Monitor all course purchases and subscription records.</p>
         </div>
         
         <div className="relative group w-full lg:w-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-slate-900 w-full lg:min-w-[380px] shadow-sm text-sm"
            />
         </div>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
           <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="py-24 bg-white border border-slate-100 rounded-2xl text-center space-y-6 shadow-sm mx-2 md:mx-0">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-10 h-10 text-slate-200" />
           </div>
           <div className="space-y-2">
              <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest px-6 text-center">No payment records match your search</p>
           </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mx-2 md:mx-0">
           <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                 <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Info</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course Detail</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Paid</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.map((t, i) => (
                      <motion.tr 
                        key={t._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedTx(t)}
                        className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                      >
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                  <User className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 leading-none text-sm">{t.studentId?.name || 'Manual Grant'}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight truncate max-w-[150px]">{t.studentId?.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-0.5">
                               <p className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{t.packageName}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-0.5 bg-slate-50 border border-slate-100 rounded-md inline-block mt-1">
                                  {t.type}
                               </p>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-base font-black text-slate-900">₹{t.amount.toLocaleString('en-IN')}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                               <Clock className="w-3.5 h-3.5 text-slate-300" />
                               <span className="font-bold text-xs">{new Date(t.date || t.createdAt).toLocaleDateString('en-GB')}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-center">
                            {t.status === 'success' ? (
                               <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                  Verified
                               </span>
                            ) : (
                               <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100">
                                  {t.status}
                               </span>
                            )}
                         </td>
                      </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
               <div className="p-10 bg-slate-900 text-white relative">
                  <button onClick={() => setSelectedTx(null)} className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all">
                     <X className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 bg-emerald-400 rounded-[30px] flex items-center justify-center text-slate-900 shadow-xl">
                        <Receipt className="w-10 h-10" />
                     </div>
                     <div>
                        <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">Payment Verification</p>
                        <h2 className="text-3xl font-black tracking-tight mt-1">{selectedTx.packageName}</h2>
                     </div>
                  </div>
               </div>

               <div className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-1 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><User className="w-3 h-3"/> Student Name</p>
                        <p className="font-black text-slate-900">{selectedTx.studentId?.name || 'Manual Access'}</p>
                     </div>
                     <div className="space-y-1 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3"/> Date / Time</p>
                        <p className="font-black text-slate-900">{new Date(selectedTx.date || selectedTx.createdAt).toLocaleString('en-GB')}</p>
                     </div>
                     <div className="space-y-1 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Hash className="w-3 h-3"/> Transaction ID</p>
                        <p className="font-black text-slate-900 truncate">{selectedTx._id}</p>
                     </div>
                     <div className="space-y-1 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><IndianRupee className="w-3 h-3"/> Amount Transacted</p>
                        <p className="text-2xl font-black text-emerald-700">₹{selectedTx.amount.toLocaleString('en-IN')}</p>
                     </div>
                  </div>
                  <div className="p-6 bg-slate-900 rounded-[30px] text-white flex items-center gap-4">
                     <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                     <p className="text-sm font-bold opacity-80 italic">This payment record is verified and synchronized with the platform's course access logic.</p>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTransactions;
