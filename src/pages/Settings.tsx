import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { useThemeStore } from '../store/themeStore';
import { Settings as SettingsIcon, LogOut, Trash2, Globe, Bell, FileText, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';
import { auth, db } from '../lib/firebase';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        if (auth.currentUser) {
          if (user?.id) {
             await deleteDoc(doc(db, 'users', user.id));
          }
          await deleteUser(auth.currentUser);
          navigate('/signin');
        }
      } catch (e: any) {
         if (e.code === 'auth/requires-recent-login') {
            alert('Security requirement: Please sign out and sign back in to delete your account.');
         } else {
            console.error(e);
            alert('An error occurred while deleting your account.');
         }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] p-4 border-b border-gray-100 dark:border-zinc-800 space-y-4 shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold dark:text-white">Settings</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-2">App Preferences</h2>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                <span className="font-semibold text-sm">Dark Mode</span>
              </div>
              <button 
                onClick={toggleTheme}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors",
                  theme === 'dark' ? "bg-[#D4006A]" : "bg-gray-300 dark:bg-zinc-700"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  theme === 'dark' ? "translate-x-7" : "translate-x-1"
                )}></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
              <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
                <Bell size={20} />
                <span className="font-semibold text-sm">Notifications</span>
              </div>
              <button className="w-12 h-6 rounded-full bg-[#D4006A] relative">
                <div className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white transition-transform"></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-zinc-800">
              <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
                <Globe size={20} />
                <span className="font-semibold text-sm">Language</span>
              </div>
              <span className="text-sm text-gray-500 font-semibold">English (US)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-2">About</h2>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 cursor-pointer active:bg-gray-50 dark:active:bg-zinc-800">
              <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
                <FileText size={20} />
                <span className="font-semibold text-sm">Privacy Policy</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 dark:active:bg-zinc-800">
              <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
                <SettingsIcon size={20} />
                <span className="font-semibold text-sm">Terms of Service</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3 pb-8">
          <button 
            onClick={handleLogout}
            className="w-full py-4 text-center rounded-xl bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white font-bold flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
          
          <button 
            onClick={handleDeleteAccount}
            className="w-full py-4 text-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/30 flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <Trash2 size={18} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
