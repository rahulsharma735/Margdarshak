
import React, { useState } from 'react';
import { Quote, ArrowRight, Star, TrendingUp, User, MessageCircle, Send, X, Loader2, Sparkles } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface Story {
  name: string;
  location: string;
  before: string;
  after: string;
  quote: string;
  roadmap: string;
  salaryIncrease: string;
}

const STORIES: Story[] = [
  {
    name: "Ramesh Kumar",
    location: "Delhi",
    before: "Unemployed",
    after: "Delivery Supervisor",
    quote: "Margdarshak showed me that my driving skills could lead to a management role.",
    roadmap: "Logistics Excellence",
    salaryIncrease: "2.5x"
  },
  {
    name: "Sunita Devi",
    location: "Mumbai",
    before: "Domestic Helper",
    after: "Retail Store Assistant",
    quote: "I didn't know I could work in a big mall. The roadmap taught me how to talk to customers.",
    roadmap: "Retail Front-end",
    salaryIncrease: "1.8x"
  },
  {
    name: "Vijay Singh",
    location: "Bengaluru",
    before: "Casual Laborer",
    after: "Certified Electrician",
    quote: "The technical training suggestions changed my life. Now I have a steady monthly salary.",
    roadmap: "Electrical Maintenance",
    salaryIncrease: "3.0x"
  },
  {
    name: "Anita Verma",
    location: "Pune",
    before: "Unemployed (12th Pass)",
    after: "Customer Support Executive",
    quote: "I thought my English wasn't good enough, but the assistant guided me to the right training.",
    roadmap: "BPO Readiness",
    salaryIncrease: "2.2x"
  },
  {
    name: "Mohammad Ali",
    location: "Hyderabad",
    before: "Garage Assistant",
    after: "Senior Service Mechanic",
    quote: "I moved from cleaning parts to fixing engines thanks to the clear path shown here.",
    roadmap: "Automotive Advanced",
    salaryIncrease: "2.0x"
  }
];

export const SuccessStories: React.FC = () => {
  const [selectedMentor, setSelectedMentor] = useState<Story | null>(null);
  const [question, setQuestion] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !question.trim()) return;

    setLoading(true);
    setAdvice(null);
    try {
      const response = await geminiService.getMentorAdvice(
        selectedMentor.name,
        `From ${selectedMentor.before} to ${selectedMentor.after} in ${selectedMentor.location}`,
        question
      );
      setAdvice(response);
    } catch (err) {
      console.error(err);
      setAdvice("I am a bit busy right now, but please don't give up! Keep learning.");
    } finally {
      setLoading(false);
    }
  };

  const closeMentor = () => {
    setSelectedMentor(null);
    setQuestion('');
    setAdvice(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 relative">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Real People, <span className="text-indigo-600">Real Jobs</span></h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">See how thousands of workers across India found their dream path with Margdarshak.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {STORIES.map((story, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-24 h-24 dark:text-white" />
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{story.name}</h3>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">{story.location}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Before</p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{story.before}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-green-500 tracking-wider">After</p>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{story.after}</p>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-8 h-8 text-indigo-100 dark:text-indigo-900/20 absolute -top-2 -left-2 -z-0" />
                <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed relative z-10 pl-4">
                  "{story.quote}"
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => setSelectedMentor(story)}
                className="flex items-center gap-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Ask Advice
              </button>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black px-2 py-1 rounded-md">
                +{story.salaryIncrease} SALARY
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor Advice Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 overflow-hidden relative">
            <button 
              onClick={closeMentor}
              className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="p-8 pb-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Ask {selectedMentor.name}</h3>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{selectedMentor.after}</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {advice && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-3xl rounded-tl-none border border-indigo-100 dark:border-indigo-900/30 animate-in slide-in-from-left-4 duration-300">
                    <p className="text-slate-800 dark:text-slate-200 font-medium italic leading-relaxed">"{advice}"</p>
                  </div>
                )}
                
                {loading && (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl w-max">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className="text-xs font-bold text-slate-400">Typing advice...</span>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleAskAdvice} className="p-8 pt-0 mt-4">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder={`Ask ${selectedMentor.name} for advice...`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none text-slate-900 dark:text-white font-medium"
                />
                <button 
                  disabled={loading || !question.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-4 rounded-2xl transition-all shadow-lg active:scale-95"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">Powered by Mentorship AI</p>
            </form>
          </div>
        </div>
      )}

      {/* CTA: Share Story */}
      <div className="mt-20 text-center p-12 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
        <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Got a job using Margdarshak?</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Your story can inspire thousands. Share it with the community!</p>
        <button className="bg-slate-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95">
          Submit My Story
        </button>
      </div>
    </div>
  );
};
