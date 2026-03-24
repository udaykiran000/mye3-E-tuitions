import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  CreditCard, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Info,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { usePreview } from '../../context/PreviewContext';

const StudentStore = () => {
  const { activeView } = usePreview();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('/api/student/catalog');
        setCourses(data);

        // MOCK DATA FOR ADMIN PREVIEW
        if ((activeView === 'admin' || activeView === 'teacher') && data.length === 0) {
          setCourses([
            { id: 'c10b', name: 'Class 10 (Full Bundle)', type: 'bundle', price: 2999, classLevel: 'Class 10' },
            { id: 'p12', name: 'Physics (Class 12)', type: 'subject', price: 999, classLevel: 'Class 12' },
            { id: 'm12', name: 'Maths (Class 12)', type: 'subject', price: 999, classLevel: 'Class 12' },
          ]);
        }
        
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [activeView]);

  const handleMockPay = async () => {
    setBuyLoading(true);
    try {
      await axios.post('/api/student/mock-payment-success', {
        amount: selectedCourse.price,
        packageName: selectedCourse.name,
        referenceId: selectedCourse.id,
        type: selectedCourse.type
      });

      toast.success('Course Purchased Successfully!');
      setTimeout(() => {
        setBuyLoading(false);
        setShowCheckout(false);
        setSelectedCourse(null);
        window.location.href = '/student/dashboard'; // Rapid refresh
      }, 1500);
    } catch (error) {
      toast.error('Payment Simulation Failed');
      setBuyLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.classLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl" />
         <div className="space-y-2 relative z-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Browse Curriculum Store</h1>
            <p className="text-slate-400 font-bold italic">Select your class bundle or individual subjects to start learning.</p>
         </div>

         <div className="relative group w-full md:w-96 relative z-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search classes or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[24px] outline-none font-black text-slate-900 text-sm shadow-inner transition-all"
            />
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredCourses.map((c, i) => (
           <div key={i} className="group bg-white rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 transition-all overflow-hidden flex flex-col p-8">
              <div className="flex items-start justify-between mb-8">
                 <div className={`w-16 h-16 ${c.type === 'bundle' ? 'bg-indigo-600' : 'bg-slate-900'} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <GraduationCap className="w-8 h-8" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Plan</p>
                    <p className="text-2xl font-black text-indigo-600">₹{c.price}<span className="text-[10px] text-slate-300">/mo</span></p>
                 </div>
              </div>

              <div className="flex-1 space-y-4">
                 <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest bg-indigo-50 inline-block px-3 py-1 rounded-full">
                    {c.type === 'bundle' ? 'Class Bundle (6-10)' : 'Individual Subject (11-12)'}
                 </p>
                 <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{c.name}</h3>
                 
                 <div className="space-y-3 pt-4">
                    {['200+ Video Lectures', 'Expert PDF Notes', 'Doubt Clearing Sessions'].map((feat, idx) => (
                       <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {feat}
                       </div>
                    ))}
                 </div>
              </div>

              <button 
                onClick={() => { setSelectedCourse(c); setShowCheckout(true); }}
                className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 hover:scale-[1.02] shadow-xl transition-all active:scale-95"
              >
                 Buy Now <ChevronRight className="w-4 h-4" />
              </button>
           </div>
         ))}
      </div>

      {/* MOCK CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCheckout(false)} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white w-full max-w-lg rounded-[50px] shadow-2xl overflow-hidden p-10 md:p-14 text-center space-y-8"
             >
                <div className="space-y-4">
                   <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner mb-6">
                      <CreditCard className="w-10 h-10" />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Checkout Simulation</h2>
                   <p className="text-slate-400 font-bold italic">Simulate your payment for <span className="text-indigo-600 uppercase not-italic">{selectedCourse.name}</span></p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[40px] space-y-4 shadow-inner">
                   <div className="flex items-center justify-between font-black text-xs uppercase tracking-widest text-slate-400">
                      <span>Course Total</span>
                      <span className="text-slate-900 text-xl">₹{selectedCourse.price}</span>
                   </div>
                   <div className="flex items-center justify-between font-black text-xs uppercase tracking-widest text-slate-400 pt-4 border-t border-slate-200">
                      <span>Gateway Fees</span>
                      <span className="text-slate-400">₹0.00</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                   <button 
                     disabled={buyLoading}
                     onClick={handleMockPay}
                     className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all text-sm"
                   >
                      {buyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Pay Success (Simulation)</>}
                   </button>
                   <button 
                     onClick={() => setShowCheckout(false)}
                     className="w-full py-5 bg-white text-rose-600 border-2 border-rose-50 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all hover:bg-rose-50 hover:text-rose-700 active:scale-95"
                   >
                      Cancel Payment
                   </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-tighter">
                   <Info className="w-3.5 h-3.5" /> This is a secure mock payment testing environment
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Loader2 = ({ className }) => <X className={`${className} animate-spin`} />;

export default StudentStore;
