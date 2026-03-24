import React, { useState } from 'react';
import { HiPlus, HiCollection } from 'react-icons/hi';

const TeacherDashboard = () => {
  const [topic, setTopic] = useState('');
  const [classRange, setClassRange] = useState('');
  const [subject, setSubject] = useState('');
  const [platform, setPlatform] = useState('Zoom');
  const [link, setLink] = useState('');

  const subjects = {
    '6-10': ['Mathematics', 'Science', 'English', 'Social Studies'],
    '11-12': ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Economics']
  };

  const currentSubjects = classRange ? subjects[classRange] : [];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-10">Teacher Control Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="premium-card p-8">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-red-100 text-red-600 rounded-xl"><HiPlus className="text-2xl" /></div>
             <h2 className="text-2xl font-bold text-slate-900">Schedule Live Class</h2>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Level</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-bold"
                  onChange={(e) => setClassRange(e.target.value)}
                  value={classRange}
                >
                  <option value="">Select Level</option>
                  <option value="6-10">Class 6-10</option>
                  <option value="11-12">Class 11-12</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Subject</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-bold"
                  disabled={!classRange}
                  onChange={(e) => setSubject(e.target.value)}
                  value={subject}
                >
                  <option value="">Select Subject</option>
                  {currentSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Topic Title</label>
              <input 
                type="text"
                placeholder="e.g., Intro to Quantum Physics"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-bold"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Platform</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-bold"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  <option value="Zoom">Zoom</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="YouTube Live">YouTube Live</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Meeting URL</label>
                <input 
                  type="text"
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none font-bold"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="w-full btn-primary mt-4">Broadcast & Link Live session</button>
          </form>
        </div>

        <div className="premium-card p-8 bg-slate-900 border-none text-white overflow-hidden relative">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl"><HiCollection className="text-2xl" /></div>
                <h2 className="text-2xl font-bold">Content Inventory</h2>
              </div>
              
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
                       <div>
                          <p className="font-bold">Calculus Basics (Notes PDF)</p>
                          <p className="text-xs text-white/40">Class 12 • Physics • Yesterday</p>
                       </div>
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-indigo-400 font-bold text-sm">Delete</button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32"></div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
