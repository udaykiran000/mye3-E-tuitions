import React from 'react';
import StudentSidebar from './StudentSidebar';
import { HiBell } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { UserCircle, GraduationCap, LogOut } from 'lucide-react';

const StudentLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <StudentSidebar />
      <div className="flex-1 ml-72">
        {/* Top Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                 <GraduationCap className="w-4 h-4" /> Enrolled Student
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all relative">
                 <HiBell className="text-xl" />
                 <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="h-8 w-px bg-slate-100"></div>

              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{userInfo?.name || 'Student'}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Academic Board: {userInfo?.classLevel || 'Class 10'}</p>
                 </div>
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 cursor-pointer hover:scale-105 transition-transform">
                    {userInfo?.name?.charAt(0) || <UserCircle className="w-7 h-7" />}
                 </div>
                 <button
                   onClick={handleLogout}
                   className="flex items-center gap-2 px-4 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-all border border-rose-100"
                 >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                 </button>
              </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="p-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
