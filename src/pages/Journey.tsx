import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, Lock, PlayCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';

const ROOTING_MODULES = [
  { id: 'r1', title: 'Welcome to WODDI Institute', duration: '8 min' },
  { id: 'r2', title: 'About WODDI — Who We Are', duration: '10 min' },
  { id: 'r3', title: 'About WGMN — The Good Mother Network', duration: '10 min' },
  { id: 'r4', title: 'About NNN — Nurture NextGen', duration: '8 min' },
  { id: 'r5', title: 'Your Identity', duration: '12 min' },
  { id: 'r6', title: 'Your Values & Non-Negotiables', duration: '10 min' },
  { id: 'r7', title: 'Setting Your Intention', duration: '10 min' },
  { id: 'r8', title: 'Your Learning Covenant', duration: '5 min' },
];

const BLUEPRINT_PILLARS = [
  { id: 'bp1', title: 'Pillar 1 — Identity', lessons: 4 },
  { id: 'bp2', title: 'Pillar 2 — Mandate', lessons: 4 },
  { id: 'bp3', title: 'Pillar 3 — Influence & Legacy', lessons: 5 },
];

export default function Journey() {
  const { rootingProgress, blueprintProgress } = useProgressStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const rootingUnlocked = true; // Always unlocked initially
  const blueprintUnlocked = rootingProgress.completed;
  
  return (
    <div className="p-4 flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-display font-bold dark:text-white">Your Journey</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete the foundational phases to unlock the Course Hub.
        </p>
      </div>

      {/* PHASE 1: ROOTING */}
      <div className={cn(
        "rounded-3xl border p-5 flex flex-col space-y-4",
        rootingProgress.completed 
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/10" 
          : "border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#1A1A1A]"
      )}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#D4006A]">Phase 1</span>
            <h2 className="text-lg font-bold dark:text-white">Rooting Phase</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Foundation and orientation</p>
          </div>
          {rootingProgress.completed ? (
            <div className="bg-emerald-500 rounded-full p-1 text-white">
              <CheckCircle2 size={20} />
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-zinc-800 rounded-full py-1 px-3 text-xs font-bold text-gray-500 dark:text-gray-400">
              {rootingProgress.completedModules.length}/8
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          {ROOTING_MODULES.map((mod, index) => {
            const isCompleted = rootingProgress.completedModules.includes(mod.id);
            // Sequential lock: previous module must be completed
            const isLocked = index > 0 && !rootingProgress.completedModules.includes(ROOTING_MODULES[index - 1].id);
            
            return (
              <button
                key={mod.id}
                onClick={() => !isLocked && navigate(`/journey/rooting/${mod.id}`)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border text-left transition-colors",
                  isCompleted ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/5" :
                  isLocked ? "border-transparent bg-gray-50 dark:bg-zinc-800/50 opacity-60" :
                  "border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 shadow-sm active:scale-95"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isCompleted ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400" :
                    isLocked ? "bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-gray-500" :
                    "bg-pink-100 text-[#D4006A] dark:bg-[#D4006A]/20 dark:text-[#D4006A]"
                  )}>
                    {isCompleted ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={16} /> : <PlayCircle size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-semibold", isLocked ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white")}>
                      {mod.title}
                    </span>
                    <span className="text-[10px] text-gray-500">{mod.duration}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PHASE 2: BLUEPRINT */}
      <div className={cn(
        "rounded-3xl border p-5 flex flex-col space-y-4",
        !blueprintUnlocked ? "border-transparent bg-gray-50 dark:bg-zinc-900 opacity-70" :
        blueprintProgress.completed ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/10" : 
        "border-gray-200 bg-white dark:border-zinc-800 dark:bg-[#1A1A1A]"
      )}>
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#7CB518]">Phase 2</span>
            <h2 className="text-lg font-bold dark:text-white flex items-center space-x-2">
              <span>Blueprint Phase</span>
              {!blueprintUnlocked && <Lock size={16} className="text-gray-400" />}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Discover your mandate and legacy</p>
          </div>
          {blueprintProgress.completed ? (
            <div className="bg-emerald-500 rounded-full p-1 text-white">
              <CheckCircle2 size={20} />
            </div>
          ) : blueprintUnlocked && (
            <div className="bg-gray-100 dark:bg-zinc-800 rounded-full py-1 px-3 text-xs font-bold text-gray-500 dark:text-gray-400">
              {blueprintProgress.completedLessons.length}/13
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 pt-2">
          {BLUEPRINT_PILLARS.map((pillar) => {
            const isCompleted = false; // Add logic for pillar completion
            return (
              <button
                key={pillar.id}
                onClick={() => blueprintUnlocked && navigate(`/journey/blueprint/${pillar.id}`)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border text-left transition-colors",
                  blueprintUnlocked ? "border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 shadow-sm active:scale-95" : "border-transparent bg-gray-100 dark:bg-zinc-800/50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    blueprintUnlocked ? "bg-green-100 text-[#7CB518] dark:bg-[#7CB518]/20 dark:text-[#7CB518]" : "bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-gray-500"
                  )}>
                    {blueprintUnlocked ? <BookOpen size={16} /> : <Lock size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-semibold", !blueprintUnlocked ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white")}>
                      {pillar.title}
                    </span>
                    <span className="text-[10px] text-gray-500">{pillar.lessons} lessons</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
    </div>
  );
}
