import { Home, GraduationCap, Radio, MessageSquare, Store, MoreHorizontal } from 'lucide-react';
import { NavLink } from 'react-router';
import { useState } from 'react';
import MoreDrawer from './MoreDrawer';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

export default function BottomNavigation() {
  const { user } = useAuthStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Courses', icon: GraduationCap, path: '/courses' },
    { name: 'Radio', icon: Radio, path: '/radio' },
    { name: 'Community', icon: MessageSquare, path: '/community' },
    { name: 'Market', icon: Store, path: '/market' },
  ];

  return (
    <>
      <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#0F0F0F] border-t border-gray-200 dark:border-zinc-800 flex justify-around items-center px-2 z-40 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive ? 'text-[#D4006A] dark:text-[#D4006A]' : 'text-gray-500 dark:text-gray-400'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? 'fill-current opacity-20' : undefined} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
        
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-gray-400"
        >
          <MoreHorizontal size={22} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      <MoreDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
