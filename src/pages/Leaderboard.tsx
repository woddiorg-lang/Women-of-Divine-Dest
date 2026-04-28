import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Trophy, Flame } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Leaderboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'month' | 'network'>('all');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('points', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map((doc, idx) => ({
        id: doc.id,
        rank: idx + 1,
        name: doc.data().name || 'Anonymous',
        country: doc.data().country || 'Unknown',
        pts: doc.data().points || 0,
        streak: doc.data().streak || 0,
        isCurrentUser: user?.id === doc.id
      }));
      
      setLeaderboard(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] p-4 border-b border-gray-100 dark:border-zinc-800 space-y-4 shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold dark:text-white">Leaderboard</h1>
        </div>

        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setTab('all')}
            className={cn("flex-1 py-1.5 text-xs font-semibold rounded shadow-sm transition-colors", tab === 'all' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none")}
          >All Time</button>
          <button 
            onClick={() => setTab('month')}
            className={cn("flex-1 py-1.5 text-xs font-semibold rounded shadow-sm transition-colors", tab === 'month' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none")}
          >This Month</button>
          <button 
            onClick={() => setTab('network')}
            className={cn("flex-1 py-1.5 text-xs font-semibold rounded shadow-sm transition-colors", tab === 'network' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none")}
          >My Network</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3 pb-20">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading Leaderboard...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No data available</div>
        ) : leaderboard.map((entry) => (
          <div 
            key={entry.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-2xl shadow-sm border",
              entry.isCurrentUser 
                ? "bg-pink-50 border-pink-200 dark:bg-[#D4006A]/10 dark:border-[#D4006A]/30" 
                : "bg-white border-gray-100 dark:bg-[#1A1A1A] dark:border-zinc-800"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 text-center font-bold font-display">
                {entry.rank === 1 ? <span className="text-yellow-500 text-xl">🥇</span> :
                 entry.rank === 2 ? <span className="text-gray-400 text-xl">🥈</span> :
                 entry.rank === 3 ? <span className="text-amber-600 text-xl">🥉</span> :
                 <span className="text-gray-500 dark:text-gray-400 text-sm">#{entry.rank}</span>}
              </div>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
                entry.isCurrentUser ? "bg-[#D4006A]" : "bg-[#7CB518]"
              )}>
                {entry.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className={cn("font-bold text-[15px]", entry.isCurrentUser ? "text-[#D4006A]" : "text-gray-900 dark:text-white")}>
                  {entry.name}
                </span>
                <span className="text-[10px] text-gray-500">{entry.country}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-900 dark:text-white text-sm">{entry.pts} pts</span>
              {entry.streak > 0 && (
                <span className="flex items-center space-x-0.5 text-[10px] font-bold text-amber-500">
                  <Flame size={10} className="fill-current" />
                  <span>{entry.streak}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
