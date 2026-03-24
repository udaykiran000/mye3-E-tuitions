import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PreviewProvider, usePreview } from './context/PreviewContext';
import ViewSwitcher from './components/admin/ViewSwitcher';
import Navbar from './components/shared/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Store from './pages/Store';
import Footer from './components/shared/Footer';
import AdminLayout from './components/admin/AdminLayout';
import PricingManagement from './pages/admin/PricingManagement';
import TeacherManagement from './pages/admin/TeacherManagement';
import StudentManagement from './pages/admin/StudentManagement';

import ManageClasses from './pages/admin/ManageClasses';
import ManageSubjects from './pages/admin/ManageSubjects';

// Teacher Pages
import TeacherLayout from './components/teacher/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MyClasses from './pages/teacher/MyClasses';
import ScheduleLive from './pages/teacher/ScheduleLive';
import ContentUpload from './pages/teacher/ContentUpload';
import ManageStudents from './pages/admin/ManageStudents'; // Moved up

// Student Pages
import StudentLayout from './components/student/StudentLayout';
import StudentCourseContent from './pages/student/StudentCourseContent';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { userInfo } = useSelector((state) => state.auth);
  
  if (!userInfo) return <Navigate to="/login" replace />;
  
  // Admin bypass: Admins can access all views
  if (userInfo.role.toLowerCase() === 'admin') return children;
  
  if (role && userInfo.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" replace />;
  
  return children;
};


function App() {
  return (
    <PreviewProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/store" element={<Store />} />
              
              {/* Student Routes */}
              <Route path="/student/*" element={
                <ProtectedRoute role="student">
                  <StudentLayout>
                    <Routes>
                      <Route index element={<Navigate to="/student/dashboard" replace />} />
                      <Route path="dashboard" element={<StudentDashboard />} />
                      <Route path="classes/:courseName" element={<StudentCourseContent />} />
                      <Route path="my-classes" element={<StudentDashboard />} />
                      <Route path="materials" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center uppercase tracking-widest">Materials Archive...</div>} />
                      <Route path="payments" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center uppercase tracking-widest">Payment History...</div>} />
                      <Route path="profile" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center uppercase tracking-widest">Student Profile...</div>} />
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
                      <Route path="recordings" element={<ContentUpload />} />
                      <Route path="materials" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center">Study Materials Hub...</div>} />
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
                      <Route path="pricing/classes" element={<ManageClasses />} />
                      <Route path="pricing/subjects" element={<ManageSubjects />} />
                      <Route path="teachers" element={<TeacherManagement />} />
                      <Route path="students" element={<ManageStudents />} />
                      <Route path="transactions" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center uppercase tracking-widest">Transaction History Logs...</div>} />
                      <Route path="settings" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center uppercase tracking-widest">Admin Suite Settings...</div>} />
                      <Route path="live-monitor" element={<div className="text-2xl font-black text-slate-300 italic pt-20 text-center uppercase tracking-widest">Live Class Audit Hub...</div>} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              } />

              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ViewSwitcher />
        </div>
      </Router>
    </PreviewProvider>
  );
}

export default App;
