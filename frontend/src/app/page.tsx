"use client";

import { useState } from "react";
import axios from "axios";
import { Send, Loader2, FileText, ThumbsUp, ThumbsDown, Sparkles, Scale } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [retrievedFaqs, setRetrievedFaqs] = useState<string[]>([]);
  const [logId, setLogId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setRetrievedFaqs([]);
    setLogId(null);
    setFeedbackGiven(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await axios.post(`${apiUrl}/api/ask`, {
        question: question.trim(),
      });

      setAnswer(response.data.answer);
      setRetrievedFaqs(response.data.retrieved_faqs);
      setLogId(response.data.id);
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
    } catch (err) {
      console.error("Failed to submit feedback", err);
      setFeedbackGiven(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
      {/* Hero Section */}
      <div className="text-center space-y-4 pt-4 pb-6">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-2 text-indigo-600">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Your Intelligent Legal Companion
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          Ask questions based on our curated legal knowledge base and receive instant, context-aware answers powered by AI.
        </p>
      </div>

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
          {retrievedFaqs.length > 0 && (
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Sources Consulted
              </h4>
              <ul className="grid gap-3">
                {retrievedFaqs.map((faq, index) => (
                  <li key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="mt-0.5 bg-indigo-100 p-1 rounded-md text-indigo-600">
                      <FileText className="w-3 h-3" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 leading-snug">
                      {faq}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
