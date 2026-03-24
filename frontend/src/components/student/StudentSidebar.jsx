import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  FileText, 
  CreditCard, 
  User, 
  ShoppingBag,
  LogOut,
  Sparkles
} from 'lucide-react';

const StudentSidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, label: 'My Learning', path: '/student/dashboard' }, // Linking to learning grid for now
    { icon: ShoppingBag, label: 'Store', path: '/student/store' },
    { icon: FileText, label: 'Materials', path: '/student/materials' },
    { icon: CreditCard, label: 'Payments', path: '/student/payments' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  return (
    <aside className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-slate-100 flex flex-col z-50">
      <div className="p-8 border-b border-slate-50">
        <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">S</div>
          Student <span className="text-indigo-600">Hub</span>
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
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6">
         <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white relative overflow-hidden group mb-6">
            <Sparkles className="absolute top-4 right-4 w-5 h-5 text-indigo-200 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-1">Learning Streak</p>
            <h3 className="text-2xl font-black leading-tight">5 Days</h3>
            <p className="text-[10px] mt-2 font-bold text-indigo-100/60">Keep it up! You're on fire.</p>
         </div>
        <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
