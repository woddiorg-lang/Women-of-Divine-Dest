import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProgressStore } from '../store/progressStore';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const ROOTING_CONTENT: Record<string, any> = {
  'r1': {
    title: 'Welcome to WODDI Institute',
    duration: '8 min',
    content: `WODDI stands for Women of Divine Destiny Initiative. We provide structured learning through three stages: Rooting, Blueprint, and Course Hub. You cannot skip this journey, because foundation matters.`,
    quiz: {
      question: "What does WODDI stand for?",
      options: [
        "Women Of Digital Destiny Initiatives",
        "Women of Divine Destiny Initiative",
        "Women's Organization for Digital Development",
        "World Organization of Divine Destiny"
      ],
      correctIndex: 1,
      explanation: "WODDI stands for Women of Divine Destiny Initiative."
    }
  },
  'r2': {
    title: 'About WODDI — Who We Are',
    duration: '10 min',
    content: `WODDI operates across 28 African countries. We provide structured learning, mentorship, community, and certification. Our Founder is H.E. Dr. Zinaria Okorocha.`,
    quiz: {
      question: "How many African countries does WODDI operate in?",
      options: ["10 countries", "15 countries", "28 countries", "54 countries"],
      correctIndex: 2,
      explanation: "WODDI operates across 28 African countries."
    }
  },
  'r3': {
    title: 'About WGMN — The Good Mother Network',
    duration: '10 min',
    content: `WODDI Good Mother Network (WGMN) is designed for women aged 25 and above. When a mother thrives, her entire family thrives. This network provides support, business insight, and spiritual grounding.`,
    quiz: {
      question: "Who is WGMN designed for?",
      options: [
        "Women aged 18-24",
        "Women aged 25 and above",
        "Only business owners",
        "Only women in politics"
      ],
      correctIndex: 1,
      explanation: "WGMN is designed specifically for women aged 25 and above."
    }
  },
  // We'll stub the rest to be generic for now to save space
  'r4': {
    title: 'About NNN — Nurture NextGen',
    duration: '8 min',
    content: `Nurture NextGen is for women 18–24. They are young women building identity before responsibility.`,
    quiz: { question: "Who is NNN designed for?", options: ["Under 18s", "Women 18–24", "Men 18-24", "Women 25+"], correctIndex: 1, explanation: "NNN is for young women 18-24." }
  },
  'r5': {
    title: 'Your Identity', duration: '12 min', content: `Identity precedes assignment. You cannot give what you do not have.`,
    quiz: { question: "What precedes assignment?", options: ["Money", "Education", "Identity", "Location"], correctIndex: 2, explanation: "" }
  },
  'r6': {
    title: 'Your Values & Non-Negotiables', duration: '10 min', content: `Values are the compass, not the destination. Identify your core values.`,
    quiz: { question: "What are values?", options: ["The destination", "The compass", "The vehicle", "The map"], correctIndex: 1, explanation: "" }
  },
  'r7': {
    title: 'Setting Your Intention', duration: '10 min', content: `Intention without a plan is a wish. Write your learning intention.`,
    quiz: { question: "Intention without a plan is a...?", options: ["Goal", "Strategy", "Wish", "Success"], correctIndex: 2, explanation: "" }
  },
  'r8': {
    title: 'Your Learning Covenant', duration: '5 min', content: `Commitment to self. Sign a covenant with yourself to finish what you start.`,
    quiz: { question: "Who are you signing the covenant with?", options: ["The founder", "Yourself", "Your mentor", "The community"], correctIndex: 1, explanation: "" }
  }
};

export default function RootingModule() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { markRootingModule, rootingProgress } = useProgressStore();
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!moduleId || !ROOTING_CONTENT[moduleId]) {
    return <div className="p-4">Module not found</div>;
  }

  const module = ROOTING_CONTENT[moduleId];
  const isCompletedAlready = rootingProgress.completedModules.includes(moduleId);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    setShowResult(true);
    if (selectedAnswer === module.quiz.correctIndex) {
      markRootingModule(moduleId);
    }
  };

  const goNext = () => {
    const ids = Object.keys(ROOTING_CONTENT);
    const currentIndex = ids.indexOf(moduleId);
    if (currentIndex < ids.length - 1) {
      navigate(`/journey/rooting/${ids[currentIndex + 1]}`, { replace: true });
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      navigate('/journey');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-md mx-auto bg-white dark:bg-[#0F0F0F] relative">
      <header className="sticky top-0 bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-md px-4 py-3 flex items-center border-b border-gray-100 dark:border-zinc-800 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
          <ArrowLeft size={20} />
        </button>
        <span className="ml-2 font-display font-bold truncate dark:text-white">{module.title}</span>
      </header>

      <main className="flex-1 p-5 pb-24 overflow-y-auto">
        <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4006A] mb-2 block">{module.duration} reading</span>
          <h1 className="text-2xl font-display font-bold leading-tight mb-4">{module.title}</h1>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            <p>{module.content}</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-5 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider">Module Check</h2>
          <p className="font-semibold text-lg mb-4 leading-snug dark:text-gray-200">{module.quiz.question}</p>
          
          <div className="flex flex-col space-y-3">
            {module.quiz.options.map((opt: string, idx: number) => {
              const isSelected = selectedAnswer === idx;
              let btnClass = "border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300";
              
              if (showResult) {
                if (idx === module.quiz.correctIndex) {
                  btnClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500";
                } else if (isSelected) {
                  btnClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-1 ring-red-500";
                } else {
                  btnClass = "border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1A] text-gray-400 dark:text-gray-600 opacity-50";
                }
              } else if (isSelected) {
                btnClass = "border-[#D4006A] ring-1 ring-[#D4006A] bg-pink-50 dark:bg-[#D4006A]/10 text-[#D4006A]";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !showResult && handleAnswer(idx)}
                  disabled={showResult}
                  className={cn("p-4 rounded-xl border text-left text-sm font-medium transition-all", btnClass)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
              {selectedAnswer === module.quiz.correctIndex ? (
                <>
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                    <CheckCircle2 size={20} />
                    <span>Correct!</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{module.quiz.explanation}</p>
                  <button onClick={goNext} className="w-full py-3 bg-[#D4006A] text-white rounded-xl font-bold shadow-md shadow-pink-500/20">
                    Continue Journey
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-600 dark:text-red-400 font-bold mb-4">Not quite right. Review the material and try again.</p>
                  <button onClick={() => { setShowResult(false); setSelectedAnswer(null); }} className="w-full py-3 bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-xl font-bold">
                    Try Again
                  </button>
                </>
              )}
            </motion.div>
          )}
          </AnimatePresence>
          
          {!showResult && selectedAnswer !== null && (
            <button onClick={checkAnswer} className="w-full mt-4 py-3 bg-[#D4006A] text-white rounded-xl font-bold shadow-md shadow-pink-500/20">
              Submit Answer
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function AnimatePresence({ children }: any) {
  return children;
}
