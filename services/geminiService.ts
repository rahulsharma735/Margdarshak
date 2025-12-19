
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, JobRole, RoadmapStep, JobListing } from "../types";

export const geminiService = {
  async discoverRoles(profile: UserProfile): Promise<JobRole[]> {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this user profile: ${JSON.stringify(profile)}, suggest 4 suitable blue/grey-collar job roles in India. 
      Return the response in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              averageSalary: { type: Type.STRING },
              demandLevel: { type: Type.STRING },
              matchScore: { type: Type.NUMBER },
              icon: { type: Type.STRING, description: "Suggest a keyword like 'Delivery', 'Driver', 'Mechanic', 'Chef', 'Security', 'Retail', 'Construction', 'Technician'" }
            },
            required: ['id', 'title', 'description', 'averageSalary', 'demandLevel', 'matchScore', 'icon']
          }
        }
      }
    });

    // Access .text property directly (not as a method)
    return JSON.parse(response.text || '[]');
  },

  async getRoadmap(role: JobRole, profile: UserProfile): Promise<RoadmapStep[]> {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a 4-step learning roadmap for the role "${role.title}" given a candidate with these skills: ${profile.skills.join(', ')}. Focus on practical, blue-collar readiness in India.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              duration: { type: Type.STRING },
              status: { type: Type.STRING }
            },
            required: ['title', 'description', 'duration', 'status']
          }
        }
      }
    });

    // Access .text property directly
    return JSON.parse(response.text || '[]');
  },

  async getRecommendedJobs(role: JobRole, profile: UserProfile): Promise<JobListing[]> {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 realistic mock job listings in ${profile.location} for the role "${role.title}". Include company names like "Zomato", "Urban Company", "Reliance Retail", etc.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              salary: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              postedAt: { type: Type.STRING }
            },
            required: ['id', 'title', 'company', 'location', 'salary', 'tags', 'postedAt']
          }
        }
      }
    });

    // Access .text property directly
    return JSON.parse(response.text || '[]');
  },

  async getMentorAdvice(mentorName: string, mentorStory: string, userQuestion: string): Promise<string> {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are ${mentorName}. Your background is: ${mentorStory}. 
      A job seeker asks you: "${userQuestion}". 
      Give them short, practical, and encouraging advice in simple Hinglish (Hindi + English). 
      Limit to 2-3 sentences.`,
      config: {
        temperature: 0.7,
      }
    });
    // Access .text property directly
    return response.text || "Keep working hard, you can do it!";
  }
};
