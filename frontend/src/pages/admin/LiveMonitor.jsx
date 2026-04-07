import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Activity, Loader2, BookOpen, Plus, X, Calendar, Video,
    Check, ChevronDown, ChevronRight, Edit2, Trash2, Clock,
    ShieldCheck, Link as LinkIcon, AlertCircle, Users
} from 'lucide-react';

import io from 'socket.io-client';

// ─── Socket Initialization ───────────────────────────────────────────────────
const getSocketUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace('/api', '').replace(/\/$/, '');
    }
    return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const socket = io(getSocketUrl(), {
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
});

// ─── Constants ───────────────────────────────────────────────────────────────
const BOARDS = ['AP Board', 'TS Board', 'CBSE', 'ICSE'];
const BOARD_THEMES = {
    'AP Board': { main: 'indigo', primary: 'bg-indigo-600', secondary: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hover: 'hover:bg-indigo-700', active: 'ring-indigo-100' },
    'TS Board': { main: 'rose', primary: 'bg-rose-600', secondary: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hover: 'hover:bg-rose-700', active: 'ring-rose-100' },
    'CBSE': { main: 'amber', primary: 'bg-amber-600', secondary: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:bg-amber-700', active: 'ring-amber-100' },
    'ICSE': { main: 'emerald', primary: 'bg-emerald-600', secondary: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:bg-emerald-700', active: 'ring-emerald-100' }
};
const PLATFORMS = ['Zoom', 'Google Meet', 'YouTube Live'];
const DAYS_META = [
    { label: 'S', value: 0 }, { label: 'M', value: 1 }, { label: 'T', value: 2 },
    { label: 'W', value: 3 }, { label: 'T', value: 4 }, { label: 'F', value: 5 },
    { label: 'S', value: 6 }
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const fmtDay = d => d.toLocaleDateString('en-IN', { weekday: 'short' });
const fmtDate = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const fmtTime = d => {
    try {
        const date = new Date(d);
        if (isNaN(date.getTime())) return String(d);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch { return String(d); }
};
const fmt24To12 = (t24) => {
    if (!t24) return '--:--';
    const [h, m] = t24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
};
const get24HFromDate = (d) => {
    try {
        const date = new Date(d);
        if (isNaN(date.getTime())) return '10:00';
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch { return '10:00'; }
};

/** Returns 7 Date objects for Sun-Sat of the current week, all zeroed to midnight local */
const getWeekDates = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return d;
    });
};

/** Build a concrete Date for a given weekday in the same week as `anchor` */
const dateForDayInWeek = (anchor, dayOfWeek, hour, minute) => {
    const sunday = new Date(anchor);
    sunday.setDate(anchor.getDate() - anchor.getDay());
    sunday.setHours(hour, minute, 0, 0);
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + dayOfWeek);
    return d;
};

// ─── Default form state ───────────────────────────────────────────────────────
const EMPTY_CELL_FORM = {
    sessionId: '',
    subjectId: '',
    subjectName: '',
    teacherId: '',
    time: '10:00',
    platform: 'Zoom',
    link: '',
    board: 'AP Board',
    selectedDays: [],   // day numbers 0-6
};

// ─────────────────────────────────────────────────────────────────────────────
const LiveMonitor = () => {
    // ── Data ──────────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(true);
    const [allSessions, setAllSessions] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [allBundlesDB, setAllBundlesDB] = useState([]);
    const [allSubjectsDB, setAllSubjectsDB] = useState([]);
    const [allTeachers, setAllTeachers] = useState([]);   // ALL teachers (for fallback)

    // ── UI ────────────────────────────────────────────────────────────────────
    const [viewType, setViewType] = useState('roster');
    const [expandedClasses, setExpandedClasses] = useState([]);
    const [boardFilter, setBoardFilter] = useState('AP Board');

    // ── Inline cell scheduler ─────────────────────────────────────────────────
    const [activeCell, setActiveCell] = useState(null); // { classLevel, date, subjectName }
    const [cellForm, setCellForm] = useState(EMPTY_CELL_FORM);
    const [cellTeachers, setCellTeachers] = useState([]);
    const [cellLoadingTeachers, setCellLoadingTeachers] = useState(false);
    const [cellSaving, setCellSaving] = useState(false);
    const [cellError, setCellError] = useState('');
    const [lastForm, setLastForm] = useState(null);  // remembered defaults
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);  // session id awaiting delete confirm

    const weekDates = useMemo(getWeekDates, []);
    const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

    // ── Fetch all data ────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        try {
            const [sessRes, classRes, subjRes, teachRes] = await Promise.all([
                axios.get('/admin/live-sessions'),
                axios.get('/admin/classes'),
                axios.get('/admin/subjects'),
                axios.get('/admin/teachers-list'),
            ]);

            setAllSessions(sessRes.data || []);
            setAllBundlesDB(classRes.data || []);
            setAllSubjectsDB(subjRes.data || []);
            setAllTeachers(teachRes.data || []);

            // Build sorted class list
            const bundleNames = (classRes.data || []).map(b => b.className || `Class ${b.classLevel}`);
            const subjectLevels = [...new Set((subjRes.data || []).map(s => `Class ${s.classLevel}`))];
            const combined = [...new Set([...bundleNames, ...subjectLevels])];
            combined.sort((a, b) => {
                const n = s => parseInt((s.match(/\d+/) || [99])[0]);
                return n(a) - n(b);
            });
            setAllClasses(combined);
        } catch (err) {
            console.error('fetchData failed:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        // Listen for real-time updates from other admins/backend
        socket.on('live-session-update', (data) => {
            console.log('LiveMonitor: External update detected:', data.type);
            fetchData();
        });

        return () => {
            socket.off('live-session-update');
        };
    }, [fetchData]);

    // ── Subjects for a class level ────────────────────────────────────────────
    const getSubjectsForLevel = useCallback((classLevel) => {
        const levelNum = parseInt(classLevel.replace(/\D/g, ''));
        const fromSubjectModel = allSubjectsDB.filter(s => s.classLevel === levelNum);
        if (fromSubjectModel.length > 0) {
            return fromSubjectModel.map(s => ({ id: s._id, subjectName: s.name, classLevel, type: 'subject' }));
        }
        const bundle = allBundlesDB.find(b => b.className === classLevel);
        if (bundle?.subjects?.length > 0) {
            return bundle.subjects.map(s => ({
                id: `${classLevel}::${s.name}`,
                subjectName: s.name,
                classLevel,
                type: 'bundle-subject'
            }));
        }
        return [{ id: classLevel, subjectName: classLevel, classLevel, type: 'bundle' }];
    }, [allSubjectsDB, allBundlesDB]);

    // ── Load teachers for a subject ───────────────────────────────────────────
    const loadTeachersForSubject = useCallback(async (classLevel, subjectName) => {
        setCellLoadingTeachers(true);
        setCellTeachers([]);
        try {
            const params = new URLSearchParams({ classLevel, subjectName });
            const res = await axios.get(`/admin/teachers-for-subject?${params}`);
            const list = res.data || [];
            // Fallback to ALL teachers if none assigned to this subject
            setCellTeachers(list.length > 0 ? list : allTeachers);
        } catch {
            setCellTeachers(allTeachers);
        } finally {
            setCellLoadingTeachers(false);
        }
    }, [allTeachers]);

    // ── Open the inline scheduler ─────────────────────────────────────────────
    const openCellScheduler = useCallback((classLevel, date, existingSession = null, subjectName = null) => {
        setCellError('');
        const subs = getSubjectsForLevel(classLevel);

        if (existingSession) {
            // EDIT mode
            const foundSub = subs.find(s => s.subjectName === existingSession.subjectName) || subs[0];
            setCellForm({
                sessionId: existingSession._id,
                subjectId: foundSub?.id || '',
                subjectName: existingSession.subjectName,
                teacherId: existingSession.teacherId?._id || existingSession.teacherId || '',
                time: get24HFromDate(existingSession.startTime),
                platform: existingSession.platform,
                link: existingSession.link,
                board: existingSession.board || boardFilter,
                selectedDays: [],
            });
            loadTeachersForSubject(classLevel, existingSession.subjectName);
        } else {
            // CREATE mode — use last-used values as smart defaults
            const initSub = subs.find(s => s.subjectName === subjectName) || subs[0];
            const sameSubject = lastForm && lastForm.subjectId === initSub?.id;

            // Smart Time Default: If last used time is already taken in this cell, find next hour
            let defaultTime = lastForm?.time || '10:00';
            const [h, m] = defaultTime.split(':').map(Number);

            // Check if this specific subject+time exists on this day
            const exists = allSessions.some(s =>
                s.classLevel === classLevel &&
                s.subjectName === (subjectName || initSub?.subjectName) &&
                isSameDay(new Date(s.startTime), date) &&
                new Date(s.startTime).getHours() === h &&
                new Date(s.startTime).getMinutes() === m
            );

            if (exists) {
                // If 10:00 is taken, try 11:00, 12:00 etc.
                let nextHour = (h + 1) % 24;
                defaultTime = `${nextHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            }

            setCellForm({
                ...EMPTY_CELL_FORM,
                subjectId: initSub?.id || '',
                subjectName: initSub?.subjectName || '',
                teacherId: sameSubject ? (lastForm.teacherId || '') : '',
                time: defaultTime,
                platform: lastForm?.platform || 'Zoom',
                link: lastForm?.link || '',
                board: boardFilter,
                selectedDays: [date.getDay()],
            });
            if (initSub) loadTeachersForSubject(classLevel, initSub.subjectName);
        }

        setActiveCell({ classLevel, date, subjectName: subjectName || existingSession?.subjectName });
    }, [getSubjectsForLevel, loadTeachersForSubject, lastForm, boardFilter, allSessions]);

    // ── Delete session ────────────────────────────────────────────────────────
    const handleDeleteSession = async (sessionId) => {
        if (deleteConfirmId !== sessionId) {
            // First click: ask for confirmation
            setDeleteConfirmId(sessionId);
            setTimeout(() => setDeleteConfirmId(null), 3000); // auto-cancel after 3s
            return;
        }
        // Second click: confirmed, delete
        setDeleteConfirmId(null);
        try {
            await axios.delete(`/admin/live-sessions/${sessionId}`);
            fetchData();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || err.message));
        }
    };

    // ── Save (create or update) ───────────────────────────────────────────────
    const handleCellSubmit = async () => {
        setCellError('');

        if (!cellForm.teacherId) return setCellError('Select a teacher!');
        if (!cellForm.link && cellForm.platform !== 'YouTube Live') return setCellError('Meeting link required!');
        if (!cellForm.time) return setCellError('Time required!');

        const { classLevel, date } = activeCell;
        const subs = getSubjectsForLevel(classLevel);
        const sub = subs.find(s => String(s.id) === String(cellForm.subjectId)) || subs[0];
        if (!sub) return setCellError('No subject found.');

        const [h, m] = cellForm.time.split(':').map(Number);
        const board = cellForm.board || boardFilter;
        const payload = {
            platform: cellForm.platform,
            link: cellForm.link,
            teacherId: cellForm.teacherId,
            classLevel,
            subjectName: sub.subjectName,
            board,
            subjectId: sub.type === 'subject' && /^[0-9a-fA-F]{24}$/.test(String(sub.id)) ? sub.id : undefined,
        };

        // Duplicate check — block if same subject already scheduled on same day+time
        if (!cellForm.sessionId) {
            const days = cellForm.selectedDays.length > 0 ? cellForm.selectedDays : [date.getDay()];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const hardConflicts = [];
            const softConflicts = [];

            days.forEach(dayNum => {
                const dt = dateForDayInWeek(date, dayNum, h, m);
                const match = allSessions.find(s =>
                    s.classLevel === classLevel &&
                    isSameDay(new Date(s.startTime), dt) &&
                    new Date(s.startTime).getHours() === h &&
                    new Date(s.startTime).getMinutes() === m
                );

                if (match) {
                    const timeStr = fmt24To12(`${h}:${m}`);
                    const info = `${dayNames[dayNum]} at ${timeStr} (${match.subjectName})`;
                    if (match.subjectName !== sub.subjectName) {
                        hardConflicts.push(info);
                    } else {
                        softConflicts.push(info);
                    }
                }
            });

            if (hardConflicts.length > 0) {
                return setCellError(`Wait! Another class exists: ${hardConflicts.join(', ')}`);
            }
        }

        setCellSaving(true);
        try {
            if (cellForm.sessionId) {
                // UPDATE single session
                const startTime = new Date(date);
                startTime.setHours(h, m, 0, 0);
                await axios.put(`/admin/live-sessions/${cellForm.sessionId}`, { ...payload, startTime: startTime.toISOString() });
            } else {
                // CREATE — one entry per selected day within THIS week
                const days = cellForm.selectedDays.length > 0 ? cellForm.selectedDays : [date.getDay()];
                const sessions = days.map(dayNum => {
                    const dt = dateForDayInWeek(date, dayNum, h, m);
                    return { ...payload, startTime: dt.toISOString() };
                });
                await axios.post('/admin/live-sessions', { sessions });
            }
            // Remember settings for next time
            setLastForm({ ...cellForm, subjectId: sub.id });
            setActiveCell(null);
            await fetchData();
        } catch (err) {
            setCellError(err.response?.data?.message || err.message);
        } finally {
            setCellSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="space-y-4 relative w-full">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">
                        Live &amp; Schedule Class
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                        Full Class Timetable &amp; Real-time Live Monitoring
                    </p>
                </div>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setViewType('roster')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold transition-colors ${viewType === 'roster' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Calendar className="w-4 h-4" /> Timetable
                    </button>
                    <button
                        onClick={() => setViewType('monitor')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-semibold transition-colors ${viewType === 'monitor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Activity className="w-4 h-4" /> Monitors
                    </button>
                </div>
            </div>

            {/* ── Timetable grid ───────────────────────────────────────────── */}
            {viewType === 'roster' && (
                <div className="w-full">
                    <div className="overflow-x-auto thin-scrollbar pb-10">
                        <table className="w-full border-separate border-spacing-y-4 px-4 overflow-visible">
                            <thead>
                                <tr className="bg-white border-b shadow-sm sticky top-0 z-40">
                                    <th className="px-3 py-3 text-center bg-white w-[5%] border-r border-slate-100 whitespace-nowrap">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Timetable</span>
                                            <span className="text-[10px] font-medium text-indigo-600 uppercase">Schedule</span>
                                        </div>
                                    </th>
                                    {weekDates.map((date, di) => {
                                        const isToday = isSameDay(date, today);
                                        const isSunday = date.getDay() === 0;
                                        return (
                                            <th key={di} className={`p-3 text-center transition-all relative border-r border-slate-50 last:border-r-0 ${isToday ? `${BOARD_THEMES[boardFilter].primary} text-white shadow-sm z-30` : 'text-slate-600 bg-white'} w-[13.5%] min-w-[120px]`}>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-slate-800'}`}>{fmtDay(date)}</span>
                                                    <span className={`text-xs font-medium ${isToday ? 'text-white/80' : 'text-slate-500'}`}>{fmtDate(date)}</span>
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>

                            <tbody>
                                {allClasses.map((lvl, ridx) => {
                                    const isExpanded = expandedClasses.includes(lvl);
                                    const subs = getSubjectsForLevel(lvl);

                                    return (
                                        <React.Fragment key={ridx}>
                                            <tr
                                                className={`transition-colors cursor-pointer group sticky top-0 z-30`}
                                                onClick={() => setExpandedClasses(isExpanded ? [] : [lvl])}
                                            >
                                                <td colSpan={8} className={`p-0 rounded-lg border shadow-sm overflow-hidden transition-colors ${isExpanded ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                                                    <div className="px-4 py-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-1 h-8 rounded-full ${isExpanded ? 'bg-indigo-600' : 'bg-slate-300'}`} />

                                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${isExpanded ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600'}`}>
                                                                <BookOpen className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`font-semibold transition-colors ${isExpanded ? 'text-indigo-900' : 'text-slate-800'}`}>{lvl}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {(() => {
                                                                        const count = allSessions.filter(s => s.classLevel === lvl && s.board === boardFilter).length;
                                                                        return (
                                                                            <div className="flex items-center gap-1.5">
                                                                                <div className={`w-1.5 h-1.5 rounded-full ${count > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                                                <span className="text-xs font-medium text-slate-500">{count} {count === 1 ? 'Slot' : 'Slots'} Scheduled</span>
                                                                            </div>
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-6 pr-2">
                                                            {isExpanded && (
                                                                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                                                                    {BOARDS.map(b => {
                                                                        const isActive = boardFilter === b;
                                                                        return (
                                                                            <button
                                                                                key={b}
                                                                                onClick={e => { e.stopPropagation(); setBoardFilter(b); }}
                                                                                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${isActive ? `bg-white text-indigo-600 shadow-sm` : 'text-slate-500 hover:text-slate-700'}`}
                                                                            >
                                                                                {b}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                            <div className={`px-4 py-2 rounded-md border flex items-center gap-2 text-xs font-semibold transition-colors ${isExpanded ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 group-hover:border-indigo-300 group-hover:text-indigo-600'}`}>
                                                                <span>{isExpanded ? 'Close Schedule' : 'View Schedule'}</span>
                                                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            {isExpanded && (
                                                <React.Fragment>

                                                    {subs.map((sub, sIdx) => (
                                                        <tr key={sIdx} className={`animate-in fade-in slide-in-from-top-1 duration-300 border-b ${sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'} border-slate-100 last:border-b-0 group/row`}>
                                                            <td className={`px-2 py-4 border-r border-slate-200 bg-slate-100/50 w-[5%] font-bold text-xs text-slate-700 uppercase leading-tight text-center align-middle whitespace-nowrap`}>
                                                                {sub.subjectName}
                                                            </td>

                                                            {weekDates.map((date, di) => {
                                                                const isToday = isSameDay(date, today);
                                                                const isSunday = date.getDay() === 0;

                                                                const daySessions = allSessions
                                                                    .filter(s => {
                                                                        if (s.classLevel !== lvl) return false;
                                                                        if (s.subjectName !== sub.subjectName) return false;
                                                                        if (s.board !== boardFilter) return false;
                                                                        if (!isSameDay(new Date(s.startTime), date)) return false;
                                                                        return true;
                                                                    })
                                                                    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                                                                const isFormOpen =
                                                                    activeCell?.classLevel === lvl &&
                                                                    activeCell?.subjectName === sub.subjectName &&
                                                                    activeCell?.date &&
                                                                    isSameDay(activeCell.date, date);

                                                                const isPreviewDay =
                                                                    !isFormOpen &&
                                                                    activeCell?.classLevel === lvl &&
                                                                    activeCell?.subjectName === sub.subjectName &&
                                                                    (cellForm.selectedDays || []).includes(date.getDay()) &&
                                                                    cellForm.board === boardFilter &&
                                                                    !daySessions.some(s =>
                                                                        new Date(s.startTime).getHours() === Number(cellForm.time?.split(':')[0]) &&
                                                                        new Date(s.startTime).getMinutes() === Number(cellForm.time?.split(':')[1])
                                                                    );

                                                                return (
                                                                    <td key={di} className={`p-2 align-top transition-colors border-r border-slate-50 last:border-r-0 ${isToday ? `bg-${BOARD_THEMES[boardFilter].main}-50/30 border-x border-${BOARD_THEMES[boardFilter].main}-100` : ''}`}>
                                                                        <div className="flex flex-col h-full min-h-[60px]">
                                                                            <div className="flex flex-col gap-2 flex-grow">
                                                                                {daySessions.map((s, sidx) => {
                                                                                    const isLive = s.status === 'live';
                                                                                    const isEnded = s.status === 'ended';
                                                                                    const theme = BOARD_THEMES[boardFilter];
                                                                                    return (
                                                                                        <div
                                                                                            key={sidx}
                                                                                            className={`p-2 border rounded-md shadow-sm flex flex-col justify-between transition-colors relative group/card hover:border-indigo-300 hover:shadow-md ${deleteConfirmId === s._id ? 'border-rose-400 bg-rose-50 z-20' : isLive ? 'bg-rose-50 border-rose-200' : isEnded ? 'bg-slate-50 border-slate-200 text-slate-500' : `bg-white ${theme.border}`}`}
                                                                                        >
                                                                                            <div className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r-sm ${isLive ? 'bg-rose-500' : isEnded ? 'bg-emerald-500' : theme.primary}`} />

                                                                                            <div className="flex items-center justify-between pl-1.5">
                                                                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isLive ? 'text-rose-600' : isEnded ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                                                                    {fmt24To12(get24HFromDate(s.startTime))}
                                                                                                </span>
                                                                                                <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                                                                    {!isEnded && !isLive && (
                                                                                                        <>
                                                                                                            {deleteConfirmId === s._id ? (
                                                                                                                <button onClick={() => handleDeleteSession(s._id)} className="p-1 text-white bg-rose-600 rounded flex gap-1 items-center">
                                                                                                                    <Trash2 className="w-3 h-3" />
                                                                                                                </button>
                                                                                                            ) : (
                                                                                                                <>
                                                                                                                    <button onClick={() => openCellScheduler(lvl, date, s)} className={`p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded`}>
                                                                                                                        <Edit2 className="w-3 h-3" />
                                                                                                                    </button>
                                                                                                                    <button onClick={() => setDeleteConfirmId(s._id)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded">
                                                                                                                        <Trash2 className="w-3 h-3" />
                                                                                                                    </button>
                                                                                                                </>
                                                                                                            )}
                                                                                                        </>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="pl-1.5 mt-1">
                                                                                                {isLive ? (
                                                                                                    <a href={s.link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 w-full py-1 bg-rose-600 text-white rounded text-[10px] font-semibold hover:bg-rose-700 transition-colors">
                                                                                                        <Video className="w-3 h-3" /> Join Now
                                                                                                    </a>
                                                                                                ) : (
                                                                                                    <p className="text-xs font-semibold text-slate-800 truncate">{s.teacherId?.name || 'TBA'}</p>
                                                                                                )}
                                                                                                <div className="mt-1">
                                                                                                    <span className="text-[10px] font-medium text-slate-500">{s.platform}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>

                                                                            {isPreviewDay && (
                                                                                <div className="mt-2 p-2.5 border-2 border-dashed border-indigo-300 bg-indigo-50/40 rounded-2xl space-y-1 animate-pulse overflow-hidden">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-[10px] font-black text-indigo-500">{fmt24To12(cellForm.time)}</span>
                                                                                        <ShieldCheck className="w-3 h-3 text-indigo-400" />
                                                                                    </div>
                                                                                    <p className="text-[10px] font-black text-indigo-900/50 uppercase leading-tight truncate">
                                                                                        {allTeachers.find(t => t._id === cellForm.teacherId)?.name || 'Preview...'}
                                                                                    </p>
                                                                                </div>
                                                                            )}

                                                                            {isFormOpen ? (
                                                                                <div className={`mt-2 border rounded-lg bg-white p-3 space-y-3 shadow-lg z-50 relative`}>
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Schedule Session</span>
                                                                                    </div>

                                                                                    <select
                                                                                        value={cellForm.teacherId}
                                                                                        onChange={e => setCellForm(f => ({ ...f, teacherId: e.target.value }))}
                                                                                        className="w-full text-sm font-medium bg-white border border-slate-200 rounded-md px-2 py-1.5 outline-none focus:border-indigo-500"
                                                                                    >
                                                                                        <option value="">Select Teacher</option>
                                                                                        {cellTeachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                                                                    </select>

                                                                                    <div className="bg-slate-50 p-2 rounded-md border border-slate-200">
                                                                                        <div className="flex gap-1.5 items-center">
                                                                                            {(() => {
                                                                                                const [h24, m24] = (cellForm.time || '10:00').split(':').map(Number);
                                                                                                const h12 = h24 % 12 || 12;
                                                                                                const period = h24 >= 12 ? 'PM' : 'AM';
                                                                                                const update = (nh, nm, np) => {
                                                                                                    let h = parseInt(nh);
                                                                                                    if (np === 'PM' && h < 12) h += 12;
                                                                                                    if (np === 'AM' && h === 12) h = 0;
                                                                                                    setCellForm(f => ({ ...f, time: `${h.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}` }));
                                                                                                };
                                                                                                return (
                                                                                                    <>
                                                                                                        <select value={h12} onChange={e => update(e.target.value, m24, period)} className="flex-1 text-sm font-medium bg-white border border-slate-200 p-1 rounded">
                                                                                                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(h => <option key={h} value={h}>{h}</option>)}
                                                                                                        </select>
                                                                                                        <span className="font-bold text-slate-400">:</span>
                                                                                                        <select value={m24} onChange={e => update(h12, e.target.value, period)} className="flex-1 text-sm font-medium bg-white border border-slate-200 p-1 rounded">
                                                                                                            {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => <option key={m} value={m}>{m}</option>)}
                                                                                                        </select>
                                                                                                        <select value={period} onChange={e => update(h12, m24, e.target.value)} className={`flex-1 text-sm font-medium bg-white border border-slate-200 p-1 rounded`}>
                                                                                                            <option value="AM">AM</option>
                                                                                                            <option value="PM">PM</option>
                                                                                                        </select>
                                                                                                    </>
                                                                                                );
                                                                                            })()}
                                                                                        </div>
                                                                                    </div>

                                                                                    <select
                                                                                        value={cellForm.platform}
                                                                                        onChange={e => setCellForm(f => ({ ...f, platform: e.target.value }))}
                                                                                        className="w-full text-sm font-medium bg-white border border-slate-200 rounded-md px-2 py-1.5 outline-none focus:border-indigo-500"
                                                                                    >
                                                                                        {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                                                                                    </select>
                                                                                    <div className="relative">
                                                                                        <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                                                        <input
                                                                                            type="url"
                                                                                            placeholder="Quick Meeting Link..."
                                                                                            value={cellForm.link}
                                                                                            onChange={e => setCellForm(f => ({ ...f, link: e.target.value }))}
                                                                                            className="w-full text-sm font-medium bg-white border border-slate-200 rounded-md pl-8 pr-2 py-1.5 outline-none focus:border-indigo-500 placeholder:text-slate-400"
                                                                                        />
                                                                                    </div>

                                                                                    {!cellForm.sessionId && (
                                                                                        <div className="pt-2">
                                                                                            <div className="flex justify-between gap-1">
                                                                                                {DAYS_META.map((day, idx) => {
                                                                                                    const isSelected = (cellForm.selectedDays || []).includes(day.value);
                                                                                                    return (
                                                                                                        <button
                                                                                                            type="button" key={idx}
                                                                                                            onClick={() => setCellForm(prev => {
                                                                                                                const sel = prev.selectedDays || [];
                                                                                                                return { ...prev, selectedDays: sel.includes(day.value) ? sel.filter(d => d !== day.value) : [...sel, day.value] };
                                                                                                            })}
                                                                                                            className={`w-6 h-6 rounded text-[10px] font-semibold flex items-center justify-center transition-colors ${isSelected ? `bg-indigo-600 text-white` : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}
                                                                                                        >
                                                                                                            {day.label}
                                                                                                        </button>
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {cellError && <div className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-md">{cellError}</div>}

                                                                                    <div className="flex gap-2 pt-2">
                                                                                        <button onClick={() => setActiveCell(null)} className="flex-1 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50">Cancel</button>
                                                                                        <button
                                                                                            onClick={handleCellSubmit}
                                                                                            disabled={cellSaving}
                                                                                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-white flex items-center justify-center gap-1 transition-colors ${cellSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                                                                        >
                                                                                            {cellSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                                                            Save
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => openCellScheduler(lvl, date, null, sub.subjectName)}
                                                                                    className={`w-full py-2.5 mt-2 border border-dashed border-slate-300 text-slate-400 rounded-md flex items-center justify-center gap-1.5 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all opacity-80 hover:opacity-100 ${daySessions.length === 0 ? 'min-h-[44px]' : ''}`}
                                                                                >
                                                                                    <Plus className="w-3.5 h-3.5" />
                                                                                    <span className="text-[10px] uppercase font-bold tracking-wider">Add Slot</span>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Monitor view ─────────────────────────────────────────────── */}
            {viewType === 'monitor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {allSessions.length === 0 && (
                        <div className="col-span-full py-16 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg">
                            <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                            <p className="text-sm font-semibold text-slate-800">No Sessions Scheduled</p>
                            <p className="text-xs text-slate-500 mt-1">Use the Timetable view to add classes.</p>
                        </div>
                    )}
                    {allSessions
                        .sort((a, b) => {
                            const w = { live: 0, upcoming: 1, ended: 2 };
                            return (w[a.status] ?? 1) - (w[b.status] ?? 1) || new Date(a.startTime) - new Date(b.startTime);
                        })
                        .map((s, idx) => {
                            const isLive = s.status === 'live';
                            const isEnded = s.status === 'ended';
                            return (
                                <div key={idx} className={`bg-white border rounded-lg overflow-hidden shadow-sm transition-shadow ${isLive ? 'border-rose-300 shadow-rose-50' : isEnded ? 'border-slate-200 opacity-80' : 'border-slate-200 hover:shadow-md'}`}>
                                    <div className={`px-4 py-2 flex items-center justify-between border-b ${isLive ? 'bg-rose-50 border-rose-100' : isEnded ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100'}`}>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${isLive ? 'bg-rose-600 text-white animate-pulse' : isEnded ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-700'}`}>
                                            {isLive ? 'LIVE' : isEnded ? 'DONE' : 'NEXT'}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-600">{s.classLevel}</span>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-800 leading-tight">{s.subjectName}</h3>
                                            <p className="text-xs font-medium text-slate-500 mt-1">{s.platform} &middot; {new Date(s.startTime).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                                                {(s.teacherId?.name || 'T').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase leading-none mb-1">Teacher</p>
                                                <p className="text-sm font-semibold text-slate-800 leading-none">{s.teacherId?.name || 'TBA'}</p>
                                            </div>
                                            <span className="ml-auto text-xs font-semibold text-indigo-600">{fmtTime(s.startTime)}</span>
                                        </div>
                                        {!isEnded ? (
                                            <a href={s.link} target="_blank" rel="noreferrer"
                                                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-md text-xs font-semibold transition-colors ${isLive ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>
                                                <Video className="w-4 h-4" /> Join Classroom
                                            </a>
                                        ) : (
                                            <div className="w-full py-2.5 text-center bg-slate-50 text-slate-500 rounded-md text-xs font-semibold border border-slate-200">
                                                Session Concluded &#10003;
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default LiveMonitor;
