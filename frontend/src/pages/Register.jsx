import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../store/slices/authSlice';
import { HiCheckCircle } from 'react-icons/hi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, role });
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-[40px] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.1)] border border-slate-100 bg-white">
        
        {/* Left Side: Illustration & Info */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-slate-900 text-white space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
           
           <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black leading-tight">Start Your <br /> Learning <br /> Journey.</h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                 Join thousands of students and expert teachers on India's most innovative learning platform.
              </p>
              <div className="pt-8 space-y-6">
                 {[
                   { icon: HiCheckCircle, text: "Free Access to Study Materials", color: "text-emerald-400" },
                   { icon: HiCheckCircle, text: "Personalized Support & Doubt Clearing", color: "text-indigo-400" },
                   { icon: HiCheckCircle, text: "Flexible Learning at Your Own Pace", color: "text-amber-400" }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <div className={`text-2xl ${item.color}`}><item.icon /></div>
                      <span className="font-bold text-slate-200">{item.text}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-slate-500 font-bold">Zero commitment, infinite possibilities.</p>
            </div>

            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm font-bold border border-rose-100 animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Create Password</label>
                <input 
                  type="password" 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Join As</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-bold text-slate-900 appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher (Verification Req.)</option>
                </select>
              </div>
              
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all !mt-10">
                Register Now
              </button>
            </form>

            <p className="text-center text-slate-500 font-bold">
              Already a member? <Link to="/login" className="text-indigo-600 hover:underline decoration-2">Sign in instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
