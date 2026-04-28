import { Outlet, useNavigate, useLocation, NavLink } from 'react-router';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { LayoutDashboard, Users, Ticket, Store, MessageSquare, BookOpen, Upload, Award, LineChart, Settings, Mail, LogOut, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
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

  if (!isAuthenticated || user?.role !== 'admin') return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin');
  };

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Tickets', icon: Ticket, path: '/admin/tickets' },
    { name: 'Marketplace', icon: Store, path: '/admin/marketplace' },
    { name: 'Forum', icon: MessageSquare, path: '/admin/forum' },
    { name: 'Courses', icon: BookOpen, path: '/admin/courses' },
    { name: 'Upload', icon: Upload, path: '/admin/upload' },
    { name: 'Certificates', icon: Award, path: '/admin/certificates' },
    { name: 'Analytics', icon: LineChart, path: '/admin/analytics' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
    { name: 'Invites', icon: Mail, path: '/admin/invites' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-gray-50 dark:bg-[#0F0F0F] overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-zinc-800 flex flex-col shrink-0 hidden md:flex">
         <div className="p-6 flex items-center justify-between">
            <h1 className="font-display font-bold text-2xl dark:text-white tracking-tight">
               WODDI <span className="text-purple-600">Admin</span>
            </h1>
         </div>
         <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
            {navItems.map(item => (
               <NavLink 
                  key={item.name}
                  end={item.path === '/admin'}
                  to={item.path}
                  className={({isActive}) => cn(
                     "flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
                     isActive ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800"
                  )}
               >
                  <item.icon size={18} />
                  <span>{item.name}</span>
               </NavLink>
            ))}
         </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] relative pb-16 md:pb-0 w-full max-w-md md:max-w-none mx-auto bg-white md:bg-gray-50 dark:bg-[#1A1A1A] md:dark:bg-[#0F0F0F]">
         {/* Mobile Header */}
         <header className="md:hidden sticky top-0 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-zinc-800 p-4 shrink-0 flex justify-between items-center z-10">
             <h1 className="font-display font-bold text-xl dark:text-white">
               WODDI <span className="text-purple-600">Admin</span>
             </h1>
             <button onClick={handleLogout} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-lg text-gray-500"><LogOut size={16}/></button>
          </header>

          <header className="hidden md:flex h-16 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-zinc-800 px-8 items-center justify-between shrink-0">
             <div className="relative w-64 bg-gray-100 dark:bg-zinc-900 rounded-lg flex items-center px-3 py-2">
                <Search size={16} className="text-gray-400" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full ml-2 dark:text-white" />
             </div>
             <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-2 border-l border-gray-200 dark:border-zinc-800 pl-4">
                   <div className="flex flex-col items-end">
                      <span className="font-bold text-sm dark:text-white leading-tight">{user.name}</span>
                      <span className="text-xs text-gray-500">Super Admin</span>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                   </div>
                </div>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto">
             <Outlet />
          </div>

          {/* Mobile Bottom Nav Spacer (simplified for admin, usually admin uses desktop) */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-zinc-800 p-2 flex overflow-x-auto gap-2 z-40 pb-safe">
             {navItems.map(item => (
                <NavLink
                  key={item.name}
                  end={item.path === '/admin'}
                  to={item.path}
                  className={({isActive}) => cn(
                     "flex flex-col items-center justify-center shrink-0 w-16 px-1 py-1 rounded-lg",
                     isActive ? "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400" : "text-gray-500"
                  )}
                >
                  <item.icon size={18} className="mb-1" />
                  <span className="text-[9px] font-medium truncate w-full text-center">{item.name}</span>
                </NavLink>
             ))}
          </div>
      </main>
    </div>
  );
}
