"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Send, Loader2, FileText, ThumbsUp, ThumbsDown, Sparkles, Scale, History, PlusCircle, ChevronDown, ChevronUp, CheckCircle2, Copy, Check } from "lucide-react";

import { format } from "date-fns";

interface FAQSource {
  title: string;
  content: string;
}

interface HistoryItem {
  id: number;
  question: string;
  answer: string;
  retrievedFaqs: FAQSource[];
  feedbackGiven: number | null;
  timestamp: string;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [retrievedFaqs, setRetrievedFaqs] = useState<FAQSource[]>([]);
  const [logId, setLogId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<number | null>(null);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("legal_chat_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    localStorage.setItem("legal_chat_history", JSON.stringify(newHistory));
  };

  const updateHistoryFeedback = (id: number, feedback: number) => {
    const newHistory = history.map(h => h.id === id ? { ...h, feedbackGiven: feedback } : h);
    setHistory(newHistory);
    localStorage.setItem("legal_chat_history", JSON.stringify(newHistory));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setRetrievedFaqs([]);
    setLogId(null);
    setFeedbackGiven(null);

    const currentQuestion = question.trim();

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await axios.post(`${apiUrl}/api/ask`, {
        question: currentQuestion,
      });

      const responseAnswer = response.data.answer;
      const responseFaqs = response.data.retrieved_faqs;
      const responseId = response.data.id;

      setAnswer(responseAnswer);
      setRetrievedFaqs(responseFaqs);
      setLogId(responseId);

      saveToHistory({
        id: responseId,
        question: currentQuestion,
        answer: responseAnswer,
        retrievedFaqs: responseFaqs,
        feedbackGiven: null,
        timestamp: new Date().toISOString()
      });

    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || "An error occurred while connecting to the server. Is it running?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (val: number) => {
    if (!logId || feedbackGiven !== null) return;

    try {
      setFeedbackGiven(val);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      await axios.post(`${apiUrl}/api/logs/${logId}/feedback`, {
        feedback: val
      });
      updateHistoryFeedback(logId, val);
    } catch (err) {
      console.error("Failed to submit feedback", err);
      setFeedbackGiven(null);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setQuestion(item.question);
    setAnswer(item.answer);
    
    // Support backwards compatibility for old string array formats in history
    if (item.retrievedFaqs && typeof item.retrievedFaqs[0] === 'string') {
      setRetrievedFaqs(item.retrievedFaqs.map(f => ({ title: f as any, content: "Content not available in old history log." })));
    } else {
      setRetrievedFaqs(item.retrievedFaqs || []);
    }

    setLogId(item.id);
    setFeedbackGiven(item.feedbackGiven);
    setError(null);
    setExpandedSource(null);
  };

  const startNewChat = () => {
    setQuestion("");
    setAnswer(null);
    setRetrievedFaqs([]);
    setLogId(null);
    setFeedbackGiven(null);
    setError(null);
    setExpandedSource(null);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-700">
      {/* Left Sidebar: History */}
      <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
        <button 
          onClick={startNewChat}
          className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> New Question
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">Your History</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {history.length === 0 ? (
              <div className="text-center p-6 text-slate-400 text-sm">
                No previous questions. Ask something to get started!
              </div>
            ) : (
              history.map(item => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${logId === item.id ? 'bg-indigo-50 border-indigo-100 border' : 'hover:bg-slate-50 border border-transparent'}`}
                >
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.question}</p>
                  <p className="text-xs text-slate-400 mt-1">{format(new Date(item.timestamp), "MMM d, h:mm a")}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Content: Main Chat Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 space-y-8">
        {/* Hero Section (only show if no answer yet to save space) */}
        {!answer && (
          <div className="text-center space-y-4 pt-4 pb-6">
            <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-2 text-indigo-600">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Intelligent Legal Companion
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
              Ask questions based on our curated legal knowledge base and receive instant, context-aware answers.
            </p>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl group-focus-within:bg-indigo-500/10 transition-all duration-500" />
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What legal question can I help you with today? (e.g., 'What is a contract?')"
                className="w-full p-5 pr-20 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 resize-none outline-none text-slate-800 placeholder:text-slate-400 transition-all duration-300"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="absolute bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 translate-x-0.5" />}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {error}
            </div>
          )}
        </div>

        {/* Answer Section */}
        {answer && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-inner">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    AI Response
                  </h3>
                </div>
                
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
                  <button 
                    onClick={() => handleFeedback(1)}
                    disabled={feedbackGiven !== null}
                    className={`p-2 rounded-full transition-all duration-300 ${feedbackGiven === 1 ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm'}`}
                    title="Helpful"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-slate-200" />
                  <button 
                    onClick={() => handleFeedback(-1)}
                    disabled={feedbackGiven !== null}
                    className={`p-2 rounded-full transition-all duration-300 ${feedbackGiven === -1 ? 'bg-rose-100 text-rose-600 shadow-sm' : 'text-slate-400 hover:text-rose-600 hover:bg-white hover:shadow-sm'}`}
                    title="Not Helpful"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed text-lg">
                {answer.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* Context References */}
            {retrievedFaqs && retrievedFaqs.length > 0 && (
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200/60 backdrop-blur-sm">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Sources Consulted
                </h4>
                <ul className="grid gap-3">
                  {retrievedFaqs.map((faq, index) => (
                    <li key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-indigo-200">
                      <div 
                        className="p-4 cursor-pointer flex items-center justify-between"
                        onClick={() => setExpandedSource(expandedSource === index ? null : index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 bg-indigo-50 p-1.5 rounded-lg text-indigo-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-slate-800 leading-snug pr-2">
                              {typeof faq === 'string' ? faq : faq.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Verified Internal Source
                              </span>
                            </div>
                          </div>
                        </div>
                        {typeof faq !== 'string' && (
                          <div className="text-slate-400 p-1">
                            {expandedSource === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        )}
                      </div>
                      
                      {typeof faq !== 'string' && expandedSource === index && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-50 bg-slate-50/30">
                          <p className="text-sm text-slate-600 leading-relaxed mb-3">
                            {faq.content}
                          </p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(`Source: ${faq.title}\nContent: ${faq.content}`, index); }}
                            className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {copiedIndex === index ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedIndex === index ? "Copied!" : "Copy Citation"}
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
