import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '../lib/utils';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export default function Support() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<'create' | 'tickets'>('create');
  const [form, setForm] = useState({ subject: 'Technical Issue', message: '' });
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tickets');
    });
    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.message.trim()) return;

    try {
      await addDoc(collection(db, 'tickets'), {
        userId: user.id,
        subject: form.subject,
        message: form.message,
        status: 'In Progress',
        createdAt: Date.now()
      });
      setForm({ subject: 'Technical Issue', message: '' });
      setTab('tickets');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tickets');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] p-4 border-b border-gray-100 dark:border-zinc-800 space-y-4 shrink-0">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold dark:text-white">Help & Support</h1>
        </div>

        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setTab('create')}
            className={cn("flex-1 py-1.5 text-xs font-semibold rounded shadow-sm transition-colors", tab === 'create' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none")}
          >Contact Support</button>
          <button 
            onClick={() => setTab('tickets')}
            className={cn("flex-1 py-1.5 text-xs font-semibold rounded shadow-sm transition-colors", tab === 'tickets' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none")}
          >My Tickets</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {tab === 'create' ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1A1A1A] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-white">Create a Ticket</h2>
            <p className="text-sm text-gray-500">Need help? Send us a message and our support team will get back to you within 24 hours.</p>
            
            <div className="space-y-3 pt-2">
               <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Subject</label>
                  <select 
                     value={form.subject}
                     onChange={(e) => setForm({...form, subject: e.target.value})}
                     className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:border-[#D4006A] dark:text-white"
                  >
                     <option>Technical Issue</option>
                     <option>Course Content</option>
                     <option>Certificate</option>
                     <option>Account</option>
                     <option>Other</option>
                  </select>
               </div>
               <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Message</label>
                  <textarea 
                     rows={5}
                     value={form.message}
                     onChange={(e) => setForm({...form, message: e.target.value})}
                     placeholder="Describe your issue in detail..."
                     required
                     className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:border-[#D4006A] dark:text-white resize-none"
                  ></textarea>
               </div>
               <button type="submit" className="w-full py-3.5 bg-[#D4006A] text-white rounded-xl font-bold shadow-md shadow-pink-500/20 active:scale-95 transition-transform mt-2">
                  Submit Ticket
               </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
             {tickets.length === 0 ? (
               <div className="text-center py-12 text-gray-500">No tickets found.</div>
             ) : tickets.map(ticket => (
               <div key={ticket.id} className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-sm dark:text-white line-clamp-1 flex-1 pr-2">{ticket.subject}</h3>
                     <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 shrink-0",
                        ticket.status === 'Resolved' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                     )}>
                        {ticket.status === 'Resolved' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        <span>{ticket.status}</span>
                     </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{ticket.message}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                     <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                     <button className="flex items-center space-x-1 text-[#D4006A] hover:underline">
                        <MessageSquare size={12} />
                        <span>View Reply</span>
                     </button>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
