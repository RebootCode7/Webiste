import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: "Hello! I am your Reboot Admissions Assistant. I can help answer questions about our courses, placements, campus location, or scheduling. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionPills = [
    "Available Courses",
    "Where are you located?",
    "Placement Support",
    "How to book a free demo?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, isOpen]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTyping(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (response.ok) {
        const data = await response.json();
        // Add bot response
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: data.response,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error('Chatbot response failed');
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: "I am having trouble reaching our catalog servers right now. Please feel free to click 'Book Free Demo' or call our counselors directly at +91 90595 56216!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white rounded-full shadow-2xl hover:shadow-red-950/30 border-2 border-white flex items-center justify-center cursor-pointer relative"
        title="Open Admissions Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="w-6 h-6 text-white" key="close" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white animate-pulse" key="open" />
              {/* Notification Badge */}
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-full border border-white">
                Live
              </span>
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="mb-4 bg-slate-950 border border-slate-800 rounded-2xl w-[320px] sm:w-[380px] h-[480px] shadow-2xl flex flex-col overflow-hidden"
          >
            
            {/* Header ribbon */}
            <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                  Reboot AI Assistant
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online • Bhimavaram
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Stream Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/80">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
                    
                    {/* Bot avatar symbol */}
                    {isBot && (
                      <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 text-blue-500 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    {/* Chat Bubble text */}
                    <div className={`max-w-[80%] rounded-2xl p-3 text-xs font-medium leading-relaxed ${
                      isBot
                        ? 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none'
                        : 'bg-blue-600 text-white rounded-tr-none shadow'
                    }`}>
                      {msg.text}
                    </div>

                    {/* User avatar symbol */}
                    {!isBot && (
                      <div className="w-7 h-7 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}

                  </div>
                );
              })}

              {/* Bot typing animation */}
              {typing && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 text-blue-500 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800/80 text-slate-400 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Quick Buttons */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-slate-900 bg-slate-950 flex flex-wrap gap-1.5">
                {suggestionPills.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(pill)}
                    className="px-2.5 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-full text-[10px] text-slate-400 font-bold transition-all cursor-pointer"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Text Input Field */}
            <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask our admissions chatbot..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage(inputText);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white disabled:text-slate-600 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
