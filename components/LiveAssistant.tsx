
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { 
  Mic, 
  MicOff, 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Sparkles, 
  Bike, 
  Truck, 
  Wrench, 
  MapPin, 
  GraduationCap, 
  IndianRupee,
  Volume2
} from 'lucide-react';
import { SYSTEM_INSTRUCTION } from '../constants';
import { UserProfile } from '../types';

interface LiveAssistantProps {
  onProfileComplete: (profile: UserProfile) => void;
}

// Utility functions for Audio Encoding/Decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string, mimeType: string } {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ onProfileComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Namaste! I am Margdarshak. Let’s talk about you. What is your name and what work do you know?' }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [activeVisual, setActiveVisual] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Detect keywords to show visual cues for low-literacy users
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || '';
    if (lastMsg.includes('bike') || lastMsg.includes('cycle') || lastMsg.includes('transport')) setActiveVisual('bike');
    else if (lastMsg.includes('skill') || lastMsg.includes('work') || lastMsg.includes('technician')) setActiveVisual('tools');
    else if (lastMsg.includes('city') || lastMsg.includes('location') || lastMsg.includes('place')) setActiveVisual('map');
    else if (lastMsg.includes('school') || lastMsg.includes('education') || lastMsg.includes('10th')) setActiveVisual('edu');
    else if (lastMsg.includes('salary') || lastMsg.includes('money') || lastMsg.includes('pay')) setActiveVisual('money');
    else setActiveVisual(null);
  }, [messages]);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;

      const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioCtx.destination);
            setIsActive(true);
          },
          onmessage: async (msg) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => prev + msg.serverContent.outputTranscription.text);
            }

            if (msg.serverContent?.turnComplete) {
              setMessages(prev => [...prev, { role: 'bot', text: transcription || 'I heard you! Let me think...' }]);
              setTranscription('');
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live Error:', e),
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION + "\nAlways use very simple words. Speak slowly.",
          outputAudioTranscription: {},
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start Live session:', err);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsProcessing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => `${m.role}: ${m.text}`), `user: ${userMsg}`].join('\n'),
        config: { 
          systemInstruction: SYSTEM_INSTRUCTION + "\nOutput final profile as JSON only when user says they are done.",
        }
      });

      const text = response.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const profileData = JSON.parse(jsonMatch[0]);
          onProfileComplete({
            name: profileData.name || 'User',
            location: profileData.location || 'India',
            skills: Array.isArray(profileData.skills) ? profileData.skills : [],
            education: profileData.education || 'Not specified',
            experience: profileData.experience || 'New to workforce',
            preferences: { salary: profileData.salaryPreference || 'Competitive', hours: 'Full-time', transport: profileData.transport || 'None' },
            interests: profileData.skills || []
          });
        } catch (e) {
          setMessages(prev => [...prev, { role: 'bot', text: text }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: text }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800 transition-colors">
      {/* Visual Cue Overlay (Low-Literacy Aid) */}
      <div className={`h-40 flex items-center justify-center transition-all duration-500 ${activeVisual ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
        {!activeVisual ? (
          <div className="text-center animate-bounce">
            <Bot className="w-16 h-16 text-indigo-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">Assistant is ready</p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
             {activeVisual === 'bike' && <Bike className="w-20 h-20 mb-2" />}
             {activeVisual === 'tools' && <Wrench className="w-20 h-20 mb-2" />}
             {activeVisual === 'map' && <MapPin className="w-20 h-20 mb-2" />}
             {activeVisual === 'edu' && <GraduationCap className="w-20 h-20 mb-2" />}
             {activeVisual === 'money' && <IndianRupee className="w-20 h-20 mb-2" />}
             <p className="font-black text-xl uppercase tracking-widest">
               {activeVisual.toUpperCase()}
             </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950 relative">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl flex gap-4 ${
              m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border-2 border-slate-100 dark:border-slate-800 shadow-sm'
            }`}>
              {m.role === 'bot' && <Bot className="w-6 h-6 mt-1 text-indigo-500 shrink-0" />}
              <p className="text-lg font-medium leading-tight">{m.text}</p>
              {m.role === 'user' && <User className="w-6 h-6 mt-1 shrink-0" />}
            </div>
          </div>
        ))}
        
        {isActive && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className="w-1 bg-indigo-500 rounded-full animate-pulse" 
                  style={{ 
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s` 
                  }} 
                />
              ))}
            </div>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Listening to your voice...</p>
          </div>
        )}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl flex gap-4 border-2 border-slate-100 dark:border-slate-800 shadow-sm">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <p className="text-lg text-slate-400 font-bold italic">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={isActive ? stopSession : startSession}
            className={`flex-1 h-20 rounded-[2rem] flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl ${
              isActive 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isActive ? (
              <>
                <MicOff className="w-10 h-10" />
                <span className="text-xl font-black">STOP VOICE</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10" />
                <span className="text-xl font-black uppercase tracking-tight">Tap to Speak</span>
              </>
            )}
          </button>
        </div>

        <div className="flex gap-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Or type here..."
            className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all text-lg font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="bg-slate-900 dark:bg-slate-700 hover:bg-black dark:hover:bg-slate-600 disabled:opacity-30 text-white p-4 rounded-2xl transition-all active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Demo Hook */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
         <button 
          onClick={() => {
            onProfileComplete({
              name: "Rajesh",
              location: "Mumbai",
              skills: ["Driving", "Basic Repair"],
              experience: "2 years",
              education: "10th Pass",
              preferences: { salary: "25k", hours: "Full-time", transport: "Own Bike" },
              interests: ["Logistics"]
            });
          }}
          className="text-[10px] font-bold text-slate-300 dark:text-slate-600 hover:text-indigo-400 flex items-center gap-2"
        >
          <Sparkles className="w-3 h-3" /> DEMO: FINISH PROFILE
        </button>
      </div>
    </div>
  );
};
