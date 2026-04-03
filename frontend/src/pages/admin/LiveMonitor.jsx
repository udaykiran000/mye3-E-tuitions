import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldCheck, Users, Clock, AlertCircle, Loader2, BookOpen, Plus, X, Calendar, Video, Link as LinkIcon, Check, LayoutGrid, List, UserPlus, ChevronDown, Edit2, Trash2 } from 'lucide-react';
import { HiSearch } from 'react-icons/hi';

const WEEKDAYS = [
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
];

const LiveMonitor = () => {
    const [viewType, setViewType] = useState('roster'); // Default to the requested roster grid
    const [sessions, setSessions] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [allClasses, setAllClasses] = useState([]); // All class levels from DB
    const [allSubjectsDB, setAllSubjectsDB] = useState([]); // Subject model (11-12)
    const [allBundlesDB, setAllBundlesDB] = useState([]); // ClassBundle model (6-10) with subjects
    const [loading, setLoading] = useState(true);

    // Filter State
    const [classFilter, setClassFilter] = useState('All');
    const [teacherFilter, setTeacherFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Scheduling State
    const [showScheduler, setShowScheduler] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [scheduling, setScheduling] = useState(false);
    
    const [formData, setFormData] = useState({
        platform: 'Zoom',
        link: '',
        teacherId: '',
        assignmentId: '',
        startTime: '10:00',
        selectedDays: []
    });
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [showAssignPanel, setShowAssignPanel] = useState(false);
    const [quickAssignTeacherId, setQuickAssignTeacherId] = useState('');
    const [assigning, setAssigning] = useState(false);

    // Inline cell form state — tracks which cell is being edited
    const [activeCell, setActiveCell] = useState(null); // { classLevel, dayId }
    const [cellForm, setCellForm] = useState({ sessionId: '', subjectId: '', subjectName: '', teacherId: '', time: '10:00', platform: 'Zoom', link: '' });
    const [cellTeachers, setCellTeachers] = useState([]);
    const [cellSubjects, setCellSubjects] = useState([]);
    const [cellSaving, setCellSaving] = useState(false);
    const [cellLoadingTeachers, setCellLoadingTeachers] = useState(false);

    const fetchData = async () => {
        try {
            const [statsRes, teachersRes, assignmentsRes, allSessionsRes, classesRes, subjectsRes] = await Promise.all([
                axios.get('/admin/stats'),
                axios.get('/admin/teachers-list'),
                axios.get('/teacher/my-assignments'),
                axios.get('/admin/live-sessions'),
                axios.get('/admin/classes'),
                axios.get('/admin/subjects')
            ]);
            setSessions(statsRes.data.activeSessions || []);
            setAllSessions(allSessionsRes.data || []);
            setTeachers(teachersRes.data || []);
            setAssignments(assignmentsRes.data || []);
            setAllSubjectsDB(subjectsRes.data || []);
            setAllBundlesDB(classesRes.data || []);

            // Build all class levels: bundles (6-10) + subjects (11-12)
            const bundleNames = (classesRes.data || []).map(b => b.className || `Class ${b.classLevel}`);
            const subjectClassLevels = [...new Set((subjectsRes.data || []).map(s => `Class ${s.classLevel}`))];
            const combined = [...new Set([...bundleNames, ...subjectClassLevels])];
            
            // Robust sorting: prioritize numeric value, then handle Junior/Senior keywords
            combined.sort((a, b) => {
                const getNum = (s) => {
                    const match = s.match(/\d+/);
                    if (match) return parseInt(match[0]);
                    if (s.toLowerCase().includes('junior')) return 11;
                    if (s.toLowerCase().includes('senior')) return 12;
                    return 99; // Fallback for others
                };
                return getNum(a) - getNum(b);
            });
            setAllClasses(combined);

            setLoading(false);
        } catch (error) {
            console.error('FAILED TO FETCH DATA:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
           if (!showScheduler) fetchData();
        }, 15000);
        return () => clearInterval(interval);
    }, [showScheduler]);

    // When the selected assignment changes, fetch only eligible teachers
    useEffect(() => {
        if (!formData.assignmentId) {
            setFilteredTeachers(teachers);
            return;
        }
        const assignment = assignments.find(a => String(a.id || a.classLevel) === String(formData.assignmentId));
        if (!assignment) {
            setFilteredTeachers(teachers);
            return;
        }
        const params = new URLSearchParams();
        if (assignment.classLevel) params.set('classLevel', assignment.classLevel);
        if (assignment.subjectName) params.set('subjectName', assignment.subjectName);
        axios.get(`/admin/teachers-for-subject?${params.toString()}`)
            .then(res => setFilteredTeachers(res.data || []))
            .catch(() => setFilteredTeachers(teachers)); // fallback to all teachers
    }, [formData.assignmentId, assignments, teachers]);

    const toggleDay = (dayId) => {
        setFormData(prev => ({
            ...prev,
            selectedDays: prev.selectedDays.includes(dayId) 
               ? prev.selectedDays.filter(d => d !== dayId)
               : [...prev.selectedDays, dayId]
        }));
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.selectedDays.length === 0) {
            alert('Please select at least one day.');
            return;
        }

        const assignment = assignments.find(a => String(a.id) === String(formData.assignmentId) || a.classLevel === formData.assignmentId);
        if (!assignment) {
            alert('Please select a valid class/subject.');
            return;
        }

        setScheduling(true);
        const sessionsToCreate = [];
        const [hour, minute] = formData.startTime.split(':');
        const today = new Date();

        // One-time session generation logic for the specified days
        for (let i = 0; i < 7; i++) {
           const d = new Date(today);
           d.setDate(today.getDate() + i);
           
           if (formData.selectedDays.includes(d.getDay())) {
              d.setHours(parseInt(hour), parseInt(minute), 0, 0);
              
              sessionsToCreate.push({
                 platform: formData.platform,
                 link: formData.link,
                 teacherId: formData.teacherId,
                 classLevel: assignment.classLevel,
                 subjectName: assignment.subjectName,
                 subjectId: assignment.type === 'subject' ? (assignment.id || assignment.subjectId) : undefined,
                 startTime: d.toISOString()
              });
           }
        }

        try {
            await axios.post('/admin/live-sessions', { sessions: sessionsToCreate });
            setShowScheduler(false);
            setFormData({ platform: 'Zoom', link: '', teacherId: '', assignmentId: '', startTime: '10:00', selectedDays: [] });
            fetchData();
        } catch (error) {
            console.error('Failed to schedule:', error);
            alert('Error scheduling: ' + (error.response?.data?.message || error.message));
        } finally {
            setScheduling(false);
        }
    };

    const handleQuickAssign = async () => {
        if (!quickAssignTeacherId || !formData.assignmentId) return;
        const assignment = assignments.find(a => String(a.id || a.classLevel) === String(formData.assignmentId));
        if (!assignment) return;

        setAssigning(true);
        try {
            await axios.put(`/admin/teachers/${quickAssignTeacherId}/assign`, {
                assignments: [{
                    assignmentType: assignment.type || 'subject',
                    classLevel: assignment.classLevel,
                    subjectName: assignment.subjectName,
                    subjectId: assignment.id || null
                }]
            });
            setShowAssignPanel(false);
            setQuickAssignTeacherId('');
            // Refetch filtered teachers for the current assignment
            const params = new URLSearchParams();
            if (assignment.classLevel) params.set('classLevel', assignment.classLevel);
            if (assignment.subjectName) params.set('subjectName', assignment.subjectName);
            const res = await axios.get(`/admin/teachers-for-subject?${params.toString()}`);
            setFilteredTeachers(res.data || []);
        } catch (err) {
            console.error('Quick assign failed:', err);
            alert('Failed to assign teacher.');
        } finally {
            setAssigning(false);
        }
    };

    const openCellScheduler = (classLevel, dayId, existingSession = null) => {
        const levelNum = parseInt(classLevel.replace(/\D/g, ''));
        let subs = [];

        // Class 11-12: subjects come from the Subject model
        const subjectModelSubs = allSubjectsDB.filter(s => s.classLevel === levelNum);
        if (subjectModelSubs.length > 0) {
            subs = subjectModelSubs.map(s => ({
                id: s._id,
                subjectName: s.name,
                classLevel: classLevel,
                type: 'subject'
            }));
        } else {
            // Class 6-10: subjects come from ClassBundle.subjects array
            const bundle = allBundlesDB.find(b => b.className === classLevel);
            if (bundle && bundle.subjects && bundle.subjects.length > 0) {
                subs = bundle.subjects.map(s => ({
                    id: `${classLevel}::${s.name}`,
                    subjectName: s.name,
                    classLevel: classLevel,
                    type: 'bundle-subject'
                }));
            } else {
                subs = [{ id: classLevel, subjectName: classLevel, classLevel: classLevel, type: 'bundle' }];
            }
        }

        setCellSubjects(subs);
        setCellTeachers([]);
        
        if (existingSession) {
            // EDIT MODE
            const foundSub = subs.find(sub => sub.subjectName === existingSession.subjectName) || subs[0];
            const sessionTime = new Date(existingSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            
            setCellForm({
                sessionId: existingSession._id,
                subjectId: foundSub?.id || '',
                subjectName: existingSession.subjectName,
                teacherId: existingSession.teacherId?._id || existingSession.teacherId,
                time: sessionTime,
                platform: existingSession.platform,
                link: existingSession.link
            });
            
            // Load teachers for this subject
            setCellLoadingTeachers(true);
            const params = new URLSearchParams();
            params.set('classLevel', classLevel);
            params.set('subjectName', existingSession.subjectName);
            axios.get(`/admin/teachers-for-subject?${params.toString()}`)
                .then(r => setCellTeachers(r.data || []))
                .finally(() => setCellLoadingTeachers(false));
        } else {
            // CREATE MODE
            const firstSub = subs[0];
            setCellForm({ sessionId: '', subjectId: firstSub?.id || '', subjectName: firstSub?.subjectName || '', teacherId: '', time: '10:00', platform: 'Zoom', link: '' });
            
            if (firstSub) {
                setCellLoadingTeachers(true);
                const params = new URLSearchParams();
                params.set('classLevel', classLevel);
                params.set('subjectName', firstSub.subjectName);
                axios.get(`/admin/teachers-for-subject?${params.toString()}`)
                    .then(r => setCellTeachers(r.data || []))
                    .finally(() => setCellLoadingTeachers(false));
            }
        }
        
        setActiveCell({ classLevel, dayId });
    };

    const handleDeleteSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to delete this session?')) return;
        try {
            await axios.delete(`/admin/live-sessions/${sessionId}`);
            fetchData();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const onCellSubjectChange = (subjectId) => {
        const sub = cellSubjects.find(s => String(s.id) === String(subjectId));
        setCellForm(f => ({ ...f, subjectId, subjectName: sub?.subjectName || '', teacherId: '' }));
        if (sub) {
            setCellLoadingTeachers(true);
            setCellTeachers([]);
            const params = new URLSearchParams();
            params.set('classLevel', sub.classLevel);
            if (sub.subjectName) params.set('subjectName', sub.subjectName);
            axios.get(`/admin/teachers-for-subject?${params.toString()}`)
                .then(r => setCellTeachers(r.data || []))
                .finally(() => setCellLoadingTeachers(false));
        }
    };

    const handleCellSubmit = async (classLevel, dayId) => {
        if (!cellForm.teacherId || !cellForm.link) {
            alert('Please fill in Teacher and Link.');
            return;
        }
        const sub = cellSubjects.find(s => String(s.id) === String(cellForm.subjectId)) || cellSubjects[0];
        if (!sub) { alert('No subject found.'); return; }

        const today = new Date();
        const [hour, minute] = cellForm.time.split(':');
        let targetDate = new Date(today);
        while (targetDate.getDay() !== dayId) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        targetDate.setHours(parseInt(hour), parseInt(minute), 0, 0);

        setCellSaving(true);
        try {
            const payload = {
                platform: cellForm.platform,
                link: cellForm.link,
                teacherId: cellForm.teacherId,
                classLevel: classLevel,
                subjectName: sub.subjectName,
                subjectId: sub.type === 'subject' && /^[0-9a-fA-F]{24}$/.test(String(sub.id)) ? sub.id : undefined,
                startTime: targetDate.toISOString()
            };

            if (cellForm.sessionId) {
                // UPDATE
                await axios.put(`/admin/live-sessions/${cellForm.sessionId}`, payload);
            } else {
                // CREATE
                await axios.post('/admin/live-sessions', { sessions: [payload] });
            }
            
            setActiveCell(null);
            fetchData();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message || err.message));
        } finally {
            setCellSaving(false);
        }
    };

    // Use ALL classes from DB as rows (not just ones with teacher assignments)
    const uniqueClassLevels = allClasses.length > 0
        ? allClasses
        : [...new Set(assignments.map(a => a.classLevel))].sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/)));

    if (loading) return (
        <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="space-y-10 p-6 md:p-10 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">Live & Schedule Class</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-3">Full Class Timetable & Real-time Live Monitoring</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                       onClick={() => setShowScheduler(true)}
                       className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                    >
                       <Plus className="w-5 h-5" /> Quick Schedule
                    </button>
                    <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
                        <button 
                            onClick={() => setViewType('roster')}
                            className={`px-5 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewType === 'roster' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Calendar className="w-4 h-4" /> Timetable
                        </button>
                        <button 
                            onClick={() => setViewType('monitor')}
                            className={`px-5 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewType === 'monitor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Activity className="w-4 h-4" /> Monitors
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="mb-8 flex flex-wrap items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex-1 min-w-[240px] relative">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
                    <input 
                        type="text" 
                        placeholder="Search sessions or teachers..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-transparent focus:border-indigo-600 focus:bg-white border-2 rounded-2xl outline-none font-bold transition-all text-sm"
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <LayoutGrid className="w-4 h-4 text-slate-400" />
                        <select 
                            value={classFilter} 
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="bg-transparent text-sm font-black text-slate-600 outline-none pr-4"
                        >
                            <option value="All">All Classes</option>
                            {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <UserPlus className="w-4 h-4 text-slate-400" />
                        <select 
                            value={teacherFilter} 
                            onChange={(e) => setTeacherFilter(e.target.value)}
                            className="bg-transparent text-sm font-black text-slate-600 outline-none pr-4"
                        >
                            <option value="All">All Teachers</option>
                            {teachers.map(t => <option key={t._id} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-sm font-black text-slate-600 outline-none pr-4"
                        >
                            <option value="All">All Status</option>
                            <option value="live">Live Now</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="ended">Completed</option>
                        </select>
                    </div>

                    {(classFilter !== 'All' || teacherFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '') && (
                        <button 
                           onClick={() => { setClassFilter('All'); setTeacherFilter('All'); setStatusFilter('All'); setSearchQuery(''); }}
                           className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors"
                           title="Clear Filters"
                        >
                           <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {viewType === 'roster' ? (
                /* --- TIMETABLE ROW-DRIVEN GRID --- */
                <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Class Timetable</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-white">
                                    <th className="p-4 text-left border-r border-slate-50 w-32"></th>
                                    {WEEKDAYS.map(day => (
                                        <th key={day.id} className="p-4 text-center font-black uppercase tracking-widest text-slate-400 text-[10px] border-b border-slate-50 min-w-[140px]">
                                            {day.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allClasses
                                    .filter(lvl => {
                                        // 1. Basic Class Filter
                                        if (classFilter !== 'All' && lvl !== classFilter) return false;

                                        // 2. If any other filter is active (Status, Teacher, Search), 
                                        // only show this row if it actually contains matching sessions.
                                        const hasFilters = statusFilter !== 'All' || teacherFilter !== 'All' || searchQuery !== '';
                                        if (hasFilters) {
                                            const hasMatchingSessionInRow = allSessions.some(s => {
                                                if (s.classLevel !== lvl) return false;
                                                const d = new Date(s.startTime);
                                                const sessionDateStr = d.toISOString().split('T')[0];
                                                const now = new Date();
                                                const todayStr = now.toISOString().split('T')[0];
                                                
                                                // Check basic time/day visibility
                                                if (sessionDateStr < todayStr) return false;
                                                
                                                // Check current filters
                                                if (statusFilter !== 'All' && s.status !== statusFilter) return false;
                                                if (teacherFilter !== 'All' && s.teacherId?.name !== teacherFilter) return false;
                                                if (searchQuery) {
                                                    const q = searchQuery.toLowerCase();
                                                    return s.subjectName?.toLowerCase().includes(q) || s.teacherId?.name?.toLowerCase().includes(q);
                                                }
                                                return true;
                                            });
                                            if (!hasMatchingSessionInRow) return false;
                                        }
                                        return true;
                                    })
                                    .map((lvl, ridx) => (
                                    <tr key={ridx} className="group hover:bg-slate-50 transition-all border-b border-slate-50">
                                        <td className="p-4 border-r border-slate-50 font-black text-slate-900 text-sm md:text-base uppercase tracking-tighter w-28 md:w-32 italic">
                                            {lvl}
                                        </td>
                                        {WEEKDAYS.map(day => {
                                            const now = new Date();
                                            const todayStr = now.toISOString().split('T')[0];

                                            const daySessions = allSessions
                                                .filter(s => {
                                                    const d = new Date(s.startTime);
                                                    const sessionDateStr = d.toISOString().split('T')[0];
                                                    
                                                    // Filter for this class and day
                                                    if (s.classLevel !== lvl || d.getDay() !== day.id) return false;
                                                    
                                                    // HIDE PAST SESSIONS: If session date is before today, hide it.
                                                    if (sessionDateStr < todayStr) return false;

                                                    // TEACHER FILTER
                                                    if (teacherFilter !== 'All' && s.teacherId?.name !== teacherFilter) return false;
                                                    
                                                    // STATUS FILTER
                                                    if (statusFilter !== 'All' && s.status !== statusFilter) return false;

                                                    // SEARCH FILTER
                                                    if (searchQuery) {
                                                        const q = searchQuery.toLowerCase();
                                                        const match = s.subjectName?.toLowerCase().includes(q) || 
                                                                      s.teacherId?.name?.toLowerCase().includes(q);
                                                        if (!match) return false;
                                                    }

                                                    return true;
                                                })
                                                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                                            return (
                                                <td key={day.id} className="p-2 md:p-3 align-top border-r border-slate-50 last:border-r-0" style={{minWidth: '140px'}}>
                                                    <div className="space-y-2">
                                                        {daySessions.map((s, sidx) => {
                                                            const isEnded = s.status === 'ended';
                                                            const isLive = s.status === 'live';

                                                            return (
                                                                <div 
                                                                    key={sidx} 
                                                                    className={`p-3 border rounded-2xl shadow-sm space-y-1 transition-all group/card relative ${
                                                                        isLive ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500' : 
                                                                        isEnded ? 'bg-emerald-50/30 border-emerald-100 opacity-70' : 
                                                                        'bg-white border-indigo-100'
                                                                    } hover:ring-2 hover:ring-indigo-500`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`text-[10px] font-black ${isLive ? 'text-rose-600' : isEnded ? 'text-emerald-600' : 'text-indigo-600'}`}>
                                                                                {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </span>
                                                                            {isLive && (
                                                                                <span className="flex items-center gap-1 bg-rose-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                                                                                    LIVE
                                                                                </span>
                                                                            )}
                                                                            {isEnded && (
                                                                                <span className="text-emerald-600 font-black text-[8px] flex items-center gap-0.5">
                                                                                    <Check className="w-2.5 h-2.5" /> DONE
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            {!isEnded && !isLive && (
                                                                                <div className="hidden group-hover/card:flex items-center gap-1.5 mr-1">
                                                                                    <button onClick={() => openCellScheduler(lvl, day.id, s)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition-colors">
                                                                                        <Edit2 className="w-3 h-3" />
                                                                                    </button>
                                                                                    <button onClick={() => handleDeleteSession(s._id)} className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors">
                                                                                        <Trash2 className="w-3 h-3" />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : isEnded ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        {isLive ? (
                                                                            <a 
                                                                                href={s.link} 
                                                                                target="_blank" 
                                                                                rel="noreferrer"
                                                                                className="flex items-center justify-center gap-2 w-full py-1.5 bg-rose-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md shadow-rose-100"
                                                                            >
                                                                                <Video className="w-3 h-3" /> Join Class
                                                                            </a>
                                                                        ) : (
                                                                            <p className="text-[10px] font-black text-slate-800 uppercase leading-tight line-clamp-1">{s.subjectName}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-1">
                                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{s.platform}</p>
                                                                        <p className="text-[8px] font-black text-slate-900 uppercase italic opacity-60">
                                                                            {s.teacherId?.name || 'TBA'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                        {/* INLINE ADD FORM */}
                                                        {activeCell?.classLevel === lvl && activeCell?.dayId === day.id ? (
                                                            <div className="border-2 border-indigo-200 rounded-2xl bg-indigo-50/60 p-3 space-y-2">
                                                                {/* Subject Dropdown — from DB */}
                                                                {cellSubjects.length > 1 ? (
                                                                    <select
                                                                        value={cellForm.subjectId}
                                                                        onChange={e => onCellSubjectChange(e.target.value)}
                                                                        className="w-full text-[11px] font-bold bg-white border border-indigo-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    >
                                                                        <option value="">Select Subject</option>
                                                                        {cellSubjects.map(s => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
                                                                    </select>
                                                                ) : cellSubjects.length === 1 ? (
                                                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-1">{cellSubjects[0].subjectName}</p>
                                                                ) : (
                                                                    <p className="text-[10px] font-bold text-slate-400 px-1">No subjects in DB for this class</p>
                                                                )}
                                                                {/* Teacher Dropdown — filtered by subject from DB */}
                                                                <div className="relative">
                                                                    <select
                                                                        value={cellForm.teacherId}
                                                                        onChange={e => setCellForm(f => ({...f, teacherId: e.target.value}))}
                                                                        disabled={cellLoadingTeachers}
                                                                        className="w-full text-[11px] font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                                                                    >
                                                                        <option value="">
                                                                            {cellLoadingTeachers ? 'Loading...' : cellTeachers.length > 0 ? 'Select Teacher' : 'No teachers assigned to this subject'}
                                                                        </option>
                                                                        {cellTeachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                                                    </select>
                                                                    {cellLoadingTeachers && (
                                                                        <Loader2 className="w-3 h-3 animate-spin text-indigo-400 absolute right-3 top-1/2 -translate-y-1/2" />
                                                                    )}
                                                                </div>
                                                                {/* No teachers warning */}
                                                                {!cellLoadingTeachers && cellTeachers.length === 0 && cellForm.subjectId && (
                                                                    <p className="text-[9px] font-bold text-rose-400 px-1 flex items-center gap-1">
                                                                        <AlertCircle className="w-3 h-3" /> No teacher assigned to this subject yet
                                                                    </p>
                                                                )}
                                                                {/* Time */}
                                                                <input
                                                                    type="time"
                                                                    value={cellForm.time}
                                                                    onChange={e => setCellForm(f => ({...f, time: e.target.value}))}
                                                                    className="w-full text-[11px] font-bold bg-white border border-indigo-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                                                />
                                                                {/* Platform */}
                                                                <select
                                                                    value={cellForm.platform}
                                                                    onChange={e => setCellForm(f => ({...f, platform: e.target.value}))}
                                                                    className="w-full text-[11px] font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                                                >
                                                                    <option>Zoom</option>
                                                                    <option>Google Meet</option>
                                                                    <option>YouTube Live</option>
                                                                </select>
                                                                {/* Link */}
                                                                <input
                                                                    type="url"
                                                                    placeholder="Meeting link (https://...)"
                                                                    value={cellForm.link}
                                                                    onChange={e => setCellForm(f => ({...f, link: e.target.value}))}
                                                                    className="w-full text-[11px] font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                                                />
                                                                <div className="flex gap-2 pt-1">
                                                                    <button
                                                                        onClick={() => setActiveCell(null)}
                                                                        className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 bg-white rounded-xl border border-slate-100 transition-all"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleCellSubmit(lvl, day.id)}
                                                                        disabled={cellSaving}
                                                                        className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                                                                    >
                                                                        {cellSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => openCellScheduler(lvl, day.id)}
                                                                className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-slate-300 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">+ Add</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* --- MONITOR VIEW (LIST) --- */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {allSessions
                        .filter(s => {
                            // Filter by Search, Class, Teacher, and Status
                            const q = searchQuery.toLowerCase();
                            const matchSearch = !searchQuery || s.subjectName?.toLowerCase().includes(q) || s.teacherId?.name?.toLowerCase().includes(q);
                            const matchClass = classFilter === 'All' || s.classLevel === classFilter;
                            const matchTeacher = teacherFilter === 'All' || s.teacherId?.name === teacherFilter;
                            const matchStatus = statusFilter === 'All' || s.status === statusFilter;
                            return matchSearch && matchClass && matchTeacher && matchStatus;
                        })
                        .sort((a, b) => {
                            // Priority: LIVE (0) > UPCOMING (1) > ENDED (2)
                            const statusWeight = { 'live': 0, 'upcoming': 1, 'ended': 2 };
                            const weightA = statusWeight[a.status] ?? 1;
                            const weightB = statusWeight[b.status] ?? 1;
                            
                            if (weightA !== weightB) {
                                return weightA - weightB;
                            }
                            // Within same status, sort by time (earlier first)
                            return new Date(a.startTime) - new Date(b.startTime);
                        })
                        .map((s, idx) => {
                            const isLive = s.status === 'live';
                            const isEnded = s.status === 'ended';

                            return (
                                <div key={idx} className={`premium-card overflow-hidden bg-white group hover:border-indigo-500 transition-all border-2 ${isLive ? 'border-rose-500 shadow-2xl shadow-rose-900/10' : isEnded ? 'border-emerald-100 opacity-80' : 'border-slate-100'}`}>
                                    <div className={`${isLive ? 'bg-rose-600' : isEnded ? 'bg-emerald-600' : 'bg-slate-900'} p-6 text-white flex items-center justify-between`}>
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${
                                            isLive ? 'bg-white text-rose-600 animate-pulse' : 'bg-white/20 text-white'
                                        }`}>
                                            {isLive ? 'LIVE NOW' : isEnded ? 'FINISHED' : 'UPCOMING'}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Activity className={`w-4 h-4 ${isLive ? 'text-white' : 'text-slate-400'}`} />
                                            <span className="text-[10px] font-black tracking-widest uppercase">{isLive ? 'Live Stream' : 'Monitoring'}</span>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-2 border-b border-slate-100 pb-2">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                                    {s.classLevel}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                   <Calendar className="w-3 h-3" /> {new Date(s.startTime).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight pt-2">{s.subjectName}</h3>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{s.platform}</p>
                                                {isEnded && <span className="text-emerald-600 text-[10px] font-black">COMPLETED ✓</span>}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center font-black text-sm">
                                                   {s.teacherId?.name?.charAt(0) || 'T'}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Instruction By</p>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-widest">{s.teacherId?.name || 'TBA'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>START: {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-50">
                                            {!isEnded ? (
                                                <a 
                                                    href={s.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={`w-full py-5 text-center rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${
                                                        isLive ? 'bg-rose-600 text-white shadow-rose-900/10 hover:bg-rose-700' : 'bg-slate-900 text-white shadow-slate-900/10 hover:bg-indigo-600'
                                                    }`}
                                                >
                                                    <Video className="w-4 h-4" /> Join Classroom
                                                </a>
                                            ) : (
                                                <div className="w-full py-5 text-center bg-emerald-50 text-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-emerald-100">
                                                    Session Concluded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    {allSessions.filter(s => {
                        const q = searchQuery.toLowerCase();
                        const matchSearch = !searchQuery || s.subjectName?.toLowerCase().includes(q) || s.teacherId?.name?.toLowerCase().includes(q);
                        const matchClass = classFilter === 'All' || s.classLevel === classFilter;
                        const matchTeacher = teacherFilter === 'All' || s.teacherId?.name === teacherFilter;
                        const matchStatus = statusFilter === 'All' || s.status === statusFilter;
                        return matchSearch && matchClass && matchTeacher && matchStatus;
                    }).length === 0 && (
                        <div className="col-span-full py-32 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[4rem]">
                            <div className="max-w-xs mx-auto space-y-4 opacity-50">
                                <Clock className="w-16 h-16 mx-auto text-slate-300" />
                                <div>
                                    <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Sessions Found</p>
                                    <p className="text-[10px] font-black text-slate-400 leading-relaxed uppercase tracking-widest">Adjust filters or schedule a class to see results.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SCHEDULER MODAL */}
            {showScheduler && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowScheduler(false)} />
                    <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
                        
                        <div className="flex items-center justify-between p-8 border-b border-slate-100 shrink-0">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Scheduler Wizard</h2>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Configure single or recurring weekly live sessions</p>
                            </div>
                            <button onClick={() => setShowScheduler(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-8 custom-scrollbar">
                           <form id="schedule-form" onSubmit={handleScheduleSubmit} className="space-y-8">
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Class/Subject</label>
                                       <select 
                                         required
                                         value={formData.assignmentId}
                                         onChange={e => setFormData({...formData, assignmentId: e.target.value})}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                                       >
                                           <option value="">Select Bundle or Subject</option>
                                           {assignments.map(a => (
                                               <option key={a.id || a.classLevel} value={a.id || a.classLevel}>{a.name}</option>
                                           ))}
                                       </select>
                                   </div>

                                   <div className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assign Teacher</label>
                                       <select 
                                         required
                                         value={formData.teacherId}
                                         onChange={e => setFormData({...formData, teacherId: e.target.value})}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                                       >
                                           <option value="">{formData.assignmentId ? (filteredTeachers.length > 0 ? 'Select eligible instructor' : 'No teachers assigned to this subject') : 'Select a class/subject first'}</option>
                                           {filteredTeachers.map(t => (
                                               <option key={t._id} value={t._id}>{t.name}</option>
                                           ))}
                                       </select>
                                        {formData.assignmentId && filteredTeachers.length === 0 && (
                                            <div className="mt-2 border border-rose-100 bg-rose-50 rounded-2xl p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                                                        <UserPlus className="w-3 h-3" /> No teachers assigned — Quick Assign here
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAssignPanel(p => !p)}
                                                        className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:underline flex items-center gap-1"
                                                    >
                                                        {showAssignPanel ? 'Close' : '+ Assign Now'}
                                                        <ChevronDown className={`w-3 h-3 transition-transform ${showAssignPanel ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                {showAssignPanel && (
                                                    <div className="flex gap-3">
                                                        <select
                                                            value={quickAssignTeacherId}
                                                            onChange={e => setQuickAssignTeacherId(e.target.value)}
                                                            className="flex-1 bg-white border border-rose-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                                        >
                                                            <option value="">Pick a teacher to assign</option>
                                                            {teachers.map(t => (
                                                                <option key={t._id} value={t._id}>{t.name}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            disabled={!quickAssignTeacherId || assigning}
                                                            onClick={handleQuickAssign}
                                                            className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-40 flex items-center gap-2"
                                                        >
                                                            {assigning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                                            Assign
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                   </div>
                               </div>

                               <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-6">
                                   <div>
                                       <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4 block flex items-center gap-2">
                                           <Calendar className="w-4 h-4" /> Recurrence Settings (Weekly)
                                       </label>
                                       <div className="flex flex-wrap gap-3">
                                           {WEEKDAYS.map(day => {
                                               const isSelected = formData.selectedDays.includes(day.id);
                                               return (
                                                   <button
                                                     type="button"
                                                     key={day.id}
                                                     onClick={() => toggleDay(day.id)}
                                                     className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-2 ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white border-white text-slate-400 shadow-sm hover:border-indigo-200 hover:text-indigo-600'}`}
                                                   >
                                                      {isSelected && <Check className="w-3 h-3" />} {day.label}
                                                   </button>
                                               )
                                           })}
                                       </div>
                                   </div>
                                   <div className="space-y-2 max-w-[200px]">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                           <Clock className="w-3 h-3" /> Scheduled Time
                                       </label>
                                       <input 
                                         required
                                         type="time"
                                         value={formData.startTime}
                                         onChange={e => setFormData({...formData, startTime: e.target.value})}
                                         className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-sm font-black text-indigo-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                       />
                                   </div>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Video className="w-3 h-3"/> Video Platform</label>
                                       <select 
                                         required
                                         value={formData.platform}
                                         onChange={e => setFormData({...formData, platform: e.target.value})}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                                       >
                                           <option value="Zoom">Zoom Meetings</option>
                                           <option value="Google Meet">Google Meet</option>
                                           <option value="YouTube Live">YouTube Live</option>
                                       </select>
                                   </div>
                                   <div className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><LinkIcon className="w-3 h-3"/> Classroom Link</label>
                                       <input 
                                         required
                                         type="url"
                                         placeholder="https://..."
                                         value={formData.link}
                                         onChange={e => setFormData({...formData, link: e.target.value})}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 outline-none"
                                       />
                                   </div>
                               </div>

                           </form>
                        </div>
                        
                        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-[40px] shrink-0 flex items-center justify-end gap-4">
                            <button 
                              type="button"
                              onClick={() => setShowScheduler(false)}
                              className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Close Modal
                            </button>
                            <button 
                              type="submit"
                              form="schedule-form"
                              disabled={scheduling}
                              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Assignments'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveMonitor;
