import AdminSidebar from './AdminSidebar';
import { HiBell, HiSearch } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { LogOut } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-72">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
           <div className="relative group">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search students, teachers, classes..." 
                className="pl-12 pr-6 py-3 bg-slate-50 border-transparent focus:border-indigo-600 focus:bg-white border-2 rounded-2xl outline-none w-80 font-bold transition-all"
              />
           </div>

           <div className="flex items-center gap-6">
              <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all relative">
                 <HiBell className="text-2xl" />
                 <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-10 w-px bg-slate-100"></div>
              <div className="flex items-center gap-4">
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{userInfo?.name || 'Administrator'}</p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Master Admin</p>
                 </div>
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 cursor-pointer">
                    {userInfo?.name?.charAt(0) || 'A'}
                 </div>
                 <button
                   onClick={handleLogout}
                   className="flex items-center gap-2 px-4 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-all ml-2 border border-rose-100"
                 >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                 </button>
              </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
