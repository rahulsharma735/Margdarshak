
import React from 'react';
import { RoadmapStep, JobRole } from '../types';
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';

interface RoadmapViewProps {
  steps: RoadmapStep[];
  role: JobRole;
  onContinue: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ steps, role, onContinue }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Your Career Roadmap</p>
          <h2 className="text-3xl font-bold mb-4">How to become a {role.title}</h2>
          <p className="text-indigo-50/80 max-w-lg">Follow these steps to get job-ready. We'll show you companies hiring for this role next.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
           <Clock className="w-32 h-32" />
        </div>
      </div>

      <div className="space-y-6 relative">
        <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-slate-200 dark:bg-slate-800" />
        
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6 relative">
            <div className={`z-10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 shadow-sm ${
              step.status === 'completed' ? 'bg-green-500' : 
              step.status === 'current' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}>
              {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-white" /> : <span className="font-bold">{i + 1}</span>}
            </div>
            
            <div className={`flex-1 p-6 rounded-2xl border transition-all ${
              step.status === 'current' ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 shadow-lg ring-1 ring-indigo-50 dark:ring-indigo-900/10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm opacity-80'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{step.title}</h3>
                <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {step.duration}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
              {step.status === 'current' && (
                <button className="mt-4 text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
                  Start Training <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={onContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95"
        >
          See Available Jobs
        </button>
      </div>
    </div>
  );
};
