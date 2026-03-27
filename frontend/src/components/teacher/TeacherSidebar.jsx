import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  FileText,
  LogOut,
  Home
} from 'lucide-react';

const TeacherSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', exact: true },
    { icon: LayoutDashboard, label: 'Overview', path: '/teacher/dashboard' },
    { icon: BookOpen, label: 'My Classes', path: '/teacher/classes' },
    { icon: Video, label: 'Schedule Live', path: '/teacher/schedule-live' },
    { icon: FileText, label: 'Study Materials', path: '/teacher/materials' },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-xl">T</div>
          Faculty <span className="text-teal-400">Suite</span>
        </h1>
      </div>

      <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item, idx) => (
          item.exact ? (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ) : (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group
                ${isActive 
                  ? 'bg-teal-600 text-white shadow-xl shadow-teal-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
         <div className="px-6 py-4 bg-slate-800/50 rounded-[32px] border border-slate-700/50 mb-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Faculty Status</p>
            <div className="flex items-center justify-center gap-2 mt-1">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-sm font-black text-emerald-500">Online</span>
            </div>
         </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Exit Suite</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
