import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProgressStore } from '../store/progressStore';
import { ArrowLeft, CheckCircle2, PlayCircle, Award, FileText, FileVideo, FileAudio, ShieldAlert, BadgeCheck, Globe, StopCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { COURSES } from './Courses';
import { GoogleGenAI } from '@google/genai';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const LANGUAGES = ['English', 'French', 'Arabic', 'Portuguese', 'Swahili', 'Yoruba', 'Igbo', 'Hausa'];

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { completeSkill, completedSkills } = useProgressStore();
  
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{score: number, passed: boolean} | null>(null);
  const [content, setContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [language, setLanguage] = useState('English');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, [language, courseId]);

  const toggleAudio = (moduleId: string, text: string) => {
    if (playingAudio === moduleId) {
      window.speechSynthesis.cancel();
      setPlayingAudio(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = {
        'English': 'en-US', 'French': 'fr-FR', 'Arabic': 'ar-SA',
        'Portuguese': 'pt-PT', 'Swahili': 'sw-KE', 'Yoruba': 'yo-NG',
        'Igbo': 'ig-NG', 'Hausa': 'ha-NG'
      };
      utterance.lang = langMap[language] || 'en-US';
      utterance.onend = () => setPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
      setPlayingAudio(moduleId);
    }
  };

  const course = COURSES.find(c => c.id === courseId);

  useEffect(() => {
    if (!course) return;
    
    let isMounted = true;
    const fetchCourseContent = async () => {
      setLoadingContent(true);
      setContent(null);
      try {
        const prompt = `You are an expert course creator. Generate a comprehensive, real, and detailed JSON course for the topic "${course.title}".
        Translate all text content (including titles, detailed text, quiz questions, and options) into **${language}**.
        The text must be highly instructional, providing actual knowledge, examples, and deep insights. No placeholder text.
        The JSON must match exactly this structure:
        {
          "modules": [
            { 
              "id": "m1", 
              "title": "Real Module Title", 
              "content": "Comprehensive, real instructional text covering the module deeply. Use markdown formatting. (Minimum 400 words). Do NOT use generic placeholders.",
              "youtubeVideoId": "Provide a REAL, widely known, 11-character YouTube video ID that is highly relevant to this topic (e.g. 'dQw4w9WgXcQ')"
            }
          ],
          "quiz": {
            "questions": [
              {
                "q": "A real, challenging multiple choice question about the content",
                "options": ["Real Option 1", "Real Option 2", "Real Option 3", "Real Option 4"],
                "ans": 0,
                "exp": "Detailed explanation of the correct answer"
              }
            ]
          }
        }
        Generate exactly 3 complete modules and 5 real quiz questions. Output raw JSON only, no markdown formatting.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (isMounted && response.text) {
          // Clean the markdown ticks in case it outputted them
          const raw = response.text.replace(/```json|```/g, '').trim();
          setContent(JSON.parse(raw));
        }
      } catch (e: any) {
        console.error("Failed to generate course", e);
        if (isMounted) {
           setContent({ error: true, details: e?.message || 'Error occurred' });
        }
      } finally {
        if (isMounted) setLoadingContent(false);
      }
    };
    
    fetchCourseContent();
    return () => { isMounted = false; };
  }, [course, language]);
  
  if (!course) return <div className="p-4">Course not found</div>;

  const isCompleted = completedSkills.includes(course.id);
  const color = course.track === 'Digital Skills' ? 'text-[#D4006A] bg-[#D4006A]' : 'text-[#7CB518] bg-[#7CB518]';
  const colorHex = course.track === 'Digital Skills' ? '#D4006A' : '#7CB518';

  const handleQuizSubmit = async () => {
    if (!content?.quiz) return;
    let correct = 0;
    content.quiz.questions.forEach((q: any, i: number) => {
      if (quizAnswers[i] === q.ans) correct++;
    });
    const score = Math.round((correct / content.quiz.questions.length) * 100);
    const passed = score >= 70;
    setQuizResult({ score, passed });
    if (passed) {
      completeSkill(course.id);
      if (user && !isCompleted) {
         try {
            await updateDoc(doc(db, 'users', user.id), {
               completedSkills: arrayUnion(course.id),
               points: increment(50)
            });
            setUser({ ...user, points: (user.points || 0) + 50 });
         } catch(e) {
            console.error(e);
         }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-md mx-auto bg-white dark:bg-[#0F0F0F] relative">
      <header className="sticky top-0 bg-white/80 dark:bg-[#0F0F0F]/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
           <Globe size={14} className="text-gray-500" />
           <select 
             value={language}
             onChange={(e) => setLanguage(e.target.value)}
             className="bg-transparent text-xs font-bold outline-none border-none text-gray-700 dark:text-gray-300"
           >
              {LANGUAGES.map(l => (
                 <option key={l} value={l} className="dark:bg-zinc-800">{l}</option>
              ))}
           </select>
        </div>
      </header>

      {quizResult ? (
        <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-6">
          <div className={cn("w-24 h-24 rounded-full flex items-center justify-center text-white", quizResult.passed ? "bg-emerald-500" : "bg-red-500")}>
            {quizResult.passed ? <BadgeCheck size={48} /> : <ShieldAlert size={48} />}
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold mb-2 dark:text-white">
              {quizResult.passed ? "Congratulations!" : "Keep Trying!"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              You scored <span className={cn("font-bold", quizResult.passed ? "text-emerald-500" : "text-red-500")}>{quizResult.score}%</span> on the quiz.
            </p>
            {quizResult.passed && <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Skill Marked as Completed</p>}
          </div>

          {quizResult.passed ? (
            <button onClick={() => navigate('/certs')} className={cn("w-full py-3.5 text-white rounded-xl font-bold mt-4", "bg-[#D4006A]")}>
              Download Certificate
            </button>
          ) : (
            <button onClick={() => { setQuizResult(null); setQuizAnswers({}); }} className="w-full py-3.5 bg-gray-200 text-gray-900 rounded-xl font-bold mt-4">
              Retry Quiz
            </button>
          )}

          <div className="w-full text-left bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl mt-4">
            <h3 className="font-bold text-sm uppercase mb-3 text-gray-500">Quiz Review</h3>
            <div className="space-y-4">
              {content?.quiz.questions.map((q: any, i: number) => (
                <div key={i} className="text-sm">
                  <p className="font-semibold dark:text-white mb-1">{q.q}</p>
                  <p className={quizAnswers[i] === q.ans ? "text-emerald-500" : "text-red-500"}>
                    Your answer: {q.options[quizAnswers[i]] || "None"}
                  </p>
                  {quizAnswers[i] !== q.ans && (
                    <p className="text-emerald-600 dark:text-emerald-400">Correct: {q.options[q.ans]}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 italic">{q.exp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : takingQuiz ? (
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold dark:text-white">Course Quiz</h2>
            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">15:00</span>
          </div>

          {content?.quiz.questions.map((q: any, i: number) => (
            <div key={i} className="mb-8">
              <p className="font-semibold text-lg mb-4 leading-snug dark:text-gray-200">{i + 1}. {q.q}</p>
              <div className="space-y-2">
                {q.options.map((opt: string, optIndex: number) => (
                  <button
                    key={optIndex}
                    onClick={() => setQuizAnswers(prev => ({...prev, [i]: optIndex}))}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border text-sm font-medium transition-colors",
                      quizAnswers[i] === optIndex 
                        ? `border-[${colorHex}] bg-[${colorHex}]/10 text-[${colorHex}]`
                        : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300"
                    )}
                    style={quizAnswers[i] === optIndex ? { borderColor: colorHex, color: colorHex, backgroundColor: colorHex + '1A' } : {}}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length < (content?.quiz.questions.length || 0)}
            className="w-full py-3.5 bg-[#D4006A] text-white rounded-xl font-bold mt-4 disabled:opacity-50"
          >
            Submit Quiz
          </button>
        </div>
      ) : (
        <main className="flex-1 p-5 pb-24 overflow-y-auto">
          <div className="mb-6">
             <div className="flex space-x-2 mb-3">
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm",
                  course.level === 'Beginner' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  course.level === 'Intermediate' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                )}>
                  {course.level}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                  {course.track}
                </span>
              </div>
            <h1 className="text-2xl font-display font-bold leading-tight mb-2 dark:text-white">{course.title}</h1>
            <p className="text-sm text-gray-500 mb-4">{course.tutor} • {course.duration}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{course.desc}</p>
          </div>

          <div className="flex space-x-2 mb-8 overflow-x-auto no-scrollbar">
            <span className="flex items-center space-x-1 text-xs font-semibold bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full dark:text-gray-300">
              <FileVideo size={14} /> <span>Videos</span>
            </span>
            <span className="flex items-center space-x-1 text-xs font-semibold bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full dark:text-gray-300">
              <FileText size={14} /> <span>PDF Guide</span>
            </span>
            <span className="flex items-center space-x-1 text-xs font-semibold bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full dark:text-gray-300">
              <FileAudio size={14} /> <span>Audio</span>
            </span>
          </div>

          {isCompleted && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 flex items-center space-x-3 mb-6">
              <Award className="text-emerald-600" />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">Skill Completed</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-500">You have earned the certificate for this course.</p>
              </div>
            </div>
          )}

          <h2 className="font-display font-bold text-lg mb-4 dark:text-white">Course Modules ({language})</h2>
          {loadingContent ? (
             <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl border-gray-300 dark:border-zinc-700 mb-8 flex flex-col items-center justify-center space-y-3">
               <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#D4006A] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#D4006A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#D4006A] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
               <p className="text-sm">Translating and generating module...</p>
            </div>
          ) : content ? (
            <div className="space-y-3 mb-8">
              {content.modules.map((m: any, i: number) => (
                <div key={m.id || i} className="border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1A1A1A] overflow-hidden">
                  <button 
                    onClick={() => setExpandedModule(expandedModule === m.id ? null : m.id)}
                    className="w-full text-left p-4 flex justify-between items-center"
                  >
                    <span className="font-semibold text-sm dark:text-white">Module {i+1}: {m.title}</span>
                    {expandedModule === m.id ? <CheckCircle2 size={18} className="text-gray-400" /> : <PlayCircle size={18} className="text-gray-400" />}
                  </button>
                  {expandedModule === m.id && (
                    <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 flex flex-col space-y-4">
                      
                      {m.youtubeVideoId && (
                        <div className="mt-3 relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                          <iframe 
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${m.youtubeVideoId}`} 
                            frameBorder="0"
                            allow="autoplay; encrypted-media; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      <div className="markdown-body text-gray-800 dark:text-gray-300 mt-4 prose prose-sm dark:prose-invert">
                         <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>

                      <div className="mt-3 p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center space-x-3">
                         <button 
                            onClick={() => toggleAudio(m.id, m.content)}
                            className="w-8 h-8 rounded-full bg-[#D4006A] text-white flex items-center justify-center flex-shrink-0"
                         >
                            {playingAudio === m.id ? <StopCircle size={16} /> : <PlayCircle size={16} />}
                         </button>
                         <div className="flex-1">
                            <p className="text-xs font-bold dark:text-white">Audio Narration</p>
                            <p className="text-[10px] text-gray-500">{playingAudio === m.id ? "Playing..." : "Listen to lesson"}</p>
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : content?.error ? (
             <div className="p-8 text-center border border-dashed rounded-xl border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-900/10 mb-8 flex flex-col space-y-2">
               <ShieldAlert className="w-8 h-8 text-red-500 mx-auto" />
               <p className="font-bold text-red-700 dark:text-red-400">Failed to generate course</p>
               <p className="text-xs text-red-600 dark:text-red-300">
                 {content.details.includes("API key expired") 
                   ? "The Gemini API key has expired. Please navigate to Settings to renew or provide a valid API key." 
                   : content.details}
               </p>
            </div>
          ) : (
             <div className="p-8 text-center text-red-500 border border-dashed rounded-xl border-red-300 dark:border-red-900 mb-8">
              Failed to load course content.
            </div>
          )}

          {content && !content.error && (
            <button 
              onClick={() => setTakingQuiz(true)}
              className={cn(
                "w-full py-4 rounded-xl font-bold text-[15px] text-white shadow-md transition-transform active:scale-95",
                isCompleted ? "bg-emerald-500" : `bg-[${colorHex}]`
              )}
              style={!isCompleted ? { backgroundColor: colorHex } : {}}
            >
              {isCompleted ? "Retake Quiz" : "Start Quiz"}
            </button>
          )}
        </main>
      )}
    </div>
  );
}
