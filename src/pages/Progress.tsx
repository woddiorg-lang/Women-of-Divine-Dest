import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { ArrowLeft, CheckCircle2, Trophy, Flame, PlayCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';
import { COURSES } from './Courses';

export default function Progress() {
  const { user } = useAuthStore();
  const { rootingProgress, blueprintProgress, completedSkills } = useProgressStore();
  const navigate = useNavigate();

  if (!user) return null;

  const rootingPct = Math.round((rootingProgress.completedModules.length / 8) * 100);
  const blueprintPct = Math.round((blueprintProgress.completedLessons.length / 13) * 100);
  const hubPct = Math.round((completedSkills.length / 23) * 100);

  const digitalDone = COURSES.filter(c => completedSkills.includes(c.id) && c.track === 'Digital Skills').length;
  const handsOnDone = COURSES.filter(c => completedSkills.includes(c.id) && c.track === 'Hands-On Skills').length;

  const overallPct = Math.round((completedSkills.length / 23) * 100);

  // SVG parameters
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPct / 100) * circumference;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] p-4 border-b border-gray-100 dark:border-zinc-800 space-y-4 shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold dark:text-white">My Progress</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center items-center">
              <span className="text-xs text-gray-500 font-bold mb-1">Rooting</span>
              <span className="text-lg font-bold text-[#D4006A]">{rootingPct}%</span>
           </div>
           <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center items-center">
              <span className="text-xs text-gray-500 font-bold mb-1">Blueprint</span>
              <span className="text-lg font-bold text-[#7CB518]">{blueprintPct}%</span>
           </div>
           <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-center items-center">
              <span className="text-xs text-gray-500 font-bold mb-1">Courses</span>
              <span className="text-lg font-bold text-amber-500">{hubPct}%</span>
           </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center">
           <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                 <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-zinc-800" />
                 <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                         strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
                         className="text-emerald-500 transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                 <span className="text-2xl font-bold dark:text-white leading-none">{overallPct}%</span>
                 <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Done</span>
              </div>
           </div>
           
           <div className="flex justify-center space-x-6 w-full mt-4 border-t border-gray-100 dark:border-zinc-800 pt-4">
              <div className="flex flex-col items-center">
                 <span className="text-xs text-gray-500">Total Skills</span>
                 <span className="font-bold dark:text-white">23</span>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-xs text-emerald-500 font-bold">Completed</span>
                 <span className="font-bold text-emerald-500">{completedSkills.length}</span>
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-xs text-amber-500 font-bold">Remaining</span>
                 <span className="font-bold text-amber-500">{23 - completedSkills.length}</span>
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
           <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Track Breakdown</h2>
           
           <div className="space-y-1">
             <div className="flex justify-between text-sm font-semibold mb-1 dark:text-white">
               <span>Digital Skills</span>
               <span className="text-[#D4006A]">{digitalDone}/12</span>
             </div>
             <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4006A]" style={{ width: `${(digitalDone/12)*100}%` }}></div>
             </div>
           </div>

           <div className="space-y-1">
             <div className="flex justify-between text-sm font-semibold mb-1 dark:text-white">
               <span>Hands-On Skills</span>
               <span className="text-[#7CB518]">{handsOnDone}/11</span>
             </div>
             <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#7CB518]" style={{ width: `${(handsOnDone/11)*100}%` }}></div>
             </div>
           </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 pl-2">Completed Skills</h2>
          {completedSkills.length === 0 ? (
            <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl text-center text-sm text-gray-500 border border-gray-100 dark:border-zinc-800">
               No skills completed yet. Go to Course Hub to start learning!
            </div>
          ) : (
            COURSES.filter(c => completedSkills.includes(c.id)).map(course => (
              <div key={course.id} className="bg-white dark:bg-[#1A1A1A] p-3 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center space-x-3">
                 <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", course.track === 'Digital Skills' ? "bg-pink-50 text-[#D4006A]" : "bg-green-50 text-[#7CB518]")}>
                    <CheckCircle2 size={18} />
                 </div>
                 <div className="flex flex-col flex-1">
                    <span className="font-bold text-sm leading-tight dark:text-white">{course.title}</span>
                    <div className="flex items-center space-x-2 mt-0.5">
                       <span className="text-[10px] text-gray-500">{course.track}</span>
                       <span className="text-[10px] text-gray-400">•</span>
                       <span className="text-[10px] text-gray-500">{course.level}</span>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
