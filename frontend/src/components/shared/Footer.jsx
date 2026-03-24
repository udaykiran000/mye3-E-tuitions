import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black flex items-center gap-3 tracking-tighter">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl rotate-3 shadow-lg shadow-indigo-500/50">e3</div>
              Mye3
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed">
              India's leading platform for personalized online tuition. Empowering students with expert guidance and premium resources for academic excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all"><FaFacebook /></a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all"><FaTwitter /></a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all"><FaInstagram /></a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all"><FaLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Mye3</Link></li>
              <li><Link to="/store" className="hover:text-indigo-400 transition-colors">Our Courses</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Account Login</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Programs</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><Link to="/store" className="hover:text-indigo-400 transition-colors">Classes 6-10 (Bundles)</Link></li>
              <li><Link to="/store" className="hover:text-indigo-400 transition-colors">Classes 11-12 (Subjects)</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">Free Resources</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Join as Student</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Contact Us</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex items-center gap-3">
                <FaPhone className="text-indigo-400" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-indigo-400" /> support@mye3elearning.com
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-indigo-400 mt-1" /> 123 Education Hub, Jubilee Hills, Hyderabad - 500033
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-800 flex flex-col md:row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} Mye3-Elearning. All rights reserved.
          </p>
          <div className="flex gap-8 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
