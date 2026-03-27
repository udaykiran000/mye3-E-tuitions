import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Video, Calendar, Clock, Link as LinkIcon, GraduationCap, Monitor, Target, Loader2, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { usePreview } from '../../context/PreviewContext';
import { useSelector } from 'react-redux';
import CustomSelect from '../../components/common/CustomSelect';

const ScheduleLive = () => {
  const { activeView } = usePreview();
  const { userInfo } = useSelector((state) => state.auth);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    courseString: '', // JSON string of the selection
    title: '',
    platform: 'Zoom',
    link: '',
    startTime: ''
  });

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const { data } = await axios.get('/api/teacher/my-assignments');
        
        const isStaff = activeView === 'admin' || userInfo?.role?.toLowerCase() === 'admin';

        if (isStaff && data.length === 0) {
          setClasses([
            { id: 'mock1', name: 'Class 10 (Full Bundle)', classLevel: 'Class 10', subjectName: 'All Subjects', type: 'bundle' },
            { id: 'mock2', name: 'Physics (Class 12)', classLevel: 'Class 12', subjectName: 'Physics', type: 'subject' },
            { id: 'mock3', name: 'Maths (Class 11)', classLevel: 'Class 11', subjectName: 'Maths', type: 'subject' },
          ]);
        } else {
          setClasses(data);
        }
        setLoading(false);
      } catch (error) {
        const isStaff = activeView === 'admin' || userInfo?.role?.toLowerCase() === 'admin';
        if (isStaff) {
          setClasses([
            { id: 'mock1', name: 'Class 10 (Full Bundle)', classLevel: 'Class 10', subjectName: 'All Subjects', type: 'bundle' },
            { id: 'mock2', name: 'Physics (Class 12)', classLevel: 'Class 12', subjectName: 'Physics', type: 'subject' },
          ]);
        }
        setLoading(false);
      }
    };
    fetchAssigned();
  }, [activeView, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseString) return toast.error('Please select an item');

    try {
      const course = JSON.parse(formData.courseString);
      const payload = {
        ...formData,
        classLevel: course.classLevel,
        subjectName: course.subjectName,
        subjectId: course.type === 'subject' ? course.id : null,
      };
      
      const { data } = await axios.post('/api/teacher/schedule-live', payload);
      toast.success(data.message || 'Live class scheduled successfully!');
      
      setFormData({
        courseString: '',
        title: '',
        platform: 'Zoom',
        link: '',
        startTime: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule session');
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 px-4 mb-20">
      <Toaster position="top-right" />
      
      <div className="space-y-1 text-center">
         <div className="inline-flex py-2 px-6 bg-rose-50 rounded-full text-rose-600 text-[10px] font-black uppercase tracking-widest gap-2 items-center mb-4">
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-ping"></div>
            Broadcast Hub
         </div>
         <h1 className="text-4xl font-black text-slate-900 tracking-tight">Launch Live Session</h1>
         <p className="text-slate-500 font-bold max-w-md mx-auto italic">Engage with your students in real-time. Schedule your next digital classroom session here.</p>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-teal-900/5 p-8 md:p-14">
        <form onSubmit={handleSubmit} className="space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CustomSelect 
                label="Targeted Course"
                icon={GraduationCap}
                placeholder="Choose Course..."
                options={classes.map(cls => ({ ...cls, value: JSON.stringify(cls) }))}
                value={formData.courseString}
                onChange={(val) => setFormData({ ...formData, courseString: val })}
              />

              <CustomSelect 
                label="Select Platform"
                icon={Video}
                placeholder="Select Platform..."
                options={[
                  { label: 'Zoom Meeting', value: 'Zoom' },
                  { label: 'Google Meet', value: 'Google Meet' },
                  { label: 'YouTube Live', value: 'YouTube Live' },
                ]}
                value={formData.platform}
                onChange={(val) => setFormData({ ...formData, platform: val })}
              />

              <div className="md:col-span-2 space-y-3">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-500" /> Session Topic / Title
                 </label>
                 <input 
                   required
                   type="text"
                   placeholder="e.g. Organic Chemistry: Functional Groups Part 2"
                   value={formData.title}
                   onChange={(e) => setFormData({...formData, title: e.target.value})}
                   className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-600 focus:bg-white rounded-3xl outline-none font-black text-slate-900 shadow-inner transition-all hover:bg-slate-100/50"
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-blue-500" /> Meeting Link / ID
                 </label>
                 <input 
                   required
                   type="url"
                   placeholder="https://zoom.us/j/..."
                   value={formData.link}
                   onChange={(e) => setFormData({...formData, link: e.target.value})}
                   className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-600 focus:bg-white rounded-3xl outline-none font-black text-slate-900 shadow-inner transition-all hover:bg-slate-100/50"
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" /> Start Date & Time
                 </label>
                 <input 
                   required
                   type="datetime-local"
                   value={formData.startTime}
                   onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                   className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-600 focus:bg-white rounded-3xl outline-none font-black text-slate-900 shadow-inner transition-all hover:bg-slate-100/50"
                 />
              </div>
           </div>

           <div className="p-8 bg-teal-50 rounded-[32px] border border-teal-100 flex items-start gap-5">
              <CheckCircle2 className="w-6 h-6 text-teal-600 mt-1" />
              <div>
                 <p className="font-black text-teal-900 leading-tight mb-1" id="notif-label">Live Notifications</p>
                 <p className="text-xs font-bold text-teal-700/60 leading-relaxed uppercase tracking-wider">Once you schedule, a push notification will be sent to all enrolled students for this subject. Ensure your link is valid before confirming.</p>
              </div>
           </div>

           <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
              Broadcast Session Details
           </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleLive;
