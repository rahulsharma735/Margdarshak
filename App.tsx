
import React, { useState, useEffect } from 'react';
import { AppStep, UserProfile, JobRole, RoadmapStep, JobListing, User } from './types';
import { LiveAssistant } from './components/LiveAssistant';
import { RoleDiscovery } from './components/RoleDiscovery';
import { RoadmapView } from './components/RoadmapView';
import { JobBoard } from './components/JobBoard';
import { SuccessStories } from './components/SuccessStories';
import { Auth } from './components/Auth';
import { geminiService } from './services/geminiService';
import { 
  Compass, 
  Map, 
  Briefcase, 
  MessageSquare, 
  ArrowLeft,
  Loader2,
  Sparkles,
  Award,
  Users,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.Welcome);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Session on Load
  useEffect(() => {
    const savedSession = localStorage.getItem('margdarshak_session');
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    }
  }, []);

  const updateLocalUserStatus = (userId: string) => {
    const localUsers: any[] = JSON.parse(localStorage.getItem('margdarshak_users') || '[]');
    const userIndex = localUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      localUsers[userIndex].profileCreated = true;
      localStorage.setItem('margdarshak_users', JSON.stringify(localUsers));
      
      // Update current session too
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, profileCreated: true };
        setCurrentUser(updatedUser);
        localStorage.setItem('margdarshak_session', JSON.stringify(updatedUser));
      }
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('margdarshak_session', JSON.stringify(user));
    setStep(AppStep.Welcome);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('margdarshak_session');
    setStep(AppStep.Welcome);
  };

  const handleProfileComplete = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    if (currentUser) {
      updateLocalUserStatus(currentUser.id);
    }
    setLoading(true);
    try {
      const suggestedRoles = await geminiService.discoverRoles(userProfile);
      setRoles(suggestedRoles);
      setStep(AppStep.Discovery);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: JobRole) => {
    setSelectedRole(role);
    setLoading(true);
    try {
      if (profile) {
        const roleRoadmap = await geminiService.getRoadmap(role, profile);
        setRoadmap(roleRoadmap);
        setStep(AppStep.Roadmap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapContinue = async () => {
    if (selectedRole && profile) {
      setLoading(true);
      try {
        const recommendedJobs = await geminiService.getRecommendedJobs(selectedRole, profile);
        setJobs(recommendedJobs);
        setStep(AppStep.Jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const goBack = () => {
    if (step === AppStep.Discovery) setStep(AppStep.Chat);
    else if (step === AppStep.Roadmap) setStep(AppStep.Discovery);
    else if (step === AppStep.Jobs) setStep(AppStep.Roadmap);
    else if (step === AppStep.Chat) setStep(AppStep.Welcome);
    else if (step === AppStep.Stories) setStep(AppStep.Welcome);
    else if (step === AppStep.Auth) setStep(AppStep.Welcome);
  };

  return (
    <div className={`min-h-screen flex flex-col pb-20 md:pb-0 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span 
              className="text-xl font-black text-slate-900 dark:text-white tracking-tight cursor-pointer" 
              onClick={() => setStep(AppStep.Welcome)}
            >
              MARGDARSHAK
            </span>
            <div className="h-1 w-full bg-indigo-600 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-slate-900 dark:text-white leading-none">{currentUser.name}</span>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setStep(AppStep.Auth)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition-all text-sm"
            >
              <LogIn className="w-4 h-4" /> <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {step !== AppStep.Welcome && step !== AppStep.Auth && (
            <button 
              onClick={goBack}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors ml-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Thinking for you...</h2>
              <p className="text-slate-500 dark:text-slate-400">Our AI is finding the best path for your career.</p>
            </div>
          </div>
        ) : (
          <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-500">
            {step === AppStep.Welcome && (
              <div className="max-w-4xl mx-auto text-center space-y-8 py-12">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
                  <Award className="w-24 h-24 text-indigo-600 relative mx-auto" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                    Your Future, <span className="text-indigo-600">Guided by AI.</span>
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    India's first job portal that speaks to you. Tell us your story, and we'll show you the way to a better career.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => currentUser ? setStep(AppStep.Chat) : setStep(AppStep.Auth)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                  >
                    {currentUser?.profileCreated ? 'Continue Journey' : 'Start Free Counseling'} <MessageSquare className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setStep(AppStep.Stories)}
                    className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-600 text-slate-700 dark:text-slate-300 hover:text-indigo-600 px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2"
                  >
                    View Success Stories <Users className="w-6 h-6" />
                  </button>
                </div>
                <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Conversational', icon: MessageSquare },
                    { label: 'Skill Check', icon: Award },
                    { label: 'Roadmap', icon: Map },
                    { label: 'Fast Jobs', icon: Briefcase }
                  ].map((feat, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2">
                      <feat.icon className="w-6 h-6 text-indigo-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === AppStep.Auth && <Auth onAuthSuccess={handleAuthSuccess} onBack={goBack} />}
            {step === AppStep.Chat && <LiveAssistant onProfileComplete={handleProfileComplete} />}
            {step === AppStep.Discovery && <RoleDiscovery roles={roles} onSelect={handleRoleSelect} />}
            {step === AppStep.Roadmap && selectedRole && <RoadmapView steps={roadmap} role={selectedRole} onContinue={handleRoadmapContinue} />}
            {step === AppStep.Jobs && selectedRole && <JobBoard jobs={jobs} role={selectedRole} />}
            {step === AppStep.Stories && <SuccessStories />}
          </div>
        )}
      </main>

      {/* Persistent Navigation (Mobile) */}
      {step !== AppStep.Welcome && step !== AppStep.Auth && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-around md:hidden z-50">
          <button onClick={() => setStep(AppStep.Chat)} className={`flex flex-col items-center gap-1 ${step === AppStep.Chat ? 'text-indigo-600' : 'text-slate-400'}`}>
            <MessageSquare className="w-6 h-6" />
            <span className="text-[10px] font-bold">Chat</span>
          </button>
          <button onClick={() => setStep(AppStep.Discovery)} className={`flex flex-col items-center gap-1 ${step === AppStep.Discovery ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Compass className="w-6 h-6" />
            <span className="text-[10px] font-bold">Discover</span>
          </button>
          <button onClick={() => setStep(AppStep.Roadmap)} className={`flex flex-col items-center gap-1 ${step === AppStep.Roadmap ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Map className="w-6 h-6" />
            <span className="text-[10px] font-bold">Roadmap</span>
          </button>
          <button onClick={() => setStep(AppStep.Jobs)} className={`flex flex-col items-center gap-1 ${step === AppStep.Jobs ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Briefcase className="w-6 h-6" />
            <span className="text-[10px] font-bold">Jobs</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
