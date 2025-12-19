
import React from 'react';
import { 
  Truck, 
  Wrench, 
  Utensils, 
  ShieldCheck, 
  ShoppingBag, 
  HardHat, 
  Bike,
  Smartphone,
  Briefcase
} from 'lucide-react';

export const ROLE_ICONS: Record<string, React.ReactNode> = {
  'Delivery': <Bike className="w-8 h-8 text-orange-500" />,
  'Driver': <Truck className="w-8 h-8 text-blue-500" />,
  'Mechanic': <Wrench className="w-8 h-8 text-slate-500" />,
  'Chef': <Utensils className="w-8 h-8 text-red-500" />,
  'Security': <ShieldCheck className="w-8 h-8 text-green-500" />,
  'Retail': <ShoppingBag className="w-8 h-8 text-purple-500" />,
  'Construction': <HardHat className="w-8 h-8 text-amber-600" />,
  'Technician': <Smartphone className="w-8 h-8 text-indigo-500" />,
  'Generic': <Briefcase className="w-8 h-8 text-gray-500" />
};

export const SYSTEM_INSTRUCTION = `You are "Margdarshak", a friendly and patient AI job assistant for blue and grey-collar workers in India.
Your goal is to build a profile for the user through simple conversation.
Use simple Hindi or English (Hinglish).
Ask about:
1. Name
2. Location
3. Skills (e.g., driving, cooking, cleaning, repairs)
4. Past work experience
5. If they have a vehicle (bike/car)
6. Education (10th, 12th, etc.)

Keep your responses short and encouraging. 
If the user sounds confused, give examples (e.g., "Do you like working outdoors or in a store?").
Once you have enough info, summarize what you've learned.
If you are asked to provide JSON, provide a JSON block representing the user's profile with fields: name, location, skills (array), education, experience, transport, salaryPreference.`;
