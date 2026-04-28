import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminTickets() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'tickets'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)).sort((a: any,b: any) => b.createdAt - a.createdAt));
    }, error => handleFirestoreError(error, OperationType.LIST, 'tickets'));
    return () => unsubscribe();
  }, []);

  const handleResolve = async (ticketId: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'tickets', ticketId), { 
        status: currentStatus === 'Resolved' ? 'In Progress' : 'Resolved' 
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'tickets');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-display font-bold dark:text-white">Support Tickets</h1>
      <div className="grid grid-cols-1 gap-4">
        {tickets.map(t => (
          <div key={t.id} className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col space-y-2">
            <div className="flex justify-between items-start">
               <h3 className="font-bold dark:text-white">{t.subject}</h3>
               <button 
                onClick={() => handleResolve(t.id, t.status)}
                className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 shrink-0 transition-colors",
                  t.status === 'Resolved' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                )}
               >
                 {t.status === 'Resolved' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                 <span>{t.status}</span>
               </button>
            </div>
            <p className="text-sm text-gray-500 whitespace-pre-wrap">{t.message}</p>
            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-zinc-800 mt-2">
              User ID: {t.userId} • Created: {new Date(t.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {tickets.length === 0 && <div className="text-gray-500 text-center py-8">No tickets found.</div>}
      </div>
    </div>
  );
}
