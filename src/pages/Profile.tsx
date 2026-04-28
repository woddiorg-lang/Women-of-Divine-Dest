import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { ArrowLeft, MapPin, Calendar, BookOpen, Award, MessageSquare, Flame, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user } = useAuthStore();
  const { completedSkills } = useProgressStore();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold dark:text-white">Profile</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
         {/* Cover & Avatar */}
         <div className="bg-white dark:bg-[#1A1A1A] pt-8 pb-6 px-4 flex flex-col items-center border-b border-gray-100 dark:border-zinc-800">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-4 border-4 border-white dark:border-[#0F0F0F]",
              user.pathway === 'GMN' ? 'bg-[#D4006A]' : 'bg-[#7CB518]'
            )}>
              {user.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-display font-bold dark:text-white mb-1">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-3">{user.email}</p>

            <div className="flex items-center space-x-3 mb-6">
              {user.pathway && (
                <span className={cn(
                  "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider",
                  user.pathway === 'GMN' ? 'bg-[#D4006A]/10 text-[#D4006A] border border-[#D4006A]/20' : 'bg-[#7CB518]/10 text-[#7CB518] border border-[#7CB518]/20'
                )}>
                  {user.pathway} Pathway
                </span>
              )}
              <span className="flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                 <MapPin size={12} />
                 <span>{user.country}</span>
              </span>
            </div>

            <button className="w-full py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center space-x-2">
               <Settings size={16} />
               <span>Edit Profile</span>
            </button>
         </div>

         <div className="p-4 space-y-4 mt-2">
            <div className="bg-white dark:bg-[#1A1A1A] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800">
               <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
                  <Calendar size={16} />
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                     <div className="flex items-center space-x-2 text-gray-500">
                        <BookOpen size={16} />
                        <span className="text-xs font-semibold">Courses</span>
                     </div>
                     <span className="text-xl font-bold dark:text-white">{completedSkills.length}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                     <div className="flex items-center space-x-2 text-emerald-500">
                        <Award size={16} />
                        <span className="text-xs font-semibold">Certificates</span>
                     </div>
                     <span className="text-xl font-bold dark:text-white">{completedSkills.length}</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                     <div className="flex items-center space-x-2 text-amber-500">
                        <Flame size={16} />
                        <span className="text-xs font-semibold">Streak</span>
                     </div>
                     <span className="text-xl font-bold dark:text-white">{user.streak} days</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                     <div className="flex items-center space-x-2 text-blue-500">
                        <MessageSquare size={16} />
                        <span className="text-xs font-semibold">Posts</span>
                     </div>
                     <span className="text-xl font-bold dark:text-white">12</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
