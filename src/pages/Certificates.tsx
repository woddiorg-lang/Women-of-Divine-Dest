import { useState } from 'react';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { Award, Download, Share2, Info, ArrowLeft, X } from 'lucide-react';
import { COURSES } from './Courses';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';

export default function Certificates() {
  const { completedSkills } = useProgressStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  if (!user) return null;

  const earnedCourses = COURSES.filter(c => completedSkills.includes(c.id));

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center space-x-3 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-display font-bold dark:text-white">My Certificates</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        {earnedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 pt-12">
             <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-300">
                <Award size={40} />
             </div>
             <p className="text-sm font-medium">You haven't earned any certificates yet.</p>
             <button onClick={() => navigate('/courses')} className="px-6 py-2 bg-[#D4006A] text-white font-bold rounded-xl text-sm">Browse Courses</button>
          </div>
        ) : (
          earnedCourses.map(course => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCert(course.id)}
              className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-4 cursor-pointer active:scale-95 transition-transform"
            >
               <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400 flex items-center justify-center shrink-0">
                     <Award size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-1 rounded dark:bg-emerald-900/30 dark:text-emerald-400">Earned</span>
               </div>
               <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{course.title}</h3>
               <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">Issued: {new Date().toLocaleDateString()}</span>
                  <span className="text-xs font-bold text-[#7CB518]">Score: 100%</span>
               </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <CertPreview 
            course={COURSES.find(c => c.id === selectedCert)} 
            user={user} 
            onClose={() => setSelectedCert(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CertPreview({ course, user, onClose }: any) {
  if (!course) return null;
  const certId = `WODDI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 pb-safe">
      <div className="flex justify-between items-center p-4 text-white">
        <span className="font-bold">Certificate Preview</span>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white"><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        {/* Aspect Ratio Landscape for Certificate */}
        <div className="w-full aspect-[1.414/1] bg-white rounded-lg shadow-2xl p-6 relative flex flex-col justify-between"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23D4006A\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}>
          
          <div className="absolute inset-0 border-8 border-double border-[#D4006A]/20 m-2 pointer-events-none"></div>

          <div className="text-center">
            <h2 className="font-display font-black text-xs sm:text-lg text-gray-900 tracking-widest uppercase">WODDI <span className="text-[#D4006A]">Institute</span></h2>
            <p className="text-[6px] sm:text-[9px] uppercase tracking-[0.2em] text-gray-400 mt-0.5">Empowering Women, Transforming Nations</p>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 text-center py-2">
             <h3 className="font-display text-lg sm:text-2xl italic text-[#D4006A] mb-1">Certificate of Achievement</h3>
             <p className="text-[8px] sm:text-xs text-gray-600 mb-2">This is proudly awarded to</p>
             <h1 className="font-display italic font-bold text-xl sm:text-4xl text-gray-900 mb-2 border-b-2 border-gray-200 px-8 pb-1">{user.name}</h1>
             <p className="text-[8px] sm:text-xs text-gray-600 mb-1">for the successful completion of</p>
             <h4 className="font-bold text-xs sm:text-[15px] text-gray-800 px-6 leading-tight">{course.title}</h4>
          </div>

          <div className="flex justify-between items-end pb-1 px-4">
             <div className="flex flex-col text-left">
                <span className="text-[6px] sm:text-[9px] text-gray-500">Date: {new Date().toLocaleDateString()}</span>
                <span className="text-[6px] sm:text-[9px] text-gray-500">Score: 100%</span>
                <span className="text-[6px] sm:text-[9px] text-gray-400 font-mono">ID: {certId}</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-16 sm:w-24 border-b border-gray-400 mb-1"></div>
                <span className="text-[6px] sm:text-[8px] text-gray-600 font-bold max-w-[100px] leading-tight text-center">H.E Nneoma Nkechi Rochas Okorocha PHD</span>
                <span className="text-[5px] sm:text-[7px] text-gray-400">Founder, WODDI Institute</span>
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-900 flex space-x-3 shrink-0">
         <button className="flex-1 py-3 bg-white text-black rounded-xl font-bold flex justify-center items-center space-x-2 text-sm shadow-sm">
           <Download size={18} />
           <span>Save PDF</span>
         </button>
         <button className="flex-1 py-3 bg-[#D4006A] text-white rounded-xl font-bold flex justify-center items-center space-x-2 text-sm shadow-sm">
           <Share2 size={18} />
           <span>Share</span>
         </button>
      </div>
    </div>
  );
}
