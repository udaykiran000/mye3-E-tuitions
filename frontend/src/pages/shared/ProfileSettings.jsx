import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Camera,
  Loader2,
  ChevronRight,
  Fingerprint,
  CheckCircle2
} from 'lucide-react';

const ProfileSettings = ({ role }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab ] = useState('personal');

  // Role-based theme colors
  const theme = {
    student: 'indigo',
    teacher: 'teal',
    admin: 'indigo'
  }[role.toLowerCase()] || 'indigo';

  const t = {
    indigo: {
      accent: 'indigo',
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-600',
      hover: 'hover:bg-indigo-700',
      light: 'bg-indigo-50',
      lightText: 'text-indigo-700',
      shadow: 'shadow-indigo-200',
      ring: 'bg-indigo-600 focus:ring-indigo-500'
    },
    teal: {
      accent: 'teal',
      bg: 'bg-teal-600',
      text: 'text-teal-600',
      border: 'border-teal-600',
      hover: 'hover:bg-teal-700',
      light: 'bg-teal-50',
      lightText: 'text-teal-700',
      shadow: 'shadow-teal-200',
      ring: 'bg-teal-600 focus:ring-teal-500'
    }
  }[theme];

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put('/auth/profile', {
        name,
        email,
        password: password || undefined,
      });
      dispatch(setCredentials({ ...res.data }));
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'security', label: 'Password & Security', icon: Lock },
    ...(role?.toLowerCase() === 'student' ? [{ id: 'subscriptions', label: 'My Subscriptions', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-8 md:gap-10"
      >
        {/* Sidebar Tabs */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky lg:top-24">
             <div className="flex flex-col items-center mb-8 md:mb-10">
                <div className="relative group">
                   <div className={`w-24 h-24 md:w-28 md:h-28 ${t.bg} rounded-2xl md:rounded-3xl flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-2xl ${t.shadow} group-hover:scale-105 transition-transform duration-500`}>
                      {userInfo?.name?.charAt(0)}
                   </div>
                   <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors">
                      <Camera className="w-5 h-5" />
                   </button>
                </div>
                <h3 className="mt-6 text-xl font-black text-slate-900 tracking-tight uppercase">{userInfo?.name}</h3>
                <p className={`px-4 py-1.5 mt-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${t.light} ${t.lightText}`}>
                   {role} Verification
                </p>
             </div>

            <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-xl font-black text-[10px] md:text-sm uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? `${t.bg} text-white shadow-lg ${t.shadow}` 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <span className="flex-1 text-left hidden sm:inline md:inline">{tab.label}</span>
                  <span className="flex-1 text-left sm:hidden">
                    {tab.id === 'personal' ? 'Info' : tab.id === 'subscriptions' ? 'Billing' : 'Security'}
                  </span>
                  <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 transition-transform hidden lg:block ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-16 shadow-2xl shadow-slate-200/40 border border-slate-100 min-h-[500px] md:min-h-[600px]"
            >
              {activeTab === 'personal' && (
                <div className="space-y-8 md:space-y-10">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 md:p-4 ${t.light} ${t.text} rounded-xl md:rounded-2xl`}>
                        <User className="w-6 h-6 md:w-8 md:h-8" />
                     </div>
                     <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Identity Settings</h2>
                        <p className="text-slate-500 font-bold text-sm">Manage your personal portal information</p>
                     </div>
                  </div>

                  <form onSubmit={submitHandler} className="max-w-2xl space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Portal Name</label>
                          <div className="relative group">
                             <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                <User className="w-4 h-4 md:w-5 md:h-5" />
                             </div>
                             <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 text-sm md:text-base shadow-inner"
                                placeholder="Full name"
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Account Email</label>
                          <div className="relative group">
                             <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                                <Mail className="w-4 h-4 md:w-5 md:h-5" />
                             </div>
                             <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 text-sm md:text-base shadow-inner"
                                placeholder="Email address"
                             />
                          </div>
                       </div>
                    </div>

                    <div className={`p-6 ${t.light} rounded-2xl border border-${t.accent}-100 flex items-start gap-4`}>
                       <ShieldCheck className={`w-5 h-5 md:w-6 md:h-6 ${t.text} shrink-0`} />
                       <div>
                          <p className={`text-[10px] font-black ${t.lightText} uppercase tracking-widest`}>Security Alert</p>
                          <p className="text-xs md:text-sm text-slate-600 font-bold leading-relaxed mt-1 italic">
                             Updates to your email will also synchronize your login credentials for all linked devices.
                          </p>
                       </div>
                    </div>

                    <div className="pt-6">
                       <button 
                          type="submit" 
                          disabled={loading}
                          className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 ${t.bg} text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl ${t.shadow} ${t.hover} disabled:opacity-50 transition-all`}
                       >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Synchronize Identity'}
                       </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'subscriptions' && (
                <div className="space-y-8 md:space-y-10">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 md:p-4 ${t.light} ${t.text} rounded-xl md:rounded-2xl`}>
                        <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                     </div>
                     <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Active Subscriptions</h2>
                        <p className="text-slate-500 font-bold text-sm">Monitor your current access and enrollment status</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    {(userInfo?.activeSubscriptions || []).length === 0 ? (
                      <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                         <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                         <p className="text-slate-400 font-black uppercase tracking-widest text-sm italic">No active enrollments found</p>
                         <Link to="/student/courses" className="mt-4 inline-block text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Explore the Store</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {userInfo.activeSubscriptions.map((sub, idx) => {
                          const daysLeft = Math.ceil((new Date(sub.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                          const isNearExpiry = daysLeft <= 7 && daysLeft > 0;
                          const isExpired = daysLeft <= 0;

                          return (
                            <div key={idx} className={`p-6 rounded-2xl border-2 transition-all ${isNearExpiry ? 'border-orange-100 bg-orange-50/30' : isExpired ? 'border-rose-100 bg-rose-50/30' : 'border-slate-50 bg-white shadow-sm'}`}>
                               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                  <div className="flex items-center gap-4">
                                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isExpired ? 'bg-rose-100 text-rose-600' : isNearExpiry ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <GraduationCap className="w-6 h-6" />
                                     </div>
                                     <div>
                                        <h4 className="font-black text-slate-900 uppercase tracking-tight">{sub.name}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                           {sub.type === 'bundle' ? 'All Subjects Pass' : 'Individual Subject'} • {sub.subscriptionType}
                                        </p>
                                     </div>
                                  </div>

                                  <div className="flex flex-col md:items-end gap-1">
                                     <span className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-rose-600' : isNearExpiry ? 'text-orange-600' : 'text-slate-400'}`}>
                                        {isExpired ? 'Expired On' : 'Valid Until'}
                                     </span>
                                     <span className="font-black text-slate-900">
                                        {new Date(sub.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                                     </span>
                                     {isNearExpiry && <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest animate-pulse mt-1">Expires in {daysLeft} days!</span>}
                                  </div>

                                  {(isNearExpiry || isExpired) && (
                                    <Link 
                                      to="/student/courses"
                                      className={`px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${isNearExpiry ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-900/10' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-900/10'}`}
                                    >
                                       Renew Now
                                    </Link>
                                  )}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 md:space-y-10">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 md:p-4 ${t.light} ${t.text} rounded-xl md:rounded-2xl`}>
                        <Lock className="w-6 h-6 md:w-8 md:h-8" />
                     </div>
                     <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Security Access</h2>
                        <p className="text-slate-500 font-bold text-sm">Update your vault password</p>
                     </div>
                  </div>

                  <form onSubmit={submitHandler} className="max-w-2xl space-y-6 md:space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">New Vault Password</label>
                        <div className="relative group">
                           <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                              <Fingerprint className="w-4 h-4 md:w-5 md:h-5" />
                           </div>
                           <input 
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 text-sm md:text-base shadow-inner"
                              placeholder="New password..."
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Verify Password</label>
                        <div className="relative group">
                           <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                           </div>
                           <input 
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full pl-14 pr-6 py-4 md:py-5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 text-sm md:text-base shadow-inner"
                              placeholder="Confirm password"
                           />
                        </div>
                     </div>

                     <div className="pt-6">
                        <button 
                           type="submit" 
                           disabled={loading}
                           className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 ${t.bg} text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl ${t.shadow} ${t.hover} disabled:opacity-50 transition-all`}
                        >
                           {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Vault Key'}
                        </button>
                     </div>
                  </form>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;
