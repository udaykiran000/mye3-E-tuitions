import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, Users, Clock, AlertCircle, Loader2, BookOpen } from 'lucide-react';

const LiveMonitor = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLive = async () => {
            try {
                const { data } = await axios.get('/admin/stats');
                setSessions(data.activeSessions || []);
                setLoading(false);
            } catch (error) {
                console.error('FAILED TO FETCH LIVE:', error);
                setLoading(false);
            }
        };
        fetchLive();
        const interval = setInterval(fetchLive, 30000); // 30s heartbeat
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="space-y-10 p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Live & Schedule Class</h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Real-time surveillance of ongoing educational sessions</p>
                </div>
                <div className="flex items-center gap-4 bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl border border-emerald-100">
                    <Activity className="w-6 h-6 animate-pulse" />
                    <div>
                        <p className="text-xs font-black uppercase">System Status</p>
                        <p className="text-sm font-black">All Streams Healthy</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {sessions.length > 0 ? sessions.map((s, i) => (
                    <div key={i} className="premium-card overflow-hidden bg-white group hover:border-indigo-500 transition-all">
                        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                            <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${
                                s.status === 'live' ? 'bg-rose-600 animate-pulse' : 'bg-indigo-600'
                            }`}>
                                {s.status === 'live' ? 'LIVE NOW' : 'UPCOMING'}
                            </span>
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-black">ACTIVE MONITOR</span>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-indigo-500" />
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-100 pb-0.5">
                                        {s.classLevel ? `Target: ${s.classLevel}` : 'Global Enrollment'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">{s.title}</h3>
                                <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
                                    Subject: <span className="text-slate-900">{s.subjectName}</span>
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-black">T</div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Primary Tutor</p>
                                        <p className="text-sm font-black text-slate-900">{s.teacherId?.name || 'Assigned Instructor'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>STARTED: {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span>SECURE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50">
                                <a 
                                  href={s.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full py-5 text-center bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-900/10"
                                >
                                  Join Classroom
                                </a>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-32 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem]">
                        <div className="max-w-xs mx-auto space-y-4 opacity-30">
                            <AlertCircle className="w-16 h-16 mx-auto text-slate-400" />
                            <div>
                                <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Active Sessions</p>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">Global monitoring currently idle. All classrooms are quiet.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveMonitor;
