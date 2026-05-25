"use client";

import React, { useState, useEffect, useRef } from "react";

import { Bot, X, Send, Mic, MicOff } from "lucide-react";

import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs)); } interface Message { role: "user" | "assistant"; content: string; }
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
const [isListening, setIsListening] = useState(false);
const [input, setInput] = useState("");
const [messages, setMessages] = useState<Message[]>([ { role: "assistant", content: "Namaste! I am your AI Assistant. How can I help you today? You can ask me about market prices, weather, or crop health.", }, ]);
const scrollRef = useRef<HTMLDivElement>(null); useEffect(() => {
  if (scrollRef.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; } }, [messages]);
const handleSend = (text: string) => {
  if (!text.trim()) return;
const newMessages: Message[] = [...messages, { role: "user", content: text }]; setMessages(newMessages); setInput("");
// Simulated AI response logic 
setTimeout(() => {
  let response = "That's an interesting question. Let me look that up for you.";
const lowerText = text.toLowerCase();
if (lowerText.includes("weather")) { response = "The weather in Ludhiana is currently 24°C and sunny. It's a great time for field work!"; } else if (lowerText.includes("price") || lowerText.includes("market") || lowerText.includes("mandi")) { response = "Wheat prices in Ludhiana Mandi are currently ₹2,450 per quintal, up by 5% from last week."; } else if (lowerText.includes("crop") || lowerText.includes("pest")) { response = "To help with crop health, please upload a photo of the affected area in the 'Crops' section or describe the symptoms."; } else if (lowerText.includes("scheme") || lowerText.includes("government")) { response = "You are currently eligible for the PM-Kisan Samman Nidhi scheme. Would you like me to help you check your status?"; } setMessages((prev) => [...prev, { role: "assistant", content: response }]); }, 1000); };
const toggleListening = () => { setIsListening(!isListening);
// In a real app, we would use the Web Speech API here
if (!isListening) { setTimeout(() => { setIsListening(false); handleSend("What is the current market price for wheat?"); }, 3000); } };
return ( <div className="fixed bottom-8 right-8 z-50"> {/* Chat Window */} {isOpen && ( <div className="absolute bottom-20 right-0 w-80 md:w-96 glass-card overflow-hidden flex flex-col shadow-2xl border-primary/20 animate-in fade-in slide-in-from-bottom-5 duration-300"> {/* Header */}
<div className="p-4 bg-primary/20 border-b border-primary/20 flex items-center justify-between">
<div className="flex items-center gap-2">
<Bot className="w-6 h-6 text-primary" />
<h3 className="font-bold text-lg">AI Assistant</h3>
</div>
<button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-50 rounded-full transition-colors" aria-label="Close Assistant" title="Close Assistant" >
<X className="w-5 h-5" />
</button>
</div> {/* Messages */}
<div ref={scrollRef} className="flex-1 p-4 h-96 overflow-y-auto space-y-4" > {messages.map((msg, i) => ( <div key={i} className={cn( "max-w-[80%] p-3 rounded-2xl text-sm", msg.role === "user" ? "ml-auto bg-primary text-gray-500 rounded-tr-none" : "mr-auto bg-gray-50 border border-gray-200 rounded-tl-none" )} > {msg.content}
</div> ))}
</div> {/* Input */}
<div className="p-4 border-t border-gray-200 flex gap-2">
<button onClick={toggleListening} className={cn( "p-2 rounded-xl transition-all", isListening ? "bg-red-500 text-gray-500 animate-pulse" : "bg-gray-50 hover:bg-gray-50 " )} title={isListening ? "Stop listening" : "Start voice command"} > {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
</button>
<input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend(input)} placeholder="Ask me anything..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50 text-sm" />
<button onClick={() => handleSend(input)} className="p-2 bg-primary rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/20" title="Send message" >
<Send className="w-5 h-5" />
</button>
</div>
</div> )} {/* Floating Button */}
<button onClick={() => setIsOpen(!isOpen)} className={cn( "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl", isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-primary hover:bg-primary-light hover:scale-110 shadow-primary/40" )} aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"} title={isOpen ? "Close AI Assistant" : "Open AI Assistant"} > {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-8 h-8" />}
</button>
</div> ); } 