import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  LayoutDashboard, 
  IndianRupee, // Added
  Users, 
  UserSquare2, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: IndianRupee, label: 'Pricing Manager', path: '/admin/pricing' },
    { icon: UserSquare2, label: 'Teachers', path: '/admin/teachers' },
    { icon: Users, label: 'Students', path: '/admin/students' },
    { icon: CreditCard, label: 'Transactions', path: '/admin/transactions' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-72 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">M</div>
          Mye3 <span className="text-indigo-400">LMS</span>
        </h1>
      </div>

      <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group
              ${isActive 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-rose-400 hover:text-white hover:bg-rose-600/20 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
