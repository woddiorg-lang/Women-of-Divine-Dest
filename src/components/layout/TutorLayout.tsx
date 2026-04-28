import { Outlet, useNavigate, useLocation, NavLink } from 'react-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { LayoutDashboard, Users, Clock, BookOpen, MessageSquare, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function TutorLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'tutor') {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated || user?.role !== 'tutor') return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin');
  };

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/tutor' },
    { name: 'Students', icon: Users, path: '/tutor/students' },
    { name: 'Sessions', icon: Clock, path: '/tutor/sessions' },
    { name: 'Courses', icon: BookOpen, path: '/tutor/courses' },
    { name: 'Messages', icon: MessageSquare, path: '/tutor/messages' },
  ];

  return (
    <div className="flex h-[100dvh] w-full bg-gray-50 dark:bg-[#0F0F0F] overflow-hidden">
      {/* Sidebar for tablets/desktop, or bottom nav for mobile (we'll implement a responsive sidebar here) */}
      <aside className="w-64 bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-zinc-800 flex flex-col shrink-0 hidden md:flex">
         <div className="p-6">
            <h1 className="font-display font-bold text-2xl dark:text-white">
               WODDI <span className="text-blue-600">Tutor</span>
            </h1>
         </div>
         <nav className="flex-1 px-4 space-y-2">
            {navItems.map(item => (
               <NavLink 
                  key={item.name}
                  end={item.path === '/tutor'}
                  to={item.path}
                  className={({isActive}) => cn(
                     "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                     isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800/50"
                  )}
               >
                  <item.icon size={20} />
                  <span>{item.name}</span>
               </NavLink>
            ))}
         </nav>
         <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
            <div className="flex items-center space-x-3 mb-4 px-2">
               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
               </div>
               <div className="flex flex-col truncate">
                  <span className="font-bold text-sm dark:text-white truncate">{user.name}</span>
                  <span className="text-xs text-gray-500">Tutor</span>
               </div>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2 w-full rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
               <LogOut size={20} />
               <span>Sign Out</span>
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-md md:max-w-none mx-auto border-l md:border-l-0 border-r md:border-r-0 border-gray-200 dark:border-zinc-800 bg-white md:bg-transparent dark:bg-[#0F0F0F] shadow-2xl md:shadow-none flex flex-col relative pb-16 md:pb-0">
          <header className="md:hidden sticky top-0 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-zinc-800 p-4 shrink-0 flex justify-between items-center z-10">
             <h1 className="font-display font-bold text-xl dark:text-white">
               WODDI <span className="text-blue-600">Tutor</span>
             </h1>
             <button onClick={handleLogout} className="text-gray-500"><LogOut size={20}/></button>
          </header>
          
          <div className="flex-1 overflow-y-auto">
             <Outlet />
          </div>

          {/* Mobile Bottom Nav */}
          <nav className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-zinc-800 flex justify-around items-center px-1 z-40 pb-safe">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                end={item.path === '/tutor'}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center w-full h-full space-y-1',
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
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
          </nav>
      </main>
    </div>
  );
}
