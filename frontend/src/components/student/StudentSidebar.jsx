import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  LayoutDashboard, 
  BookOpen, 
  CreditCard, 
  User, 
  LogOut,
  Sparkles,
  Home,
  ShoppingBag,
  Video,
  X
} from 'lucide-react';

const StudentSidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (onClose) onClose();
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', end: true },
    { icon: LayoutDashboard, label: 'Summary', path: '/student/dashboard' },
    { icon: BookOpen, label: 'My Classes', path: '/student/classes' },
    { icon: Video, label: 'Live & Schedule Class', path: '/student/live-schedule' },
    { icon: ShoppingBag, label: 'Courses', path: '/student/courses' },
    { icon: CreditCard, label: 'Fee Payments', path: '/student/payments' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white h-screen text-slate-900 flex flex-col shadow-2xl lg:shadow-none lg:border-r lg:border-slate-100">
      <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">S</div>
          Student <span className="text-indigo-600">Portal</span>
        </h1>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 md:p-6 space-y-1.5 mt-4 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.end}
            onClick={() => onClose && onClose()}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold transition-all group text-sm
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-2xl text-white relative overflow-hidden group mb-6 hidden md:block">
            <Sparkles className="absolute top-4 right-4 w-5 h-5 text-indigo-200/50 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-1">Learning Streak</p>
            <h3 className="text-xl font-black leading-tight">5 Days</h3>
            <p className="text-[9px] mt-2 font-bold text-indigo-100/40 uppercase tracking-wider">Keep crushing it!</p>
         </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all group text-sm border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
