import { MessageSquare, Users, Clock, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function TutorOverview() {
   const { user } = useAuthStore();

   return (
      <div className="p-6 max-w-5xl mx-auto space-y-6">
         <div className="bg-blue-600 text-white rounded-3xl p-8 flex flex-col justify-end min-h-[200px] relative overflow-hidden shadow-xl shadow-blue-600/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <h1 className="text-3xl font-display font-bold relative z-10">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
            <p className="text-blue-100 mt-2 relative z-10 max-w-lg">Your students are making great progress. You have 3 upcoming sessions this week.</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
               { label: 'Active Students', value: '42', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
               { label: 'Pending Sessions', value: '5', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
               { label: 'Courses Assigned', value: '3', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
               { label: 'Unread Messages', value: '12', icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
            ].map((stat, i) => (
               <div key={i} className="bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                     <stat.icon size={24} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-2xl font-bold dark:text-white leading-tight">{stat.value}</span>
                     <span className="text-xs text-gray-500 font-semibold">{stat.label}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4">
               <h2 className="font-bold dark:text-white">Upcoming Sessions</h2>
               <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="flex items-center justify-between flex-wrap gap-2 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center space-x-3 min-w-[200px]">
                           <div className="w-10 h-10 rounded-full bg-[#7CB518] text-white flex items-center justify-center font-bold">M</div>
                           <div className="flex flex-col">
                              <span className="font-semibold text-sm dark:text-white">Mercy A.</span>
                              <span className="text-xs text-gray-500">Business Strategy</span>
                           </div>
                        </div>
                        <div className="flex items-center space-x-4">
                           <div className="flex flex-col items-end">
                              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Today, 2:00 PM</span>
                              <span className="text-xs text-blue-600 font-medium">Zoom</span>
                           </div>
                           <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shrink-0">Join</button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4">
               <h2 className="font-bold dark:text-white">Recent Messages</h2>
               <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                        <div className="w-10 h-10 rounded-full bg-[#D4006A] text-white flex items-center justify-center font-bold">S</div>
                        <div className="flex flex-col flex-1 truncate">
                           <div className="flex justify-between items-center mb-0.5">
                              <span className="font-semibold text-sm dark:text-white">Sarah N.</span>
                              <span className="text-[10px] text-gray-400">10m ago</span>
                           </div>
                           <span className="text-xs text-gray-500 truncate">Thank you for the feedback on my proposal! I will update it.</span>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="w-full text-center text-sm font-semibold text-blue-600 py-2">View all messages</button>
            </div>
         </div>
      </div>
   );
}
