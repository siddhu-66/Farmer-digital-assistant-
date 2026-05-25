"use client";

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { ArrowLeft, Send, User, Search, Loader2 } from 'lucide-react';

import { businessService, ChatListEntry, ChatHistoryItem } from '@/services/businessService';
export default function Messages() {
  const [activeChat, setActiveChat] = useState(0);
const [chats, setChats] = useState<ChatListEntry[]>([]);
const [history, setHistory] = useState<ChatHistoryItem[]>([]);
const [loading, setLoading] = useState(true);
const [loadingChat, setLoadingChat] = useState(false); useEffect(() => {
  const fetchChats = async () => { setLoading(true); try {
  const data = await businessService.getChatList(); setChats(data); } catch (error) { console.error('Failed to fetch chats:', error); } finally { setLoading(false); } }; fetchChats(); }, []); useEffect(() => {
  const fetchHistory = async () => {
  if (chats.length === 0) return; setLoadingChat(true); try {
  const data = await businessService.getChatHistory(chats[activeChat].id); setHistory(data); } catch (error) { console.error('Failed to fetch history:', error); } finally { setLoadingChat(false); } }; fetchHistory(); }, [activeChat, chats]);
return ( <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col h-[calc(100vh-100px)]">
<Link href="/business" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-500 transition-colors mb-8 shrink-0">
<ArrowLeft className="w-4 h-4" /> Back to Salesman Dashboard </Link>
<div className="flex-1 glass-card border-gray-200 flex overflow-hidden"> {/* Chat List */}
<div className="w-80 border-r border-gray-200 flex flex-col">
<div className="p-4 border-b border-gray-200">
<div className="relative group">
<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
<input type="text" placeholder="Search chats..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all" />
</div>
</div>
<div className="flex-1 overflow-y-auto"> {loading ? ( <div className="flex py-12 justify-center">
<Loader2 className="w-6 h-6 animate-spin text-gray-500" />
</div> ) : chats.map((chat, i) => ( <button key={i} onClick={() => setActiveChat(i)} className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all text-left border-b border-gray-200 ${activeChat === i ? 'bg-blue-500/10' : ''}`} >
<div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200">
<User className="w-6 h-6 text-gray-500" />
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-start mb-1">
<h4 className="font-bold truncate group-hover:text-blue-400 transition-colors">{chat.name}
</h4>
<span className="text-[10px] text-gray-500 whitespace-nowrap">{chat.time}
</span>
</div>
<p className="text-xs text-gray-500 truncate italic">{chat.lastMsg}
</p>
</div> {chat.unread && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
</div>}
</button> ))}
</div>
</div> {/* Chat window */}
<div className="flex-1 flex flex-col bg-white/[0.02]"> {chats.length > 0 && ( <>
<div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20"> {chats[activeChat].name.charAt(0)}
</div>
<div>
<h3 className="font-bold">{chats[activeChat].name}
</h3>
<p className="text-[10px] text-green-400 flex items-center gap-1">
<div className="w-1 h-1 rounded-full bg-green-400 animate-pulse">
</div> Online</p>
</div>
</div>
<div className="flex-1 p-6 space-y-4 overflow-y-auto min-h-0"> {loadingChat ? ( <div className="flex h-full items-center justify-center">
<Loader2 className="w-8 h-8 animate-spin text-blue-500/30" />
</div> ) : ( history.map((msg, i) => ( <div key={i} className={`max-w-[70%] p-4 rounded-2xl text-sm animate-slide-in ${ msg.sender === 'me' ? 'bg-blue-500 ml-auto rounded-tr-none text-gray-500 font-medium shadow-lg shadow-blue-500/20' : 'bg-gray-50 rounded-tl-none border border-gray-200 text-gray-500' }`} > {msg.text}
<div className={`text-[9px] mt-1 50 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}> {msg.time}
</div>
</div> )) )}
</div>
<div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2 shrink-0">
<input type="text" placeholder="Type a message..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm" />
<button title="Send Message" className="p-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
<Send className="w-5 h-5 text-gray-500" />
</button>
</div>
</> )}
</div>
</div>
</div> ); } 