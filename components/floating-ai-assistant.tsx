"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";

const SUGGESTED = [
  "What should I eat to manage my glucose?",
  "How does exercise affect blood sugar?",
  "Tips for better sleep with diabetes",
];

// Smart responses for common questions
const RESPONSES: Record<string, string[]> = {
  diet: [
    "For better glucose management, focus on low-glycemic foods like leafy greens, whole grains, and lean proteins. Avoid sugary drinks and processed foods. Eating smaller, more frequent meals can help maintain stable blood sugar levels.",
    "Great question! Some excellent food choices include: non-starchy vegetables (broccoli, spinach, peppers), lean proteins (chicken, fish, tofu), healthy fats (avocado, nuts, olive oil), and whole grains in moderation. Try to limit refined carbs and sugary snacks.",
    "Managing glucose through diet is key! I recommend the plate method: fill half your plate with non-starchy vegetables, a quarter with lean protein, and a quarter with complex carbs. This helps maintain steady blood sugar levels throughout the day.",
  ],
  exercise: [
    "Regular exercise helps your body use insulin more effectively. Aim for at least 150 minutes of moderate activity per week. Walking after meals can help lower post-meal blood sugar spikes. Always check your glucose before and after exercise.",
    "Exercise is wonderful for glucose control! Activities like brisk walking, swimming, or cycling can lower blood sugar for up to 24 hours. Start slowly and build up. A 15-minute walk after meals is a great way to begin!",
    "Physical activity makes your cells more sensitive to insulin. Try to include both aerobic exercise (walking, dancing) and resistance training (weights, resistance bands) for best results. Even light activity like gardening helps!",
  ],
  sleep: [
    "Good sleep is crucial for glucose management. Aim for 7-9 hours per night. Keep a consistent sleep schedule and avoid heavy meals before bed. Poor sleep can increase insulin resistance and affect your blood sugar levels.",
    "Sleep and blood sugar are closely connected! When you don't sleep well, your body produces more stress hormones, which can raise glucose levels. Tips: keep your bedroom cool, limit screens before bed, and try relaxation techniques.",
    "Quality sleep helps regulate hormones that control appetite and blood sugar. Try to go to bed and wake up at the same time daily. Avoid caffeine after 2 PM and create a calming bedtime routine.",
  ],
  stress: [
    "Stress can significantly impact blood sugar levels by triggering cortisol release. Try deep breathing exercises, meditation, or gentle yoga. Even a few minutes of relaxation can help lower stress hormones and stabilize glucose.",
    "Managing stress is important for glucose control! When stressed, your body releases hormones that raise blood sugar. Consider practices like mindfulness, progressive muscle relaxation, or spending time in nature.",
  ],
  general: [
    "I'm here to help with your glucose management journey! Some key tips: monitor your blood sugar regularly, stay hydrated, maintain a balanced diet, exercise regularly, and get adequate sleep. What specific area would you like to know more about?",
    "Great to chat with you! For optimal glucose management, focus on consistency: regular meal times, consistent sleep schedule, and daily movement. Small, sustainable changes often work better than drastic ones. How can I help you today?",
    "Remember, managing blood sugar is a marathon, not a sprint! Focus on progress, not perfection. Keep track of how different foods and activities affect your levels, and work with your healthcare team for personalized advice.",
  ],
  medication: [
    "While I can provide general information, medication decisions should always be made with your healthcare provider. They can consider your complete health picture. Is there something specific about medication timing or effects you'd like to understand better?",
    "Medication management is important! General tips: take medications at consistent times, understand how they interact with food, and never adjust doses without consulting your doctor. Your pharmacist is also a great resource for questions.",
  ],
  symptoms: [
    "If you're experiencing symptoms like excessive thirst, frequent urination, blurred vision, or fatigue, please check your blood sugar and contact your healthcare provider. These could indicate high or low blood sugar that needs attention.",
    "Symptoms of blood sugar issues can vary. High blood sugar signs include increased thirst, frequent urination, and fatigue. Low blood sugar symptoms include shakiness, sweating, and confusion. Always keep fast-acting glucose handy for lows.",
  ],
};

function getSmartResponse(query: string): string {
  const q = query.toLowerCase();
  
  let category = "general";
  if (q.includes("eat") || q.includes("food") || q.includes("diet") || q.includes("meal") || q.includes("carb") || q.includes("sugar")) {
    category = "diet";
  } else if (q.includes("exercise") || q.includes("workout") || q.includes("activity") || q.includes("walk") || q.includes("gym")) {
    category = "exercise";
  } else if (q.includes("sleep") || q.includes("rest") || q.includes("night") || q.includes("tired")) {
    category = "sleep";
  } else if (q.includes("stress") || q.includes("anxious") || q.includes("worry") || q.includes("relax")) {
    category = "stress";
  } else if (q.includes("medicine") || q.includes("medication") || q.includes("insulin") || q.includes("pill") || q.includes("drug")) {
    category = "medication";
  } else if (q.includes("symptom") || q.includes("feel") || q.includes("thirst") || q.includes("dizzy") || q.includes("tired")) {
    category = "symptoms";
  }
  
  const responses = RESPONSES[category];
  return responses[Math.floor(Math.random() * responses.length)];
}

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your GlycoCare AI assistant. I can help you with glucose management, diet tips, exercise advice, and answer any health-related questions. You can also use the microphone to speak to me!",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak text
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !voiceEnabled) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Natural"))
    ) || voices.find((v) => v.lang.startsWith("en"));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [voiceEnabled]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSend = useCallback((text?: string) => {
    const q = (text ?? input).trim();
    if (!q || isLoading) return;
    
    setInput("");
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: q,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate thinking delay and respond
    setTimeout(() => {
      const response = getSmartResponse(q);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Speak the response
      speak(response);
    }, 800 + Math.random() * 700);
  }, [input, isLoading, speak]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden border-2"
        style={{
          background: "linear-gradient(135deg, #0F4D92 0%, #1A6BBF 100%)",
          borderColor: "#FFF3A3",
        }}
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <div className="relative">
            <Sparkles size={28} className="text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse border-2 border-white" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl shadow-2xl overflow-hidden flex flex-col border-2"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{
              background: "linear-gradient(135deg, #0F4D92 0%, #1A6BBF 100%)",
              borderColor: "var(--border)",
            }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 bg-white">
              <Image
                src="/images/glycocare-logo.jpeg"
                alt="GlycoCare AI"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  GlycoCare AI
                </span>
                <span className="text-xs font-mono bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  {isSpeaking && <Volume2 size={10} className="animate-pulse" />}
                  {isLoading ? "Thinking..." : "Online"}
                </span>
              </div>
              <p className="text-xs text-white/70">
                Voice-enabled assistant
              </p>
            </div>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors mr-1"
              title={voiceEnabled ? "Mute AI voice" : "Enable AI voice"}
            >
              {voiceEnabled ? (
                <Volume2 size={14} className="text-white" />
              ) : (
                <VolumeX size={14} className="text-white/50" />
              )}
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                setIsOpen(false);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-3 max-h-[300px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] leading-relaxed ${
                    m.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                  }`}
                  style={
                    m.role === "user"
                      ? {
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }
                      : {
                          background: "var(--muted)",
                          color: "var(--foreground)",
                        }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm"
                  style={{
                    background: "var(--muted)",
                    color: "var(--foreground)",
                  }}
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-xs font-mono text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 px-4 pb-4">
            <button
              onClick={toggleListening}
              disabled={isLoading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50 ${
                isListening 
                  ? "bg-destructive animate-pulse" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff size={16} className="text-white" />
              ) : (
                <Mic size={16} style={{ color: "var(--secondary-foreground)" }} />
              )}
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/70 transition-colors"
              disabled={isListening || isLoading}
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: "var(--primary)" }}
            >
              <Send size={15} style={{ color: "var(--primary-foreground)" }} />
            </button>
          </div>

          {/* Voice Status */}
          {isListening && (
            <div className="px-4 pb-3 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs text-muted-foreground">Listening... speak now</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
