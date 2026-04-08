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
  CheckCircle2,
  ArrowRight
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

  if (loading) {
    return (
      <div className="space-y-8 p-4 md:p-6 lg:p-10 animate-pulse bg-slate-50/10 min-h-screen">
        <div className="h-32 bg-slate-100 rounded-[40px] border border-slate-50" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[32px]" />)}
        </div>
        <div className="h-[400px] bg-slate-100 rounded-[48px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 p-4 md:p-6 lg:p-10 bg-[#f8fbff]/50 min-h-screen">
      <Toaster position="top-right" />

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
            className="bg-orange-50 border-2 border-orange-200 rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-900/5"
          >
            <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
              <div className="w-16 h-16 bg-[#f16126] rounded-3xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] italic">Access Alert</p>
                <h3 className="text-xl md:text-2xl font-black text-[#002147] uppercase tracking-tight italic leading-none">
                  Your access for <span className="text-[#f16126]">{expiringSoon[0].name}</span> expires soon!
                </h3>
              </div>
            </div>
            <Link to="/student/courses" className="px-10 py-5 bg-[#002147] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#f16126] transition-all shadow-xl active:scale-95">Renew Immediately</Link>
          </motion.div>
        );
      })()}

      {/* 1. STATE CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Star, label: 'Learning Pts', val: '12,450', color: 'bg-indigo-50 text-[#002147]', border: 'group-hover:border-indigo-200' },
          { icon: Trophy, label: 'Certificates', val: '08', color: 'bg-emerald-50 text-emerald-600', border: 'group-hover:border-emerald-200' },
          { icon: Clock, label: 'Class Hours', val: '142h', color: 'bg-orange-50 text-orange-600', border: 'group-hover:border-orange-200' },
          { icon: Zap, label: 'Active Streak', val: '12 Days', color: 'bg-rose-50 text-rose-600', border: 'group-hover:border-rose-200' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-[36px] border border-slate-50 flex flex-col justify-between group transition-all shadow-sm hover:shadow-xl relative overflow-hidden ${stat.border}`}>
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 duration-500`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-xl md:text-2xl font-black text-[#002147] tracking-tighter italic leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. MAIN HUB */}
      {!hasSubscriptions ? (
        <div className="space-y-10">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-[#002147] rounded-[56px] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl border-b-[12px] border-indigo-600/10"
           >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f16126] rounded-full blur-[140px] -mr-64 -mt-64 opacity-10 pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                 <div className="flex-1 space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/10 text-[#f16126] rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                       Restricted Mode
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">Unlock your <br/><span className="text-[#f16126]">Academic Future</span></h2>
                    <p className="text-indigo-200/60 font-bold text-xs md:text-sm uppercase tracking-[0.3em] italic max-w-xl leading-relaxed">Join your specialized class bubble today to access live sessions and strategy notes.</p>
                 </div>
                 
                 <div className="w-full lg:w-[340px] bg-white rounded-[44px] p-8 text-slate-900 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                    <div className="flex justify-between items-start mb-8">
                       <img src={logoImg} className="h-10 object-contain" alt="logo" />
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Entry At</p>
                          <p className="text-2xl font-black text-[#002147] italic tracking-tighter leading-none tabular-nums">
                             ₹{(matchingCourse?.pricing?.oneMonth || matchingCourse?.price || 200).toLocaleString()}
                          </p>
                       </div>
                    </div>
                    <div className="space-y-5 mb-10">
                       <h4 className="text-xl font-black uppercase italic text-[#002147] tracking-tight">{userInfo?.className || 'Class Bundle'}</h4>
                       <div className="space-y-3">
                          {['Live Daily Classes', 'Full Subject Notes', 'Recorded Recaps', 'Weekly Mock Tests'].map((item, i) => (
                             <div key={i} className="flex items-center gap-4 group/item">
                                <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center">
                                   <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                </div>
                                <span className="text-[11px] font-black uppercase italic text-slate-500 tracking-wide">{item}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                    <button 
                      onClick={openCheckout}
                      className="w-full py-6 bg-[#002147] text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-[#f16126] transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95 group/btn"
                    >
                       Enroll Now <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </div>
           </motion.div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Live Mentorship', desc: 'Real-time doubt clearing with top faculty.', icon: MonitorPlay, bg: 'bg-indigo-50/50', iconColor: 'text-[#002147]' },
                { title: 'Full Curriculum', desc: 'Specially targeted for Board Excellence.', icon: Zap, bg: 'bg-orange-50/50', iconColor: 'text-[#f16126]' },
                { title: 'Smart Analytics', desc: 'Track your growth and learning speed.', icon: Trophy, bg: 'bg-emerald-50/50', iconColor: 'text-emerald-500' }
              ].map((box, i) => (
                <div key={i} className="bg-white p-10 rounded-[52px] border border-slate-50 shadow-sm hover:shadow-xl transition-all text-center space-y-6 group">
                   <div className={`w-16 h-16 ${box.bg} rounded-[24px] flex items-center justify-center mx-auto ${box.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                      <box.icon className="w-8 h-8" />
                   </div>
                   <div className="space-y-2 text-center">
                      <h4 className="text-sm font-black uppercase italic text-[#002147] tracking-[0.2em]">{box.title}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic line-clamp-2">{box.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#002147] to-[#003366] rounded-[56px] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f16126] rounded-full blur-[140px] -mr-32 -mt-32 opacity-15 pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/10 text-emerald-400 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Access Active
                </div>
                <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">MY <span className="text-[#f16126]">DASHBOARD</span></h2>
                <p className="text-indigo-200/60 font-bold text-xs md:text-sm uppercase tracking-[0.3em] italic max-w-lg">Access your daily live lessons and repository below.</p>
              </div>
              <Link to="/student/live-schedule" className="w-full md:w-auto px-14 py-7 bg-[#f16126] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-white hover:text-[#002147] transition-all flex items-center justify-center gap-4 active:scale-95 group/live">
                Start Live Session <Play className="w-5 h-5 fill-current ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* ACTIVE SUBSCRIPTION CARD */}
          <div className="bg-white p-10 rounded-[52px] border-2 border-slate-50 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-xl gap-10 hover:border-indigo-100 transition-all">
            <div className="text-center md:text-left flex-1 relative z-10">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <Zap className="w-4 h-4 text-[#f16126] fill-current" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Access</p>
              </div>
              <h3 className="text-3xl md:text-5xl font-black text-[#002147] uppercase italic tracking-tighter leading-none mb-4">{learning[0]?.originalBundleName || learning[0]?.name || 'My Subscription'}</h3>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="px-5 py-2 bg-[#f8fbff] rounded-full text-[10px] font-black text-indigo-500 uppercase tracking-widest border border-indigo-50">Validity</div>
                <p className="text-sm font-black text-[#002147] tabular-nums">{learning[0]?.expiryDate ? new Date(learning[0].expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Permanent Access'}</p>
              </div>
            </div>
            <Link to="/student/notes" className="w-full md:w-auto px-14 py-7 bg-[#002147] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f16126] transition-all shadow-2xl text-center active:scale-95">
              VIEW NOTES ARCHIVE
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* SCHEDULE TODAY */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#002147] flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#f16126]" /> Scheduled Today
                </h3>
              </div>
              <div className="space-y-6">
                {liveAlerts.filter(s => s.status === 'upcoming').length > 0 ? (
                  liveAlerts.filter(s => s.status === 'upcoming').slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-8 bg-white rounded-[40px] border border-slate-50 hover:border-indigo-100 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-500">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-[#f8fbff] text-[#f16126] rounded-2xl flex items-center justify-center font-black text-xs italic group-hover:bg-[#f16126] group-hover:text-white transition-all shadow-sm border border-indigo-50">
                          {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-[#002147] text-xl leading-none uppercase italic group-hover:text-[#f16126] transition-colors tracking-tight">{s.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">{new Date(s.startTime).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-[#f16126] group-hover:translate-x-2 transition-all" />
                    </div>
                  ))
                ) : <div className="p-20 bg-white border border-slate-50 rounded-[40px] text-center uppercase text-[10px] font-black text-slate-300 italic tracking-[0.3em]">No classes on agenda.</div>}
              </div>
            </div>

            {/* RECAPS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#002147] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Digital Recaps
                </h3>
              </div>
              <div className="space-y-6">
                {liveAlerts.filter(s => s.status === 'ended').length > 0 ? (
                  liveAlerts.filter(s => s.status === 'ended').slice(0, 3).map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-8 bg-white rounded-[40px] border border-slate-50 hover:border-emerald-100 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1 duration-500">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xs italic group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm border border-emerald-100">
                          <MonitorPlay className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-[#002147] text-xl leading-none uppercase italic group-hover:text-emerald-600 transition-colors tracking-tight">{s.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Library Updated</p>
                        </div>
                      </div>
                      <Link to="/student/notes" className="w-12 h-12 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-all"><ArrowRight className="w-5 h-5" /></Link>
                    </div>
                  ))
                ) : <div className="p-20 bg-white border border-slate-50 rounded-[40px] text-center uppercase text-[10px] font-black text-slate-300 italic tracking-[0.3em]">Recordings library empty.</div>}
              </div>
            </div>
          </div>
        </div>
      )}

      <SessionRecapModal
        isOpen={recapModal.open}
        onClose={() => setRecapModal({ open: false, session: null })}
        session={recapModal.session}
      />

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckout && selectedCourse && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 backdrop-blur-3xl bg-[#002147]/70" onClick={() => setShowCheckout(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[48px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#002147] p-10 text-white relative border-b-8 border-[#f16126]">
                <button onClick={() => setShowCheckout(false)} className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-[#f16126] transition-all"><FiX className="w-6 h-6" /></button>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-indigo-300">Class Selection</p>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">{selectedCourse.className || selectedCourse.name}</h3>
              </div>
              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  {['oneMonth', 'threeMonths', 'sixMonths', 'twelveMonths'].map(dur => {
                    const price = selectedCourse.pricing?.[dur];
                    if (price === 0 && dur !== 'oneMonth') return null;
                    const isSelected = selectedDuration === dur;
                    return (
                      <button key={dur} onClick={() => setSelectedDuration(dur)} className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${isSelected ? 'border-[#f16126] bg-orange-50/50 shadow-lg' : 'border-slate-50 hover:border-slate-100'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-[#f16126] bg-[#f16126]' : 'border-slate-200'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                          </div>
                          <p className={`text-xs font-black uppercase italic ${isSelected ? 'text-[#002147]' : 'text-slate-400'}`}>{dur.replace(/([A-Z])/g, ' $1')}</p>
                        </div>
                        <p className={`text-xl font-black italic ${isSelected ? 'text-[#f16126]' : 'text-[#002147]'}`}>₹{price?.toLocaleString()}</p>
                      </button>
                    );
                  })}
                </div>
                <button disabled={buyLoading} onClick={handlePayment} className="w-full bg-[#f16126] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-[#002147] transition-all shadow-xl active:scale-95 disabled:opacity-50">
                  {buyLoading ? 'Authorizing...' : <><span className="mt-0.5">Approve & Pay</span> <FiCreditCard className="w-6 h-6" /></>}
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
