import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiCheckCircle, 
  FiStar, 
  FiAward, 
  FiMessageCircle,
  FiArrowRight,
  FiLinkedin,
  FiTwitter
} from 'react-icons/fi';
import { GraduationCap, Users, BookOpen, Clock } from 'lucide-react';
import teacherMaths from '../assets/teacher-maths.png';
import teacherPhysics from '../assets/teacher-physics.png';
import teacherChemistry from '../assets/teacher-chemistry.png';

const Teachers = () => {
  const teachers = [
    {
      name: "Dr. Rajesh Kumar",
      subject: "Mathematics Expert",
      qualification: "M.Sc, PhD (IIT Madras)",
      experience: "15+ Years Experience",
      image: teacherMaths,
      specialization: "Calculus & Algebra",
      bio: "Passionate about making complex mathematical concepts simple and intuitive for competitive exams."
    },
    {
      name: "Mrs. Anjali Sharma",
      subject: "Physics Specialist",
      qualification: "B.Tech, M.Tech (NIT Warangal)",
      experience: "10+ Years Experience",
      image: teacherPhysics,
      specialization: "Mechanics & Optics",
      bio: "Expert in visual learning techniques for Physics, helping students ace JEE and NEET with ease."
    },
    {
      name: "Mr. Vikram Singh",
      subject: "Chemistry Guru",
      qualification: "M.Sc Chemistry, B.Ed",
      experience: "12+ Years Experience",
      image: teacherChemistry,
      specialization: "Organic & Physical Chemistry",
      bio: "Dedicated to simplifying chemical equations and reactions through real-world applications."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* ── SEARCH STRIP (Uniform with Store) ── */}
      <div className="bg-[#002147] py-4 px-4 border-b border-[#001b3a]">
        <div className="max-w-[800px] mx-auto flex h-14 shadow-2xl relative z-20">
          <div className="flex-1 relative flex items-center bg-white rounded-l-xl overflow-hidden border-y border-l border-white/20">
            <FiSearch className="text-slate-400 w-5 h-5 ml-6 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Find your favorite teacher or subject..."
              className="w-full py-2 px-5 text-[15px] text-[#002147] font-bold outline-none h-full bg-transparent placeholder-slate-400"
            />
          </div>
          <button className="bg-[#f16126] text-white px-10 h-full text-[13px] font-black uppercase tracking-[0.2em] rounded-r-xl hover:bg-[#de551e] transition-all flex-shrink-0 shadow-lg active:scale-95">
            Search faculty
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-20 pb-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-60" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] -ml-40 -mb-40 opacity-40" />

        <div className="text-center space-y-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 rounded-full border border-orange-100 mb-4"
          >
            <FiStar className="text-[#f16126] w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f16126]">Academic Excellence</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-[#002147] tracking-tighter leading-[1.1] uppercase italic"
          >
            Meet Our <span className="text-[#f16126] not-italic">World-Class</span> <br/>Faculty
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-[#64748b] font-bold text-base md:text-lg leading-relaxed italic"
          >
            Learn from the brightest minds in the education industry. Our teachers are 
            handpicked from top institutions like IITs and NITs to group your child's success.
          </motion.p>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { label: "Expert Teachers", val: "50+", icon: GraduationCap, color: "text-[#002147]" },
            { label: "Years of Trust", val: "10+", icon: Clock, color: "text-[#f16126]" },
            { label: "Happy Students", val: "10k+", icon: Users, color: "text-emerald-500" },
            { label: "Quality Lessons", val: "5000+", icon: BookOpen, color: "text-blue-500" }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-2 hover:shadow-lg transition-all"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-black text-[#002147] leading-none tracking-tight">{stat.val}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── TEACHER GRID ── */}
      <div className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 px-4">
            {teachers.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-navy-900/10 transition-all flex flex-col p-8"
              >
                {/* Image Section */}
                <div className="relative h-64 md:h-72 rounded-[24px] overflow-hidden mb-8 shadow-inner bg-slate-50">
                  <img 
                    src={t.image} 
                    alt={t.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-[#002147] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border border-white/20 shadow-xl backdrop-blur-md">
                     {t.subject}
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="w-9 h-9 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-[#002147] transition-all border border-white/20">
                      <FiLinkedin className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-all border border-white/20">
                      <FiTwitter className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 flex-1">
                   <div>
                     <p className="text-[10px] font-black text-[#f16126] uppercase tracking-[0.25em] mb-2">{t.qualification}</p>
                     <h3 className="text-2xl font-black text-[#002147] uppercase italic tracking-tight group-hover:text-[#f16126] transition-colors">{t.name}</h3>
                   </div>
                   
                   <div className="flex flex-col gap-2 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                         <FiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {t.experience}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                         <FiAward className="w-4 h-4 text-orange-500 shrink-0" /> Special: {t.specialization}
                      </div>
                   </div>

                   <p className="text-slate-400 font-bold italic text-[13px] leading-relaxed pt-2">
                     "{t.bio}"
                   </p>
                </div>

                <button className="mt-10 w-full py-4 bg-[#002147] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-[#f16126] transition-all shadow-xl active:scale-95 group/btn">
                  Book Free Demo <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTACT CTA (Consistent with Home/About) ── */}
      <div className="bg-[#f06522] py-20 px-6 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wide leading-none italic">Join The League of <span className="text-[#002147] not-italic">Top Educators</span></h2>
             <p className="text-white/90 text-sm md:text-lg font-bold italic leading-loose max-w-2xl mx-auto">
                Are you a passionate educator wanting to make a difference? Join our faculty and start your journey of shaping legends.
             </p>
             <div className="flex flex-col md:flex-row items-center justify-center gap-6">
               <button className="w-full md:w-auto bg-[#002147] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-[#002147] transition-all shadow-2xl active:scale-95">
                  Apply As Teacher
               </button>
               <button className="w-full md:w-auto border-2 border-white text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-[#f16126] transition-all active:scale-95">
                  Contact Support
               </button>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Teachers;
