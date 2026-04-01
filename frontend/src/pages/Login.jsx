import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import { FcGoogle } from 'react-icons/fc';
import logoGif from '../assets/logo_transparent.gif';
import loginImg from '../assets/ChatGPT Image Mar 30, 2026, 01_51_09 AM.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      const user = res.data;
      dispatch(setCredentials({ ...user }));
      
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
    <div className="h-screen bg-sky-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
        {/* Left Side: Form */}
        <div className="w-full lg:w-[45%] p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          <div className="space-y-4">
            <header className="flex justify-center lg:justify-start">
              <img 
                src={logoGif} 
                alt="e-Tuitions Logo" 
                className="h-20 md:h-28 scale-[1.2] md:scale-[1.3] object-contain -ml-2"
              />
            </header>

            {/* Social Login Buttons & Create Account */}
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-center gap-2 w-full py-2.5 px-6 border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm">
                <FcGoogle className="text-xl" />
                Sign in with Google
              </button>
              <Link 
                to="/register" 
                className="flex items-center justify-center w-full py-2.5 px-6 bg-slate-100 rounded-full font-bold text-slate-600 hover:bg-slate-200 transition-all text-sm"
              >
                Create Account
              </Link>
            </div>

            <div className="relative flex items-center justify-center uppercase py-1">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[9px] font-black text-slate-300 tracking-widest whitespace-nowrap">
                or Sign in with Email
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-3 rounded-xl border border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                  placeholder="batukre312@|"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                </div>
                <input 
                  type="password" 
                  className="w-full px-5 py-3 rounded-xl border border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 text-sm"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end pr-1">
                  <Link to="#" className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Forget Password?</Link>
                </div>
              </div>
              
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all mt-1">
                Login
              </button>
            </form>
          </div>

          <footer className="mt-6 text-center lg:text-left">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
              ©2024 Elegance All Rights Reserved.
            </p>
          </footer>
        </div>

        {/* Right Side: Illustration */}
        <div 
          className="hidden lg:block w-[55%] relative bg-cover"
          style={{ 
            backgroundImage: `url("${loginImg}")`,
            backgroundPosition: 'center 10%'
          }}
        >
          {/* Decorative Overlay */}
          <div className="absolute inset-0 bg-indigo-600/5 mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
