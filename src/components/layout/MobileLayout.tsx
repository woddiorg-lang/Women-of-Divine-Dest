import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import MiniPlayer from './MiniPlayer';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export default function MobileLayout() {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/signin' && location.pathname !== '/signup') {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated && location.pathname !== '/signin' && location.pathname !== '/signup') {
    return null; // Will redirect
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-white dark:bg-[#0F0F0F] relative overflow-hidden shadow-2xl">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-16 pt-16">
        <Outlet />
      </main>

      <MiniPlayer />
      <BottomNavigation />
    </div>
  );
}
