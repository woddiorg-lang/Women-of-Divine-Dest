import { Bell, UserCircle, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export default function Header() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  if (!user) return null;

  const pathwayColor = user.pathway === 'GMN' ? 'text-[#D4006A] border-[#D4006A]' : 'text-[#7CB518] border-[#7CB518]';
  const pathwayBg = user.pathway === 'GMN' ? 'bg-[#D4006A]' : 'bg-[#7CB518]';

  return (
    <header className="absolute top-0 left-0 right-0 h-16 bg-white dark:bg-[#0F0F0F] border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 z-50">
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg leading-tight dark:text-white">
            WODDI <span className="text-[#D4006A]">Institute</span>
          </span>
          {user.pathway && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${pathwayColor} self-start`}>
              {user.pathway}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="relative text-gray-500 dark:text-gray-400">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
        </button>
        
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${pathwayBg}`}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
