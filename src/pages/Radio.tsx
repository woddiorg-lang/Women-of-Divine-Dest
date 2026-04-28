import { useState } from 'react';
import { useRadioStore } from '../store/radioStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ListMusic, History } from 'lucide-react';
import { cn } from '../lib/utils';

const PROGRAMS = [
  { id: 'ttt', title: 'Talk That Talk (TTT)', subtitle: 'Discussion Program', color: 'bg-[#D4006A] shadow-[#D4006A]/40' },
  { id: 'hh', title: 'Harmony Hub', subtitle: 'Wellness & Balance', color: 'bg-[#7CB518] shadow-[#7CB518]/40' },
  { id: 'wt', title: 'WODDI Thirst', subtitle: 'Faith & Purpose', color: 'bg-[#E67E22] shadow-[#E67E22]/40' },
];

const LANGUAGES = [
  { id: 'en', label: '🇺🇸 English' },
  { id: 'es', label: '🇪🇸 Español' },
  { id: 'pt', label: '🇧🇷 Português' },
  { id: 'sw', label: '🇰🇪 Swahili' },
];

export default function Radio() {
  const { isPlaying, currentProgramId, togglePlay, playEpisode } = useRadioStore();
  const [activeTab, setActiveTab] = useState<'playlist' | 'favs' | 'recent'>('playlist');
  const [lang, setLang] = useState('en');

  const activeProgram = PROGRAMS.find(p => p.id === currentProgramId) || PROGRAMS[0];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="p-4 bg-white dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-zinc-800">
         <h1 className="text-2xl font-display font-bold dark:text-white mb-4">WODDI Radio</h1>
         <div className="flex space-x-3 overflow-x-auto no-scrollbar">
            {PROGRAMS.map(prog => (
              <button
                key={prog.id}
                onClick={() => playEpisode(prog.id, 'ep1')}
                className={cn(
                  "shrink-0 w-32 h-24 rounded-2xl p-3 flex flex-col justify-end text-left shadow-md transition-transform active:scale-95",
                  prog.color,
                  currentProgramId === prog.id ? "ring-2 ring-white dark:ring-black ring-offset-2 ring-offset-current" : ""
                )}
              >
                <span className="text-white font-bold text-sm leading-tight">{prog.title}</span>
                <span className="text-white/80 text-[10px]">{prog.subtitle}</span>
              </button>
            ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center space-y-8">
         <div className={cn("w-64 h-64 rounded-full shadow-2xl flex items-center justify-center transition-all duration-1000", activeProgram.color.split(' ')[0], isPlaying ? "scale-105" : "scale-100")}>
            <div className="w-48 h-48 rounded-full border-4 border-white/20 flex flex-col items-center justify-center p-4 text-center">
               <span className="text-white/80 text-xs font-bold tracking-widest uppercase mb-2">Now Playing</span>
               <h2 className="text-white font-display font-bold text-2xl leading-none mb-1">{activeProgram.title}</h2>
               <p className="text-white/90 text-sm">{activeProgram.subtitle}</p>
            </div>
         </div>

         <div className="w-full max-w-xs space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 border-gray-900 dark:bg-white w-1/3"></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                <span>12:45</span>
                <span>45:00</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center px-4">
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <SkipBack size={24} />
              </button>
              <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xl active:scale-95 transition-transform"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <SkipForward size={24} />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-center space-x-3 text-gray-400">
               <Volume2 size={16} />
               <div className="h-1 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <div className="h-full bg-gray-400 w-4/5"></div>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-t-3xl border-t border-gray-100 dark:border-zinc-800 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {LANGUAGES.map(l => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                lang === l.id 
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black" 
                  : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex justify-around border-b border-gray-100 dark:border-zinc-800 mb-2">
           <button onClick={() => setActiveTab('playlist')} className={cn("pb-3 pt-1 flex items-center space-x-1 text-sm font-semibold", activeTab === 'playlist' ? "text-[#D4006A] border-b-2 border-[#D4006A]" : "text-gray-400")}>
             <ListMusic size={16} /> <span>Playlist</span>
           </button>
           <button onClick={() => setActiveTab('favs')} className={cn("pb-3 pt-1 flex items-center space-x-1 text-sm font-semibold", activeTab === 'favs' ? "text-[#D4006A] border-b-2 border-[#D4006A]" : "text-gray-400")}>
             <Heart size={16} /> <span>Favorites</span>
           </button>
           <button onClick={() => setActiveTab('recent')} className={cn("pb-3 pt-1 flex items-center space-x-1 text-sm font-semibold", activeTab === 'recent' ? "text-[#D4006A] border-b-2 border-[#D4006A]" : "text-gray-400")}>
             <History size={16} /> <span>Recent</span>
           </button>
        </div>

        <div className="flex flex-col space-y-2 py-2 max-h-32 overflow-y-auto">
          {/* Mock episodes */}
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                   <Play size={16} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-sm font-semibold dark:text-gray-200">Episode 0{i}: The Journey Forward</span>
                   <span className="text-[10px] text-gray-500">45 mins • WODDI Network</span>
                 </div>
               </div>
               <button className="text-gray-300 hover:text-red-500">
                 <Heart size={16} />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
