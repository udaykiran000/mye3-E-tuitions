import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, BookOpen, Clock, DollarSign, Calendar as CalendarIcon, CheckCircle, PlayCircle, Loader2, Award, GraduationCap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TeacherProfile = ({ teacher, onBack }) => {
    const [sessions, setSessions] = useState({ past: [], present: [], future: [] });
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'daily'

    useEffect(() => {
        fetchData();
    }, [teacher._id]);

    const fetchData = async () => {
        try {
            const [sessionsRes, payoutsRes] = await Promise.all([
                axios.get('/admin/live-sessions'),
                axios.get('/admin/payroll')
            ]);
            
            const now = new Date();
            // Filter sessions for this teacher
            const teacherSessions = (sessionsRes.data || []).filter(s => 
                String(s.teacherId?._id || s.teacherId) === String(teacher._id)
            ).map(s => {
                const startTime = new Date(s.startTime);
                const endTime = new Date(s.endTime);
                let status = s.status;
                
                // Real-time status override for display logic
                if (status !== 'ended' && status !== 'live') {
                    if (startTime > now) status = 'upcoming';
                    else if (startTime < now) status = 'missed';
                }
                return { ...s, displayStatus: status };
            });
            
            const past = teacherSessions.filter(s => s.displayStatus === 'ended' || s.displayStatus === 'missed');
            const present = teacherSessions.filter(s => s.displayStatus === 'live');
            const future = teacherSessions.filter(s => s.displayStatus === 'upcoming');

            setSessions({ past, present, future });

            // Filter payouts for this teacher
            const teacherPayouts = (payoutsRes.data || []).filter(p => 
                String(p.teacherId?._id || p.teacherId) === String(teacher._id)
            );
            setPayouts(teacherPayouts);
            
        } catch (error) {
            toast.error('Failed to load teacher stats');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async (payoutId) => {
        try {
            await axios.put(`/admin/payroll/${payoutId}/pay`, { transactionId: 'Manual Admin Settlement' });
            toast.success('Payout marked as Settled');
            setPayouts(prev => prev.map(p => p._id === payoutId ? { ...p, status: 'Paid' } : p));
        } catch (error) {
            toast.error('Failed to update payout status');
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#f16126] animate-spin" />
        </div>
    );

    // Performance mock calculation (could be based on actual metrics if available)
    const completedClasses = sessions.past.length;
    const performanceScore = completedClasses > 0 ? Math.min(100, 75 + (completedClasses * 2)) : 0; 
    const totalEarnings = payouts.filter(p => p.status === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0);

    // Calculate Daily Earnings dynamically from past sessions
    const getSessionRate = (level) => {
        const cl = (level || '').toLowerCase();
        if (cl.includes('11') || cl.includes('12') || cl.includes('inter')) return teacher.payRates?.rateB || 0;
        return teacher.payRates?.rateA || 0;
    };

    const getMonday = (d) => {
        const dt = new Date(d);
        const day = dt.getDay(), diff = dt.getDate() - day + (day === 0 ? -6:1);
        dt.setDate(diff);
        return dt;
    };

    const allSessionsObj = [...sessions.past, ...sessions.present, ...sessions.future];

    const buildGroupedData = (groupType) => {
        const obj = allSessionsObj.reduce((acc, s) => {
            const dateRef = s.endTime || s.startTime;
            if (!dateRef) return acc;
            
            let key, dateObj, displayDate;
            const d = new Date(dateRef);
            if (groupType === 'daily') {
                dateObj = d;
                key = d.toLocaleDateString('en-GB');
                displayDate = key;
            } else {
                const monday = getMonday(d);
                const sunday = new Date(monday);
                sunday.setDate(monday.getDate() + 6);
                dateObj = monday;
                key = monday.toLocaleDateString('en-GB');
                displayDate = `${monday.toLocaleDateString('en-GB', {day:'2-digit', month:'short'})} - ${sunday.toLocaleDateString('en-GB', {day:'2-digit', month:'short'})}`;
            }

            if (!acc[key]) acc[key] = { date: key, displayDate, dateObj, sessions: 0, amount: 0, details: [] };
            acc[key].sessions += 1;
            acc[key].amount += s.status === 'ended' ? getSessionRate(s.classLevel) : 0;
            acc[key].details.push(s);
            return acc;
        }, {});
        return Object.values(obj).sort((a, b) => b.dateObj - a.dateObj);
    };

    const dailyEarnings = buildGroupedData('daily');
    const weeklyEarnings = buildGroupedData('weekly');

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <button onClick={onBack} className="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100 hover:text-slate-800 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">{teacher.name}'s Profile</h1>
                    <p className="text-sm font-bold text-slate-500">{teacher.email}</p>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#002147]/10 text-[#002147] rounded-xl flex items-center justify-center"><BookOpen className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tot. Assigned</p>
                        <p className="text-xl font-black text-slate-900">{teacher.assignedSubjects?.length || 0}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#002147]/5 text-[#002147] rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Classes Completed</p>
                        <p className="text-xl font-black text-slate-900">{completedClasses}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Award className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Performance</p>
                        <p className="text-xl font-black text-slate-900">{performanceScore}%</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#002147]/5 text-[#002147] rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Paid</p>
                        <p className="text-xl font-black text-slate-900">₹{totalEarnings}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Curriculum & Pay Rates */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-lg font-black text-[#002147]">Curriculum & Rates</h2>
                    </div>
                    <div className="p-5 flex-1">
                        <div className="mb-6 flex gap-4">
                            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class 6-10 Rate</p>
                                <p className="text-lg font-black text-slate-800">₹{teacher.payRates?.rateA || 0} <span className="text-xs text-slate-500 font-bold">/class</span></p>
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class 11-12 Rate</p>
                                <p className="text-lg font-black text-slate-800">₹{teacher.payRates?.rateB || 0} <span className="text-xs text-slate-500 font-bold">/class</span></p>
                            </div>
                        </div>

                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assigned Boards & Subjects</h3>
                        <div className="space-y-3">
                            {teacher.assignedSubjects?.length > 0 ? (
                                teacher.assignedSubjects.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#002147]/10 text-[#002147] flex items-center justify-center"><BookOpen className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{sub.subjectName}</p>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                    <span className="text-[#f16126]">{sub.board || 'TS Board'}</span> • <span><GraduationCap className="w-3 h-3 inline pb-0.5" /> {sub.classLevel}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic font-medium">No subjects assigned</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Session Timeline */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-lg font-black text-[#002147]">Session Timeline</h2>
                    </div>
                    <div className="p-5 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar space-y-6">
                        {/* Live Now */}
                        <div>
                            <h3 className="text-xs font-black text-[#f16126] uppercase tracking-widest mb-3 flex items-center gap-2"><PlayCircle className="w-4 h-4" /> Live Now</h3>
                            {sessions.present.length > 0 ? sessions.present.map(s => (
                                <div key={s._id} className="p-4 rounded-xl border-2 border-[#f16126] bg-red-50 flex flex-col gap-1 mb-3">
                                    <span className="text-[10px] font-black text-[#f16126] tracking-widest uppercase">{s.classLevel} • {s.subjectName}</span>
                                    <p className="text-sm font-bold text-red-900">{s.title}</p>
                                    <span className="text-xs font-semibold text-red-700 mt-1">Started: {new Date(s.startTime).toLocaleTimeString()}</span>
                                </div>
                            )) : <p className="text-xs text-slate-400 font-bold mb-4">No active live sessions</p>}
                        </div>

                        {/* Upcoming */}
                        <div>
                            <h3 className="text-xs font-black text-[#f16126] uppercase tracking-widest mb-3 flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Upcoming</h3>
                            {sessions.future.length > 0 ? sessions.future.map(s => (
                                <div key={s._id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-1 mb-3">
                                    <span className="text-[10px] font-black text-[#f16126] tracking-widest uppercase">{s.classLevel} • {s.subjectName}</span>
                                    <p className="text-sm font-bold text-slate-800">{s.title}</p>
                                    <span className="text-xs font-semibold text-slate-500 mt-1">{new Date(s.startTime).toLocaleString()}</span>
                                </div>
                            )) : <p className="text-xs text-slate-400 font-bold mb-4">No upcoming scheduled sessions</p>}
                        </div>

                         {/* Past */}
                         <div>
                            <h3 className="text-xs font-black text-[#002147]/50 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Completed</h3>
                            {sessions.past.length > 0 ? sessions.past.map(s => (
                                <div key={s._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-1 mb-3 opacity-70">
                                    <span className="text-[10px] font-black text-[#002147] tracking-widest uppercase">{s.classLevel} • {s.subjectName}</span>
                                    <p className="text-sm font-bold text-slate-800">{s.title}</p>
                                    <span className="text-xs font-semibold text-slate-500 mt-1">Ended: {new Date(s.endTime).toLocaleString()}</span>
                                </div>
                            )) : <p className="text-xs text-slate-400 font-bold">No completed sessions</p>}
                        </div>
                    </div>
                </div>
                
                {/* Payout History spanning full width */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm lg:col-span-2">
                    <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <h2 className="text-lg font-black text-[#002147]">Payout Records & Schedule</h2>
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                            <button 
                                onClick={() => setViewMode('monthly')}
                                className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest transition-colors ${viewMode === 'monthly' ? 'bg-[#002147] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Monthly
                            </button>
                            <button 
                                onClick={() => setViewMode('weekly')}
                                className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest transition-colors ${viewMode === 'weekly' ? 'bg-[#f16126] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Weekly
                            </button>
                            <button 
                                onClick={() => setViewMode('daily')}
                                className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest transition-colors ${viewMode === 'daily' ? 'bg-[#f16126] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Day-Wise
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f8fafc] text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-slate-100">
                                <tr>
                                    <th className="px-5 py-4">{viewMode === 'monthly' ? 'Month/Year' : (viewMode === 'weekly' ? 'Weekly Range' : 'Date')}</th>
                                    <th className="px-5 py-4">Total Sessions & Details</th>
                                    <th className="px-5 py-4">Status & Amount</th>
                                    {viewMode === 'monthly' && <th className="px-5 py-4 text-right">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                                {viewMode === 'monthly' ? (
                                    payouts.length === 0 ? (
                                        <tr><td colSpan="4" className="px-5 py-8 text-center text-xs font-bold text-slate-400">No monthly payout records yet.</td></tr>
                                    ) : payouts.map(p => (
                                        <tr key={p._id} className="hover:bg-slate-50/50">
                                            <td className="px-5 py-4 font-black text-slate-800">{p.month}/{p.year}</td>
                                            <td className="px-5 py-4">{p.totalSessions}</td>
                                            <td className="px-5 py-4 font-black text-slate-900">₹{p.totalAmount}</td>
                                            <td className="px-5 py-4 text-right">
                                                {p.status === 'Paid' ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-[#002147]/10 text-[#002147] px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                                                        <CheckCircle className="w-3 h-3" /> Settled
                                                    </span>
                                                ) : (
                                                    <button 
                                                        onClick={() => markAsPaid(p._id)}
                                                        className="inline-flex items-center gap-1.5 bg-[#002147] text-white px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm hover:opacity-90 transition-opacity"
                                                    >
                                                        Mark as Settled
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    (viewMode === 'daily' ? dailyEarnings : weeklyEarnings).length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-5 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full"><CalendarIcon className="w-8 h-8 text-slate-300" /></div>
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">No Sessions Yet</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (viewMode === 'daily' ? dailyEarnings : weeklyEarnings).map((d, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-5 py-6 align-top font-black text-slate-800 pt-8">{d.date}</td>
                                            <td className="px-5 py-6 align-top">
                                                <div className="font-black text-slate-800 text-sm mb-3 bg-slate-100 w-max px-3 py-1 rounded-md">{d.sessions} Total Sessions</div>
                                                <div className="space-y-2 grid grid-cols-1 max-w-lg">
                                                    {d.details.map((s, idx) => (
                                                        <div key={s._id || idx} className={`p-3 rounded-xl border ${s.status === 'ended' ? 'bg-[#002147]/5/50 border-[#002147]/10' : s.status === 'live' ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-white border-slate-200'}`}>
                                                            <div className="flex justify-between items-start mb-1.5">
                                                                <span className="font-black text-[#002147]">{s.title}</span>
                                                                <span className={`text-[9px] px-2 py-1 uppercase tracking-widest font-black rounded-lg ${s.status === 'ended' ? 'text-[#002147] bg-[#002147]/10' : s.status === 'live' ? 'text-rose-700 bg-rose-200 animate-pulse' : 'text-slate-500 bg-slate-100'}`}>
                                                                    {s.status}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                                                <span className="text-[#f16126]">{s.subjectName}</span>
                                                                <span>• {new Date(s.endTime || s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-5 py-6 align-top pt-8 text-xl font-black text-[#002147] tracking-tighter">
                                                {d.amount > 0 ? `₹${d.amount}` : <span className="text-sm text-slate-400">Scheduled</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
