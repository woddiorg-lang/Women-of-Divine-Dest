import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') navigate('/admin');
        else if (userData.role === 'tutor') navigate('/tutor');
        else navigate('/');
      } else {
        // Automatically create a student profile if one doesn't exist
        const newUser = {
          email: result.user.email,
          name: result.user.displayName || 'New User',
          role: 'student',
          pathway: 'None',
          country: 'Unknown',
          streak: 0,
          points: 0,
          createdAt: Date.now()
        };
        await setDoc(userDocRef, newUser);
        navigate('/');
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to sign in');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-md mx-auto bg-white dark:bg-[#0F0F0F] relative overflow-hidden px-6 pt-12 pb-6 justify-center">
      <div className="flex flex-col items-center mb-12">
        <h1 className="font-display font-bold text-3xl mb-2 text-center dark:text-white">
          WODDI <span className="text-[#D4006A]">Institute</span>
        </h1>
        <p className="text-gray-500 text-sm text-center font-medium">
          Identity. Leadership. Transformation across Africa.
        </p>
      </div>

      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-8">
        <button className="flex-1 py-2 bg-white dark:bg-[#27272A] rounded shadow-sm text-sm font-semibold dark:text-white">
          Sign In
        </button>
        <button onClick={() => navigate('/signup')} className="flex-1 py-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
          Create Account
        </button>
      </div>

      {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

      <button 
        onClick={handleGoogleSignIn}
        className="w-full py-4 px-4 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center space-x-3 bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="font-semibold text-gray-700 dark:text-gray-200">Continue with Google</span>
      </button>

    </div>
  );
}

