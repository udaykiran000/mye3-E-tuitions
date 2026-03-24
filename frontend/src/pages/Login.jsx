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
      const res = await axios.post('/api/auth/login', { email, password });
      const user = res.data;
      dispatch(setCredentials({ ...user }));
      
      // Dynamic Redirection
      if (user.role.toLowerCase() === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role.toLowerCase() === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[40px] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.1)] border border-slate-100 bg-white">
        
        {/* Left Side: Illustration & Info */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-indigo-600 text-white space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
           
           <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black leading-tight">Welcome Back to <br /> Excellence.</h2>
              <p className="text-xl text-white/70 font-medium leading-relaxed">
                 Log in to access your personalized learning dashboard, live classes, and premium study materials.
              </p>
              <div className="pt-8 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><HiStatusOnline className="text-xl" /></div>
                    <span className="font-bold">Live Interactive Sessions</span>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><HiAcademicCap className="text-xl" /></div>
                    <span className="font-bold">Expert-Led Curriculum</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 lg:p-20 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Login</h2>
              <p className="text-slate-500 font-bold">Good to see you again!</p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Password</label>
                   <Link to="#" className="text-xs font-black text-indigo-600 hover:underline">Forgot?</Link>
                </div>
                <input 
                  type="password" 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all">
                Sign In to Platform
              </button>
            </form>

            <p className="text-center text-slate-500 font-bold">
              New here? <Link to="/register" className="text-indigo-600 hover:underline decoration-2">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
