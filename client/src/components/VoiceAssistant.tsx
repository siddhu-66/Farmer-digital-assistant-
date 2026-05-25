"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Web Speech API for speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError('Speech recognition error. Please try again.');
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    setError(null);
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      setError('Speech recognition not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!synthesisRef.current || isMuted) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await apiClient.post<{ success: boolean; data: { query: string; category: string; response: string } } | { success: false }>(
        '/assistant/query',
        { query: transcript }
      );

      if (res && 'data' in res && res.data) {
        setResponse(res.data.response);
        speakResponse(res.data.response);
      } else {
        setError('Failed to get response from assistant');
      }
    } catch (err) {
      setError('Failed to connect to assistant. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">Voice Assistant</span>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Transcript */}
          {transcript && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-600 mb-1">You said:</p>
              <p className="text-sm font-medium text-gray-800">{transcript}</p>
            </div>
          )}

          {/* Response */}
          {response && (
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <p className="text-sm text-green-600 mb-1">Assistant:</p>
              <p className="text-sm font-medium text-gray-800">{response}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-green-600" />
            </div>
          )}

          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Speaking...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={loading}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:opacity-50`}
              title={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about market prices, selling crops, or weather..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              disabled={loading}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !transcript.trim()}
              className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
              title="Send"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Ask in Hindi or English about market prices, crop selling, order status, weather, or crop diseases
          </p>
        </div>
      </div>
    </div>
  );
}
