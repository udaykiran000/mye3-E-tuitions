import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Link to="/" className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tighter">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl rotate-3 shadow-lg shadow-indigo-200">e3</div>
          Mye3
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          <Link to="/" className="font-bold text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/store" className="font-bold text-slate-600 hover:text-indigo-600 transition-colors">Courses</Link>
          <Link to="/about" className="font-bold text-slate-600 hover:text-indigo-600 transition-colors">About Mye3</Link>
        </div>

        <div className="flex items-center gap-6">
          {userInfo ? (
            <div className="flex items-center gap-4">
              <Link 
                to={userInfo.role.toLowerCase() === 'admin' ? '/admin/dashboard' : userInfo.role.toLowerCase() === 'teacher' ? '/teacher/dashboard' : '/dashboard'}
                className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl font-black text-sm hover:bg-slate-200 transition-all"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="font-bold text-slate-400 hover:text-red-500 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="font-black text-slate-900 hover:text-indigo-600 transition-colors text-sm">Login</Link>
              <Link to="/register" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
