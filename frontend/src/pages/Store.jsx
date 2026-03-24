import React, { useState } from 'react';
import { HiCheck, HiShoppingCart, HiBookmark, HiInformationCircle } from 'react-icons/hi';

const Store = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const classes6_10 = [
    { id: '6', name: 'Class 6 - All Subjects', price: 999, level: 'Class 6' },
    { id: '7', name: 'Class 7 - All Subjects', price: 999, level: 'Class 7' },
    { id: '8', name: 'Class 8 - All Subjects', price: 1199, level: 'Class 8' },
    { id: '9', name: 'Class 9 - All Subjects', price: 1299, level: 'Class 9' },
    { id: '10', name: 'Class 10 - All Subjects', price: 1499, level: 'Class 10' },
  ];

  const subjects11_12 = [
    { id: 'p11', name: 'Physics', level: 'Class 11', price: 499 },
    { id: 'm11', name: 'Mathematics', level: 'Class 11', price: 499 },
    { id: 'c11', name: 'Chemistry', level: 'Class 11', price: 499 },
    { id: 'p12', name: 'Physics', level: 'Class 12', price: 599 },
    { id: 'm12', name: 'Mathematics', level: 'Class 12', price: 599 },
    { id: 'b12', name: 'Biology', level: 'Class 12', price: 599 },
  ];

  const toggleSubject = (id) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const totalPrice = selectedSubjects.reduce((acc, id) => {
    const sub = subjects11_12.find(s => s.id === id);
    return acc + (sub?.price || 0);
  }, 0);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4">
      <div className="mb-20 text-center space-y-4">
         <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">Pricing Plans</span>
         <h1 className="text-5xl font-black text-slate-900 tracking-tight">Invest in Your Future</h1>
         <p className="text-slate-500 font-semibold max-w-xl mx-auto">Choose from comprehensive bundles or individual subjects tailored to your academic needs.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
        {/* Left: Classes 6-10 */}
        <div className="xl:col-span-12 lg:col-span-12 mb-12">
           <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <HiBookmark className="text-indigo-600" /> Lower Secondary (Class 6 - 10)
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {classes6_10.map(cls => (
                <div key={cls.id} className="premium-card p-8 flex flex-col items-center text-center group bg-white hover:border-indigo-600">
                   <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all text-2xl font-black mb-6">
                      {cls.id}th
                   </div>
                   <h3 className="text-lg font-black text-slate-900 mb-2">{cls.name}</h3>
                   <div className="mt-4 mb-8">
                      <p className="text-3xl font-black text-slate-900">₹{cls.price}<span className="text-xs text-slate-400 font-bold">/mo</span></p>
                   </div>
                   <ul className="text-xs font-bold text-slate-500 mb-10 space-y-2">
                      <li className="flex items-center gap-2 justify-center"><HiCheck className="text-indigo-600" /> Full Access to 5+ Subjects</li>
                      <li className="flex items-center gap-2 justify-center"><HiCheck className="text-indigo-600" /> Unlimited Live Classes</li>
                      <li className="flex items-center gap-2 justify-center"><HiCheck className="text-indigo-600" /> Complete PDF Library</li>
                   </ul>
                   <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black group-hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100 group-hover:shadow-indigo-100">Subscribe & Unlock</button>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Classes 11-12 */}
        <div className="xl:col-span-12">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <HiBookmark className="text-emerald-500" /> Senior Secondary (Class 11 - 12)
           </h2>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects11_12.map(sub => (
                   <label 
                    key={sub.id} 
                    className={`relative p-6 rounded-3xl cursor-pointer border-2 transition-all group overflow-hidden ${selectedSubjects.includes(sub.id) ? 'border-emerald-500 bg-emerald-50 shadow-2xl shadow-emerald-100' : 'border-white bg-white hover:border-slate-200 shadow-xl shadow-slate-200/50'}`}
                   >
                      <div className="relative z-10 flex flex-col h-full">
                         <div className="flex justify-between items-start mb-6">
                            <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-md tracking-widest">{sub.level}</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${selectedSubjects.includes(sub.id) ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg' : 'border-slate-300'}`}>
                               {selectedSubjects.includes(sub.id) && <HiCheck />}
                            </div>
                         </div>
                         <h4 className="text-xl font-black text-slate-900 mb-1">{sub.name}</h4>
                         <p className="text-xs font-bold text-slate-400">Expert Instruction + PDF Material</p>
                         <div className="mt-auto pt-6 flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">₹{sub.price}</span>
                            <span className="text-[10px] font-bold text-slate-400 capitalize">/ month / subject</span>
                         </div>
                      </div>
                      <input type="checkbox" className="hidden" onChange={() => toggleSubject(sub.id)} />
                      
                      {selectedSubjects.includes(sub.id) && (
                         <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                      )}
                   </label>
                ))}
              </div>

              {/* Checkout Summary Card */}
              <div className="lg:col-span-1 h-fit sticky top-28">
                 <div className="premium-card p-10 bg-slate-900 border-none text-white overflow-hidden relative">
                    <div className="relative z-10">
                       <h3 className="text-2xl font-black mb-8">Purchase Summary</h3>
                       
                       <div className="space-y-4 mb-10 min-h-[100px]">
                          {selectedSubjects.length === 0 ? (
                             <div className="text-white/30 text-center py-6 border-2 border-dashed border-white/10 rounded-2xl">
                                <p className="text-xs font-bold">No subjects selected</p>
                             </div>
                          ) : (
                             selectedSubjects.map(id => {
                               const item = subjects11_12.find(s => s.id === id);
                               return (
                                 <div key={id} className="flex justify-between items-center text-sm font-bold">
                                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> {item.name}</span>
                                    <span>₹{item.price}</span>
                                 </div>
                               );
                             })
                          )}
                       </div>

                       <div className="space-y-2 border-t border-white/10 pt-8 mt-auto">
                          <div className="flex justify-between text-xs font-black text-white/40 uppercase tracking-widest">
                             <span>Grand Total</span>
                             <span className="text-white">Tax Incl.</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                             <span className="text-5xl font-black">₹{totalPrice}</span>
                             <span className="text-sm font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg">30 Days Valid</span>
                          </div>
                       </div>

                       <button 
                        disabled={selectedSubjects.length === 0}
                        className="w-full mt-10 py-5 bg-emerald-500 text-white rounded-[2rem] font-black flex items-center justify-center gap-4 hover:bg-emerald-400 active:scale-95 disabled:grayscale disabled:opacity-20 transition-all shadow-2xl shadow-emerald-500/30"
                       >
                          <HiShoppingCart className="text-xl" /> Pay with Razorpay
                       </button>

                       <p className="mt-6 text-[10px] text-center text-white/40 font-bold flex items-center justify-center gap-2">
                          <HiInformationCircle className="text-sm" /> Safe & Secure 256-bit Encrypted Payments
                       </p>
                    </div>

                    {/* Bg Design Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[120px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[120px] -ml-32 -mb-32"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
