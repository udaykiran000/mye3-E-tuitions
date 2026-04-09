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
import logoImg from '../../assets/output-onlinepngtools.png';


const CourseCard = ({ c, setSelectedCourse, setSelectedDuration, setShowCheckout, userInfo }) => {
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
      whileHover={{ y: -5, scale: 1.02 }}
      className={`group bg-white p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full ${
        !isEligible ? 'opacity-70 blur-[0.5px]' : 'hover:border-orange-500/30 hover:shadow-xl shadow-sm border-slate-100'
      }`}
    >
      {/* Decorative Top Bar instead of full side bar for wider cards */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${isBundle ? 'bg-orange-500' : 'bg-[#002147]'} opacity-80`} />
      
      {/* Header: Logo & Price compact */}
      <div className="flex items-start justify-between mb-4 mt-2">
        <div className="w-10 h-10 bg-[#002147] rounded-[10px] flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-all">
          <img src={brandSymbol} alt="logo" className="w-[85%] h-[85%] object-contain drop-shadow" />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1.5">Tuition Fee</p>
          <p className="text-2xl font-black text-[#002147] tracking-tight leading-none">₹{(c.pricing?.oneMonth || c.price || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-5 flex-1">
        <div className="flex items-center gap-2.5 mb-2.5">
          <p className="text-[12px] font-black text-orange-600 uppercase tracking-widest leading-none">
            {Number(courseClass) === 11 ? 'Inter 1st Year' : Number(courseClass) === 12 ? 'Inter 2nd Year' : `Class ${courseClass}`}
          </p>
          {courseBoard && (
            <span className="px-2.5 py-1 bg-[#00142e] text-orange-400 text-[9px] border border-[#002147] shadow-[0_2px_10px_rgba(0,33,71,0.2)] font-black rounded uppercase tracking-widest">
              {courseBoard}
            </span>
          )}
        </div>
        <h3 className="text-base font-black text-[#002147] leading-snug tracking-tight mb-2 uppercase">{c.name}</h3>
        
        {/* Simplified Inline Subjects */}
        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed italic">
          <span className="text-emerald-500 font-bold not-italic">Includes:</span> {c.subjects && c.subjects.length > 0 ? c.subjects.map(s => s.name).join(', ') : 'All foundational subjects'}
        </p>
      </div>

      <div className="relative z-10 mt-auto">
        {isEligible ? (
            <button
              onClick={() => { 
                setSelectedCourse(c); 
                setSelectedDuration('oneMonth'); 
                setShowCheckout(true); 
              }}
              className="w-full bg-[#002147] text-white py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-colors shadow-md active:scale-95"
            >
              VIEW CLASS <FiArrowRight className="w-4 h-4" />
            </button>
        ) : (
          <div className="space-y-2">
            <button disabled className="w-full bg-slate-50 text-slate-400 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-not-allowed border border-dashed border-slate-200">
              RESTRICTED
            </button>
            <p className="text-[8px] text-center font-bold text-rose-400 uppercase tracking-widest">Only for {userClass || 'designated'} grade</p>
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
    <div className="relative w-full h-[140px] md:h-[240px] rounded-3xl bg-transparent flex items-center justify-center overflow-visible">
      {decorativeIcons.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 0.8, y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: item.delay }}
          className={`absolute ${item.pos} z-20 flex w-7 h-7 md:w-10 md:h-10 rounded-full ${item.bg} items-center justify-center shadow-sm border border-white md:scale-100`}
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
  const [activeInterYear, setActiveInterYear] = useState(11); // Default to First Year (Class 11)
  
  // Mobile Specific Filter State
  const [selectedMobileClass, setSelectedMobileClass] = useState('6');
  const [selectedMobileBoard, setSelectedMobileBoard] = useState('TS Board');

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boardCourses.map(c => (
                <CourseCard key={c.id} c={c} expandedId={expandedId} setExpandedId={setExpandedId} setSelectedCourse={setSelectedCourse} setSelectedDuration={setSelectedDuration} setShowCheckout={setShowCheckout} userInfo={userInfo} />
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
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate- pulse">Loading Courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans">
      <Toaster position="top-right" />



      {/* Top Search Strip */}
      <div className="bg-[#002147] py-4 md:py-5 px-3 md:px-4 w-full shadow-lg z-20">
        <div className="max-w-[750px] mx-auto flex h-[48px] md:h-[52px] relative">
          <div className="flex-1 relative flex items-center bg-white rounded-l-2xl overflow-hidden">
            <FiSearch className="text-slate-400 w-4 h-4 md:w-5 md:h-5 ml-4 md:ml-6 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search class or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-3 md:px-5 text-xs md:text-[15px] font-bold text-[#002147] outline-none h-full bg-transparent placeholder-slate-400"
            />
          </div>
          <button className="bg-orange-500 text-white px-5 md:px-10 h-full text-[11px] md:text-[13px] font-black uppercase tracking-widest rounded-r-2xl hover:bg-orange-600 transition-all">
            Search
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-6 pb-10">
        <div className="bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-sm flex flex-col md:flex-row h-auto min-h-[200px]">
          <div className="w-full md:w-[65%] p-8 flex flex-col justify-center border-r-0 md:border-r-2 border-orange-500 relative overflow-hidden bg-white">
            <div className="relative z-10">
              <div className="hidden md:flex items-center gap-2 mb-4 px-4 py-1 bg-orange-50 rounded-full w-fit border border-orange-100 shadow-sm">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Select Your Class</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-[#002147] mb-3 md:mb-4 italic md:not-italic tracking-tighter leading-none uppercase">
                <span className="md:hidden">MYE3 <span className="text-orange-500 not-italic">ACADEMY</span></span>
                <span className="hidden md:inline">
                  {activeBoardFilter ? `${activeBoardFilter} ` : 'MYE3-E-TUITION '}
                  <span className="text-orange-500 not-italic">{activeBoardFilter ? 'TUITIONS' : 'ACADEMY'}</span>
                </span>
              </h1>
              <p className="text-slate-500 font-bold italic text-xs md:text-sm max-w-xl mb-6 leading-relaxed">
                <span className="md:hidden">Explore our comprehensive online courses and start learning with expert tutors.</span>
                <span className="hidden md:inline">
                  {activeBoardFilter 
                    ? `Specially curated courses for ${activeBoardFilter} students to achieve academic excellence.`
                    : "Explore our comprehensive online courses and start learning with expert tutors."}
                </span>
              </p>
              <div className="hidden md:flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100"><FiCheckCircle /> All Subjects</div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100"><FiCheckCircle /> Live Classes</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[35%] bg-slate-50 relative p-6 flex items-center justify-center"><StoreCarousel /></div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-32 space-y-8">
        {/* Mobile Filter Navigation */}
        <div className="md:hidden space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          {/* Board Selector */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Board</p>
            <div className="flex flex-wrap gap-2">
              {['TS Board', 'AP Board', 'CBSE Board', 'ICSE Board'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedMobileBoard(b)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                    selectedMobileBoard === b 
                    ? 'bg-[#002147] text-white border-[#002147] shadow-md scale-105' 
                    : 'bg-white text-slate-600 border-slate-100 hover:border-orange-500/50'
                  }`}
                >
                  {b.replace(' Board', '')}
                </button>
              ))}
            </div>
          </div>

          {/* School Tuitions */}
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#002147]">School Tuitions</span>
                <div className="flex-1 h-[1px] bg-slate-100" />
             </div>
             <div className="flex flex-wrap gap-2">
                {['6', '7', '8', '9', '10'].map(cls => (
                  <button
                    key={cls}
                    onClick={() => setSelectedMobileClass(cls)}
                    className={`w-10 h-10 rounded-full text-xs font-black transition-all border flex items-center justify-center ${
                      selectedMobileClass === cls 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-lg scale-110' 
                      : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-orange-500/20'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
             </div>
          </div>

          {/* Intermediate */}
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#002147]">Intermediate</span>
                <div className="flex-1 h-[1px] bg-slate-100" />
             </div>
             <div className="flex gap-3">
                <button
                  onClick={() => setSelectedMobileClass('11')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedMobileClass === '11' 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg' 
                    : 'bg-[#002147] text-white border-[#002147]'
                  }`}
                >
                  First Year
                </button>
                <button
                  onClick={() => setSelectedMobileClass('12')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedMobileClass === '12' 
                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg' 
                    : 'bg-[#002147] text-white border-[#002147]'
                  }`}
                >
                  Second Year
                </button>
             </div>
          </div>
        </div>

        {/* Existing Listings (Conditional for Desktop/Mobile) */}
        <div className="hidden md:block space-y-12">

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

        {(interFirstYear.length > 0 || interSecondYear.length > 0) && (
          <div className="scroll-mt-32 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveInterYear(11)}
                  className={`px-8 py-3 rounded-2xl font-black italic tracking-tight uppercase transition-all shadow-md transform -skew-x-12 ${
                    activeInterYear === 11 ? 'bg-orange-500 text-white' : 'bg-[#002147] text-white hover:bg-orange-500'
                  }`}
                >
                  <span className="inline-block skew-x-12">First Year</span>
                </button>
                <button 
                  onClick={() => setActiveInterYear(12)}
                  className={`px-8 py-3 rounded-2xl font-black italic tracking-tight uppercase transition-all shadow-md transform -skew-x-12 ${
                    activeInterYear === 12 ? 'bg-orange-500 text-white' : 'bg-[#002147] text-white hover:bg-orange-500'
                  }`}
                >
                  <span className="inline-block skew-x-12">Second Year</span>
                </button>
              </div>
              <div className="hidden md:flex flex-1 h-[2px] bg-slate-100" />
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                {activeInterYear === 11 ? 'CLASS 11TH' : 'CLASS 12TH'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeInterYear}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
              >
                {activeInterYear === 11 ? renderBoardGroups(interFirstYear) : renderBoardGroups(interSecondYear)}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

        {/* Mobile Filtered Listing */}
        <div className="md:hidden space-y-8">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                Showing {selectedMobileBoard} - Class {selectedMobileClass}
              </span>
              <div className="flex-1 h-[1px] bg-slate-100" />
           </div>
           
           {finalFiltered.filter(c => {
             const cClass = String(c.classLevel || c.className || '').replace(/\D/g, '');
             const cBoard = (c.board || 'TS Board').toUpperCase().trim();
             const fBoard = selectedMobileBoard.toUpperCase().trim();
             return (cClass === selectedMobileClass || (selectedMobileClass === '11' && c.classLevel === '11') || (selectedMobileClass === '12' && c.classLevel === '12')) && 
                    (cBoard === fBoard || cBoard === fBoard.replace(' BOARD', ''));
           }).length > 0 ? (
             <div className="grid grid-cols-1 gap-6">
                {finalFiltered.filter(c => {
                  const cClass = String(c.classLevel || c.className || '').replace(/\D/g, '');
                  const cBoard = (c.board || 'TS Board').toUpperCase().trim();
                  const fBoard = selectedMobileBoard.toUpperCase().trim();
                  return cClass === selectedMobileClass && (cBoard === fBoard || cBoard === fBoard.replace(' BOARD', ''));
                }).map(c => (
                  <CourseCard key={c.id} c={c} setSelectedCourse={setSelectedCourse} setSelectedDuration={setSelectedDuration} setShowCheckout={setShowCheckout} userInfo={userInfo} />
                ))}
             </div>
           ) : (
             <div className="bg-slate-50 p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                <FiBook className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No courses found for this selection</p>
             </div>
           )}
        </div>
      </div>

      <AnimatePresence>
        {showCheckout && selectedCourse && (
          <div 
            key="checkout-overlay"
            onClick={() => setShowCheckout(false)}
            className="fixed inset-0 z-[2100] flex items-center justify-center p-0 md:p-8 backdrop-blur-2xl bg-[#002147]/80 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()}
              className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl bg-white rounded-none md:rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-default flex flex-col md:flex-row"
            >
              {/* Left Side: Summary & Logo */}
              <div className="w-full md:w-[45%] bg-[#002147] p-4 md:p-12 text-white relative flex flex-col items-center justify-center border-b-[6px] md:border-b-0 md:border-r-[8px] border-orange-500 overflow-y-auto">
                 {/* Close button for Mobile only */}
                 <button 
                   onClick={() => setShowCheckout(false)} 
                   className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 md:hidden flex items-center justify-center hover:bg-white/20 transition-colors z-30 cursor-pointer"
                   aria-label="Close"
                 >
                   <FiX className="w-4 h-4 text-white" />
                 </button>

                 <img src={logoImg} alt="Mye3 Logo" className="h-20 md:h-32 object-contain mb-4 md:mb-8 filter drop-shadow-xl" />
                 
                 <p className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.4em] mb-1.5 md:mb-4 text-orange-500">Summary</p>
                 <h3 className="text-base md:text-3xl font-black uppercase tracking-tight text-center relative w-full mb-3 md:mb-8 leading-[1.1]">
                    <span className="relative z-10">{selectedCourse.name}</span>
                 </h3>
                 
                 <div className="w-full flex justify-center">
                    <div className="flex flex-wrap gap-1.5 justify-center max-w-[90%]">
                      {selectedCourse.subjects && selectedCourse.subjects.length > 0 ? selectedCourse.subjects.map((sub, i) => (
                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[9px] md:text-[11px] font-bold tracking-widest text-emerald-400 border border-emerald-500/30 shadow-inner">{sub.name}</span>
                      )) : <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] md:text-[11px] font-bold tracking-widest text-emerald-400 border border-emerald-500/30 shadow-inner">All Foundation</span>}
                    </div>
                 </div>
              </div>

              {/* Right Side: Payment Form */}
              <div className="w-full md:w-[55%] p-4 md:p-12 space-y-3 md:space-y-8 overflow-y-auto bg-slate-50 md:bg-white relative flex flex-col justify-center">
                 {/* Close button for Desktop only */}
                 <button 
                   onClick={() => setShowCheckout(false)} 
                   className="absolute top-8 right-8 w-12 h-12 rounded-full bg-slate-100 hidden md:flex items-center justify-center hover:bg-slate-200 transition-colors z-30 cursor-pointer shadow-sm"
                   aria-label="Close"
                 >
                   <FiX className="w-6 h-6 text-slate-400" />
                 </button>

                 <div className="space-y-2 md:space-y-4">
                    <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-[#002147] mb-1 md:mb-2">Select Duration</p>
                   {['oneMonth', 'threeMonths', 'sixMonths', 'twelveMonths'].map(dur => {
                     const labelMap = {
                       oneMonth: 'Monthly Access',
                       threeMonths: 'Quarterly (3 Months)',
                       sixMonths: 'Half-Yearly (6 Months)',
                       twelveMonths: 'Annual (12 Months)'
                     };
                     let price = selectedCourse.pricing?.[dur] || 0;
                     if (price === 0) {
                       const basePrice = selectedCourse.pricing?.oneMonth || selectedCourse.price || 500;
                       if (dur === 'oneMonth') price = basePrice;
                       if (dur === 'threeMonths') price = Math.round((basePrice * 3) * 0.95);
                       if (dur === 'sixMonths') price = Math.round((basePrice * 6) * 0.90);
                       if (dur === 'twelveMonths') price = Math.round((basePrice * 12) * 0.85);
                     }
                     if (price === 0) return null; // Fallback if no price available

                     const isSelected = selectedDuration === dur;

                     return (
                       <button
                         key={dur}
                         onClick={() => setSelectedDuration(dur)}
                         className={`w-full flex items-center justify-between p-2.5 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all group ${isSelected
                           ? 'border-[#002147] bg-[#f8fbff] shadow-md ring-1 ring-[#002147]/5'
                           : 'border-slate-100 bg-white hover:border-slate-200'
                           }`}
                       >
                         <div className="flex items-center gap-3">
                           <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-[#f16126] bg-[#f16126]' : 'border-slate-200 bg-white'
                             }`}>
                             {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                           </div>
                           <div className="text-left">
                             <p className={`text-[10px] md:text-xs font-black uppercase tracking-tight italic ${isSelected ? 'text-[#002147]' : 'text-slate-500'}`}>
                               {labelMap[dur]}
                             </p>
                             {dur === 'twelveMonths' && <span className="text-[8px] md:text-[10px] font-black text-emerald-500 tracking-widest uppercase bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 ml-2">Best Value</span>}
                           </div>
                         </div>
                         <div className="text-right">
                           <p className={`text-lg md:text-2xl font-black italic tracking-tighter ${isSelected ? 'text-[#f16126]' : 'text-[#002147]'}`}>
                             ₹{price.toLocaleString()}
                           </p>
                         </div>
                       </button>
                     );
                   })}
                 </div>
                 <button disabled={buyLoading} onClick={handlePayment} className="w-full bg-gradient-to-r from-[#002147] to-[#00152e] text-white py-3 md:py-5 rounded-xl md:rounded-2xl font-black text-[11px] md:text-[15px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:shadow-[0_10px_30px_rgba(0,33,71,0.4)] transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-2 md:mt-8">
                   {buyLoading ? 'Processing...' : <>Confirm & Pay <FiCreditCard className="w-4 h-4 md:w-6 md:h-6" /></>}
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
