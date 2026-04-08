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

const CourseDetailModal = ({ course, isOpen, onClose, onEnroll }) => {
  if (!course) return null;

  const mediums = ['CBSE', 'State Board', 'ICSE'];
  const [selectedMedium, setSelectedMedium] = useState('CBSE');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#002147]/70 backdrop-blur-md"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[24px] md:rounded-[40px] shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button Mobile */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 md:hidden z-20 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-lg"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>

            {/* Left Column: Summary */}
            <div className="w-full md:w-[320px] bg-[#002147] p-6 md:p-8 text-white flex flex-col justify-between shrink-0">
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center p-2.5 md:p-3 backdrop-blur-xl border border-white/10 mb-4 md:mb-8">
                  <img src={brandSymbol} alt="brand" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                
                <div className="px-4 py-1.5 md:px-5 md:py-1.5 bg-orange-500 rounded-full w-fit mb-4 md:mb-6 shadow-lg shadow-orange-500/20">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">Class Overview</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-tight mb-1 md:mb-2 uppercase">{course.name}</h2>
                <p className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-widest">Academic Excellence Program</p>
                
                <div className="mt-8 md:mt-12 space-y-4 md:space-y-6 flex md:block gap-6">
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Package</p>
                    <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-orange-500">₹{course.price}</p>
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Package</p>
                    <p className="text-sm md:text-lg font-black italic mt-1">12 Months Access</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <FiX className="w-4 h-4" /> Close Window
              </button>
            </div>

            {/* Right Column: Interactive Details */}
            <div className="flex-1 p-6 md:p-12 overflow-y-visible md:overflow-y-auto custom-scrollbar">
              {/* Close Button Desktop */}
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 hidden md:flex w-10 h-10 rounded-full bg-slate-50 items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-slate-400" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Section 1: Medium Selection Dropdown */}
                <div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                    <FiLayers className="w-4 h-4 text-orange-500" /> Choose Medium
                  </h3>
                  <div className="relative">
                    <select
                      value={selectedMedium}
                      onChange={(e) => setSelectedMedium(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-[13px] font-black uppercase tracking-widest text-[#002147] outline-none appearance-none cursor-pointer focus:border-orange-500 transition-all"
                    >
                      {mediums.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                      <FiLayers className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                      <FiMonitor className="w-4 h-4 text-orange-500" /> Learning Modes
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600"><FiCalendar className="w-4 h-4" /></div>
                        <p className="text-[11px] font-black text-[#002147] uppercase italic">Live Classes</p>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600"><FiShield className="w-4 h-4" /></div>
                        <p className="text-[11px] font-black text-[#002147] uppercase italic">Mentorship</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Syllabus Side-by-Side */}
                <div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                    <FiBook className="w-4 h-4 text-orange-500" /> Course Syllabus
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {course.subjects?.map((sub, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                        <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-[10px] font-bold text-[#002147] uppercase tracking-tight">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 md:mt-10 bg-[#002147] rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
                <div className="text-center sm:text-left">
                    <p className="text-white font-black italic tracking-tight uppercase leading-none text-sm md:text-base">Complete Course</p>
                    <p className="text-[8px] md:text-[9px] text-indigo-300 font-bold uppercase tracking-widest mt-1">Full Curriculum Included</p>
                </div>
                <button
                  onClick={() => onEnroll(course)}
                  className="w-full sm:w-auto bg-orange-500 text-white px-8 md:px-10 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[11px] md:text-[12px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 md:gap-3 hover:bg-white hover:text-[#002147] transition-all group/proceed shadow-xl shadow-orange-500/20"
                >
                  Confirm <FiArrowRight className="w-4 h-4 group-hover/proceed:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CourseCard = ({ c, expandedId, setExpandedId, setSelectedCourse, setShowCheckout, userInfo, onDetailView }) => {
  const isBundle = c.type === 'bundle';
  const isExpanded = expandedId === c.id;

  // Normalize for comparison
  // Normalize for comparison
  const userClass = userInfo?.className?.replace(/\D/g, '') || '';
  const courseClass = String(c.classLevel || c.className || '').replace(/\D/g, '') || '';
  const userBoard = userInfo?.board?.toUpperCase().trim() || '';
  const courseBoard = c.board?.toUpperCase().trim() || '';

  // If not logged in, show everything as eligible for viewing/exploring
  const isEligible = !userInfo || (userClass === courseClass && (!courseBoard || !userBoard || courseBoard === userBoard));

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`group bg-white rounded-3xl border transition-all duration-300 flex flex-col p-4 relative overflow-hidden ${!isEligible ? 'opacity-75' : ''} ${isExpanded ? 'border-orange-500 shadow-xl' : 'border-slate-100 hover:border-orange-500/30 hover:shadow-2xl shadow-sm'}`}
    >
      {/* Brand Bar */}
      <div className={`absolute top-0 left-0 w-1 h-full ${isBundle ? 'bg-orange-500 shadow-[0_0_15px_rgba(241,97,38,0.4)]' : 'bg-[#002147]'}`} />
      
      {!isEligible && (
        <div className="absolute inset-0 bg-slate-50/10 z-[5] pointer-events-none" />
      )}

      {isBundle && (
        <div className="absolute top-0 right-0 px-5 py-2 bg-orange-500 text-white font-black text-[9px] uppercase tracking-widest rounded-bl-xl shadow-md z-10">
          All Subjects
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-[#002147] rounded-xl flex items-center justify-center p-2.5 group-hover:scale-105 transition-all duration-300 shadow-sm relative">
          <img src={brandSymbol} alt="logo" className="w-full h-full object-contain" />
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">From</p>
          <p className="text-xl font-black text-[#002147] italic tracking-tighter leading-none">₹{(c.pricing?.oneMonth || c.price || 0).toLocaleString()}</p>
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
        <div className="mt-4 space-y-2">
          {(c.subjects || []).slice(0, 3).map((sub, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-600">
              <FiCheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
              <span className="text-[10px] font-bold italic uppercase tracking-tight">{sub.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-50 space-y-3">
        {isEligible ? (
          <div className="flex gap-3">
             <button 
               onClick={() => { setSelectedCourse(c); setShowCheckout(true); }}
               className="flex-1 bg-[#002147] text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg active:scale-95 group/buy"
             >
               Enroll <FiArrowRight className="w-4 h-4 group-hover/buy:translate-x-1 transition-transform" />
             </button>
             <button 
               onClick={() => onDetailView(c)}
               className="px-4 bg-slate-50 text-[#002147] rounded-xl border border-slate-100 hover:bg-slate-100 transition-all"
             >
               <FiMonitor className="w-4 h-4" />
             </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button disabled className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] cursor-not-allowed border border-slate-200">
               Not Eligible
            </button>
            <p className="text-[8px] text-center font-bold text-rose-400 uppercase tracking-widest italic">Only for Grade {userClass} students</p>
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('oneMonth');

  // Helper to format board name from URL (e.g., 'ts-board' -> 'TS Board')
  const getFormattedBoard = (slug) => {
    if (!slug) return null;
    return slug.split('-').map(word => word === 'board' ? 'Board' : word.toUpperCase()).join(' ');
  };
  const activeBoardFilter = getFormattedBoard(boardName);

  const juniorRef = useRef(null);
  const seniorRef = useRef(null);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/student/catalog');
      let baseCourses = [];
      if (!data || data.length === 0) {
        baseCourses = [
          { id: 'c6', name: 'Class 6 - All Subjects', classLevel: '6', type: 'bundle', price: 999, subjects: [{name: 'Maths'}, {name: 'Science'}, {name: 'English'}] },
          { id: 'c7', name: 'Class 7 - All Subjects', classLevel: '7', type: 'bundle', price: 999, subjects: [{name: 'Maths'}, {name: 'Science'}, {name: 'English'}] },
          { id: 'c8', name: 'Class 8 - All Subjects', classLevel: '8', type: 'bundle', price: 1199, subjects: [{name: 'Maths'}, {name: 'Physics'}, {name: 'Chemistry'}] },
          { id: 'c9', name: 'Class 9 - All Subjects', classLevel: '9', type: 'bundle', price: 1499, subjects: [{name: 'Maths'}, {name: 'Physics'}, {name: 'Chemistry'}] },
          { id: 'c10', name: 'Class 10 - All Subjects', classLevel: '10', type: 'bundle', price: 1499, subjects: [{name: 'Maths'}, {name: 'Physics'}, {name: 'Chemistry'}] },
          { id: 'c11', name: 'Class 11 - Subjects', classLevel: '11', type: 'subject', price: 999, subjects: [{name: 'Physics'}, {name: 'Chemistry'}, {name: 'Maths'}] },
          { id: 'c12', name: 'Class 12 - Subjects', classLevel: '12', type: 'subject', price: 999, subjects: [{name: 'Physics'}, {name: 'Chemistry'}, {name: 'Maths'}] },
        ];
      } else {
        baseCourses = data;
      }

      // Replicate courses across all boards to populate the UI fully
      const allBoards = ['TS Board', 'AP Board', 'CBSE Board', 'ICSE Board'];
      const populatedCourses = [];
      
      // Get unique prototypes to copy from (one for each unique course name)
      const prototypes = {};
      baseCourses.forEach(c => {
        const uniqueName = c.name?.trim().toLowerCase();
        if (uniqueName && !prototypes[uniqueName]) {
          prototypes[uniqueName] = c;
        }
      });

      // For every board, create a full set of courses
      allBoards.forEach(board => {
        Object.values(prototypes).forEach(proto => {
           populatedCourses.push({
             ...proto,
             id: `${proto._id || proto.id}-${board}`,
             _id: `${proto._id || proto.id}-${board}`, // Ensure unique key
             board: board
           });
        });
      });

      const sorted = populatedCourses.sort((a, b) => parseInt(a.classLevel?.toString().replace(/\D/g,'') || '0') - parseInt(b.classLevel?.toString().replace(/\D/g,'') || '0'));
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
         const courseBoard = c.board?.toUpperCase().trim() || '';
         return userClass === courseClass && (courseBoard === userBoard || !courseBoard);
      });

      if (match) {
        setSelectedCourse(match);
        setShowCheckout(true);
        // Clean up URL to prevent repeat triggers on reload
        window.history.replaceState({}, '', '/student/courses');
      }
    }
  }, [location, loading, courses, userInfo]);

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setShowDetailModal(false);
    setShowCheckout(true);
  };

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
        const cBoard = c.board || 'TS Board';
        return cBoard.toUpperCase().trim() === b.toUpperCase().trim() || 
               cBoard.toUpperCase().trim() === baseBoard.toUpperCase().trim();
      });
      // Always add the board to grouped, even if empty, to ensure all boards are shown
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
              <CourseCard key={c.id} c={c} expandedId={expandedId} setExpandedId={setExpandedId} setSelectedCourse={setSelectedCourse} setShowCheckout={setShowCheckout} userInfo={userInfo} onDetailView={(course) => { setSelectedCourse(course); setShowDetailModal(true); }} />
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
      
      <CourseDetailModal 
        course={selectedCourse} 
        isOpen={showDetailModal} 
        onClose={() => setShowDetailModal(false)}
        onEnroll={handleEnroll}
      />

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
              <div className="flex items-center gap-2 mb-4 px-4 py-1 bg-orange-50 rounded-full w-fit border border-orange-100">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Admissions Open 2026</span>
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
                   className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-30"
                 >
                   <FiX className="w-5 h-5 text-white" />
                 </button>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Finalize Enrollment</p>
                 <h3 className="text-2xl font-black uppercase italic tracking-tight">{selectedCourse.name}</h3>
              </div>
              <div className="p-8 space-y-6">
                 <div className="flex gap-2 w-full mb-2 bg-slate-100 p-1 rounded-lg">
                    {['oneMonth', 'threeMonths', 'sixMonths', 'twelveMonths'].map(dur => (
                      <button key={dur} onClick={() => setSelectedDuration(dur)} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${selectedDuration === dur ? 'bg-white shadow-sm text-[#f16126]' : 'text-slate-500'}`}>
                        {dur.replace('Months', ' M').replace('one', '1 ')}
                      </button>
                    ))}
                 </div>
                 <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">Course Fee</span>
                    <span className="text-2xl font-black text-[#002147] italic">₹{selectedCourse.pricing?.[selectedDuration] || selectedCourse.price || 0}</span>
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
