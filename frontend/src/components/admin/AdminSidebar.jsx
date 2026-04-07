import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  LayoutDashboard, 
  IndianRupee, 
  Users, 
  UserSquare2, 
  CreditCard, 
  Settings,
  Activity,
  LogOut,
  FileText,
  X
} from 'lucide-react';
import logoImg from '../../assets/output-onlinepngtools.png';

const AdminSidebar = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    if (onClose) onClose();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Summary', path: '/admin/dashboard' },
    { icon: IndianRupee, label: 'Fees Control', path: '/admin/pricing' },
    { icon: UserSquare2, label: 'Teachers', path: '/admin/teachers' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: Activity, label: 'Live & Schedule Class', path: '/admin/live-monitor' },
    { icon: CreditCard, label: 'Fee Payments', path: '/admin/transactions' },
    { icon: FileText, label: 'Study Notes', path: '/admin/notes' },
    { icon: Settings, label: 'Options', path: '/admin/settings' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-slate-900 h-screen text-white flex flex-col shadow-2xl">
      <div className="p-6 md:p-8 border-b border-slate-800 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group px-2">
          <img 
            src={logoImg} 
            alt="Logo" 
            className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
          />
          <div className="flex flex-col gap-0 text-left">
            <span className="text-xl font-black tracking-tighter leading-none">Admin</span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-0.5">LMS Portal</span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 md:p-6 space-y-1.5 mt-4 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            onClick={() => onClose && onClose()}
            className={({ isActive }) => `
              flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold transition-all group text-sm
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
            `}
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 transition-all group text-sm"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
