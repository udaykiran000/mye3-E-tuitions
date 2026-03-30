import React, { useState } from 'react';
import { FiSearch, FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent! We'll get back to you shortly.");
    setFormData({ name: '', email: '', mobile: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white font-sans w-full min-h-screen flex flex-col">
      {/* Top Search Strip (Consistent UI) */}
      <div className="bg-[#002147] py-[16px] px-4 w-full border-b border-[#001b3a]">
        <div className="max-w-[750px] mx-auto flex h-[52px] shadow-sm">
          <div className="flex-1 relative flex items-center bg-white rounded-l-sm overflow-hidden">
            <FiSearch className="text-[#999] w-[18px] h-[18px] ml-5 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search For Information..."
              className="w-full py-2 px-4 text-[15px] text-[#555] outline-none h-full bg-transparent placeholder-[#999]"
            />
          </div>
          <button className="bg-[#f16126] text-white px-8 md:px-10 h-full text-[14px] font-semibold uppercase tracking-wide rounded-r-sm hover:bg-[#de551e] transition-colors flex-shrink-0">
            Search
          </button>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 py-20 pb-28 w-full">
        {/* Page Header */}
        <div className="text-center mb-20 space-y-4">
          <h1 className="text-[42px] font-black tracking-tight">
            <span className="text-[#002147]">Contact </span>
            <span className="text-[#f16126]">Us</span>
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto text-[16px] leading-relaxed italic">
            Got questions about our courses or need assistance? Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Contact Info Column */}
          <div className="lg:w-[40%] w-full space-y-10">
            <div className="relative">
              <h2 className="text-[26px] font-black text-[#002147] uppercase tracking-tight mb-2">Get In Touch</h2>
              <div className="w-16 h-1.5 bg-[#f16126] rounded-full"></div>
            </div>

            <p className="text-[#666] text-[15px] leading-relaxed">
              We are here to support your learning journey every step of the way. Feel free to reach out for course information, technical support, or even a simple hello.
            </p>

            <ul className="space-y-8">
              <li className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-[#f16126] text-xl group-hover:bg-[#f16126] group-hover:text-white transition-all shadow-sm">
                  <FiPhone />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-[#002147] uppercase tracking-widest mb-1">Phone</h4>
                  <p className="text-[15px] font-bold text-[#555]">+9876543210 / +91 9289439711</p>
                </div>
              </li>

              <li className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-[#f16126] text-xl group-hover:bg-[#f16126] group-hover:text-white transition-all shadow-sm">
                  <FiMail />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-[#002147] uppercase tracking-widest mb-1">Email</h4>
                  <p className="text-[15px] font-bold text-[#555]">mye3-e-tuitions@gmail.com</p>
                </div>
              </li>

              <li className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-[#f16126] text-xl group-hover:bg-[#f16126] group-hover:text-white transition-all shadow-sm">
                  <FiMapPin />
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-[#002147] uppercase tracking-widest mb-1">Address</h4>
                  <p className="text-[15px] font-bold text-[#555] leading-relaxed">
                    FIEE Complex, A-55, Okhla Phase II,<br />Okhla Industrial Estate, New Delhi 110020
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Right: Contact Form Column */}
          <div className="lg:w-[60%] w-full">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100">
              <h3 className="text-[20px] font-bold text-[#002147] mb-8">Send Us A Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 focus-within:text-[#f16126]">
                    <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter Full Name" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f16126] focus:bg-white transition-all text-[#333]" 
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-[#f16126]">
                    <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Your Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Enter Email Address" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f16126] focus:bg-white transition-all text-[#333]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 focus-within:text-[#f16126]">
                    <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Mobile No</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 XXXXX XXXXX" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f16126] focus:bg-white transition-all text-[#333]" 
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-[#f16126]">
                    <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="What is this about?" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f16126] focus:bg-white transition-all text-[#333]" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5 focus-within:text-[#f16126]">
                  <label className="text-[12px] font-black uppercase tracking-wider text-slate-500">Your Message</label>
                  <textarea 
                    rows="5"
                    required
                    placeholder="Write your query here..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#f16126] focus:bg-white transition-all text-[#333]"
                  ></textarea>
                </div>

                <button className="w-full bg-[#002147] text-white py-4 rounded-lg font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#f16126] transition-all shadow-lg active:scale-95 shadow-[#002147]/20 hover:shadow-[#f16126]/40">
                  <FiSend className="text-lg" />
                  Send Information
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Placeholder */}
      <div className="w-full h-[450px] bg-slate-100 grayscale hover:grayscale-0 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.414619472304!2d77.2721!3d28.5372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3ec20000001%3A0x1000000000000000!2sOkhla%20Industrial%20Estate%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1654321098765" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
          title="Mye3-e-Tuitions Office Map"
        ></iframe>
      </div>

      {/* Orange Banner (UI Consistency) */}
      <div className="bg-[#f06522] py-[55px] px-4">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-14">
          <div className="flex items-center gap-6 md:gap-14 md:w-3/4">
            {/* Perfectly matched bulb icon */}
            <div className="relative flex-shrink-0 w-[80px] h-[80px] flex items-center justify-center">
              <div className="absolute inset-0">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => (
                  <div 
                    key={degree}
                    className="absolute top-1/2 left-1/2 w-[12px] h-[2.5px] bg-[#fbc02d] rounded-full"
                    style={{ transform: `translate(-50%, -50%) rotate(${degree}deg) translate(32px)` }}
                  ></div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-[42px] h-[42px] bg-[#fbc02d] rounded-full relative">
                  <div className="absolute top-[6px] left-[8px] w-[8px] h-[12px] border-l-[3px] border-t-[3px] border-white/40 rounded-tl-full"></div>
                </div>
                <div className="w-[18px] h-[12px] bg-[#34495e] mt-[-3px] flex flex-col gap-[2px] items-center py-[1px] rounded-b-sm">
                  <div className="w-full h-[2px] bg-black/20"></div>
                  <div className="w-[80%] h-[2px] bg-black/20"></div>
                  <div className="w-[60%] h-[2px] bg-black/20"></div>
                </div>
              </div>
            </div>
            
            <div className="text-white">
              <h2 className="text-[20px] md:text-[27px] font-bold uppercase mb-2 tracking-wide">
                Therefore Always Free From Repetition
              </h2>
              <p className="text-white/95 text-[14px] md:text-[15px] leading-relaxed max-w-2xl">
                Ready to transform your future? Connect with our education experts today for a personalized guidance session.
              </p>
            </div>
          </div>
          <div className="md:w-1/4 flex md:justify-end w-full pl-24 md:pl-0">
            <button className="border-[1.5px] border-white text-white font-medium px-8 py-[12px] text-[14.5px] rounded-[30px] hover:bg-white hover:text-[#f06522] transition-colors shadow-sm tracking-wide whitespace-nowrap">
              Book This Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
