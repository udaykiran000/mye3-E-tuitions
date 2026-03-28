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
      const { data } = await axios.get('/student/catalog');
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
      await axios.post('/student/mock-payment-success', {
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (razorpayKeyId) => {
    setBuyLoading(true);
    try {
      // Load Razorpay Script Dynamically to avoid console warnings
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setBuyLoading(false);
        return;
      }

      // 1. Create order on backend
      const { data: order } = await axios.post('/payments/orders', {
        amount: selectedCourse.price,
        type: selectedCourse.type,
        referenceIds: [selectedCourse.id]
      });

      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Mye3 Learning Platform',
        description: `Purchase: ${selectedCourse.name}`,
        order_id: order.id,
        handler: async (response) => {
          toast.success('Payment Successful! Processing access...');
          // Redirect to dashboard (Webhook handles background logic)
          setTimeout(() => {
            window.location.href = '/student/dashboard';
          }, 2000);
        },
        prefill: {
          name: userInfo?.name,
          email: userInfo?.email
        },
        theme: { color: '#4f46e5' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setBuyLoading(false);
    } catch (error) {
      console.error('RAZORPAY ERROR:', error);
      toast.error(error.response?.data?.message || 'Failed to initialize Razorpay');
      setBuyLoading(false);
    }
  };

  const processPayment = async () => {
    setBuyLoading(true);
    try {
      // Ask backend for config (Mock vs Real)
      const { data: config } = await axios.get('/payments/config');
      
      if (config.mode === 'live' && config.keyId) {
        handleRazorpayPayment(config.keyId);
      } else {
        handleMockPay();
      }
    } catch (error) {
      console.error('CONFIG ERROR:', error);
      // Fallback to mock if config fails (or show error)
      handleMockPay();
    }
  };

  const filteredCourses = (courses || []).filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.classLevel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const juniorCourses = filteredCourses.filter(c => c.type === 'bundle');
  const seniorCourses = filteredCourses.filter(c => c.type === 'subject');

  return (
    <div className="space-y-12 md:space-y-16 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto p-4 md:p-6 lg:px-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
         <div className="space-y-1 md:space-y-2 relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Academic Store</h1>
            <p className="text-slate-400 font-bold italic text-sm md:text-base">Secure your success with 'Full Course' bundles or target specific subjects.</p>
         </div>

         <div className="relative group w-full lg:w-[400px] relative z-10">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text"
              placeholder="Search classes or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-4 md:py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl md:rounded-2xl outline-none font-black text-slate-900 text-sm shadow-inner transition-all"
            />
         </div>
      </div>

      {/* JUNIOR SECTION */}
      <section className="space-y-8">
         <div className="flex items-center gap-4 md:gap-6 pl-4 border-l-4 border-indigo-600">
            <div className="bg-indigo-600 text-white p-2.5 md:p-3 rounded-xl shadow-lg shadow-indigo-100">
               <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest leading-none">School Tuition</h2>
               <p className="text-indigo-600 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1.5 md:mt-1">Full Course Bundles (Classes 6th - 10th)</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {juniorCourses.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <ShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic px-6">No Full Courses Available</p>
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
         <div className="flex items-center gap-4 md:gap-6 pl-4 border-l-4 border-slate-900">
            <div className="bg-slate-900 text-white p-2.5 md:p-3 rounded-xl shadow-lg shadow-slate-100">
               <Layout className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
               <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest leading-none">Senior Secondary</h2>
               <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1.5 md:mt-1">Individual Subjects (Classes 11th - 12th)</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {seniorCourses.length === 0 && !loading && (
              <div className="col-span-full py-16 text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <Layout className="w-10 h-10 md:w-12 md:h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest italic px-6">No Senior Subjects Available</p>
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
               initial={{ scale: 0.95, opacity: 0, y: 10 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 10 }}
               className="relative bg-white w-full max-w-xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden p-6 md:p-12 text-center space-y-8"
             >
                {/* Checkout Header */}
                <div className="space-y-4">
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner mb-4 md:mb-6 border-2 border-white ring-1 ring-indigo-100">
                      <CreditCard className="w-8 h-8 md:w-10 md:h-10" />
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Confirm Order</h2>
                   <p className="text-slate-400 font-bold italic text-xs md:text-sm px-4">Simulating secure checkout for <span className="text-indigo-600 block mt-1 not-italic uppercase">{selectedCourse.name}</span></p>
                </div>

                {/* Pricing Summary */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-2xl space-y-4 border border-slate-100 shadow-inner">
                   <div className="flex items-center justify-between font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400">
                      <span>Plan Description</span>
                      <span className="text-slate-900 text-xs">{selectedCourse.subscriptionType === 'full' ? 'Full Access' : 'Single Access'}</span>
                   </div>
                   <div className="flex items-center justify-between font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 pt-4 border-t border-slate-200">
                      <span className="text-indigo-500">Total Investment</span>
                      <span className="text-slate-900 text-2xl md:text-3xl">₹{selectedCourse.price}</span>
                   </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                   <button 
                     disabled={buyLoading}
                     onClick={processPayment}
                     className="w-full py-4 md:py-5 bg-emerald-500 text-white rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 hover:bg-emerald-600 active:scale-95 transition-all group"
                   >
                      {buyLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-white" /> : <><ShieldCheck className="w-5 h-5 md:w-6 md:h-6" /> Pay Securely</>}
                   </button>
                   <button 
                     onClick={() => setShowCheckout(false)}
                     className="w-full py-4 md:py-5 bg-white text-rose-500 border border-rose-100 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest transition-all hover:bg-rose-50 hover:text-rose-700 active:scale-95"
                   >
                      Abort Checkout
                   </button>
                </div>

                 <div className="py-3 px-6 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                       Demo Simulation • No real funds charged
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
  <div className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all flex flex-col p-6 m-d:p-8 relative overflow-hidden ${expandedId === c.id ? 'ring-2 ring-indigo-100 border-indigo-200' : ''}`}>
    
    {c.type === 'bundle' && (
      <div className="absolute top-0 right-0 px-4 py-1.5 bg-indigo-600 text-white font-black text-[8px] uppercase tracking-widest rounded-bl-xl shadow-md">
        Best Choice
      </div>
    )}

    <div className="flex items-start justify-between mb-8">
       <div className={`w-12 h-12 md:w-14 md:h-14 ${c.type === 'bundle' ? 'bg-indigo-600' : 'bg-slate-900'} rounded-xl flex items-center justify-center text-white shadow-lg shrink-0`}>
          <GraduationCap className="w-6 h-6 md:w-7 md:h-7" />
       </div>
       <div className="text-right">
          <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Investment Plan</p>
          <p className="text-2xl md:text-3xl font-black text-indigo-600 leading-none">₹{c.price}</p>
       </div>
    </div>

    <div className="flex-1 space-y-4">
       <div>
          <p className={`text-[9px] font-black uppercase tracking-widest inline-block px-2.5 py-1 rounded-lg mb-2 ${c.type === 'bundle' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
             {c.type === 'bundle' ? 'Full Access' : 'Single Subject'}
          </p>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{c.name}</h3>
       </div>
       
       <div className="space-y-2.5 pt-4">
          {['Interactive Live Sessions', 'LMS Study Materials', 'Direct Teacher Help'].map((feat, idx) => (
             <div key={idx} className="flex items-center gap-3 text-[11px] md:text-[12px] font-black text-slate-400 uppercase tracking-tight">
                <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 shrink-0" /> {feat}
             </div>
          ))}
       </div>
    </div>

    {c.subjects && c.subjects.length > 0 && (
      <div className="mt-8 pt-6 border-t border-slate-50">
        <button 
          onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
          className="flex items-center justify-between w-full text-[9px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors"
        >
          {expandedId === c.id ? 'Hide Prices' : 'Individual Pricing'}
          {expandedId === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        <AnimatePresence>
          {expandedId === c.id && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-4 space-y-2">
                {c.subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{sub.name}</span>
                    <button 
                      onClick={() => {
                        setSelectedCourse({
                          id: c.id, 
                          name: `${sub.name} (${c.classLevel})`,
                          price: sub.singleSubjectPrice,
                          type: 'subject',
                          subscriptionType: 'single'
                        });
                        setShowCheckout(true);
                      }}
                      className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95"
                    >
                      ₹{sub.singleSubjectPrice} — Buy
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
      className="mt-8 w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg active:scale-95 group"
    >
       {c.type === 'bundle' ? 'Get Full Access' : 'Purchase Now'} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

export default StudentStore;
