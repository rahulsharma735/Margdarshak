
import React from 'react';
import { JobListing, JobRole } from '../types';
import { MapPin, IndianRupee, Clock, Bookmark, ExternalLink } from 'lucide-react';

interface JobBoardProps {
  jobs: JobListing[];
  role: JobRole;
}

export const JobBoard: React.FC<JobBoardProps> = ({ jobs, role }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Jobs for You</h1>
          <p className="text-slate-600 dark:text-slate-400">Based on your training for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{role.title}</span>.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-sm transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">{jobs.length} new openings found today</span>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                  <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded uppercase tracking-wider">New</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{job.company}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-slate-400" /> {job.salary}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {job.postedAt}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-100 dark:border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
                  Apply Now <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
