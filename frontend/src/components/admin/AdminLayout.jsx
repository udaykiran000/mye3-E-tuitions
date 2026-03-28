import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { HiBell, HiSearch, HiMenuAlt2, HiX } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
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
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <HiMenuAlt2 className="text-2xl" />
              </button>
              
              <div className="relative group hidden md:block">
                 <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="pl-12 pr-6 py-2.5 bg-slate-50 border-transparent focus:border-indigo-600 focus:bg-white border-2 rounded-xl outline-none w-64 lg:w-80 font-bold transition-all text-sm"
                 />
              </div>
           </div>

           <div className="flex items-center gap-3 md:gap-6">
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all relative">
                 <HiBell className="text-xl md:text-2xl" />
                 <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 md:h-10 w-px bg-slate-100 hidden sm:block"></div>
              
              <div className="flex items-center gap-2 md:gap-4">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900 leading-tight">{userInfo?.name || 'Admin'}</p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Master Admin</p>
                 </div>
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100">
                    {userInfo?.name?.charAt(0) || 'A'}
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

export default AdminLayout;
