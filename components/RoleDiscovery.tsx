
import React from 'react';
import { JobRole } from '../types';
import { ROLE_ICONS } from '../constants';
import { ArrowRight, Star } from 'lucide-react';

interface RoleDiscoveryProps {
  roles: JobRole[];
  onSelect: (role: JobRole) => void;
}

export const RoleDiscovery: React.FC<RoleDiscoveryProps> = ({ roles, onSelect }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Roles Found for You</h1>
        <p className="text-slate-600 dark:text-slate-400">We analyzed your skills and location to find these perfect matches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role) => (
          <div 
            key={role.id}
            onClick={() => onSelect(role)}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-indigo-500" />
            </div>
            
            <div className="mb-4 inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 group-hover:scale-110 transition-transform">
              {ROLE_ICONS[role.icon] || ROLE_ICONS['Generic']}
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{role.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{role.description}</p>
            
            <div className="space-y-3 mt-auto">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>Match Score</span>
                <span className="text-indigo-600 dark:text-indigo-400">{role.matchScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000" 
                  style={{ width: `${role.matchScore}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{role.averageSalary}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  role.demandLevel === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {role.demandLevel} Demand
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
