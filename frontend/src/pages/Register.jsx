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
      const res = await axios.post('/auth/register', { name, email, password, role });
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
         <div className="hidden lg:flex flex-col justify-center p-16 bg-slate-900 text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
               <h2 className="text-5xl font-black leading-tight uppercase tracking-tight">Initiate <br /> Learning <br /> Protocol.</h2>
               <p className="text-xl text-slate-400 font-bold italic leading-relaxed">
                  Join the elite community of students and mentors on India's most advanced platform.
               </p>
               <div className="pt-8 space-y-5">
                  {[
                    { icon: HiCheckCircle, text: "Synchronized Study Assets", color: "text-emerald-400" },
                    { icon: HiCheckCircle, text: "Live Mentor Consultation", color: "text-indigo-400" },
                    { icon: HiCheckCircle, text: "Adaptive Learning Engine", color: "text-amber-400" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                       <div className={`text-2xl ${item.color} group-hover:scale-110 transition-transform`}><item.icon /></div>
                       <span className="font-black uppercase tracking-widest text-sm text-slate-200">{item.text}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Side: Form */}
         <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
           <div className="max-w-sm w-full mx-auto space-y-8">
             <div className="space-y-2 text-center lg:text-left">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Registration</h2>
               <p className="text-slate-500 font-bold italic text-sm md:text-base">Initialize your educational journey</p>
             </div>

             {error && (
               <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-black uppercase tracking-widest border border-rose-100 animate-shake text-center">
                 {error}
               </div>
             )}

             <form onSubmit={submitHandler} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Identity</label>
                 <input 
                   type="text" 
                   className="w-full px-5 py-3.5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 text-sm shadow-inner"
                   placeholder="Your Name"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   required
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Portal Email</label>
                 <input 
                   type="email" 
                   className="w-full px-5 py-3.5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 text-sm shadow-inner"
                   placeholder="name@example.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Access Key</label>
                 <input 
                   type="password" 
                   className="w-full px-5 py-3.5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 text-sm shadow-inner"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Role Assignment</label>
                 <select 
                   className="w-full px-5 py-3.5 rounded-xl md:rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:bg-white bg-slate-50 outline-none transition-all font-black text-slate-900 appearance-none text-sm shadow-inner cursor-pointer"
                   value={role}
                   onChange={(e) => setRole(e.target.value)}
                 >
                   <option value="Student">Student Portal</option>
                   <option value="Teacher">Teacher Faculty</option>
                 </select>
               </div>
               
               <button type="submit" className="w-full py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black text-sm md:text-lg uppercase tracking-widest shadow-xl shadow-indigo-900/10 hover:bg-indigo-700 active:scale-95 transition-all !mt-6">
                 Complete Setup
               </button>
             </form>

             <p className="text-center text-slate-500 font-bold text-sm">
               Already recorded? <Link to="/login" className="text-indigo-600 hover:underline decoration-2 font-black uppercase tracking-widest ml-2">Authenticate</Link>
             </p>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Register;
