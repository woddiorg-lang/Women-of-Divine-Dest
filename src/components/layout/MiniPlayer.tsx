import { useRadioStore } from '../../store/radioStore';
import { Play, Pause, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';

// Using some placeholder audio URLs for radio
const PROGRAMS = {
  'ttt': { title: 'Talk That Talk (TTT)', subtitle: 'Discussion Program', url: 'https://mp3tourl.com/audio/1776468820132-21da7ff0-f50a-46b9-9d4c-c8d97d636fca.mp3', color: '#D4006A' },
  'hh': { title: 'Harmony Hub', subtitle: 'Wellness & Balance', url: 'https://mp3tourl.com/audio/1776514057310-ae116025-e754-49f2-b568-74853b6df405.mp3', color: '#7CB518' },
  'wt': { title: 'WODDI Thirst', subtitle: 'Faith & Purpose', url: 'https://mp3tourl.com/audio/1776641671737-04028c5d-66cc-4b8b-9e34-b404e4e6f1d2.mp3', color: '#E67E22' },
};

export default function MiniPlayer() {
  const { isPlaying, currentProgramId, togglePlay } = useRadioStore();
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const program = currentProgramId ? PROGRAMS[currentProgramId as keyof typeof PROGRAMS] : null;

  useEffect(() => {
    if (audioRef.current && program) {
      if (audioRef.current.src !== program.url) {
        audioRef.current.src = program.url;
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, program]);

  if (!program) return null;
  
  // Hide mini player on the actual radio page
  if (location.pathname === '/radio') return (
    <audio ref={audioRef} loop />
  );

  return (
    <>
      <audio ref={audioRef} loop />
      <div 
        onClick={() => navigate('/radio')}
        className="absolute bottom-16 left-0 right-0 h-14 bg-white dark:bg-[#1A1A1A] border-t border-gray-100 dark:border-zinc-800 flex items-center px-4 justify-between z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] cursor-pointer pb-safe"
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded shadow-sm shrink-0" style={{ backgroundColor: program.color }}></div>
          <div className="flex flex-col truncate">
            <span className="text-xs font-bold truncate dark:text-white">{program.title}</span>
            <span className="text-[10px] text-gray-500 truncate">{program.subtitle}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 shrink-0 ml-2">
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
          </button>
        </div>
      </div>
    </>
  );
}
