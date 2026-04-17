import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, CheckCircle, Clock, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TeacherEarnings = () => {
    const [earnings, setEarnings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const res = await axios.get('/teacher/earnings');
                setEarnings(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load earnings');
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    const months = [
        { val: 1, label: 'January' }, { val: 2, label: 'February' }, { val: 3, label: 'March' },
        { val: 4, label: 'April' }, { val: 5, label: 'May' }, { val: 6, label: 'June' },
        { val: 7, label: 'July' }, { val: 8, label: 'August' }, { val: 9, label: 'September' },
        { val: 10, label: 'October' }, { val: 11, label: 'November' }, { val: 12, label: 'December' }
    ];

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div></div>;

    const totalEarned = earnings.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const paidAmount = earnings.filter(e => e.status === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
    const pendingAmount = earnings.filter(e => e.status === 'Pending').reduce((acc, curr) => acc + curr.totalAmount, 0);

    return (
        <div className="space-y-8 animate-in fade-in p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#002147] tracking-tighter uppercase italic">My Earnings</h1>
                    <p className="text-sm font-bold text-slate-500 mt-1">Track your monthly payouts and transaction history</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-xl">
                     <div className="w-16 h-16 bg-slate-50 text-slate-800 rounded-2xl flex items-center justify-center border border-slate-200">
                        <DollarSign className="w-8 h-8" />
                     </div>
                     <div>
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Lifetime Earned</p>
                         <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{totalEarned}</p>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-xl border-t-4 border-t-rose-500">
                     <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                        <Clock className="w-8 h-8" />
                     </div>
                     <div>
                         <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest leading-none mb-1">Total Pending</p>
                         <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{pendingAmount}</p>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-xl border-t-4 border-t-emerald-500">
                     <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-8 h-8" />
                     </div>
                     <div>
                         <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest leading-none mb-1">Total Paid</p>
                         <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{paidAmount}</p>
                     </div>
                 </div>
            </div>

            <div className="bg-white border rounded-[40px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Earnings History</h2>
                </div>
                <div className="overflow-x-auto p-4">
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                            <tr>
                                <th className="px-6 py-4">Billing Month</th>
                                <th className="px-6 py-4">Classes Logged</th>
                                <th className="px-6 py-4">Total Amount</th>
                                <th className="px-6 py-4">Status & Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 font-bold">
                            {earnings.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-full"><FileText className="w-8 h-8 text-slate-300" /></div>
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">No Earnings Generated Yet</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : earnings.map(e => (
                                <tr key={e._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><CalendarIcon className="w-5 h-5" /></div>
                                            <span className="text-sm font-black text-[#002147] uppercase italic">{months.find(m => m.val === e.month)?.label} {e.year}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-slate-500">{e.totalSessions} sessions <span className="opacity-50">({e.totalHours} hrs)</span></td>
                                    <td className="px-6 py-6 text-xl font-black text-slate-900 tracking-tighter">₹{e.totalAmount}</td>
                                    <td className="px-6 py-6">
                                        {e.status === 'Paid' ? (
                                            <div className="flex flex-col items-start">
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</span>
                                                <span className="text-[10px] text-slate-400 font-black mt-1.5 uppercase tracking-widest">TRX: {e.transactionId || 'N/A'}</span>
                                            </div>
                                        ) : (
                                            <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherEarnings;
