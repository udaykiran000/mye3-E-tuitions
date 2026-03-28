import React from 'react';
import { HiArrowRight, HiStatusOnline, HiAcademicCap, HiClock, HiUserGroup, HiShieldCheck, HiOutlineLightBulb, HiCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-20 md:space-y-32 pb-20 -mt-8 px-4 md:px-0 max-w-7xl mx-auto">
      {/* HERO SECTION - Inspired by e-tuitions.com */}
      <section className="relative min-h-[70vh] lg:min-h-[80vh] flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-12 md:py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 -z-10 rounded-2xl hidden lg:block"></div>
        
        <div className="flex-1 space-y-8 md:space-y-10 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest shadow-sm">
            <HiStatusOnline className="text-lg animate-pulse" /> Global Learning Standard
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-tight tracking-tight uppercase">
            Mastery <br />
            <span className="text-indigo-600">Without Bounds</span> <br />
            From Your Space
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-bold italic">
            Synchronized 1-on-1 and Group live classes for CBSE, ICSE, and Competitive Boards. Precision learning at your fingertips.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center lg:justify-start pt-4">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-xl font-black text-sm md:text-xl shadow-xl shadow-indigo-900/10 transform hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest">
              Join Demo <HiArrowRight />
            </Link>
            <Link to="/courses" className="w-full sm:w-auto flex items-center justify-center px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-xl font-black text-sm md:text-xl hover:bg-slate-50 transition-all uppercase tracking-widest">
              Explore Vault
            </Link>
          </div>

          <div className="flex items-center gap-8 md:gap-10 justify-center lg:justify-start pt-8 border-t border-slate-100 flex-wrap">
             <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-slate-900">10K+</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Minds</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-slate-900">500+</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elite Tutors</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-slate-900">4.9/5</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Index</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-2xl relative mt-12 lg:mt-0">
           <div className="premium-card rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-2xl shadow-indigo-900/20 relative group">
              <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent transition-all duration-700"></div>
              
              <div className="w-full h-full flex flex-col items-center justify-center p-8 md:p-12 text-center text-white space-y-6">
                 <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mb-4 group-hover:rotate-6 transition-transform">
                    <HiAcademicCap className="text-5xl md:text-6xl text-white" />
                 </div>
                 <h2 className="text-2xl md:text-4xl font-black italic underline decoration-indigo-500 decoration-4 underline-offset-8 uppercase tracking-tight">"The Nexus of <br /> Adaptive Intelligence"</h2>
              </div>
              
              {/* Floating badges - Optimized for mobile */}
              <div className="absolute top-8 left-4 md:-left-8 bg-white p-4 md:p-6 rounded-xl shadow-2xl group-hover:-translate-y-2 transition-transform">
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-lg md:text-xl font-black">1:1</div>
                    <div className="text-left leading-tight">
                       <p className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-tight">Synchronized</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attention</p>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-8 right-4 md:-right-8 bg-white p-4 md:p-6 rounded-xl shadow-2xl group-hover:translate-y-2 transition-transform">
                 <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xl md:text-2xl"><HiShieldCheck /></div>
                    <div className="text-left leading-tight">
                       <p className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-tight">Verified</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* HOW IT WORKS - Step Process */}
      <section className="py-12 md:py-24">
         <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4 px-6 font-black uppercase">
            <h2 className="text-indigo-600 tracking-[0.3em] text-[10px] md:text-xs">Precision Workflow</h2>
            <p className="text-3xl md:text-5xl text-slate-900 tracking-tight">Initialize Your Success</p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
            {[
              { step: "01", title: "Activation", desc: "Initialize your user record in our synchronized educational hub." },
              { step: "02", title: "Allocation", desc: "Select your specialized curriculum or full academic bundles." },
              { step: "03", title: "Deployment", desc: "Attend high-bandwidth interactive live sessions instantly." },
              { step: "04", title: "Assessment", desc: "Analyze and track your performance via our data engine." }
            ].map((s, i) => (
              <div key={i} className="relative group p-6 md:p-8 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                 <div className="text-6xl md:text-7xl font-black text-indigo-50 group-hover:text-indigo-600/10 transition-colors absolute top-0 left-0 leading-none -mt-4 -ml-4">
                    {s.step}
                 </div>
                 <div className="relative z-10 space-y-3 pt-4">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">{s.title}</h3>
                    <p className="text-slate-500 font-bold italic text-sm leading-relaxed">{s.desc}</p>
                 </div>
                 {i < 3 && <div className="hidden lg:block absolute top-12 -right-12 w-12 border-t-2 border-dotted border-indigo-100"></div>}
              </div>
            ))}
         </div>
      </section>

      {/* WHY CHOOSE US - Sharp Layout */}
      <section className="bg-slate-950 text-white rounded-2xl md:rounded-3xl p-8 md:p-16 lg:p-24 relative overflow-hidden shadow-2xl shadow-indigo-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
           <div className="space-y-6 md:space-y-8">
              <h2 className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Competitive Edge</h2>
              <p className="text-4xl md:text-6xl font-black leading-tight uppercase tracking-tight italic">Adaptive <br /> Logic Hub</p>
              <p className="text-lg md:text-xl text-slate-400 font-bold leading-relaxed italic">
                 We synchronize traditional teaching excellence with state-of-the-art digital infrastructure.
              </p>
              <ul className="space-y-4 md:space-y-6">
                 {["Interactive live sessions with top tutors", "Cloud-stored session recordings", "Curated high-density study assets", "Direct 1:1 consultation support"].map((item, idx) => (
                   <li key={idx} className="flex items-center gap-3 md:gap-4 text-sm md:text-lg font-black uppercase tracking-tight text-slate-200">
                      <HiCheckCircle className="text-emerald-400 text-xl md:text-2xl shrink-0" /> {item}
                   </li>
                 ))}
              </ul>
           </div>
           
           <div className="grid grid-cols-2 gap-4 md:gap-8">
              {[
                { icon: HiStatusOnline, label: "Live Broadcast", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" },
                { icon: HiClock, label: "Playback", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
                { icon: HiOutlineLightBulb, label: "Data Assets", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
                { icon: HiUserGroup, label: "User Support", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" }
              ].map((item, i) => (
                <div key={i} className={`p-6 md:p-10 rounded-xl md:rounded-2xl border ${item.color} flex flex-col items-center gap-3 md:gap-4 group hover:bg-white/5 transition-all cursor-crosshair`}>
                   <item.icon className="text-4xl md:text-5xl group-hover:scale-110 transition-transform" />
                   <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px] text-center">{item.label}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA SECTION - Updated */}
      <section className="py-16 md:py-32 bg-indigo-600 rounded-2xl md:rounded-3xl text-center text-white relative overflow-hidden px-6 md:px-10 shadow-2xl shadow-indigo-900/30">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-transparent"></div>
         <div className="relative z-10 space-y-8 md:space-y-12 max-w-4xl mx-auto font-black uppercase">
            <h2 className="text-4xl md:text-7xl leading-tight tracking-tight">Launch Your Potential</h2>
            <p className="text-lg md:text-2xl text-white/80 font-bold italic max-w-2xl mx-auto normal-case">
               Experience the future of synchronized learning. Professional tuition at a revolutionary standard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
               <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 rounded-xl font-black text-sm md:text-xl shadow-xl shadow-indigo-900/20 hover:bg-slate-50 transition-all uppercase tracking-widest">
                  Initialize Account
               </Link>
               <Link to="/about" className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 hover:bg-white/10 text-white rounded-xl font-black text-sm md:text-xl transition-all uppercase tracking-widest">
                  Documentation
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
