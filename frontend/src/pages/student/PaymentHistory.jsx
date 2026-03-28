import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Loader2,
  AlertCircle,
  X,
  Receipt,
  Calendar,
  Hash,
  IndianRupee,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/student/transactions');
        setTransactions(res.data);
      } catch (err) {
        toast.error('Failed to fetch transaction history');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.packageName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700 pb-20 p-4 md:p-6 lg:px-8">
      {/* 1. HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
         <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Billing History</h1>
            <p className="text-slate-500 font-bold italic mt-1 text-sm md:text-base">View and manage all your course enrollments and payment records.</p>
         </div>
         
         <div className="relative group w-full lg:w-[400px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by package name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-8 py-4 md:py-5 bg-white border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all font-black text-slate-900 w-full shadow-sm text-sm"
            />
         </div>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
           <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="py-24 bg-white border border-slate-100 rounded-2xl text-center space-y-6 shadow-sm">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-10 h-10 text-slate-200" />
           </div>
           <div className="space-y-2 px-6">
              <p className="text-slate-400 font-black text-lg italic uppercase tracking-widest">No purchase records found</p>
              <p className="text-slate-300 font-bold text-sm">Start your learning journey by enrolling in a course!</p>
           </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                 <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Order Date</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Course / Bundle</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Paid</th>
                       <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                       <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-12 text-center">Receipt</th>
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
                            <div className="flex items-center gap-3">
                               <Clock className="w-4 h-4 text-slate-300" />
                               <span className="font-extrabold text-slate-600 text-sm whitespace-nowrap">{new Date(t.date || t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-0.5">
                               <p className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-tight">{t.packageName}</p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest capitalize px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg inline-block mt-1">
                                  {t.type} Access
                               </p>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-lg font-black text-slate-900">₹{t.amount.toLocaleString('en-IN')}</span>
                         </td>
                         <td className="px-8 py-6">
                            {t.status === 'success' ? (
                               <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                               </span>
                            ) : t.status === 'pending' ? (
                               <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm">
                                  <Clock className="w-3.5 h-3.5" /> Pending
                               </span>
                            ) : (
                               <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 shadow-sm">
                                  <XCircle className="w-3.5 h-3.5" /> Failed
                               </span>
                            )}
                         </td>
                         <td className="px-8 py-6 text-right pr-12">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toast.success('Invoice generation pending synchronization'); }}
                              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ml-auto shrink-0"
                            >
                               <Download className="w-3.5 h-3.5" /> Invoice
                            </button>
                         </td>
                      </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* SUPPORT PANEL */}
      <div className="p-8 md:p-12 bg-white border border-slate-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-30" />
         <div className="flex items-center gap-6 md:gap-8 relative z-10 flex-col md:flex-row text-center md:text-left">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner shrink-0">
               <AlertCircle className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="space-y-1">
               <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Payment Issues?</h4>
               <p className="text-slate-500 font-bold italic text-sm md:text-base">If your payment was processed but access is not granted.</p>
            </div>
         </div>
         <button className="w-full md:w-auto px-10 py-4 md:py-5 bg-slate-900 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-600 active:scale-95 transition-all relative z-10">Raise Ticket</button>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-6"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-0 m-auto w-full max-w-2xl h-fit bg-white rounded-2xl md:rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col"
            >
               {/* Modal Header */}
               <div className="p-8 md:p-10 bg-slate-900 text-white relative">
                  <button 
                    onClick={() => setSelectedTx(null)}
                    className="absolute top-6 md:top-8 right-6 md:right-8 w-10 md:w-12 h-10 md:h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all group"
                  >
                     <X className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-90 transition-transform" />
                  </button>
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-400 rounded-2xl flex items-center justify-center text-slate-900 shadow-xl shrink-0">
                        <Receipt className="w-8 h-8 md:w-10 md:h-10" />
                     </div>
                     <div>
                        <p className="text-emerald-400 font-black uppercase tracking-widest text-[9px] md:text-[10px]">Order Confirmation</p>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1 truncate max-w-[250px] md:max-w-md uppercase">{selectedTx.packageName}</h2>
                     </div>
                  </div>
               </div>

               {/* Modal Content */}
               <div className="p-8 md:p-10 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-sm">
                     <div className="space-y-1 p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Hash className="w-3 h-3" /> Transaction ID
                        </p>
                        <p className="font-black text-slate-900 truncate text-xs md:text-sm">{selectedTx._id}</p>
                     </div>
                     <div className="space-y-1 p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <Calendar className="w-3 h-3" /> Payment Date
                        </p>
                        <p className="font-black text-slate-900 text-xs md:text-sm">{new Date(selectedTx.date || selectedTx.createdAt).toLocaleString('en-GB')}</p>
                     </div>
                     <div className="space-y-1 p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <ShieldCheck className="w-3 h-3" /> Payment Mode
                        </p>
                        <p className="font-black text-slate-900 uppercase text-xs">Secured Gateway</p>
                     </div>
                     <div className="space-y-1 p-5 md:p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                           <IndianRupee className="w-3 h-3" /> Total Amount
                        </p>
                        <p className="text-xl md:text-2xl font-black text-emerald-700">₹{selectedTx.amount.toLocaleString('en-IN')}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 p-6 md:p-8 bg-slate-900 rounded-2xl text-white">
                     <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-400 shrink-0" />
                     <div>
                        <p className="font-black text-base md:text-lg leading-tight mb-1">Transaction Verified</p>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">Purchase confirmed and synchronized with learning portal.</p>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <button className="flex-1 py-4 md:py-5 bg-slate-100 text-slate-900 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                        <Download className="w-4 h-4 md:w-5 md:h-5" /> Download Invoice
                     </button>
                     <button className="flex-1 py-4 md:py-5 bg-indigo-600 text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-900/10 transition-all flex items-center justify-center gap-3">
                        <ExternalLink className="w-4 h-4 md:w-5 md:h-5" /> Report Issue
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentHistory;
