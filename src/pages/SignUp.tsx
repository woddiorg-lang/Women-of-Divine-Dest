import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Rwanda", "Uganda", "Tanzania", 
  "Egypt", "Morocco", "Ethiopia", "UK", "USA", "Canada", "Australia"
];

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    country: '',
    pathway: '' as 'GMN' | 'NNN' | ''
  });

  const handleGoogleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pathway) return setError("Please select a pathway");
    if (!formData.country) return setError("Please select a country");
    
    setError('');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // User already exists, just redirect them
        const userData = userDoc.data();
        if (userData.role === 'admin') navigate('/admin');
        else if (userData.role === 'tutor') navigate('/tutor');
        else navigate('/');
      } else {
        // Create new user with selected form data
        const newUser = {
          email: result.user.email,
          name: result.user.displayName || 'New User',
          role: 'student',
          pathway: formData.pathway as 'GMN' | 'NNN',
          country: formData.country,
          streak: 0,
          points: 0,
          createdAt: Date.now(),
          completedRootingModules: [],
          completedBlueprintLessons: [],
          completedSkills: []
        };
        await setDoc(userDocRef, newUser);
        navigate('/');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to sign up');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-md mx-auto bg-white dark:bg-[#0F0F0F] relative overflow-y-auto px-6 pt-12 pb-12">
      <div className="flex flex-col items-center mb-6">
        <h1 className="font-display font-bold text-3xl mb-2 text-center dark:text-white">
          WODDI <span className="text-[#D4006A]">Institute</span>
        </h1>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
        <button onClick={() => navigate('/signin')} className="flex-1 py-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
          Sign In
        </button>
        <button className="flex-1 py-2 bg-white dark:bg-[#27272A] rounded shadow-sm text-sm font-semibold dark:text-white">
          Create Account
        </button>
      </div>

      {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

      <form onSubmit={handleGoogleSignUp} className="flex flex-col space-y-4">
        <select
          value={formData.country}
          onChange={(e) => setFormData({...formData, country: e.target.value})}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:border-[#D4006A] dark:text-white appearance-none h-[50px]"
          required
        >
          <option value="" disabled>Select Country *</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="py-2">
          <p className="text-sm font-bold mb-3 dark:text-white">Select your pathway</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({...formData, pathway: 'GMN'})}
              className={cn(
                "p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all",
                formData.pathway === 'GMN' ? 'border-[#D4006A] bg-pink-50 dark:bg-[#D4006A]/10' : 'border-gray-200 dark:border-zinc-800'
              )}
            >
              <Heart className={formData.pathway === 'GMN' ? 'text-[#D4006A]' : 'text-gray-400'} fill={formData.pathway === 'GMN' ? '#D4006A' : 'none'} size={32} />
              <span className={cn("font-bold text-sm", formData.pathway === 'GMN' ? 'text-[#D4006A]' : 'text-gray-500')}>GMN</span>
              <span className="text-[10px] text-gray-500">Age 25+</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, pathway: 'NNN'})}
              className={cn(
                "p-4 rounded-xl border-2 flex flex-col items-center justify-center space-y-2 transition-all",
                formData.pathway === 'NNN' ? 'border-[#7CB518] bg-green-50 dark:bg-[#7CB518]/10' : 'border-gray-200 dark:border-zinc-800'
              )}
            >
              <Leaf className={formData.pathway === 'NNN' ? 'text-[#7CB518]' : 'text-gray-400'} fill={formData.pathway === 'NNN' ? '#7CB518' : 'none'} size={32} />
              <span className={cn("font-bold text-sm", formData.pathway === 'NNN' ? 'text-[#7CB518]' : 'text-gray-500')}>NNN</span>
              <span className="text-[10px] text-gray-500">Age 18–24</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 mt-2">
          By creating an account you agree to our <a href="#" className="underline">Privacy Policy</a>
        </p>

        <button
          type="submit"
          className="w-full py-4 px-4 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center space-x-3 bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors mt-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-semibold text-gray-700 dark:text-gray-200">Sign Up with Google</span>
        </button>
      </form>
    </div>
  );
}
