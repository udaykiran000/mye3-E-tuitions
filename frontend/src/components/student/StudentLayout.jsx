import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import { HiBell, HiMenuAlt2 } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { UserCircle, GraduationCap, LogOut } from 'lucide-react';

const StudentLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <StudentSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen w-full">
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
              <button className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all relative">
                 <HiBell className="text-xl" />
                 <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

              <div className="flex items-center gap-2 md:gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900 leading-tight">{userInfo?.name || 'Student'}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                       {userInfo?.classLevel || 'Class 10'}
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
