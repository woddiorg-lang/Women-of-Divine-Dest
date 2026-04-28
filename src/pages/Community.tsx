import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { Plus, Heart, MessageCircle, MoreVertical, Search, ShieldCheck, GraduationCap, Award, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { collection, query, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Community() {
  const { user } = useAuthStore();
  const { completedSkills } = useProgressStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(dbPosts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  const isCertified = completedSkills.length > 0;

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.id,
        authorName: user.name,
        authorAvatarLetter: user.name.charAt(0).toUpperCase(),
        authorPathway: user.pathway || 'None',
        content: newPostContent,
        likes: 0,
        comments: 0,
        createdAt: Date.now()
      });
      setNewPostContent('');
      setShowAddForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  const RoleBadge = ({ role, certified }: { role: string, certified?: boolean }) => {
    if (role === 'admin') return <span className="flex items-center space-x-1 text-[9px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded"><ShieldCheck size={10} className="mr-0.5"/> Admin</span>;
    if (role === 'tutor') return <span className="flex items-center space-x-1 text-[9px] font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded"><GraduationCap size={10} className="mr-0.5"/> Tutor</span>;
    if (certified) return <span className="flex items-center space-x-1 text-[9px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded"><Award size={10} className="mr-0.5"/> Certified</span>;
    return <span className="flex items-center space-x-1 text-[9px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Learning</span>;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F] relative">
      <div className="bg-white dark:bg-[#1A1A1A] px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <h1 className="text-2xl font-display font-bold dark:text-white">Community</h1>
        <button onClick={() => setShowAddForm(true)} className="flex items-center justify-center space-x-1 bg-[#D4006A] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform">
          <Plus size={16} />
          <span>Post</span>
        </button>
      </div>

      <div className="px-4 py-3 bg-white dark:bg-[#1A1A1A] border-b border-gray-100 dark:border-zinc-800 shrink-0">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search discussions..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border border-transparent focus:border-[#D4006A] transition-colors rounded-xl text-sm outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="flex flex-col">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-[#1A1A1A] p-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
                    post.authorRole === 'admin' ? "bg-purple-600" : post.authorRole === 'tutor' ? "bg-blue-600" : "bg-[#7CB518]"
                  )}>
                    {post.authorAvatarLetter}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                       <span className="font-bold text-sm dark:text-white">{post.authorName}</span>
                       <RoleBadge role={post.authorRole || 'student'} certified={post.isCertified} />
                    </div>
                    <span className="text-[10px] text-gray-500">{post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) + ' ago' : 'Just now'}</span>
                  </div>
                </div>
                <button className="text-gray-400 p-1">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>

              <div className="flex items-center space-x-6 pt-2">
                <button className="flex items-center space-x-1.5 text-gray-500 hover:text-[#D4006A] transition-colors">
                  <Heart size={18} />
                  <span className="text-xs font-semibold">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-xs font-semibold">{post.comments}</span>
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
               No posts yet. Be the first to start a discussion!
            </div>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="absolute inset-0 z-50 bg-white dark:bg-[#0F0F0F] flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold text-lg dark:text-white">New Post</h2>
            <button onClick={() => setShowAddForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleAddPost} className="p-4 flex flex-col flex-1">
            <textarea
              className="w-full flex-1 resize-none bg-transparent outline-none dark:text-white placeholder-gray-400"
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              autoFocus
            />
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
              <button 
                type="submit" 
                disabled={!newPostContent.trim()}
                className="w-full py-3.5 bg-[#D4006A] disabled:opacity-50 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
