import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { Flame, Bot, GraduationCap, Store, MessageSquare, Award, PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router';

export default function Home() {
  const { user } = useAuthStore();
  const { rootingProgress, blueprintProgress, courseHubUnlocked, completedSkills } = useProgressStore();
  const navigate = useNavigate();

  if (!user) return null;

  const rootingPct = Math.round((rootingProgress.completedModules.length / 8) * 100);
  const blueprintPct = Math.round((blueprintProgress.completedLessons.length / 13) * 100);
  const hubPct = Math.round((completedSkills.length / 23) * 100);

  return (
    <div className="p-4 flex flex-col space-y-6">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-display font-bold dark:text-white">
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <div className="flex space-x-2">
          {user.pathway && (
            <span className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider",
              user.pathway === 'GMN' ? 'bg-[#D4006A] text-white' : 'bg-[#7CB518] text-white'
            )}>
              {user.pathway} Phase
            </span>
          )}
          <span className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
            <Flame size={14} className="fill-current" />
            <span>{user.streak} Day Streak</span>
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col space-y-4">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Progress</h2>
        
        <div className="flex flex-col space-y-3">
          <PhaseProgress 
            title="Rooting Phase" 
            pct={rootingPct} 
            color="bg-[#D4006A]" 
            isDone={rootingProgress.completed}
            onClick={() => navigate('/journey')}
          />
          <PhaseProgress 
            title="Blueprint Phase" 
            pct={blueprintPct} 
            color="bg-[#7CB518]" 
            isDone={blueprintProgress.completed}
            isLocked={!rootingProgress.completed}
            onClick={() => navigate('/journey')}
          />
          <PhaseProgress 
            title="Course Hub" 
            pct={hubPct} 
            color="bg-amber-500" 
            isDone={false}
            isLocked={!courseHubUnlocked}
            onClick={() => navigate('/courses')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <QuickAction 
          title="AI Mentor" 
          icon={<Bot size={24} />} 
          color="bg-[#D4006A]" 
          onClick={() => navigate('/ai-mentor')} 
        />
        <QuickAction 
          title="Courses" 
          icon={<GraduationCap size={24} />} 
          color="bg-[#D4006A]" 
          onClick={() => navigate('/courses')} 
        />
        <QuickAction 
          title="Marketplace" 
          icon={<Store size={24} />} 
          color="bg-[#D4006A]" 
          onClick={() => navigate('/market')} 
        />
        <QuickAction 
          title="Community" 
          icon={<MessageSquare size={24} />} 
          color="bg-[#7CB518]" 
          onClick={() => navigate('/community')} 
        />
        <QuickAction 
          title="Certificates" 
          icon={<Award size={24} />} 
          color="bg-gray-800 text-white dark:bg-zinc-800" 
          onClick={() => navigate('/certs')} 
        />
      </div>

      {completedSkills.length > 0 && (
        <div className="flex flex-col space-y-3 pt-2">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Activity</h2>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800">
            <p className="text-sm dark:text-gray-300">You've completed {completedSkills.length} skills so far. Keep going!</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PhaseProgress({ title, pct, color, isDone, isLocked = false, onClick }: any) {
  return (
    <div className={cn("flex flex-col space-y-2", isLocked && 'opacity-50 grayscale')}>
      <div className="flex justify-between items-center text-sm font-semibold dark:text-gray-200">
        <span className="flex items-center space-x-2">
          {title}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className={cn("h-full", color)} style={{ width: `${pct}%` }}></div>
        </div>
        <button 
          onClick={isLocked ? undefined : onClick}
          className={cn(
            "flex items-center justify-center p-1.5 rounded-full text-white shadow-sm transition-transform active:scale-90",
            isDone ? "bg-emerald-500" : isLocked ? "bg-gray-300 dark:bg-gray-700" : color
          )}
        >
          {isDone ? <CheckCircle2 size={16} /> : <PlayCircle size={16} className="ml-0.5" />}
        </button>
      </div>
    </div>
  )
}

function QuickAction({ title, icon, color, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-2xl text-white shadow-md active:scale-95 transition-transform space-y-2",
        color
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{title}</span>
    </button>
  );
}
