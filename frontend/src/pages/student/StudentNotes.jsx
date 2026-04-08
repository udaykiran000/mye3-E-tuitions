import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import {
  FileText,
  Search,
  Download,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentNotes = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get('/student/all-materials');
        setNotes(data || []);
        setLoading(false);
      } catch (err) {
        console.error('FETCH_NOTES_FAIL:', err);
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(n => {
    const query = searchQuery.toLowerCase();
    return (
      n.title?.toLowerCase().includes(query) ||
      n.subjectName?.toLowerCase().includes(query) ||
      n.classLevel?.toLowerCase().includes(query)
    );
  });

  if (loading) return (
    <div className="p-10 space-y-10 animate-pulse bg-white min-h-screen">
       <div className="h-20 bg-slate-50 rounded-2xl w-1/3" />
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-50 rounded-[32px]" />)}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-24 p-6 md:p-12 lg:px-20 animate-in fade-in duration-1000">
      
      {/* ULTRA-CLEAN MINIMAL HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-[2px] bg-[#002147]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Faculty Repository</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-[#002147] leading-none">
            STUDY <span className="text-slate-200 not-italic font-light">ACCESS</span>
          </h1>
          <p className="text-slate-400 font-bold italic text-sm uppercase tracking-widest leading-none">
            Curated study materials for your specialization.
          </p>
        </div>

        {/* MINIMAL SEARCH */}
        <div className="relative w-full lg:w-[400px]">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#002147]" />
          <input
            type="text"
            placeholder="SEARCH MATERIALS..."
            className="w-full pl-10 pr-4 py-4 bg-transparent border-b-2 border-slate-100 focus:border-[#002147] focus:outline-none text-[12px] font-black uppercase tracking-widest transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT GRID */}
      <AnimatePresence mode="popLayout">
        {filteredNotes.length === 0 ? (
          <div className="py-40 text-center space-y-4">
             <BookOpen className="w-12 h-12 text-slate-100 mx-auto" />
             <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] italic">No archived items matching your search.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {filteredNotes.map((note, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={note._id || idx}
                className="group flex flex-col space-y-8"
              >
                {/* CARD CONTAINER */}
                <div className="bg-slate-50 rounded-[40px] p-10 h-[300px] flex flex-col justify-between transition-all duration-500 hover:bg-[#002147] group-hover:shadow-2xl group-hover:shadow-indigo-900/10 hover:-translate-y-2 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8">
                      <div className="px-3 py-1 bg-white rounded-full text-[8px] font-black uppercase tracking-widest text-[#002147] border border-slate-100">
                         {note.type || 'NOTE'}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500" />
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-300 transition-colors italic leading-none truncate">
                            {note.subjectName?.replace(/class/gi, '').trim() || 'General'}
                         </p>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-[#002147] uppercase italic tracking-tighter leading-[1.1] group-hover:text-white transition-colors duration-500 line-clamp-3">
                        {note.title}
                      </h3>
                   </div>

                   <div className="flex items-center gap-4">
                      <a
                        href={note.fileUrl}
                        download
                        className="flex-1 py-5 bg-white text-[#002147] rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-500 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                         DOWNLOAD <Download className="w-4 h-4" />
                      </a>
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-16 h-16 bg-white text-[#002147] rounded-3xl flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-slate-100 group-hover:border-white/10"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </a>
                   </div>
                </div>

                {/* CARD FOOTER */}
                <div className="px-6 flex items-center justify-between">
                   <p className="text-[10px] font-bold text-slate-300 uppercase italic tabular-nums">Ref: A-{idx + 1001}</p>
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Verified Original</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentNotes;
