import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  Clock,
  ChevronRight,
  Zap,
  Calendar,
  Star,
  Trophy,
  MonitorPlay,
  Play,
  CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SessionRecapModal from '../../components/student/SessionRecapModal';
import logoImg from '../../assets/output-onlinepngtools.png';
import { FiX, FiCreditCard } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { setCredentials } from '../../store/slices/authSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [learning, setLearning] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recapModal, setRecapModal] = useState({ open: false, session: null });

  // Checkout States
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [matchingCourse, setMatchingCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [buyLoading, setBuyLoading] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('oneMonth');

  const fetchData = useCallback(async () => {
    try {
      const [lRes, aRes] = await Promise.all([
        axios.get('/student/my-learning'),
        axios.get('/student/live-alerts')
      ]);
      setLearning(lRes.data || []);
      setLiveAlerts(aRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data');
      setLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const board = userInfo?.board || '';
      const { data } = await axios.get(`/student/catalog${board ? `?board=${board}` : ''}`);
      const catalog = data || [];
      setCourses(catalog);

      // Find matching course for this student
      const userClass = userInfo?.className?.replace(/\D/g, '') || '';
      const userBoard = userInfo?.board?.toUpperCase().trim() || '';
      
      const match = catalog.find(c => {
        const courseClass = String(c.classLevel || c.className || '').replace(/\D/g, '') || '';
        const studentBoard = userBoard.replace(' BOARD', '');
        const courseBoard = c.board?.toUpperCase().trim().replace(' BOARD', '') || '';
        return userClass === courseClass && (courseBoard === studentBoard || !courseBoard);
      });
      setMatchingCourse(match);
    } catch (error) {
      console.error('Error fetching catalog');
    }
  }, [userInfo]);

  useEffect(() => {
    fetchData();
    fetchCourses();
    window.addEventListener('refresh-student-data', fetchData);
    return () => window.removeEventListener('refresh-student-data', fetchData);
  }, [fetchData, fetchCourses]);

  const handlePayment = async () => {
    if (!selectedCourse) return;
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

      const updatedUser = {
        ...userInfo,
        activeSubscriptions: [
          ...(userInfo.activeSubscriptions || []),
          {
            name: selectedCourse.className || selectedCourse.name,
            type: selectedCourse.type || 'bundle',
            subscriptionType: selectedDuration,
            expiryDate: new Date(Date.now() + (selectedDuration === 'oneMonth' ? 30 : selectedDuration === 'threeMonths' ? 90 : 365) * 86400000),
            referenceId: selectedCourse._id || selectedCourse.id,
            purchaseDate: new Date()
          }
        ]
      };
      dispatch(setCredentials(updatedUser));

      setTimeout(() => {
        setBuyLoading(false);
        setShowCheckout(false);
        fetchData(); // Refresh local list
      }, 1500);
    } catch (error) {
      toast.error('Payment Failed');
      setBuyLoading(false);
    }
  };

  const openCheckout = () => {
    if (matchingCourse) {
      setSelectedCourse(matchingCourse);
      setSelectedDuration('oneMonth'); // Default to monthly
      setShowCheckout(true);
    } else {
      toast.error('Class pricing not available');
    }
  };

  const hasSubscriptions = (learning.length > 0) || (userInfo?.activeSubscriptions?.length > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-8 p-4 md:p-6 md:pt-0">

      {/* 0. SUBSCRIPTION EXPIRY WARNING */}
      {(() => {
        const expiringSoon = learning.filter(sub => {
          const days = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days <= 7 && days > 0;
        });
        if (expiringSoon.length === 0) return null;
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-900/5"
          >
            <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Account Alert</p>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                  Your access for <span className="text-orange-600">{expiringSoon[0].name}</span> expires soon!
                </h3>
              </div>
            </div>
            <Link to="/student/courses" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95">Renew Now</Link>
          </motion.div>
        );
      })()}

      {/* 1. STATE CARDS (STATS AT TOP) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { icon: Star, label: 'LEARNING POINTS', val: '12,450', color: 'bg-indigo-50 text-[#002147]' },
          { icon: Trophy, label: 'Certificates', val: '08', color: 'bg-emerald-50 text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col justify-between group hover:border-[#f16126]/20 transition-all shadow-md relative overflow-hidden">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-[#002147] tracking-tight">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. MAIN CONTENT HUB */}
      {!hasSubscriptions && !loading ? (
        <div className="pt-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[280px] bg-white rounded-[40px] border border-slate-100 shadow-2xl p-4 relative overflow-hidden group flex flex-col"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f16126]" />
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#f16126] text-white font-black text-[9px] uppercase tracking-widest rounded-bl-xl z-10">All Subjects</div>
            <div className="flex items-start justify-between mb-4 mt-1">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center p-2.5 border border-slate-100 shadow-sm">
                <img src={logoImg} alt="logo" className="w-full h-full object-contain" />
              </div>
              <div className="text-right pt-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-0.5">Monthly Fee</p>
                <p className="text-2xl font-black text-[#002147] italic tracking-tighter leading-none tabular-nums">
                  ₹{(matchingCourse?.pricing?.oneMonth || matchingCourse?.price || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mb-4 flex-1">
              <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full w-fit border border-orange-200 shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest">{userInfo?.board} • Class Bundle</span>
              </div>
              <h3 className="text-[24px] md:text-[26px] font-black text-[#002147] tracking-tighter uppercase italic leading-none mb-1">{userInfo?.className}</h3>
              <div className="mt-6 space-y-3">
                {matchingCourse?.subjects && matchingCourse.subjects.length > 0 ? (
                   matchingCourse.subjects.slice(0, 4).map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-600">
                      <div className="w-1.5 h-1.5 bg-[#f16126] rounded-full" />
                      <span className="text-[11px] font-black italic uppercase tracking-wider text-slate-500">{sub.name}</span>
                    </div>
                  ))
                ) : (
                  ['Mathematics', 'Science (PS/NS)', 'Social Studies', 'English'].map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-600">
                      <div className="w-1.5 h-1.5 bg-[#f16126] rounded-full" />
                      <span className="text-[11px] font-black italic uppercase tracking-wider text-slate-500">{sub}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-50">
              <button
                onClick={openCheckout}
                className="w-full bg-[#002147] text-white py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#f16126] transition-all shadow-2xl active:scale-95 group/btn"
              >
                Enroll Now <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </motion.div>
          <div className="max-w-md w-full bg-white/40 backdrop-blur-md p-6 rounded-[32px] border-2 border-dashed border-slate-200 text-center mt-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Hey {userInfo?.username || userInfo?.name}! Enroll in your class to access full features.</p>
          </div>
        </div>
      ) : hasSubscriptions ? (
        <div className="space-y-8">
          {/* ENROLLED HERO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-[48px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Access Active
                </div>
                <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">MY <span className="text-[#f16126]">DASHBOARD</span></h2>
                <p className="text-slate-300/80 font-bold text-xs md:text-sm uppercase tracking-[0.2em] italic max-w-lg">Access your live classes and schedule below.</p>
              </div>
              <Link to="/student/live-schedule" className="w-full md:w-auto px-12 py-6 bg-[#f16126] text-white rounded-[28px] font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-white hover:text-[#002147] transition-all flex items-center justify-center gap-4 active:scale-95 group/live relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                Start Live Session <Play className="w-5 h-5 fill-current ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* ACTIVE PLAN SUMMARY */}
          <div className="bg-white p-8 md:p-10 rounded-[48px] border-2 border-slate-50 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group shadow-xl gap-8 transition-all hover:border-[#002147]/10">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none hidden md:block">
              <MonitorPlay className="w-48 h-48 text-[#002147]" />
            </div>
            <div className="text-center md:text-left flex-1 relative z-10">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Zap className="w-4 h-4 text-orange-500 fill-current" />
                <p className="text-[10px] font-black text-[#002147] uppercase tracking-[0.25em]">Active Subscription</p>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-[#002147] uppercase italic tracking-tighter leading-none mb-3">{learning[0]?.originalBundleName || learning[0]?.name || 'My Subscription'}</h3>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Valid Until</div>
                <p className="text-sm font-black text-[#002147] tabular-nums tracking-tight">{learning[0]?.expiryDate ? new Date(learning[0].expiryDate).toLocaleDateString('en-GB') : 'Full Session'}</p>
              </div>
            </div>
            <Link to="/student/notes" className="w-full md:w-auto px-12 py-6 bg-[#002147] text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f16126] transition-all shadow-2xl text-center active:scale-95 relative overflow-hidden group/notes">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/notes:opacity-100 transition-opacity" />
              VIEW NOTES
            </Link>
          </div>

          {/* SCHEDULE & RECAPS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* SCHEDULED */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#002147] flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#f16126]" /> Scheduled Class
                </h3>
                <Link to="/student/live-schedule" className="text-[10px] font-black text-indigo-600 hover:text-orange-500 transition-colors uppercase tracking-widest">View All</Link>
              </div>
              <div className="space-y-5">
                {liveAlerts.filter(s => s.status === 'upcoming').length > 0 ? (
                  liveAlerts.filter(s => s.status === 'upcoming').slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-7 bg-white rounded-[32px] border border-slate-50 hover:border-orange-500/20 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-orange-50 text-[#f16126] rounded-2xl flex items-center justify-center font-black text-[13px] italic group-hover:bg-[#f16126] group-hover:text-white transition-all shadow-sm">
                          {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-[#002147] text-lg leading-none uppercase italic group-hover:text-orange-600 transition-colors">{s.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">{new Date(s.startTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-[#f16126] group-hover:translate-x-2 transition-all duration-500" />
                    </div>
                  ))
                ) : <div className="p-16 bg-white border border-slate-50 rounded-[32px] text-center uppercase text-[10px] font-black text-slate-400 italic tracking-[0.3em] shadow-sm">No classes scheduled.</div>}
              </div>
            </div>

            {/* RECAPS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#002147] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Recent Recaps
                </h3>
              </div>
              <div className="space-y-5">
                {liveAlerts.filter(s => s.status === 'ended').length > 0 ? (
                  liveAlerts.filter(s => s.status === 'ended').slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-7 bg-white rounded-[32px] border border-slate-50 hover:border-emerald-500/20 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xs italic group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                          <MonitorPlay className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-[#002147] text-lg leading-none uppercase italic group-hover:text-emerald-600 transition-colors">{s.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Recording Ready</p>
                        </div>
                      </div>
                      <Link to="/student/notes" className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-500 group-hover:shadow-md"><ChevronRight className="w-6 h-6" /></Link>
                    </div>
                  ))
                ) : <div className="p-16 bg-white border border-slate-50 rounded-[32px] text-center uppercase text-[10px] font-black text-slate-400 italic tracking-[0.3em] shadow-sm">No recent sessions.</div>}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <SessionRecapModal
        isOpen={recapModal.open}
        onClose={() => setRecapModal({ open: false, session: null })}
        session={recapModal.session}
      />

      <Toaster position="top-right" />

      <AnimatePresence>
        {showCheckout && selectedCourse && (
          <div
            className="fixed inset-0 z-[2100] flex items-center justify-center p-4 backdrop-blur-2xl bg-[#002147]/60"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[40px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#f16126] p-8 text-white relative">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-colors z-[60] cursor-pointer"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Finalize Enrollment</p>
                <h3 className="text-2xl font-black uppercase italic tracking-tight uppercase tracking-tight">{selectedCourse.className || selectedCourse.name}</h3>
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
                    if (price === 0 && dur !== 'oneMonth') return null;

                    const isSelected = selectedDuration === dur;

                    return (
                      <button
                        key={dur}
                        onClick={() => setSelectedDuration(dur)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${isSelected
                          ? 'border-[#002147] bg-[#f8fbff] shadow-md ring-1 ring-[#002147]/5'
                          : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
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

export default StudentDashboard;
