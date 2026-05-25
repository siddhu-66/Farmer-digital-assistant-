"use client";

import React, { useState, useRef, useEffect } from 'react';

import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext'; type Message = { id: string; role: 'user' | 'assistant'; content: string;
};
export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([ { id: 'welcome', role: 'assistant', content: 'Hello! I am your AI Agriculture Assistant. How can I help you with your farm today?' } ]);
const [inputValue, setInputValue] = useState('');
const [isTyping, setIsTyping] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);
  useLanguage();
const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }; useEffect(() => { scrollToBottom(); }, [messages, isTyping]);
const handleSend = async (e: React.FormEvent) => { e.preventDefault();
if (!inputValue.trim()) return;
const userMessage: Message = { id: Date.now().toString(), role: 'user', content: inputValue }; setMessages(prev => [...prev, userMessage]); setInputValue(''); setIsTyping(true);
// Simulate AI response delay 
setTimeout(() => {
  const responses = [ "Based on the soil moisture trends, you should consider irrigating your wheat crop within the next 48 hours to maximize yield.", "The local Mandi price for Basmati Rice is currently fetching a 5% premium over corporate buyers today. I suggest checking the Market page.", "To manage your Maize stover, consider contacting 'EcoEnergy Bio-Refinery' in Khanna. They are currently paying ₹1500/ton.", "I've analyzed the weather forecast. Expect light showers tomorrow evening, so hold off on applying any foliar fertilizers.", "Your financial escrow balance is healthy. Would you like me to initiate a payout request to your linked bank account?" ];
const aiResponse: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] }; setMessages(prev => [...prev, aiResponse]); setIsTyping(false); }, 1500); };
return ( <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end"> {/* Expanded Chat Window */}
    <div className={`bg-zinc-900 border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col mb-4 overflow-hidden origin-bottom-right transition-all duration-300 ease-out ${ isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none' }`} >
<div className="bg-primary/10 p-4 border-b border-primary/10 flex items-center justify-between shrink-0">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
<Bot className="w-4 h-4 text-primary" />
</div>
<div>
<h3 className="font-bold text-sm text-gray-500">AgriBot Assistant</h3>
<p className="text-[10px] text-primary uppercase font-bold tracking-widest flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Online </p>
</div>
</div>
<button onClick={() => setIsOpen(false)} title="Close Assistant" aria-label="Close Assistant" className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-500 transition-colors" >
<X className="w-4 h-4" />
</button>
</div> {/* Message Area */}
<div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"> {messages.map((msg) => ( <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`} >
<div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${ msg.role === 'user' ? 'bg-gray-50' : 'bg-primary/20' }`}> {msg.role === 'user' ? <User className="w-3 h-3 text-gray-500" /> : <Bot className="w-3 h-3 text-primary" />}
</div>
<div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${ msg.role === 'user' ? 'bg-gray-50 text-gray-500 rounded-tr-sm' : 'bg-primary/10 text-gray-500 rounded-tl-sm border border-primary/10' }`}> {msg.content}
</div>
</div> ))} {isTyping && ( <div className="flex gap-3 max-w-[85%]">
<div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-primary/20">
<Bot className="w-3 h-3 text-primary" />
</div>
<div className="px-4 py-3 bg-primary/10 rounded-2xl rounded-tl-sm border border-primary/10 flex items-center gap-1.5">
<span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
<span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
<span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
</div>
</div> )}
<div ref={messagesEndRef} />
</div> {/* Input Area */}
<form onSubmit={handleSend} className="p-4 bg-black/20 border-t border-gray-200 shrink-0">
<div className="relative flex items-center">
<input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask about crops, prices, weather..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 text-gray-500 placeholder:text-gray-500 transition-colors" />
<button type="submit" disabled={!inputValue.trim() || isTyping} title="Send message" aria-label="Send message" className="absolute right-2 p-2 bg-primary text-black rounded-lg disabled:50 hover:bg-primary-light transition-all" >
<Send className="w-4 h-4" />
</button>
</div>
</form>
</div> {/* Floating Action Button */}
<button onClick={() => setIsOpen(!isOpen)} title={isOpen ? "Close AI Assistant" : "Open AI Assistant"} aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${ isOpen ? 'bg-gray-50 hover:bg-gray-50 text-gray-500 shadow-none rotate-90 scale-90' : 'bg-primary hover:bg-primary-light text-black shadow-primary/30 hover:shadow-primary/50 hover:scale-110' }`} > {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
</button>
</div> );
}
