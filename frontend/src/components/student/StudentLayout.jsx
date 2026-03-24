import React from 'react';
import StudentSidebar from './StudentSidebar';
import { HiBell, HiSearch } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { UserCircle, GraduationCap } from 'lucide-react';

const StudentLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

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

           <div className="flex items-center gap-8">
              <div className="relative group">
                 <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-lg group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search your courses, materials..." 
                   className="pl-12 pr-6 py-3 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-100 rounded-2xl outline-none w-72 font-bold text-sm transition-all"
                 />
              </div>

              <div className="h-10 w-px bg-slate-100"></div>

              <div className="flex items-center gap-5">
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{userInfo?.name || 'Student'}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Academic Board: {userInfo?.classLevel || 'Class 10'}</p>
                 </div>
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 cursor-pointer hover:scale-105 transition-transform">
                    {userInfo?.name?.charAt(0) || <UserCircle className="w-7 h-7" />}
                 </div>
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
