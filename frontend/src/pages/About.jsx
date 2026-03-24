import React from 'react';
import { HiCheckCircle, HiLightBulb, HiSun, HiShieldCheck } from 'react-icons/hi';
import { FaGraduationCap, FaUserTie, FaRocket } from 'react-icons/fa';

const About = () => {
  return (
    <div className="space-y-32 pb-32">
      {/* HERO SECTION */}
      <section className="relative py-32 bg-indigo-600 rounded-[60px] text-white overflow-hidden text-center px-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/img/about_hero.png" 
            alt="About Mye3 Hero" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-700/80 to-emerald-900/40"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
           <h1 className="text-6xl md:text-8xl font-black leading-[1.1]">Transforming <br /> Online Education</h1>
           <p className="text-2xl font-bold text-white/80 leading-relaxed max-w-2xl mx-auto">
              Mye3-Elearning is India's premier online tuition platform where every student gets the personalized attention they deserve.
           </p>
        </div>
      </section>

      {/* CORE VISION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
         <div className="space-y-8">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">Our Mission</h2>
            <p className="text-5xl font-black text-slate-900 leading-tight">Empowering Students Through Personalized Focus</p>
            <p className="text-xl text-slate-500 font-semibold leading-relaxed">
               We believe that education is not a "one size fits all" process. Every student has a unique learning pace and style. At Mye3, we bridge the gap between classroom teaching and individual understanding.
            </p>
            <div className="space-y-6">
               {[
                 { title: "Personalized 1:1 Care", desc: "No more getting lost in large classrooms. Each student is our priority." },
                 { title: "Expert Tutors", desc: "Hand-picked educators from top universities with passion for teaching." },
                 { title: "Premium Resources", desc: "High-quality notes and practice sets to ensure concept clarity." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                    <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 animate-pulse">
                       <HiCheckCircle />
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-slate-900 mb-1">{item.title}</h4>
                       <p className="text-slate-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8 mt-12">
               <div className="premium-card p-10 bg-indigo-50 border-none rounded-[40px] shadow-2xl shadow-indigo-200">
                  <FaGraduationCap className="text-5xl text-indigo-600 mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">Academic <br /> Integrity</h3>
               </div>
               <div className="premium-card p-10 bg-emerald-50 border-none rounded-[40px] shadow-2xl shadow-emerald-200">
                  <HiSun className="text-5xl text-emerald-600 mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">Positive <br /> Environment</h3>
               </div>
            </div>
            <div className="space-y-8">
               <div className="premium-card p-10 bg-amber-50 border-none rounded-[40px] shadow-2xl shadow-amber-200">
                  <FaUserTie className="text-5xl text-amber-600 mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">Professional <br /> Mentors</h3>
               </div>
               <div className="premium-card p-10 bg-rose-50 border-none rounded-[40px] shadow-2xl shadow-rose-200">
                  <HiLightBulb className="text-5xl text-rose-600 mb-6" />
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">Creative <br /> Solutions</h3>
               </div>
            </div>
         </div>
      </section>

      {/* THE Mye3 PROMISE */}
      <section className="bg-slate-900 text-white rounded-[80px] p-16 lg:p-32 text-center space-y-20 relative overflow-hidden">
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent"></div>
         
         <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <HiShieldCheck className="text-8xl text-indigo-400 mx-auto" />
            <h2 className="text-5xl font-black leading-tight">The Mye3 Promise</h2>
            <p className="text-xl text-slate-400 font-medium">
               We don't just teach; we mentor. Our commitment is to ensure that every student who joins us feels more confident in their subjects after every single session.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { icon: FaRocket, val: "100%", label: "Curriculum Coverage" },
              { icon: HiStatusOnline, val: "24/7", label: "Dashboard Access" },
              { icon: HiAcademicCap, val: "500+", label: "Expert Educators" }
            ].map((stat, i) => (
              <div key={i} className="space-y-4">
                 <stat.icon className="text-5xl text-indigo-400 mx-auto mb-4" />
                 <p className="text-5xl font-black text-white">{stat.val}</p>
                 <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* MEET OUR TUTORS CTA */}
      <section className="py-20 text-center space-y-12">
         <h2 className="text-5xl font-black text-slate-900">Experience the Difference Today</h2>
         <p className="text-xl text-slate-500 max-w-2xl mx-auto font-bold leading-relaxed">
            Join thousands of students who have already taken the first step towards academic freedom and excellence.
         </p>
         <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <button className="btn-primary px-16 py-6 text-xl">Book a Free Session</button>
            <button className="text-indigo-600 font-black text-lg underline underline-offset-8">View Tutoring Plans</button>
         </div>
      </section>
    </div>
  );
};

export default About;
