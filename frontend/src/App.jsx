import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PreviewProvider, usePreview } from './context/PreviewContext';
import ViewSwitcher from './components/admin/ViewSwitcher';
import Navbar from './components/shared/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentStore from './pages/student/StudentStore';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Store from './pages/student/StudentStore'; // Unified Store
import Footer from './components/shared/Footer';
import AdminLayout from './components/admin/AdminLayout';
import PricingManagement from './pages/admin/PricingManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import StudentManagement from './pages/admin/StudentManagement';

import ManageClasses from './pages/admin/ManageClasses';
import ManageSubjects from './pages/admin/ManageSubjects';
import AdminTransactions from './pages/admin/AdminTransactions';
import LiveMonitor from './pages/admin/LiveMonitor';

// Teacher Pages
import TeacherLayout from './components/teacher/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MyClasses from './pages/teacher/MyClasses';
import ScheduleLive from './pages/teacher/ScheduleLive';
import ManageStudents from './pages/admin/ManageStudents'; // Moved up

// Student Pages
import TeacherMaterials from './pages/teacher/TeacherMaterials';
import StudentLayout from './components/student/StudentLayout';
import StudentCourseContent from './pages/student/StudentCourseContent';
import MyLearning from './pages/student/MyLearning';
import ProfileSettings from './pages/shared/ProfileSettings';
import PaymentHistory from './pages/student/PaymentHistory';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  if (!userInfo) return <Navigate to="/login" replace />;
  
  // Admin bypass: Admins can access all views
  if (userInfo.role.toLowerCase() === 'admin') return children;
  
  if (role && userInfo.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" replace />;
  
  return children;
};


function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/teacher') || location.pathname.startsWith('/student');

  return (
    <div className={isAuthPage ? '' : 'min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900'}>
      {!isDashboardRoute && !isAuthPage && <Navbar />}
      <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Store />} />
              
              {/* Student Routes */}
              <Route path="/student/*" element={
                <ProtectedRoute role="student">
                  <StudentLayout>
                    <Routes>
                      <Route index element={<Navigate to="/student/dashboard" replace />} />
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="my-learning" element={<MyLearning />} />
                      <Route path="courses" element={<StudentStore />} />
                      <Route path="classes/:courseName" element={<StudentCourseContent />} />
                      <Route path="materials" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center uppercase tracking-widest leading-loose">Materials Hub<br/><span className="text-sm opacity-50">Centralized Resource Archive coming soon...</span></div>} />
                      <Route path="payments" element={<PaymentHistory />} />
                      <Route path="profile" element={<ProfileSettings role="Student" />} />
                    </Routes>
                  </StudentLayout>
                </ProtectedRoute>
              } />

              {/* Teacher Routes */}
              <Route path="/teacher/*" element={
                <ProtectedRoute role="teacher">
                  <TeacherLayout>
                    <Routes>
                      <Route index element={<TeacherDashboard />} />
                      <Route path="dashboard" element={<TeacherDashboard />} />
                      <Route path="classes" element={<MyClasses />} />
                      <Route path="schedule-live" element={<ScheduleLive />} />
                      <Route path="materials" element={<TeacherMaterials />} />
                      <Route path="profile" element={<ProfileSettings role="Teacher" />} />
                    </Routes>
                  </TeacherLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute role="admin">
                  <AdminLayout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="pricing" element={<PricingManagement />} />
                      <Route path="pricing/classes" element={<Navigate to="/admin/pricing" replace />} />
                      <Route path="pricing/subjects" element={<Navigate to="/admin/pricing" replace />} />
                      <Route path="teachers" element={<TeacherManagement />} />
                      <Route path="students" element={<ManageStudents />} />
                      <Route path="transactions" element={<AdminTransactions />} />
                      <Route path="settings" element={<ProfileSettings role="Admin" />} />
                      <Route path="live-monitor" element={<LiveMonitor />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />

              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {!isDashboardRoute && !isAuthPage && <Footer />}
          <ViewSwitcher />
        </div>
  );
}

function App() {
  return (
    <PreviewProvider>
      <Router>
        <AppContent />
      </Router>
    </PreviewProvider>
  );
}

export default App;
