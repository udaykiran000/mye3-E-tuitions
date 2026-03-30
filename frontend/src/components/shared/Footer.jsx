import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiArrowRight,
} from 'react-icons/hi';
import logoGif from '../../assets/loader-logo (1).gif';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
} from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-white border-t border-slate-100">

      {/* ── Scrolling Rating Ticker ── */}
      <div
        className="w-full py-3 overflow-hidden"
        style={{ background: 'linear-gradient(90deg,#f97316,#ea580c)' }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 14s linear infinite' }}>
          {/* Duplicate the list twice for seamless loop */}
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex shrink-0 items-center">
              {[
                'QUALITY TEACHER ⭐ 4.9/5',
                'PUNCTUALITY AND PROFESSIONALISM ⭐ 4.8/5',
                'STUDENT SATISFACTION ⭐ 4.9/5',
                'SEAMLESS LEARNING EXPERIENCE ⭐ 5/5',
                'PERSONALIZED ATTENTION ⭐ 4.7/5',
                'ENGAGING TEACHING ⭐ 5/5',
              ].map((text, i) => (
                <span key={i} className="flex items-center gap-6">
                  <span className="text-white font-black text-[12px] md:text-[13px] uppercase tracking-widest px-8">
                    {text}
                  </span>
                  <span className="text-white/40 text-lg">|</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Logo + Tagline Row ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-10 pb-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src={logoGif}
            alt="e-Tuitions Logo"
            className="h-14 w-auto hover:scale-105 transition-transform"
          />
        </Link>

        {/* Tagline */}
        <p className="text-slate-500 font-medium text-[14px] max-w-md leading-relaxed">
          We dream to find the solution to every challenge which students come across,
          while taking online classes.
        </p>
      </div>

      {/* ── Main Columns ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Column 1: Links */}
        <div>
          <h4 className="text-[14px] font-black text-slate-800 mb-5">Links</h4>
          <ul className="space-y-3">
            {[
              { label: 'Book Classes', to: '/register' },
              { label: 'Online Classes', to: '/courses' },
              { label: 'Explore Teachers', to: '/courses' },
              { label: 'Contact Us', to: '/about' },
              { label: 'How To Register', to: '/register' },
              { label: 'Join As Teacher', to: '/register' },
              { label: 'Teacher Memberships', to: '/register' },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  className="text-[13px] text-slate-500 hover:text-orange-500 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-[14px] font-black text-slate-800 mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { label: 'About Us', to: '/about' },
              { label: 'Privacy Policy', to: '/' },
              { label: 'Refund Policy', to: '/' },
              { label: 'Terms & Conditions', to: '/' },
              { label: 'Disclaimer', to: '/' },
              { label: 'Sitemap', to: '/' },
              { label: 'Blogs', to: '/' },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.to}
                  className="text-[13px] text-slate-500 hover:text-orange-500 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Our Services + Quick Connect */}
        <div className="space-y-8">
          <div>
            <h4 className="text-[14px] font-black text-slate-800 mb-5">Our Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Group Classes', to: '/courses' },
                { label: 'Offline Classes', to: '/courses' },
                { label: 'Private Classes', to: '/courses' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.to}
                    className="text-[13px] text-slate-500 hover:text-orange-500 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social icons */}
          <div>
            <h4 className="text-[14px] font-black text-slate-800 mb-4">Quick Connect</h4>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { Icon: FaFacebookF, color: '#1877f2', href: '#' },
                { Icon: FaInstagram, color: '#e1306c', href: '#' },
                { Icon: FaTwitter, color: '#1da1f2', href: '#' },
                { Icon: FaLinkedinIn, color: '#0077b5', href: '#' },
                { Icon: FaYoutube, color: '#ff0000', href: '#' },
              ].map(({ Icon, color, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 hover:-translate-y-1 transition-all text-[14px]"
                  style={{ background: color }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 className="text-[14px] font-black text-slate-800 mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#fff3e0' }}>
                <HiOutlinePhone className="text-orange-500 text-[15px]" />
              </div>
              <div className="text-[13px] text-slate-600 font-medium leading-relaxed">
                +91 9311656688<br />+91 9289439711
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#fff3e0' }}>
                <HiOutlineMail className="text-orange-500 text-[15px]" />
              </div>
              <span className="text-[13px] text-slate-600 font-medium">education@e-tuitions.com</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#fff3e0' }}>
                <HiOutlineLocationMarker className="text-orange-500 text-[15px]" />
              </div>
              <span className="text-[13px] text-slate-600 font-medium leading-relaxed">
                FIEE Complex, A-55, Okhla Phase II,<br />
                Okhla Industrial Estate,<br />
                New Delhi, Delhi 110020
              </span>
            </li>
          </ul>

          {/* Email subscribe */}
          <div className="mt-6 flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-3 py-2.5 text-[13px] text-slate-600 outline-none bg-white placeholder-slate-400"
            />
            <button
              className="px-3 py-2.5 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
            >
              <HiArrowRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-slate-100 py-5 px-6 md:px-10 text-center">
        <p className="text-[12px] text-slate-500 font-medium">
          © Copyright 2020 - {new Date().getFullYear()} | e-Tuitions Learning Pvt Ltd | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
