import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiShoppingBag, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiArrowRight,
  FiShield,
  FiCreditCard,
  FiX,
  FiAward,
  FiStar
} from 'react-icons/fi';
import { GraduationCap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import courseItem1 from '../../assets/course-item-1.webp';
import courseItem2 from '../../assets/course-item-2.webp';
import courseItem3 from '../../assets/course-item-3.webp';
import courseItem4 from '../../assets/course-item-4.webp';

const CourseCard = ({ c, expandedId, setExpandedId, setSelectedCourse, setShowCheckout, userInfo }) => {
  const isBundle = c.type === 'bundle';
  const isExpanded = expandedId === c.id;

  // Normalize for comparison
  const userClass = userInfo?.className?.replace(/\D/g, '') || ''; // "10"
  const courseClass = String(c.classLevel || c.className || '').replace(/\D/g, '') || ''; // "10"
  
  const userSyllabus = userInfo?.syllabus?.toUpperCase().trim() || '';
  const courseSyllabus = c.syllabus?.toUpperCase().trim() || '';

  // Strict Eligibility Logic
  const isClassMatch = userClass === courseClass;
  const isSyllabusMatch = !courseSyllabus || !userSyllabus || courseSyllabus === userSyllabus;
  
  // Only eligible if class matches exactly (and syllabus if specified)
  const isEligible = isClassMatch && isSyllabusMatch;

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col p-7 relative overflow-hidden ${!isEligible ? 'opacity-75' : ''} ${isExpanded ? 'border-[#f16126] shadow-xl shadow-orange-900/5' : 'border-slate-100 hover:border-[#f16126]/30 hover:shadow-lg shadow-sm'}`}>
      
      {!isEligible && (
        <div className="absolute inset-0 bg-slate-50/10 z-[5] pointer-events-none" />
      )}

      {isBundle && (
        <div className="absolute top-0 right-0 px-5 py-2 bg-[#f16126] text-white font-black text-[9px] uppercase tracking-widest rounded-bl-xl shadow-md z-10">
          All Subjects
        </div>
      )}

      {/* Header Info */}
      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isBundle ? 'bg-orange-50 text-[#f16126]' : 'bg-blue-50 text-[#002147]'}`}>
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Class {courseClass} {courseSyllabus ? `(${courseSyllabus})` : ''}
            </p>
            <h3 className="text-lg font-black text-[#002147] uppercase italic leading-tight tracking-tight">{c.name}</h3>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6 flex items-baseline gap-2">
           <span className="text-3xl font-black text-[#002147] tracking-tighter italic">₹{(c.pricing?.oneMonth || c.price || 0).toLocaleString()}</span>
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ 1 month start</span>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          {(c.subjects || []).slice(0, 3).map((sub, idx) => (
            <div key={idx} className="flex items-center gap-3 text-slate-600">
              <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[13px] font-bold italic">{sub.name}</span>
            </div>
          ))}
          {(c.subjects || []).length > 3 && (
            <button 
              onClick={() => setExpandedId(isExpanded ? null : c.id)}
              className="text-[#f16126] text-[11px] font-black uppercase tracking-widest hover:underline pt-1"
            >
              {isExpanded ? '- Show Less' : `+ ${(c.subjects || []).length - 3} More Subjects`}
            </button>
          )}
        </div>

        {/* Details for Expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6 space-y-2 border-t border-slate-50 pt-4"
            >
              {(c.subjects || []).slice(3).map((sub, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-500">
                  <div className="w-1 h-1 bg-[#f16126] rounded-full" />
                  <span className="text-[12px] font-medium">{sub.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER CTA */}
      <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4 mt-auto relative z-10">
         {isEligible ? (
           <button 
             onClick={() => { setSelectedCourse(c); setShowCheckout(true); }}
             className="flex-1 bg-[#002147] text-white py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#f16126] transition-all shadow-lg active:scale-95 group/buy"
           >
             Enroll Now <FiArrowRight className="w-4 h-4 group-hover/buy:translate-x-1 transition-transform" />
           </button>
         ) : (
           <div className="w-full space-y-2">
             <button 
               disabled
               className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
             >
               Not Eligible <FiX className="w-4 h-4" />
             </button>
             <p className="text-[9px] text-center font-bold text-rose-400 uppercase tracking-widest">Only for Grade {userClass} students</p>
           </div>
         )}
      </div>
    </div>
  );
};

const StoreCarousel = () => {
  const [current, setCurrent] = useState(0);
  const images = [
    courseItem1,
    courseItem2,
    courseItem3,
    courseItem4
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-[180px] md:h-[220px] rounded-2xl bg-transparent flex items-center justify-center">
      {/* Decorative Icons (C-Curve Arrangement) */}
      {/* Left Arc */}
      <motion.div 
        animate={{ y: [0, -8, 0], x: [0, -3, 0] }} 
        transition={{ duration: 3, repeat: Infinity }} 
        className="absolute top-[12%] left-[12%] z-20 p-1.5 bg-orange-100 rounded-lg shadow-sm"
      >
        <FiAward className="text-[#f16126] w-3 h-3" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 8, 0], x: [0, -6, 0] }} 
        transition={{ duration: 4, repeat: Infinity }} 
        className="absolute top-[50%] left-[2%] -translate-y-1/2 z-20 p-1.5 bg-blue-50 rounded-lg shadow-sm"
      >
        <FiStar className="text-[#002147] w-3 h-3" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -8, 0], x: [0, -3, 0] }} 
        transition={{ duration: 3.5, repeat: Infinity }} 
        className="absolute bottom-[12%] left-[12%] z-20 p-1.5 bg-emerald-50 rounded-lg shadow-sm"
      >
        <FiCheckCircle className="text-emerald-500 w-3 h-3" />
      </motion.div>

      {/* Right Arc */}
      <motion.div 
        animate={{ y: [0, 8, 0], x: [0, 3, 0] }} 
        transition={{ duration: 3.2, repeat: Infinity }} 
        className="absolute top-[12%] right-[12%] z-20 p-1.5 bg-blue-50 rounded-lg shadow-sm"
      >
        <FiSearch className="text-[#002147] w-3 h-3" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -8, 0], x: [0, 6, 0] }} 
        transition={{ duration: 4.5, repeat: Infinity }} 
        className="absolute top-[50%] right-[2%] -translate-y-1/2 z-20 p-1.5 bg-orange-100 rounded-lg shadow-sm"
      >
        <FiCheckCircle className="text-[#f16126] w-3 h-3" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 8, 0], x: [0, 3, 0] }} 
        transition={{ duration: 3.8, repeat: Infinity }} 
        className="absolute bottom-[12%] right-[12%] z-20 p-1.5 bg-slate-100 rounded-lg shadow-sm"
      >
        <FiAward className="text-[#64748b] w-3 h-3" />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`Course Preview ${current + 1}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-contain object-top z-10"
        />
      </AnimatePresence>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-30">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`h-0.5 rounded-full transition-all duration-300 ${i === current ? 'w-4 bg-[#f16126]' : 'w-1 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

const StudentStore = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('oneMonth');

  const juniorRef = useRef(null);
  const seniorRef = useRef(null);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/student/catalog');
      // If backend is empty, use the requested project structure as fallback
      if (!data || data.length === 0) {
        const mockData = [
          { id: 'c6', name: 'Class 6 - All Subjects', classLevel: '6', type: 'bundle', price: 999, subjects: [{name: 'Maths'}, {name: 'Science'}, {name: 'English'}, {name: 'Social'}, {name: 'Telugu/Hindi'}] },
          { id: 'c7', name: 'Class 7 - All Subjects', classLevel: '7', type: 'bundle', price: 999, subjects: [{name: 'Maths'}, {name: 'Science'}, {name: 'English'}, {name: 'Social'}] },
          { id: 'c8', name: 'Class 8 - All Subjects', classLevel: '8', type: 'bundle', price: 1199, subjects: [{name: 'Maths'}, {name: 'Physics Basics'}, {name: 'Chemistry Basics'}, {name: 'Biology'}, {name: 'English'}] },
          { id: 'c9', name: 'Class 9 - All Subjects', classLevel: '9', type: 'bundle', price: 1499, subjects: [{name: 'Maths'}, {name: 'Physics'}, {name: 'Chemistry'}, {name: 'Biology'}, {name: 'English'}, {name: 'Social'}] },
          { id: 'c10', name: 'Class 10 - All Subjects', classLevel: '10', type: 'bundle', price: 1499, subjects: [{name: 'Maths'}, {name: 'Physics'}, {name: 'Chemistry'}, {name: 'Biology'}, {name: 'English'}, {name: 'Social'}] },
          { id: 'c11', name: 'Class 11 - Subjects', classLevel: '11', type: 'subject', price: 999, subjects: [{name: 'Physics'}, {name: 'Chemistry'}, {name: 'Maths'}, {name: 'Biology'}, {name: 'Commerce'}, {name: 'Accounts'}, {name: 'Economics'}] },
          { id: 'c12', name: 'Class 12 - Subjects', classLevel: '12', type: 'subject', price: 999, subjects: [{name: 'Physics'}, {name: 'Chemistry'}, {name: 'Maths'}, {name: 'Biology'}, {name: 'Commerce'}, {name: 'Accounts'}, {name: 'Economics'}] },
        ];
        setCourses(mockData);
      } else {
        setCourses(data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [userInfo]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section === 'junior' && juniorRef.current) {
      juniorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'senior' && seniorRef.current) {
      seniorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location, courses]);

  const handlePayment = async () => {
    setBuyLoading(true);
    try {
      // Mock payment success for now to keep focus on UI
      // Determine price based on selected duration
      const price = selectedCourse.pricing?.[selectedDuration] || selectedCourse.price || 0;
      
      await axios.post('/student/mock-payment-success', {
        amount: price,
        packageName: `${selectedCourse.className || selectedCourse.name} - ${selectedDuration}`,
        referenceId: selectedCourse._id || selectedCourse.id,
        type: selectedCourse.type || 'bundle',
        subscriptionType: selectedDuration
      });

      toast.success('Course Purchased Successfully!');
      setTimeout(() => {
        setBuyLoading(false);
        setShowCheckout(false);
        setSelectedCourse(null);
        window.location.href = '/student/dashboard';
      }, 1500);
    } catch (error) {
      toast.error('Payment Failed');
      setBuyLoading(false);
    }
  };

  const filteredCourses = (courses || []).filter(c => {
    // Only search by query, don't filter out anymore
    return (c.className?.toLowerCase() || c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
  });

  const juniorCourses = filteredCourses.filter(c => c.type === 'bundle');
  const seniorCourses = filteredCourses.filter(c => c.type === 'subject');

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans">
      <Toaster position="top-right" />
      
      {/* Top Search Strip (Clean & Separate) */}
      <div className="bg-[#002147] py-[18px] px-4 w-full shadow-lg z-20">
        <div className="max-w-[750px] mx-auto flex h-[52px] shadow-2xl relative">
          <div className="flex-1 relative flex items-center bg-white rounded-l-xl overflow-hidden">
            <FiSearch className="text-slate-400 w-5 h-5 ml-6 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search by class, subject, or course name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-5 text-[15px] font-bold text-[#002147] outline-none h-full bg-transparent placeholder-slate-400"
            />
          </div>
          <button className="bg-[#f16126] text-white px-10 h-full text-[13px] font-black uppercase tracking-[0.2em] rounded-r-xl hover:bg-[#de551e] transition-all flex-shrink-0 active:scale-95 shadow-lg">
            Find Course
          </button>
        </div>
      </div>

      {/* ── HERO 65/35 SPLIT SECTION ── */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-10 pb-16">
        <div className="bg-white rounded-[40px] border border-orange-200 overflow-hidden shadow-[0_20px_50px_rgba(241,97,38,0.08)] flex flex-col md:flex-row h-auto min-h-[320px]">
          
          {/* Left 65%: Content */}
          <div className="w-full md:w-[65%] p-8 md:p-14 flex flex-col justify-center border-r-0 md:border-r-[3px] border-[#f16126] relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-orange-50 rounded-full w-fit border border-orange-100">
                <div className="w-2 h-2 bg-[#f16126] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[#f16126] uppercase tracking-[0.25em]">Enrolment 2026</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-[#002147] mb-6 italic tracking-tighter leading-none">
                MYE3-E-TUITIONS <span className="text-[#f16126] not-italic">STORE</span>
              </h1>
              <p className="text-slate-500 font-bold italic text-base max-w-xl mb-8 leading-relaxed">
                Choose your goal and start learning with expert teachers. Select a class bundle or pick individual subjects to excel in your academic journey.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                  <FiCheckCircle className="w-4 h-4" /> All Subjects
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-black uppercase tracking-widest border border-blue-100">
                  <FiCheckCircle className="w-4 h-4" /> Live Classes
                </div>
              </div>
            </div>
          </div>

          {/* Right 35%: Visual Carousel */}
          <div className="w-full md:w-[35%] bg-slate-50 relative p-8 flex items-center justify-center">
            <StoreCarousel />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-24 space-y-24">
        {/* Junior Section */}
        <section ref={juniorRef} className="scroll-mt-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 px-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-[3px] bg-[#f16126]" />
                <h2 className="text-4xl font-black text-[#002147] italic tracking-tighter uppercase">School Tuitions</h2>
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] pl-14">All Subjects Packages • Classes 6th - 10th</p>
            </div>
            <div className="px-6 py-2 bg-orange-50 text-[#f16126] rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">
              Popular Choice
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {juniorCourses.map(c => (
                <CourseCard 
                  key={c.id} 
                  c={c} 
                  expandedId={expandedId} 
                  setExpandedId={setExpandedId}
                  setSelectedCourse={setSelectedCourse}
                  setShowCheckout={setShowCheckout}
                  userInfo={userInfo}
                />
              ))}
            </div>
          )}
        </section>

        {/* Senior Section */}
        <section ref={seniorRef} className="scroll-mt-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 px-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-[3px] bg-[#002147]" />
                <h2 className="text-4xl font-black text-[#002147] italic tracking-tighter uppercase text-orange-600">Senior Secondary</h2>
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] pl-14">Individual Subjects • Classes 11th - 12th</p>
            </div>
            <div className="px-6 py-2 bg-blue-50 text-[#002147] rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
              Personalized Learning
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {seniorCourses.map(c => (
              <CourseCard 
                key={c.id} 
                c={c} 
                expandedId={expandedId} 
                setExpandedId={setExpandedId}
                setSelectedCourse={setSelectedCourse}
                setShowCheckout={setShowCheckout}
                userInfo={userInfo}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && selectedCourse && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-[#002147]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl"
            >
              <div className="bg-[#f16126] p-8 text-white relative">
                 <button 
                   onClick={() => setShowCheckout(false)}
                   className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20"
                 >
                   <FiX className="w-4 h-4" />
                 </button>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Finalize Enrollment</p>
                 <h3 className="text-2xl font-black uppercase italic tracking-tight">{selectedCourse.className || selectedCourse.name}</h3>
              </div>

              <div className="p-8 space-y-6">
                 <div className="flex gap-2 w-full mb-2 bg-slate-100 p-1 rounded-lg">
                    {[
                      { key: 'oneMonth', label: '1 Month' },
                      { key: 'threeMonths', label: '3 Months' },
                      { key: 'sixMonths', label: '6 Months' },
                      { key: 'twelveMonths', label: '12 Months' }
                    ].map(dur => (
                      <button 
                        key={dur.key}
                        onClick={() => setSelectedDuration(dur.key)}
                        className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${selectedDuration === dur.key ? 'bg-white shadow-sm text-[#f16126]' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {dur.label}
                      </button>
                    ))}
                 </div>
                 <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Course Fee ({selectedDuration})</span>
                    <span className="text-2xl font-black text-[#002147] italic">₹{selectedCourse.pricing?.[selectedDuration] || selectedCourse.price || 0}</span>
                 </div>

                 <div className="bg-slate-50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                       <FiShield className="text-emerald-500 w-5 h-5" />
                       <span className="text-[13px] font-bold">Secure Stripe Gateway</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                       <FiCheckCircle className="text-blue-500 w-5 h-5" />
                       <span className="text-[13px] font-bold">One-Year Full Access</span>
                    </div>
                 </div>

                 <button 
                   disabled={buyLoading}
                   onClick={handlePayment}
                   className="w-full bg-[#002147] text-white py-4 rounded-2xl font-black text-[13px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#f16126] transition-all shadow-xl active:scale-95 disabled:opacity-50"
                 >
                   {buyLoading ? 'Processing...' : (
                     <>Confirm & Pay ₹{selectedCourse.pricing?.[selectedDuration] || selectedCourse.price || 0} <FiCreditCard className="w-5 h-5" /></>
                   )}
                 </button>
                 
                 <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    By clicking confirm, you agree to our terms of service.
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentStore;
