import React, { useState, useEffect } from 'react';
import StudentSidebar from './StudentSidebar';
import { HiBell, HiMenuAlt2 } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { logout } from '../../store/slices/authSlice';
import { UserCircle, GraduationCap, LogOut } from 'lucide-react';

const StudentLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Determine socket URL based on environment
  // Determine socket URL dynamically
  const getSocketUrl = () => {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL.replace('/api', '').replace(/\/$/, '');
    }
    // Fallback to current hostname to support local IP testing (mobile)
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  };

  const socketUrl = getSocketUrl();

  useEffect(() => {
    // 1. Initial Fetch
    const fetchAlerts = async () => {
      try {
        const { data } = await axios.get('/student/live-alerts');
        setAlerts(data || []);
      } catch (err) {
        console.error('ALERT_FETCH_FAIL');
      }
    };
    fetchAlerts();

    // 2. Socket Connection (Real-time)
    const socket = io(socketUrl, {
      withCredentials: true,
      transports: ['polling', 'websocket'], // Start with polling for dev stability
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      console.log('✅ Student Socket Link Active - ID:', socket.id);
    });
    
    // Listen for live class updates
    socket.on('live-session-update', (data) => {
      console.log('🔔 Real-time Session Update Received:', data.type);
      fetchAlerts(); // Re-sync alerts instantly
      window.dispatchEvent(new Event('refresh-student-data'));
    });

    socket.on('connect_error', (err) => {
      // Use warn instead of error for transient connection attempts
      console.warn('⚠️ Socket Connection Note:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [socketUrl]);

  const hasLive = alerts.some(a => a.status === 'live');
  const alertCount = alerts.filter(a => a.status === 'live' || a.status === 'upcoming').length;

  // SUBSCRIPTION EXPIRY LOGIC
  const expiringSoonItems = (userInfo?.activeSubscriptions || []).filter(sub => {
    const days = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days > 0;
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <StudentSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden overflow-y-auto w-full relative">
        
        {/* Global Expiry Banner */}
        {expiringSoonItems.length > 0 && (
          <div className="bg-orange-600 text-white px-6 py-2.5 flex items-center justify-center gap-4 sticky top-0 z-[60] shadow-lg animate-in slide-in-from-top duration-500">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                <p className="text-[10px] md:text-sm font-black uppercase tracking-widest">
                  Urgent: {expiringSoonItems.length} of your subscriptions are expiring soon! 
                </p>
             </div>
             <Link 
               to="/student/courses" 
               className="bg-white text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all shadow-sm"
             >
                Renew Now
             </Link>
          </div>
        )}

        {/* Top Header */}
        <header className="h-20 md:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <HiMenuAlt2 className="text-2xl" />
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100 hidden sm:flex">
                 <GraduationCap className="w-4 h-4" /> Enrolled Student
              </div>
           </div>

           <div className="flex items-center gap-3 md:gap-6">
              <Link 
                to="/student/live-schedule"
                className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all relative border group
                  ${hasLive ? 'bg-rose-50 border-rose-100 text-rose-600 shadow-lg shadow-rose-900/10' : alertCount > 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}
                `}
                title={hasLive ? 'Class is LIVE!' : 'View Schedule'}
              >
                 <HiBell className="text-xl group-hover:scale-110 transition-transform" />
                 {(alertCount > 0 || hasLive) && (
                   <>
                     <span className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full border-2 border-white ${hasLive ? 'bg-rose-500' : 'bg-indigo-500'}`}></span>
                     {hasLive && <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping opacity-75"></span>}
                   </>
                 )}
              </Link>

              <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

              <div className="flex items-center gap-2 md:gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900 leading-tight">{userInfo?.name || 'Student'}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                       {userInfo?.classLevel || userInfo?.role || 'Portal'}
                    </p>
                 </div>
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100 cursor-pointer">
                    {userInfo?.name?.charAt(0) || <UserCircle className="w-6 h-6" />}
                 </div>
                 <button
                   onClick={handleLogout}
                   className="flex items-center gap-2 px-3 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-lg transition-all border border-rose-100 text-xs md:text-sm"
                 >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Logout</span>
                 </button>
              </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-10 flex-1">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
