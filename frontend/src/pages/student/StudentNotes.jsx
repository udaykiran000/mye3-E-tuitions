import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Search,
  Download,
  Loader2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Filter,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

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
    const matchesSearch = n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.classLevel?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || n.type?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 pb-10 p-2 md:p-6 lg:p-10 font-sans">

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Study Materials Central
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">
            Your <span className="text-indigo-600">Class Notes</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-[0.2em]">Access all your premium resources in one place.</p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search notes or subjects..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-sm font-bold shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* CONTENT GRID */}
      <AnimatePresence mode="popLayout">
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center space-y-6 bg-white rounded-[48px] border-2 border-dashed border-indigo-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-indigo-50 text-indigo-200 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
              <BookOpen className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#002147] uppercase italic tracking-tighter">No Resources Found</h3>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.25em] max-w-sm mx-auto leading-relaxed italic">
                Adjust your search or check your active class subscriptions.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={note._id || idx}
                className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-indigo-900/10 transition-all group flex flex-col relative overflow-hidden"
              >
                {/* Accent Background Icons */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150 rotate-12 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-indigo-600/30" />
                </div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${note.type === 'Assignment' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                      {note.type || 'Study Note'}
                    </span>
                    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-tighter tabular-nums">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-8 flex-1 relative z-10">
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{note.subjectName || note.classLevel || 'General Resource'}</p>
                  <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight line-clamp-2 italic group-hover:text-indigo-600 transition-colors">
                    {note.title}
                  </h3>
                </div>

                <div className="pt-5 border-t border-slate-50 flex items-center gap-3 relative z-10">
                  <a
                    href={note.fileUrl}
                    download
                    className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-navy-100 active:scale-[0.98] group/btn"
                  >
                    Download <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                  </a>
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-[46px] bg-slate-50 text-slate-400 border border-slate-100 rounded-xl flex items-center justify-center hover:bg-white hover:text-indigo-600 hover:border-indigo-100 transition-all group/view"
                  >
                    <ArrowRight className="w-5 h-5 group-hover/view:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* PRO TIP FOOTER */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-black uppercase italic tracking-tighter">Strategic Learning <span className="text-indigo-400">Archive</span></h4>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">We add fresh materials daily. stay tuned for new updates!</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black shadow-lg">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-tighter">Joined by<br /><span className="text-white">1.2K Students</span></p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentNotes;
