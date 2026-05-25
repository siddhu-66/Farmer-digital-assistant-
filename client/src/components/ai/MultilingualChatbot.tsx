"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, Send, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getPublicApiBase } from '@/lib/getPublicApiBase';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  language: string;
};

export const MultilingualChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! You can speak to me in your language.', sender: 'ai', language: 'en' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    // Add User Message
    const newMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', language };
    setMessages(prev => [...prev, newMsg]);
    const messageToSend = input;
    setInput('');
    setIsTyping(true);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const res = await fetch(`${getPublicApiBase()}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageToSend,
          language: language
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.reply,
          sender: 'ai',
          language: language
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'I apologize, but I encountered an error processing your request.',
          sender: 'ai',
          language: 'en'
        }]);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      
      // Log error only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Chat API Error:', err);
      }
      
      // Show user-friendly error message
      let errorMessage = 'I apologize, but I\'m having trouble connecting right now. Please try again later.';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the service. Please check your connection and try again.';
        }
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: errorMessage,
        sender: 'ai',
        language: 'en'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    // In a real implementation: Trigger Web Speech API recognition here 
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setInput(language === 'te' ? 'నా పంటకు ఏ ఎరువు వేయాలి?' : language === 'hi' ? 'मुझे अपनी फसल के लिए कौन सा उर्वरक उपयोग करना चाहिए?' : 'Which fertilizer should I use for my crop?');
    }, 2000); // Dummy simulation of Speech-to-Text
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-2xl hover:scale-105 transition-transform z-50 flex items-center justify-center"
        title="Open multilingual Ai helper"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 font-inter overflow-hidden">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Agri AI Assistant</h3>
              <p className="text-xs opacity-80">Multilingual Support Active</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg" title="close chatbot">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 h-96 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-gray-100 shadow-sm rounded-bl-sm text-gray-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-4 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" /> Translating & Analyzing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100 focus-within:border-primary/30 transition-colors">
              <button 
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`}
                title="Speak to Assistant"
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask in any language..."
                className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-gray-700"
                title="multilingual text input field"
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:hover:scale-100 hover:scale-105 transition-all"
                title="send query"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
