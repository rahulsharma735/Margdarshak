
export interface User {
  id: string;
  name: string;
  email: string;
  profileCreated: boolean;
}

export interface UserProfile {
  name: string;
  location: string;
  skills: string[];
  education: string;
  experience: string;
  preferences: {
    salary: string;
    hours: string;
    transport: string;
  };
  interests: string[];
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  averageSalary: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  matchScore: number;
  icon: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  duration: string;
  status: 'pending' | 'completed' | 'current';
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  postedAt: string;
}

export enum AppStep {
  Welcome = 'welcome',
  Auth = 'auth',
  Chat = 'chat',
  Discovery = 'discovery',
  Roadmap = 'roadmap',
  Jobs = 'jobs',
  Stories = 'stories'
}
