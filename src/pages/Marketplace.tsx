import React, { useState, useEffect } from 'react';
import { useProgressStore } from '../store/progressStore';
import { Lock, Search, PlusCircle, PackageOpen, Briefcase, Palette, Megaphone, Laptop2, Shirt, Info, ExternalLink, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router';
import { collection, query, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: PackageOpen },
  { id: 'digital', name: 'Digital Services', icon: Laptop2 },
  { id: 'content', name: 'Content & Writing', icon: Megaphone },
  { id: 'design', name: 'Design & Branding', icon: Palette },
  { id: 'business', name: 'Business & Finance', icon: Briefcase },
  { id: 'handmade', name: 'Handmade Products', icon: Shirt },
];

const ListingCard: React.FC<{ item: any, isOwner?: boolean, onDelete?: (id: string) => void }> = ({ item, isOwner, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const categoryName = CATEGORIES.find(c => c.id === item.category)?.name;

  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex flex-col flex-1 pr-3">
          <span className="text-[10px] text-[#D4006A] uppercase font-bold tracking-wider mb-1">
            {categoryName}
          </span>
          <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">{item.title}</h3>
          <div className="flex items-center space-x-2 mt-1.5">
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300">
               {item.sellerName?.charAt(0) || '?'}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.sellerName}</span>
          </div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm border border-emerald-100 dark:border-emerald-800/30">
          {item.price}
        </div>
      </div>
      <div>
        <p className={cn("text-sm text-gray-600 dark:text-gray-300 transition-all", !expanded && "line-clamp-2")}>
          {item.desc}
        </p>
        {(item.desc && item.desc.length > 80) && (
           <button onClick={() => setExpanded(!expanded)} className="text-[#D4006A] hover:text-[#b00058] text-xs font-bold mt-1 inline-block">
             {expanded ? 'Show Less' : 'View More'}
           </button>
        )}
      </div>
      <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 mt-2 flex space-x-2">
        <button className="flex-1 py-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-bold flex items-center justify-center space-x-2">
          <ExternalLink size={16} />
          <span>Contact Seller</span>
        </button>
        {isOwner && (
          <button onClick={() => onDelete && onDelete(item.id)} className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 border border-red-200 font-bold">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function Marketplace() {
  const { user } = useAuthStore();
  const { completedSkills, rootingProgress, blueprintProgress } = useProgressStore();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'browse' | 'my'>('browse');
  const [showAddForm, setShowAddForm] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({ title: '', category: 'digital', price: '', desc: '' });

  const canList = completedSkills.length > 0 || (rootingProgress.completed && blueprintProgress.completed);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(dbItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'listings');
    });
    return () => unsubscribe();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'listings'), {
        ...formData,
        userId: user.id,
        sellerName: user.name,
        createdAt: Date.now()
      });
      setShowAddForm(false);
      setFormData({ title: '', category: 'digital', price: '', desc: '' });
      setTab('my');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'listings');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'listings', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'listings');
    }
  };

  if (!canList) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
        <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400">
          <Lock size={40} />
        </div>
        <h2 className="text-xl font-display font-bold text-center dark:text-white">Marketplace Locked</h2>
        <p className="text-gray-500 text-center text-sm max-w-xs">
          Earn at least one certificate OR complete the Rooting & Blueprint phases to access the graduate marketplace.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="py-3 px-8 bg-[#D4006A] text-white rounded-xl font-bold font-sans mt-4 active:scale-95 transition-transform"
        >
          Return Home
        </button>
      </div>
    );
  }

  const filteredItems = items.filter(item => {
    if (tab === 'my') return item.userId === user?.id;
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F] relative">
      <div className="bg-white dark:bg-[#1A1A1A] px-4 py-3 border-b border-gray-100 dark:border-zinc-800 space-y-4 shadow-sm z-10 shrink-0">
        <div className="flex justify-between items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setTab('browse')}
            className={cn(
              "flex-1 py-1.5 text-sm font-semibold rounded shadow-sm transition-colors",
              tab === 'browse' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none"
            )}
          >
            Browse Market
          </button>
          <button 
            onClick={() => setTab('my')}
            className={cn(
              "flex-1 py-1.5 text-sm font-semibold rounded shadow-sm transition-colors",
              tab === 'my' ? "bg-white dark:bg-[#27272A] dark:text-white" : "text-gray-500 bg-transparent shadow-none"
            )}
          >
            My Listings
          </button>
        </div>

        {tab === 'browse' && (
          <>
             <button onClick={() => setShowAddForm(true)} className="w-full py-3 bg-[#D4006A]/10 hover:bg-[#D4006A]/20 transition-colors text-[#D4006A] border border-[#D4006A]/30 rounded-xl font-bold text-[15px] flex items-center justify-center space-x-2">
                <PlusCircle size={20} />
                <span>List a Service or Product</span>
             </button>

            <div className="relative">
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search listings by title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-[#D4006A] rounded-xl text-sm outline-none dark:text-white transition-colors"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1.5 border",
                      activeCategory === cat.id 
                        ? "bg-[#D4006A] text-white border-[#D4006A]" 
                        : "bg-white text-gray-600 dark:bg-zinc-800 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    )}
                  >
                    <Icon size={14} />
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}
        
        {tab === 'my' && (
           <button onClick={() => setShowAddForm(true)} className="w-full py-3 bg-[#D4006A] text-white rounded-xl font-bold text-[15px] flex items-center justify-center space-x-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-transform">
              <PlusCircle size={20} />
              <span>Create New Listing</span>
           </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4 pb-20">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <Info size={32} className="opacity-50" />
            <p className="text-sm font-medium">{tab === 'browse' ? 'No listings found matching your search.' : "You haven't listed any services yet."}</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <ListingCard key={item.id} item={item} isOwner={item.userId === user?.id} onDelete={handleDelete} />
          ))
        )}
      </div>

      {showAddForm && (
        <div className="absolute inset-0 z-50 bg-white dark:bg-[#0F0F0F] flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0F0F0F] z-10">
            <h2 className="font-bold text-lg dark:text-white">Create Listing</h2>
            <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddSubmit} className="p-4 space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl dark:text-white focus:outline-none focus:border-[#D4006A]" placeholder="e.g. Logo Design" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl dark:text-white focus:outline-none focus:border-[#D4006A] appearance-none">
                {CATEGORIES.filter(c => c.id !== 'all').map(c => <option value={c.id} key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Price</label>
              <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl dark:text-white focus:outline-none focus:border-[#D4006A]" placeholder="e.g. 15,000 NGN" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
              <textarea required rows={4} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full p-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl dark:text-white focus:outline-none focus:border-[#D4006A]" placeholder="Describe your service..." />
            </div>
            <button type="submit" className="w-full py-4 bg-[#D4006A] text-white rounded-xl font-bold mt-4 shadow-lg shadow-pink-500/20">
              Publish Listing
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
