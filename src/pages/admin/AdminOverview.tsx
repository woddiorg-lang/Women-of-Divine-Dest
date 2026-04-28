import { Users, BookOpen, Clock, Ticket, Store, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function AdminOverview() {
   const { user } = useAuthStore();

   return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
         <div className="flex justify-between items-end mb-8">
            <div>
               <h1 className="text-3xl font-display font-bold dark:text-white">Dashboard Overview</h1>
               <p className="text-gray-500 mt-1">Welcome to the WODDI command center.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white dark:bg-[#1A1A1A] px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               <span>Systems Operational</span>
            </div>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
               { label: 'Total Users', value: '12,450', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
               { label: 'Active Students', value: '8,200', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
               { label: 'Total Tutors', value: '45', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
               { label: 'Open Tickets', value: '18', icon: Ticket, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
               { label: 'Pending Market', value: '32', icon: Store, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
               { label: 'Forum Posts', value: '1.2k', icon: MessageSquare, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
            ].map((stat, i) => (
               <div key={i} className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 flex flex-col space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                     <stat.icon size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xl font-bold dark:text-white leading-tight">{stat.value}</span>
                     <span className="text-xs text-gray-500 font-semibold">{stat.label}</span>
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4 min-h-[400px] flex flex-col">
               <h2 className="font-bold dark:text-white mb-2">User Growth & Activity</h2>
               <div className="flex-1 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 flex items-center justify-center relative overflow-hidden p-6">
                  {/* Simulated Chart */}
                  <div className="w-full h-full flex items-end justify-between space-x-2 pt-10">
                     {[40, 60, 45, 80, 55, 90, 75, 100, 85, 120, 95, 140].map((h, i) => (
                        <div key={i} className="w-full flex justify-center group relative">
                           <div className="w-full max-w-[24px] bg-purple-200 dark:bg-purple-900/30 rounded-t-sm" style={{ height: `${h}%` }}>
                              <div className="w-full bg-purple-500 rounded-t-sm absolute bottom-0" style={{ height: `${h * 0.7}%` }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex justify-center space-x-6">
                  <div className="flex items-center space-x-2 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-purple-200 dark:bg-purple-900/30"></span><span>Signups</span></div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-purple-500"></span><span>Active</span></div>
               </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-4">
               <h2 className="font-bold dark:text-white">Recent Sign-ups</h2>
               <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-gray-500">U</div>
                        <div className="flex flex-col flex-1 truncate">
                           <span className="font-semibold text-sm dark:text-white truncate">New User {i}</span>
                           <span className="text-xs text-gray-500">user{i}@example.com</span>
                        </div>
                        <span className="text-[10px] text-gray-400">Just now</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
