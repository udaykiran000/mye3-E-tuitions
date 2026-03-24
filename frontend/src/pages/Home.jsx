import React from 'react';
import { HiArrowRight, HiStatusOnline, HiAcademicCap, HiClock, HiUserGroup, HiShieldCheck, HiOutlineLightBulb, HiCheckCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-32 pb-20 -mt-8">
      {/* HERO SECTION - Inspired by e-tuitions.com */}
      <section className="relative min-h-[80vh] flex flex-col lg:flex-row items-center gap-16 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 -z-10 rounded-l-[100px] hidden lg:block"></div>
        
        <div className="flex-1 space-y-10 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-black uppercase tracking-wider">
            <HiStatusOnline className="text-xl animate-pulse" /> India's Most Trusted Learning Platform
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-tight tracking-tight">
            Learn from <br />
            <span className="text-indigo-600">The Best Tutors</span> <br />
            at Your Home
          </h1>
          
          <p className="text-2xl text-slate-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-semibold">
            Personalized 1-on-1 and Group live classes for CBSE, ICSE, and State Boards. Start your journey to excellence today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
            <Link to="/register" className="btn-primary flex items-center gap-3 px-12 py-6 text-xl shadow-2xl shadow-indigo-300 transform hover:scale-105 active:scale-95 transition-all">
              Book a Free Demo <HiArrowRight />
            </Link>
            <Link to="/store" className="btn-secondary px-12 py-6 text-xl hover:bg-slate-100 transition-all">
              Explore Courses
            </Link>
          </div>

          <div className="flex items-center gap-10 justify-center lg:justify-start pt-8 border-t border-slate-100">
             <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900">10k+</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Happy Students</span>
             </div>
             <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900">500+</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Expert Tutors</span>
             </div>
             <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900">4.9/5</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trust Rating</span>
             </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-2xl relative">
           <div className="premium-card rounded-[50px] overflow-hidden aspect-[4/5] bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] relative group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-700"></div>
              {/* Using generate_image for a placeholder-free experience */}
              <div className="w-full h-full flex items-center justify-center p-12 text-center text-white space-y-6">
                 <HiAcademicCap className="text-[150px] opacity-20" />
                 <h2 className="text-4xl font-black italic leading-tight">"Where Personalized Learning Meets Excellence"</h2>
              </div>
              
              {/* Floating badges */}
              <div className="absolute top-12 -left-8 bg-white p-6 rounded-3xl shadow-2xl animate-bounce duration-[3000ms]">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl font-black">1:1</div>
                    <div className="text-left leading-tight">
                       <p className="font-black text-slate-900">Personalized</p>
                       <p className="text-xs font-bold text-slate-400">Attention</p>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-12 -right-8 bg-white p-6 rounded-3xl shadow-2xl animate-pulse">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl"><HiShieldCheck /></div>
                    <div className="text-left leading-tight">
                       <p className="font-black text-slate-900">Certified</p>
                       <p className="text-xs font-bold text-slate-400">Educators</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* HOW IT WORKS - 4 Step Process */}
      <section className="py-24">
         <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <h2 className="text-indigo-600 font-black uppercase tracking-[0.3em] text-sm">Simple Path to Success</h2>
            <p className="text-5xl font-black text-slate-900">How to get started with Mye3?</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { step: "01", title: "Free Registration", desc: "Create your account in seconds and unlock free resources." },
              { step: "02", title: "Select Your Plan", desc: "Choose from our subject-wise or full class bundles." },
              { step: "03", title: "Join Live Class", desc: "Attend interactive live sessions from the comfort of your home." },
              { step: "04", title: "Track Progress", desc: "Access premium notes and track your exam readiness." }
            ].map((s, i) => (
              <div key={i} className="relative group p-8 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                 <div className="text-7xl font-black text-indigo-100 group-hover:text-indigo-600/10 transition-colors absolute top-0 left-0 leading-none -mt-4 -ml-4">
                    {s.step}
                 </div>
                 <div className="relative z-10 space-y-4 pt-4">
                    <h3 className="text-2xl font-black text-slate-900">{s.title}</h3>
                    <p className="text-slate-500 font-semibold leading-relaxed">{s.desc}</p>
                 </div>
                 {i < 3 && <div className="hidden lg:block absolute top-12 -right-12 w-12 border-t-4 border-dotted border-indigo-100"></div>}
              </div>
            ))}
         </div>
      </section>

      {/* WHY CHOOSE US - Revamped Grid */}
      <section className="bg-slate-900 text-white rounded-[80px] p-16 lg:p-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-24">
           <div className="space-y-8">
              <h2 className="text-emerald-400 font-black uppercase tracking-[0.3em] text-sm">Why Choose Us?</h2>
              <p className="text-5xl md:text-6xl font-black leading-tight">Designed for Modern <br /> Learning</p>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                 We combine traditional teaching excellence with modern digital convenience to provide the best tuition experience.
              </p>
              <ul className="space-y-6">
                 {["Interactive live sessions with top tutors", "Access to recorded versions of all sessions", "Expertly curated premium study notes", "Personalized doubt clearing support"].map((item, idx) => (
                   <li key={idx} className="flex items-center gap-4 text-lg font-bold text-slate-200">
                      <HiCheckCircle className="text-emerald-400 text-2xl" /> {item}
                   </li>
                 ))}
              </ul>
           </div>
           
           <div className="grid grid-cols-2 gap-8">
              {[
                { icon: HiStatusOnline, label: "Live Classes", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
                { icon: HiClock, label: "Recorded", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                { icon: HiOutlineLightBulb, label: "Study Material", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
                { icon: HiUserGroup, label: "1:1 Support", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" }
              ].map((item, i) => (
                <div key={i} className={`p-10 rounded-[40px] border ${item.color} flex flex-col items-center gap-4 group hover:scale-105 transition-all cursor-default`}>
                   <item.icon className="text-5xl group-hover:rotate-12 transition-transform" />
                   <span className="font-black uppercase tracking-widest text-xs">{item.label}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* TESTIMONIALS - Visual Quote Style */}
      <section className="py-24">
         <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl font-black text-slate-900">Loved by Students Across India</h2>
            <p className="text-xl font-bold text-slate-400">Join our growing community of successful learners</p>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="premium-card p-12 bg-indigo-50 border-none rounded-[60px] relative">
               <div className="text-9xl text-indigo-200 absolute -top-4 -left-4 opacity-50 z-0 leading-none">“</div>
               <div className="relative z-10 space-y-10">
                  <p className="text-3xl font-bold text-slate-800 italic leading-relaxed">"Their 1-on-1 attention is what makes them different. My concepts in Physics became crystal clear within just a month."</p>
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl font-black text-indigo-600">RS</div>
                     <div>
                        <p className="text-xl font-black text-slate-900">Rahul Sharma</p>
                        <p className="font-bold text-indigo-600 uppercase tracking-widest text-xs">Class 10 Student</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="space-y-12">
               {[
                 { name: "Priya Patel", role: "Class 12 (Science)", text: "The premium notes are incredibly helpful for quick revision before exams." },
                 { name: "Ankit Verma", role: "Class 8 Student", text: "The live class environment is very interactive and fun to learn in." }
               ].map((t, i) => (
                 <div key={i} className="premium-card p-10 bg-white hover:shadow-2xl transition-all rounded-[40px]">
                    <p className="text-xl font-bold text-slate-600 mb-8 italic">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                       <div>
                          <p className="font-black text-slate-900">{t.name}</p>
                          <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">{t.role}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 bg-indigo-600 rounded-[80px] text-center text-white relative overflow-hidden px-10">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-transparent"></div>
         <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black leading-tight">Ready to Boost Your Grades?</h2>
            <p className="text-2xl text-white/80 font-bold max-w-2xl mx-auto">
               Join Mye3-Elearning today and experience the future of personalized tuition at an affordable price.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link to="/register" className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black text-xl hover:scale-105 transition-all">
                  Register Now - It's Free
               </Link>
               <Link to="/about" className="px-12 py-6 border-2 border-white/20 hover:border-white text-white rounded-3xl font-black text-xl transition-all">
                  Learn More About Us
               </Link>
            </div>
         </div>
         {/* Decorative elements */}
         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default Home;
