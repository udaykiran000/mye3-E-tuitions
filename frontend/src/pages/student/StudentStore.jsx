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
  ChevronRight,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Layout,
  Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { usePreview } from '../../context/PreviewContext';
import { useSelector } from 'react-redux';

const StudentStore = () => {
  const { activeView } = usePreview();
  const { userInfo } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/api/student/catalog');
      setCourses(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [activeView, userInfo]);

  const handleMockPay = async () => {
    setBuyLoading(true);
    try {
      await axios.post('/api/student/mock-payment-success', {
        amount: selectedCourse.price,
        packageName: selectedCourse.name,
        referenceId: selectedCourse.id,
        type: selectedCourse.type,
        subscriptionType: selectedCourse.subscriptionType || 'full'
      });

      toast.success('Course Purchased Successfully!');
      setTimeout(() => {
        setBuyLoading(false);
        setShowCheckout(false);
        setSelectedCourse(null);
        window.location.href = '/student/dashboard';
      }, 1500);
    } catch (error) {
      toast.error('Payment Simulation Failed');
      setBuyLoading(false);
    }
  };

  const filteredCourses = (courses || []).filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.classLevel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const juniorCourses = filteredCourses.filter(c => c.type === 'bundle');
  const seniorCourses = filteredCourses.filter(c => c.type === 'subject');

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto px-4 lg:px-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
         <div className="space-y-2 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Browse Curriculum</h1>
            <p className="text-slate-400 font-bold italic">Secure your academic success with our 'Full Course' plans or target specific subjects.</p>
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

      {/* JUNIOR SECTION */}
      <section className="space-y-8">
         <div className="flex items-center gap-6 pl-4 border-l-4 border-indigo-600">
            <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-100">
               <GraduationCap className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest leading-none">School Tuition</h2>
               <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">Full Course Bundles (Classes 6th - 10th)</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {juniorCourses.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center space-y-4 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">No Full Courses Available in Archive</p>
              </div>
            )}
            
            {juniorCourses.map((c, i) => (
              <CourseCard 
                key={i} 
                c={c} 
                expandedId={expandedId} 
                setExpandedId={setExpandedId} 
                setSelectedCourse={setSelectedCourse} 
                setShowCheckout={setShowCheckout} 
              />
            ))}
         </div>
      </section>

      {/* SENIOR SECTION */}
      <section className="space-y-8">
         <div className="flex items-center gap-6 pl-4 border-l-4 border-slate-900">
            <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg shadow-slate-100">
               <Layout className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest leading-none">Senior Secondary</h2>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Individual Subjects (Classes 11th - 12th)</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {seniorCourses.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center space-y-4 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <Layout className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">No Senior Subjects Available in Archive</p>
              </div>
            )}
            
            {seniorCourses.map((c, i) => (
              <CourseCard 
                key={i} 
                c={c} 
                expandedId={expandedId} 
                setExpandedId={setExpandedId} 
                setSelectedCourse={setSelectedCourse} 
                setShowCheckout={setShowCheckout} 
              />
            ))}
         </div>
      </section>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCheckout(false)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="relative bg-white w-full max-w-xl rounded-[60px] shadow-2xl overflow-hidden p-12 md:p-16 text-center space-y-10"
             >
                {/* Checkout Header */}
                <div className="space-y-4">
                   <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[35%] flex items-center justify-center mx-auto shadow-inner mb-8 transform -rotate-12 border-4 border-white ring-1 ring-indigo-100">
                      <CreditCard className="w-10 h-10" />
                   </div>
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-4">Finalizing Order</h2>
                   <p className="text-slate-400 font-bold italic">Simulating secure checkout for <span className="text-indigo-600 uppercase not-italic block mt-1">{selectedCourse.name}</span></p>
                </div>

                {/* Pricing Summary */}
                <div className="bg-slate-50 p-10 rounded-[40px] space-y-5 border border-slate-100 shadow-inner">
                   <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-widest text-slate-400">
                      <span>Item Description</span>
                      <span className="text-slate-900 text-xs">{selectedCourse.subscriptionType === 'full' ? 'Full Access' : 'Single Access'}</span>
                   </div>
                   <div className="flex items-center justify-between font-black text-[10px] uppercase tracking-widest text-slate-400 pt-5 border-t border-slate-200">
                      <span className="text-indigo-500 underline decoration-indigo-200 underline-offset-4">Course Total</span>
                      <span className="text-slate-900 text-3xl">₹{selectedCourse.price}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4 pt-6">
                   <button 
                     disabled={buyLoading}
                     onClick={handleMockPay}
                     className="w-full py-6 bg-emerald-500 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-4 hover:bg-emerald-600 active:scale-95 transition-all text-sm group"
                   >
                      {buyLoading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <><ShieldCheck className="w-6 h-6" /> Complete Purchase</>}
                   </button>
                   <button 
                     onClick={() => setShowCheckout(false)}
                     className="w-full py-6 bg-white text-rose-500 border-2 border-rose-50 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-rose-50 hover:text-rose-700 active:scale-95"
                   >
                      Abort Checkout
                   </button>
                </div>

                 <div className="flex flex-col items-center gap-4 py-4 px-8 bg-slate-50 rounded-3xl border border-slate-100 italic">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                       This transaction is a mock simulation for demo purposes. No real money will be deducted.
                    </p>
                 </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Extracted CourseCard Component
const CourseCard = ({ c, expandedId, setExpandedId, setSelectedCourse, setShowCheckout }) => (
  <div className={`group bg-white rounded-[50px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-900/10 transition-all flex flex-col p-10 relative overflow-hidden ${expandedId === c.id ? 'ring-4 ring-indigo-50 border-indigo-200' : ''}`}>
    
    {c.type === 'bundle' && (
      <div className="absolute top-0 right-0 px-6 py-2 bg-indigo-600 text-white font-black text-[9px] uppercase tracking-widest rounded-bl-3xl shadow-lg">
        Most Preferred
      </div>
    )}

    <div className="flex items-start justify-between mb-10">
       <div className={`w-14 h-14 ${c.type === 'bundle' ? 'bg-indigo-600' : 'bg-slate-900'} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100`}>
          <GraduationCap className="w-7 h-7" />
       </div>
       <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Investment Plan</p>
          <p className="text-3xl font-black text-indigo-600">₹{c.price}</p>
       </div>
    </div>

    <div className="flex-1 space-y-4">
       <div className="flex items-center gap-2">
          <p className={`text-[10px] font-black uppercase tracking-widest inline-block px-3 py-1 rounded-full ${c.type === 'bundle' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
             {c.type === 'bundle' ? 'Full Course Access' : 'Individual Subject'}
          </p>
       </div>
       <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{c.name}</h3>
       
       <div className="space-y-3 pt-6">
          {['Live Interactive Sessions', 'Digital Study Materials', 'Direct Teacher Help'].map((feat, idx) => (
             <div key={idx} className="flex items-center gap-4 text-[13px] font-bold text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" /> {feat}
             </div>
          ))}
       </div>
    </div>

    {c.subjects && c.subjects.length > 0 && (
      <div className="mt-8 pt-8 border-t border-slate-50">
        <button 
          onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
          className="flex items-center justify-between w-full text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] hover:text-indigo-700 transition-colors"
        >
          {expandedId === c.id ? 'Collapse Subjects' : 'View Individual Prices'}
          {expandedId === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedId === c.id && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-6 space-y-3">
                {c.subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all group/sub">
                    <span className="text-[12px] font-black text-slate-600 uppercase tracking-widest">{sub.name}</span>
                    <button 
                      onClick={() => {
                        setSelectedCourse({
                          id: c.id, 
                          name: `${sub.name} (Class ${c.classLevel.split(' ')[1]})`,
                          price: sub.singleSubjectPrice,
                          type: 'subject',
                          subscriptionType: 'single'
                        });
                        setShowCheckout(true);
                      }}
                      className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95"
                    >
                      Buy — ₹{sub.singleSubjectPrice}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )}

    <button 
      onClick={() => { 
        setSelectedCourse({
          ...c,
          subscriptionType: c.type === 'bundle' ? 'full' : 'single'
        }); 
        setShowCheckout(true); 
      }}
      className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 shadow-xl transition-all active:scale-95 group"
    >
       {c.type === 'bundle' ? 'Unlock Full Course' : 'Buy Subject'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default StudentStore;
