import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    <footer className="bg-[#002147] text-white border-t border-slate-100 transition-colors duration-300">

      {/* ── Scrolling Rating Ticker ── */}
      <div
        className="w-full py-3 overflow-hidden border-b border-white/10"
        style={{ background: '#001a38' }}
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
                  <span className="font-black text-[12px] md:text-[13px] uppercase tracking-widest px-8 text-indigo-200">
                    {text}
                  </span>
                  <span className="text-white/20 text-lg">|</span>
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
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-10 pb-6 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0 bg-white p-3 rounded-xl shadow-lg ring-1 ring-white/10">
          <img
            src={logoGif}
            alt="e-Tuitions Logo"
            className="h-10 md:h-12 w-auto hover:scale-105 transition-transform"
          />
        </Link>

        {/* Tagline */}
        <p className="font-medium text-[14px] max-w-md leading-relaxed text-indigo-100/70">
          We dream to find the solution to every challenge which students come across,
          while taking online classes.
        </p>
      </div>

      {/* ── Main Columns ── */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Column 1: Links */}
        <div>
          <h4 className="text-[14px] font-black mb-5 uppercase tracking-wider text-white">Links</h4>
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
                  className="text-[13px] transition-colors font-medium text-indigo-100/60 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-[14px] font-black mb-5 uppercase tracking-wider text-white">Quick Links</h4>
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
                  className="text-[13px] transition-colors font-medium text-indigo-100/60 hover:text-white"
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
            <h4 className="text-[14px] font-black mb-5 uppercase tracking-wider text-white">Our Services</h4>
            <ul className="space-y-3">
              {[
                { label: 'Group Classes', to: '/courses' },
                { label: 'Offline Classes', to: '/courses' },
                { label: 'Private Classes', to: '/courses' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.to}
                    className="text-[13px] transition-colors font-medium text-indigo-100/60 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social icons */}
          <div>
            <h4 className="text-[14px] font-black mb-4 uppercase tracking-wider text-white">Quick Connect</h4>
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
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 hover:-translate-y-1 transition-all text-[14px] border border-white/20"
                  style={{ background: 'transparent' }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 className="text-[14px] font-black mb-5 uppercase tracking-wider text-white">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10">
                <HiOutlinePhone className="text-indigo-200 text-[15px]" />
              </div>
              <div className="text-[13px] font-medium leading-relaxed text-indigo-100/70">
                +9876543210<br />+91 9289439711
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/10">
                <HiOutlineMail className="text-indigo-200 text-[15px]" />
              </div>
              <span className="text-[13px] font-medium text-indigo-100/70">mye3-e-tuitions@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-white/10">
                <HiOutlineLocationMarker className="text-indigo-200 text-[15px]" />
              </div>
              <span className="text-[13px] font-medium leading-relaxed text-indigo-100/70">
                FIEE Complex, A-55, Okhla Phase II,<br />
                Okhla Industrial Estate,<br />
                New Delhi, Delhi 110020
              </span>
            </li>
          </ul>

          {/* Email subscribe */}
          <div className="mt-6 flex items-center border rounded-lg overflow-hidden border-white/10">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-3 py-2.5 text-[13px] outline-none placeholder-white/30 bg-white/5 text-white"
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
      <div className="border-t py-5 px-6 md:px-10 text-center border-white/10">
        <p className="text-[12px] font-medium text-white/30">
          © Copyright 2020 - {new Date().getFullYear()} | e-Tuitions Learning Pvt Ltd | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
