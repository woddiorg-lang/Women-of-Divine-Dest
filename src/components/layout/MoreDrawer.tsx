import { Bot, Map, TrendingUp, Award, HeartHandshake, Settings, Trophy, LifeBuoy, User, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'AI Mentor', icon: Bot, path: '/ai-mentor', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { name: 'Journey', icon: Map, path: '/journey', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { name: 'Progress', icon: TrendingUp, path: '/progress', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Certs', icon: Award, path: '/certs', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { name: 'Mentorship', icon: HeartHandshake, path: '/mentorship', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { name: 'Support', icon: LifeBuoy, path: '/support', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
    { name: 'Profile', icon: User, path: '/profile', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { name: 'Settings', icon: Settings, path: '/settings', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1A1A1A] rounded-t-3xl z-50 p-6 pb-12 shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold dark:text-white">More Options</h2>
              <button onClick={onClose} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNav(item.path)}
                  className="flex flex-col items-center justify-center space-y-2 p-2"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-1", item.color)}>
                    <item.icon size={24} />
                  </div>
                  <span className="text-xs font-semibold dark:text-gray-300">{item.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
