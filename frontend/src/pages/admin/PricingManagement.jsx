import React, { useState } from 'react';
import { Save, AlertCircle, Info, Trash2, Plus } from 'lucide-react';

const PricingManagement = () => {
  const [classBundles, setClassBundles] = useState([
    { id: 6, name: 'Class 6 Bundle', price: 999 },
    { id: 7, name: 'Class 7 Bundle', price: 999 },
    { id: 8, name: 'Class 8 Bundle', price: 1099 },
    { id: 9, name: 'Class 9 Bundle', price: 1499 },
    { id: 10, name: 'Class 10 Bundle', price: 1499 },
  ]);

  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Physics (Class 11)', price: 499 },
    { id: 2, name: 'Mathematics (Class 11)', price: 499 },
    { id: 3, name: 'Chemistry (Class 12)', price: 599 },
    { id: 4, name: 'Biology (Class 12)', price: 599 },
  ]);

  const handlePriceChange = (id, newPrice, type) => {
    if (type === 'class') {
      setClassBundles(prev => prev.map(c => c.id === id ? { ...c, price: newPrice } : c));
    } else {
      setSubjects(prev => prev.map(s => s.id === id ? { ...s, price: newPrice } : s));
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900">Pricing & Packages</h1>
            <p className="text-slate-500 font-bold">Configure granular pricing for all educational offerings</p>
         </div>
         <button className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
            <Save className="w-5 h-5" /> Save Global Changes
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         
         {/* CLASS 6-10 BUNDLES */}
         <section className="space-y-6">
            <div className="flex items-center gap-3 text-slate-900">
               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-indigo-600" />
               </div>
               <h2 className="text-xl font-black uppercase tracking-tight">Class 6-10 Bundles</h2>
            </div>
            
            <div className="premium-card p-2 bg-white overflow-hidden">
               <div className="divide-y divide-slate-50">
                  {classBundles.map(bundle => (
                    <div key={bundle.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400">{bundle.id}</div>
                          <span className="font-bold text-slate-700">{bundle.name}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Price</span>
                          <div className="relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                             <input 
                               type="number" 
                               value={bundle.price}
                               onChange={(e) => handlePriceChange(bundle.id, e.target.value, 'class')}
                               className="pl-8 pr-4 py-3 bg-slate-100 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl outline-none w-32 font-black text-indigo-600 transition-all"
                             />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </section>

         {/* CLASS 11-12 SUBJECTS */}
         <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-slate-900">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                     <AlertCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Subject-wise (11-12)</h2>
               </div>
               <button className="flex items-center gap-2 text-indigo-600 font-black hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                  <Plus className="w-4 h-4" /> Add Subject
               </button>
            </div>

            <div className="premium-card p-2 bg-white overflow-hidden">
               <div className="divide-y divide-slate-50">
                  {subjects.map(subject => (
                    <div key={subject.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                       <span className="font-bold text-slate-700">{subject.name}</span>
                       <div className="flex items-center gap-4">
                          <div className="relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                             <input 
                               type="number" 
                               value={subject.price}
                               onChange={(e) => handlePriceChange(subject.id, e.target.value, 'subject')}
                               className="pl-8 pr-4 py-3 bg-slate-100 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-xl outline-none w-32 font-black text-indigo-600 transition-all"
                             />
                          </div>
                          <button className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </section>
      </div>

      {/* FOOTER INFO */}
      <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[32px] flex items-start gap-6">
         <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0 animate-bounce">
            <Info className="w-6 h-6" />
         </div>
         <div className="space-y-1">
            <p className="text-lg font-black text-indigo-900">Master Pricing Logic</p>
            <p className="text-indigo-700/70 font-bold leading-relaxed">
               Updating these prices will immediately reflect on the Student Store page. All active subscriptions will maintain their current price until they expire.
            </p>
         </div>
      </div>
    </div>
  );
};

export default PricingManagement;
