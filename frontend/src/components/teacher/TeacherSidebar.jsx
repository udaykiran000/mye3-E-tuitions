import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  LayoutDashboard, 
  Video, 
  BookOpen, 
  LogOut,
  Home,
  User,
  X,
  History,
  FileText
} from 'lucide-react';

const TeacherSidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (onClose) onClose();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
    { icon: BookOpen, label: 'My Classes', path: '/teacher/classes' },
    { icon: FileText, label: 'Notes', path: '/teacher/materials' },
    { icon: Video, label: 'Live Classes', path: '/teacher/live-schedule' },
    { icon: History, label: 'Past Sessions', path: '/teacher/past-sessions' },
    { icon: User, label: 'Profile', path: '/teacher/profile' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900 h-screen text-white flex flex-col shadow-2xl">
      <div className="p-6 md:p-8 border-b border-slate-800 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-xl">T</div>
          Faculty <span className="text-teal-400">Portal</span>
        </h1>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 md:p-6 space-y-1.5 mt-4 overflow-y-auto">
        {menuItems.map((item, idx) => {
          const Content = (
            <>
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{item.label}</span>
            </>
          );
          
          return item.exact ? (
            <Link
              key={idx}
              to={item.path}
              onClick={() => onClose && onClose()}
              className="flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold transition-all group text-sm text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
              {Content}
            </Link>
          ) : (
            <NavLink
              key={idx}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold transition-all group text-sm
                ${isActive 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/40' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
              `}
            >
              {Content}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
         <div className="px-5 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 mb-6 hidden md:block">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Faculty Status</p>
            <div className="flex items-center justify-center gap-2 mt-1">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-xs font-black text-emerald-500 uppercase">Online</span>
            </div>
         </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 transition-all group text-sm"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Exit Portal</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
