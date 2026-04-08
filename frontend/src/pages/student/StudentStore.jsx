import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
  FiCreditCard,
  FiX,
  FiBook,
  FiMonitor,
  FiLayers,
  FiCalendar
} from 'react-icons/fi';
import { GraduationCap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import courseItem1 from '../../assets/course-item-1.webp';
import courseItem2 from '../../assets/course-item-2.webp';
import courseItem3 from '../../assets/course-item-3.webp';
import courseItem4 from '../../assets/course-item-4.webp';
import brandSymbol from '../../assets/logo copy.png';


const CourseCard = ({ c, setSelectedCourse, setShowCheckout, userInfo }) => {
  const isBundle = c.type === 'bundle';

  // Normalize for comparison
  const userClass = userInfo?.className?.replace(/\D/g, '') || '';
  const courseClass = String(c.classLevel || c.className || '').replace(/\D/g, '') || '';
  const userBoard = userInfo?.board?.toUpperCase().trim() || '';
  const courseBoard = c.board?.toUpperCase().trim() || '';

  // If not logged in, show everything as eligible for viewing/exploring
  const isEligible = !userInfo || (userClass === courseClass && (!courseBoard || !userBoard || courseBoard === userBoard));

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className={`group bg-white p-10 rounded-[56px] border-2 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full ${
        !isEligible ? 'opacity-70 blur-[0.5px]' : 'hover:border-orange-500/20 hover:shadow-[0_20px_60px_rgba(241,97,38,0.1)] shadow-sm border-slate-50'
      }`}
    >
      {/* Decorative Brand Elements */}
      <div className={`absolute top-0 left-0 w-2 h-full ${isBundle ? 'bg-orange-500 shadow-[0_0_20px_rgba(241,97,38,0.3)]' : 'bg-[#002147]'} opacity-20`} />
      
      {isBundle && (
        <div className="absolute top-0 right-0 px-8 py-3 bg-orange-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-bl-[32px] shadow-lg z-10">
          ALL SUBJECTS
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-[#002147] rounded-xl flex items-center justify-center p-2.5 group-hover:scale-105 transition-all duration-300 shadow-sm relative">
          <img src={brandSymbol} alt="logo" className="w-full h-full object-contain" />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Full Access Fee</p>
          <p className="text-3xl font-black text-[#002147] italic tracking-tighter leading-none tabular-nums">₹{(c.pricing?.oneMonth || c.price || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4 flex-1">
        <p className="text-[9px] font-black text-orange-600 uppercase tracking-[0.3em] leading-none mb-1.5">
          {Number(courseClass) === 11 ? 'Inter 1st Year' : Number(courseClass) === 12 ? 'Inter 2nd Year' : `Class ${courseClass}`} {courseBoard ? `(${courseBoard})` : ''}
        </p>
        <div className="flex items-center gap-2 mb-1.5">
          {courseBoard && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black rounded uppercase tracking-wider">
              {courseBoard}
            </span>
          )}
        </div>
        <h3 className="text-[16px] font-black text-[#002147] leading-tight tracking-tight uppercase italic">{c.name}</h3>
        {/* Features Preview */}
        <div className="space-y-3">
          {(c.subjects || []).slice(0, 4).map((sub, idx) => (
            <div key={idx} className="flex items-center gap-3 text-slate-600 transition-all hover:translate-x-1 duration-300">
              <div className="w-5 h-5 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                 <FiCheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
              </div>
              <span className="text-[11px] font-bold italic uppercase tracking-tight text-slate-500">{sub.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {isEligible ? (
            <button
              onClick={() => { 
                setSelectedCourse(c); 
                setSelectedDuration('oneMonth'); // Default to monthly
                setShowCheckout(true); 
              }}
              className="w-full bg-[#002147] text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-2xl active:scale-95 group/buy relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              SELECT PLAN <FiArrowRight className="w-5 h-5 group-hover/buy:translate-x-2 transition-transform" />
            </button>
        ) : (
          <div className="space-y-4">
            <button disabled className="w-full bg-slate-50 text-slate-300 py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] cursor-not-allowed border-2 border-dashed border-slate-100 italic">
              RESTRICTED ACCESS
            </button>
            <p className="text-[9px] text-center font-black text-rose-400 uppercase tracking-widest italic opacity-60">Only for {userClass || 'designated'} grade students</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const StoreCarousel = () => {
  const [current, setCurrent] = useState(0);
  const images = [courseItem1, courseItem2, courseItem3, courseItem4];

  const decorativeIcons = [
    { Icon: FiBook, bg: 'bg-orange-100', color: 'text-orange-600', pos: 'top-4 left-4', delay: 0 },
    { Icon: FiMonitor, bg: 'bg-blue-100', color: 'text-blue-600', pos: 'bottom-4 left-4', delay: 0.2 },
    { Icon: FiCheckCircle, bg: 'bg-emerald-100', color: 'text-emerald-600', pos: 'top-4 right-4', delay: 0.4 },
    { Icon: FiLayers, bg: 'bg-purple-100', color: 'text-purple-600', pos: 'bottom-4 right-4', delay: 0.6 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-[200px] md:h-[240px] rounded-3xl bg-transparent flex items-center justify-center overflow-visible">
      {decorativeIcons.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: item.delay }}
          className={`absolute ${item.pos} z-20 hidden md:flex w-10 h-10 rounded-full ${item.bg} items-center justify-center shadow-sm border border-white`}
        >
          <item.Icon className={`w-5 h-5 ${item.color}`} />
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt="Course Preview"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-contain object-top z-10"
        />
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
        {images.map((_, i) => (
          <div key={i} className={`h-0.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-orange-500' : 'w-1.5 bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );
};

const StudentStore = () => {
  const { boardName } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('oneMonth');

  // Helper to format board name from URL (e.g., 'ts-board' -> 'TS Board')
  const getFormattedBoard = (slug) => {
    if (!slug) return null;
    const clean = slug.replace('-board', '').toUpperCase();
    if (clean === 'CBSE' || clean === 'ICSE') return clean;
    return slug.split('-').map(word => word === 'board' ? 'Board' : word.toUpperCase()).join(' ');
  };
  const activeBoardFilter = getFormattedBoard(boardName);

  const juniorRef = useRef(null);
  const seniorRef = useRef(null);

  const fetchCourses = async () => {
    try {
      // Pass the student's board if logged in to get specific pricing
      const board = userInfo?.board || '';
      const { data } = await axios.get(`/student/catalog${board ? `?board=${board}` : ''}`);

      let baseCourses = data || [];
      if (baseCourses.length === 0) {
        // Simple fallback defaults if DB is empty
        baseCourses = [
          { id: 'c6', name: 'Class 6 - All Subjects', classLevel: '6', type: 'bundle', price: 999, subjects: [{ name: 'Maths' }] },
          { id: 'c10', name: 'Class 10 - All Subjects', classLevel: '10', type: 'bundle', price: 1499, subjects: [{ name: 'Maths' }] },
        ];
      }

      const sorted = baseCourses.sort((a, b) => parseInt(a.classLevel?.toString().replace(/\D/g, '') || '0') - parseInt(b.classLevel?.toString().replace(/\D/g, '') || '0'));
      setCourses(sorted);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [userInfo]);

  // Hash scrolling support
  useEffect(() => {
    if (location.hash && !loading) {
      setTimeout(() => {
        const id = decodeURIComponent(location.hash.substring(1));
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 50); // fast scroll after render
    }
  }, [location.hash, loading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section === 'junior' && juniorRef.current) {
      juniorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (section === 'senior' && seniorRef.current) {
      seniorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location, courses]);

  // Handle direct buy from dashboard
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    if (action === 'buy' && !loading && courses.length > 0) {
      // Find matching course for user's class and board
      const userClass = userInfo?.className?.replace(/\D/g, '') || '';
      const userBoard = userInfo?.board?.toUpperCase().trim() || '';

      const match = courses.find(c => {
        const courseClass = String(c.classLevel || c.className || '').replace(/\D/g, '') || '';
        const courseBoard = c.board?.toUpperCase().trim().replace(' BOARD', '') || '';
        const studentBoard = userBoard.replace(' BOARD', '');

        return userClass === courseClass && (courseBoard === studentBoard || !courseBoard);
      });

      if (match) {
        setSelectedCourse(match);
        setSelectedDuration('oneMonth'); // Default to monthly
        setShowCheckout(true);
        // Clean up URL to prevent repeat triggers on reload
        window.history.replaceState({}, '', '/student/courses');
      }
    }
  }, [location, loading, courses, userInfo]);



  const handlePayment = async () => {
    setBuyLoading(true);
    try {
      const price = selectedCourse.pricing?.[selectedDuration] || selectedCourse.price || 0;
      await axios.post('/student/mock-payment-success', {
        amount: price,
        packageName: `${selectedCourse.className || selectedCourse.name} - ${selectedDuration}`,
        referenceId: selectedCourse._id || selectedCourse.id,
        type: selectedCourse.type || 'bundle',
        subscriptionType: selectedDuration
      });
      toast.success('Course Purchased Successfully!');

      // Update Redux state with new subscriptions
      const updatedUser = {
        ...userInfo,
        activeSubscriptions: [
          ...(userInfo.activeSubscriptions || []),
          {
            name: selectedCourse.className || selectedCourse.name,
            type: selectedCourse.type || 'bundle',
            subscriptionType: selectedDuration,
            expiryDate: new Date(Date.now() + (selectedDuration === 'oneMonth' ? 30 : 90) * 86400000), // Approximate for sync
            referenceId: selectedCourse._id || selectedCourse.id,
            purchaseDate: new Date()
          }
        ]
      };
      dispatch(setCredentials(updatedUser));

      setTimeout(() => {
        setBuyLoading(false);
        setShowCheckout(false);
        setSelectedCourse(null);
        navigate('/student/dashboard');
      }, 1500);
    } catch (error) {
      toast.error('Payment Failed');
      setBuyLoading(false);
    }
  };

  const filteredCourses = (courses || []).filter(c =>
    (c.className?.toLowerCase() || c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Only filter if user is a student and has specific class/board settings
  const isStudentFiltered = userInfo?.role?.toLowerCase() === 'student' &&
    (userInfo?.className || userInfo?.board);

  const finalFiltered = (isStudentFiltered ? filteredCourses.filter(c => {
    const courseClass = String(c.classLevel || c.className || '').replace(/\D/g, '') || '';
    const userClass = userInfo?.className?.replace(/\D/g, '') || '';
    const courseBoard = c.board?.toUpperCase().trim() || '';
    const userBoard = userInfo?.board?.toUpperCase().trim() || '';

    // Only show if class matches (and board if specified)
    return userClass === courseClass && (!courseBoard || !userBoard || courseBoard === userBoard);
  }) : filteredCourses).filter(c => {
    if (!activeBoardFilter) return true;
    const cBoard = c.board?.toUpperCase().trim() || '';
    const fBoard = activeBoardFilter.toUpperCase().trim();
    return cBoard === fBoard;
  });

  const juniorCourses = finalFiltered.filter(c => {
    const lvl = Number(c.classLevel);
    return lvl >= 1 && lvl <= 10;
  });
  const interFirstYear = finalFiltered.filter(c => Number(c.classLevel) === 11);
  const interSecondYear = finalFiltered.filter(c => Number(c.classLevel) === 12);

  const renderBoardGroups = (courseList) => {
    // If a specific board is being filtered via URL, only show that board
    let boards = ['TS Board', 'AP Board', 'CBSE Board', 'ICSE Board'];
    
    if (activeBoardFilter) {
      const formattedFilter = activeBoardFilter.toUpperCase().trim();
      boards = boards.filter(b => b.toUpperCase().includes(formattedFilter));
    }

    const grouped = {};
    boards.forEach(b => {
      const baseBoard = b.replace(' Board', '');
      const filtered = courseList.filter(c => {
        const cBoard = (c.board || 'TS Board').toUpperCase().trim();
        return cBoard === b.toUpperCase().trim() || 
               cBoard === baseBoard.toUpperCase().trim();
      });
      grouped[b] = filtered;
    });

    return Object.entries(grouped).map(([boardName, boardCourses]) => {
      // Hide empty boards if we are filtering or if specifically requested
      if (boardCourses.length === 0) return null;
      return (
        <div key={boardName} id={boardName} className="space-y-5 scroll-mt-24">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{boardName}</span>
            <div className="flex-1 h-[1px] bg-slate-50" />
          </div>
          {boardCourses.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {boardCourses.map(c => (
                <CourseCard key={c.id} c={c} expandedId={expandedId} setExpandedId={setExpandedId} setSelectedCourse={setSelectedCourse} setShowCheckout={setShowCheckout} userInfo={userInfo} />
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Loading Courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans">
      <Toaster position="top-right" />



      {/* Top Search Strip */}
      <div className="bg-[#002147] py-5 px-4 w-full shadow-lg z-20">
        <div className="max-w-[750px] mx-auto flex h-[52px] relative">
          <div className="flex-1 relative flex items-center bg-white rounded-l-2xl overflow-hidden">
            <FiSearch className="text-slate-400 w-5 h-5 ml-6 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by class or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-5 text-[15px] font-bold text-[#002147] outline-none h-full bg-transparent placeholder-slate-400"
            />
          </div>
          <button className="bg-orange-500 text-white px-10 h-full text-[13px] font-black uppercase tracking-widest rounded-r-2xl hover:bg-orange-600 transition-all">
            Search
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6 pb-10">
        <div className="bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-sm flex flex-col md:flex-row h-auto min-h-[200px]">
          <div className="w-full md:w-[65%] p-8 flex flex-col justify-center border-r-0 md:border-r-2 border-orange-500 relative overflow-hidden bg-white">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 px-4 py-1 bg-orange-50 rounded-full w-fit border border-orange-100 shadow-sm">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Select Your Class</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#002147] mb-4 italic tracking-tighter leading-none uppercase">
                {activeBoardFilter ? `${activeBoardFilter} ` : 'MYE3-E-TUITION '}
                <span className="text-orange-500 not-italic">{activeBoardFilter ? 'TUITIONS' : 'ACADEMY'}</span>
              </h1>
              <p className="text-slate-500 font-bold italic text-sm max-w-xl mb-6 leading-relaxed">
                {activeBoardFilter 
                  ? `Specially curated courses for ${activeBoardFilter} students to achieve academic excellence.`
                  : "Explore our comprehensive online courses and start learning with expert tutors."}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100"><FiCheckCircle /> All Subjects</div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100"><FiCheckCircle /> Live Classes</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[35%] bg-slate-50 relative p-6 flex items-center justify-center"><StoreCarousel /></div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-32 space-y-12">
        {juniorCourses.length > 0 && (
          <section ref={juniorRef} className="scroll-mt-32 space-y-8">
            <div className="flex items-center gap-6">
              <div className="px-5 py-2 bg-[#002147] text-white rounded-2xl transform -skew-x-12"><h2 className="text-xl font-black italic tracking-tight uppercase leading-none skew-x-12">School Tuitions</h2></div>
              <div className="flex-1 h-[2px] bg-slate-100" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CLASS 6TH - 10TH</span>
            </div>
            {renderBoardGroups(juniorCourses)}
          </section>
        )}

        {interFirstYear.length > 0 && (
          <section ref={seniorRef} className="scroll-mt-32 space-y-8">
            <div className="flex items-center gap-6">
              <div className="px-5 py-2 bg-orange-500 text-white rounded-2xl transform -skew-x-12"><h2 className="text-xl font-black italic tracking-tight uppercase leading-none skew-x-12">Inter First Year</h2></div>
              <div className="flex-1 h-[2px] bg-slate-100" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CLASS 11TH</span>
            </div>
            {renderBoardGroups(interFirstYear)}
          </section>
        )}

        {interSecondYear.length > 0 && (
          <section className="scroll-mt-32 space-y-8">
            <div className="flex items-center gap-6">
              <div className="px-5 py-2 bg-indigo-600 text-white rounded-2xl transform -skew-x-12"><h2 className="text-xl font-black italic tracking-tight uppercase leading-none skew-x-12">Inter Second Year</h2></div>
              <div className="flex-1 h-[2px] bg-slate-100" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CLASS 12TH</span>
            </div>
            {renderBoardGroups(interSecondYear)}
          </section>
        )}
      </div>

      <AnimatePresence>
        {showCheckout && selectedCourse && (
          <div 
            onClick={() => setShowCheckout(false)}
            className="fixed inset-0 z-[2100] flex items-center justify-center p-4 backdrop-blur-2xl bg-[#002147]/60 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl cursor-default"
            >
              <div className="bg-[#f16126] p-8 text-white relative">
                 <button 
                   onClick={() => setShowCheckout(false)} 
                   className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-30 cursor-pointer"
                   aria-label="Close"
                 >
                   <FiX className="w-5 h-5 text-white" />
                 </button>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Finalize Enrollment</p>
                 <h3 className="text-2xl font-black uppercase italic tracking-tight">{selectedCourse.name}</h3>
              </div>
              <div className="p-8 space-y-5">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Select Duration</p>
                  {['oneMonth', 'threeMonths', 'sixMonths', 'twelveMonths'].map(dur => {
                    const labelMap = {
                      oneMonth: 'Monthly Access',
                      threeMonths: 'Quarterly (3 Months)',
                      sixMonths: 'Half-Yearly (6 Months)',
                      twelveMonths: 'Annual (12 Months)'
                    };
                    const price = selectedCourse.pricing?.[dur] || 0;
                    if (price === 0 && dur !== 'oneMonth') return null; // Don't show inactive tiers

                    const isSelected = selectedDuration === dur;

                    return (
                      <button
                        key={dur}
                        onClick={() => setSelectedDuration(dur)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${isSelected
                          ? 'border-[#002147] bg-[#f8fbff] shadow-md ring-1 ring-[#002147]/5'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-[#f16126] bg-[#f16126]' : 'border-slate-200 bg-white'
                            }`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="text-left">
                            <p className={`text-xs font-black uppercase tracking-tight italic ${isSelected ? 'text-[#002147]' : 'text-slate-500'}`}>
                              {labelMap[dur]}
                            </p>
                            {dur === 'twelveMonths' && <span className="text-[8px] font-black text-emerald-500 tracking-widest uppercase">Best Value</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-black italic tracking-tighter ${isSelected ? 'text-[#f16126]' : 'text-[#002147]'}`}>
                            ₹{price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button disabled={buyLoading} onClick={handlePayment} className="w-full bg-[#002147] text-white py-5 rounded-2xl font-black text-[13px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50">
                  {buyLoading ? 'Processing...' : <>Confirm & Pay <FiCreditCard className="w-5 h-5" /></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentStore;
