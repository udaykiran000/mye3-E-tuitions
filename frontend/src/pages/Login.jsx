import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import { HiStatusOnline, HiAcademicCap } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Logic would point to backend URL (e.g., http://localhost:5000/api/auth/login)
      const res = await axios.post('/auth/login', { email, password });
      const user = res.data;
      dispatch(setCredentials({ ...user }));
      
      // Dynamic Redirection
      if (user.role.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role.toLowerCase() === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl shadow-indigo-900/10 border border-slate-100 bg-white">
         
         {/* Left Side: Illustration & Info */}
         <div className="hidden lg:flex flex-col justify-center p-16 bg-indigo-600 text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
               <h2 className="text-5xl font-black leading-tight uppercase tracking-tight">Access <br /> Excellence.</h2>
               <p className="text-xl text-white/70 font-bold italic leading-relaxed">
                  Log in to access your synchronized learning dashboard and premium resources.
               </p>
               <div className="pt-8 space-y-5">
                  <div className="flex items-center gap-4 group">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all"><HiStatusOnline className="text-2xl" /></div>
                     <span className="font-black uppercase tracking-widest text-sm">Live Class Pulse</span>
                  </div>
                  <div className="flex items-center gap-4 group">
                     <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all"><HiAcademicCap className="text-2xl" /></div>
                     <span className="font-black uppercase tracking-widest text-sm">Expert Curriculum</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Side: Form */}
         <div className="p-8 md:p-12 lg:p-20 flex flex-col justify-center">
           <div className="max-w-sm w-full mx-auto space-y-10">
             <div className="space-y-2">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">User Login</h2>
               <p className="text-slate-500 font-bold italic text-sm md:text-base">Enter your credentials to continue</p>
             </div>

             {error && (
               <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-black uppercase tracking-widest border border-rose-100 animate-shake text-center">
                 {error}
               </div>
             )}

             <form onSubmit={submitHandler} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Account Email</label>
                 <input 
                   type="email" 
                   className="w-full px-6 py-4 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 text-sm shadow-inner"
                   placeholder="name@example.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                 />
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Access Key</label>
                    <Link to="#" className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Forgot?</Link>
                 </div>
                 <input 
                   type="password" 
                   className="w-full px-6 py-4 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 text-sm shadow-inner"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
               </div>
               
               <button type="submit" className="w-full py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest shadow-xl shadow-indigo-900/10 hover:bg-indigo-700 active:scale-95 transition-all">
                 Verify & Enter
               </button>
             </form>

             <p className="text-center text-slate-500 font-bold text-sm">
               New here? <Link to="/register" className="text-indigo-600 hover:underline decoration-2 font-black uppercase tracking-widest ml-2">Initialize Account</Link>
             </p>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
