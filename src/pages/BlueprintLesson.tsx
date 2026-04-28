import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useProgressStore } from '../store/progressStore';
import { cn } from '../lib/utils';
import { useState } from 'react';

const BLUEPRINT_CONTENT: Record<string, { title: string, lessons: any[] }> = {
  'bp1': {
    title: 'Pillar 1 — Identity',
    lessons: [
       { id: 'bp1-1', title: 'Who Are You Outside Roles?', content: 'As women, we often define ourselves by our roles: mother, wife, daughter, employee. But who are you when those titles are stripped away?' },
       { id: 'bp1-2', title: 'Overcoming Imposter Syndrome', content: 'You belong in every room you enter. Imposter syndrome is a sign you are growing, not a sign you are failing.' },
       { id: 'bp1-3', title: 'The Power of African Heritage', content: 'Our stories and heritage are our strength. Reclaiming the narrative.' },
       { id: 'bp1-4', title: 'Reframing Failure', content: 'Failure is data. It is feedback. It is not final.' }
    ]
  },
  'bp2': {
     title: 'Pillar 2 — Mandate',
     lessons: [
        { id: 'bp2-1', title: 'Discovering Your Why', content: 'Purpose is where your deep gladness meets the world\'s deep hunger.' },
        { id: 'bp2-2', title: 'Vision Boarding', content: 'Write the vision, make it plain.' },
        { id: 'bp2-3', title: 'Goals vs Assignments', content: 'Assignments are lifelong callings, goals are just milestones.' },
        { id: 'bp2-4', title: 'Staying the Course', content: 'Resilience when the motivation fades.' }
     ]
  },
  'bp3': {
     title: 'Pillar 3 — Influence & Legacy',
     lessons: [
        { id: 'bp3-1', title: 'Leading Without a Title', content: 'True leadership is influence, not authority.' },
        { id: 'bp3-2', title: 'Building Social Capital', content: 'Your network is your net worth. Build genuine relationships.' },
        { id: 'bp3-3', title: 'Mentoring the Next Generation', content: 'Lift as you climb.' },
        { id: 'bp3-4', title: 'Financial Legacy', content: 'Building wealth that outlasts you.' },
        { id: 'bp3-5', title: 'The Global African Woman', content: 'Taking your place on the world stage.' }
     ]
  }
};

export default function BlueprintLesson() {
  const { pillarId } = useParams();
  const navigate = useNavigate();
  const { markBlueprintLesson, blueprintProgress } = useProgressStore();
  const [activeLesson, setActiveLesson] = useState(0);

  const pillar = pillarId ? BLUEPRINT_CONTENT[pillarId] : null;

  if (!pillar) return <div className="p-4">Pillar not found</div>;

  const lesson = pillar.lessons[activeLesson];
  const isCompleted = blueprintProgress.completedLessons.includes(lesson.id);

  const handleComplete = () => {
    markBlueprintLesson(lesson.id);
    if (activeLesson < pillar.lessons.length - 1) {
       setActiveLesson(activeLesson + 1);
    } else {
       navigate('/journey'); // Back to journey
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F0F0F]">
       <header className="sticky top-0 bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-md px-4 py-3 flex items-center border-b border-gray-100 dark:border-zinc-800 z-10 space-x-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col">
           <span className="text-[10px] uppercase font-bold text-[#7CB518] tracking-wider">{pillar.title}</span>
           <span className="font-display font-bold truncate dark:text-white text-sm">Lesson {activeLesson + 1} of {pillar.lessons.length}</span>
        </div>
      </header>

      <main className="flex-1 p-5 overflow-y-auto">
         <div className="flex space-x-1 mb-6">
            {pillar.lessons.map((l, i) => (
               <div key={l.id} className={cn("h-1.5 flex-1 rounded-full", blueprintProgress.completedLessons.includes(l.id) ? "bg-[#7CB518]" : i === activeLesson ? "bg-[#7CB518]/50" : "bg-gray-200 dark:bg-zinc-800")}></div>
            ))}
         </div>

         <h1 className="text-2xl font-display font-bold leading-tight mb-6 dark:text-white">{lesson.title}</h1>
         
         <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            <p>{lesson.content}</p>
         </div>

         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 p-5 rounded-2xl mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-800 dark:text-yellow-500 mb-2">Lesson Reflection</h3>
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-400 mb-4">How does this principle apply to your own life or business currently?</p>
            <textarea placeholder="Write your reflection here..." rows={4} className="w-full bg-white dark:bg-black/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400 resize-none dark:text-gray-200"></textarea>
         </div>

         <button 
            onClick={handleComplete}
            className="w-full py-4 bg-[#7CB518] text-white rounded-xl font-bold shadow-md shadow-[#7CB518]/20 flex justify-center items-center active:scale-95 transition-transform"
         >
            {activeLesson === pillar.lessons.length - 1 ? 'Complete Pillar' : 'Complete & Continue'}
         </button>
      </main>
    </div>
  )
}
