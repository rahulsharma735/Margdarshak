
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Clear error when switching between login and register
  useEffect(() => {
    setError('');
  }, [isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();

    // Simulate Database logic using LocalStorage
    const localUsers: any[] = JSON.parse(localStorage.getItem('margdarshak_users') || '[]');

    if (isLogin) {
      // Find user with matching email (case-insensitive) and password
      const user = localUsers.find(u => u.email.toLowerCase() === trimmedEmail && u.password === password);
      
      if (user) {
        onAuthSuccess({ 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          profileCreated: !!user.profileCreated // Use the persisted status
        });
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } else {
      // Check if email is already taken
      if (localUsers.find(u => u.email.toLowerCase() === trimmedEmail)) {
        setError('This email is already registered. Try logging in.');
        return;
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: trimmedEmail,
        password: password,
        profileCreated: false
      };
      
      localUsers.push(newUser);
      localStorage.setItem('margdarshak_users', JSON.stringify(localUsers));
      
      onAuthSuccess({ 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        profileCreated: false 
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? 'Sign in to save your career progress' : 'Start your journey with Margdarshak today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 rounded-2xl transition-all text-slate-900 dark:text-white font-medium outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 rounded-2xl transition-all text-slate-900 dark:text-white font-medium outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 rounded-2xl transition-all text-slate-900 dark:text-white font-medium outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl">
              <p className="text-red-500 text-xs font-bold text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-6"
          >
            {isLogin ? 'Sign In' : 'Register Now'} <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-indigo-600 transition-colors py-2"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
          </button>
        </form>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Local Student Database
          </p>
        </div>
      </div>
      
      <button 
        onClick={onBack}
        className="mt-6 w-full text-center text-slate-400 hover:text-indigo-600 font-bold transition-colors"
      >
        Go Back to Home
      </button>
    </div>
  );
};
