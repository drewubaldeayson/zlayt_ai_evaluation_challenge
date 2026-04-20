"use client";

import { useState } from "react";
import axios from "axios";
import { Send, Loader2, FileText } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [retrievedFaqs, setRetrievedFaqs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    setRetrievedFaqs([]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await axios.post(`${apiUrl}/api/ask`, {
        question: question.trim(),
      });

      setAnswer(response.data.answer);
      setRetrievedFaqs(response.data.retrieved_faqs);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || "An error occurred while fetching the answer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ask a Legal Question</h2>
        <p className="text-gray-500 mb-6">
          Get answers based on our comprehensive legal FAQ database.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., What is a contract?"
            className="w-full p-4 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none outline-none"
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
            className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            {error}
          </div>
        )}
      </div>

      {answer && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                AI
              </span>
              Answer
            </h3>
            <div className="prose prose-blue max-w-none text-gray-700">
              {answer.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>

          {retrievedFaqs.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Retrieved Context
              </h4>
              <ul className="space-y-2">
                {retrievedFaqs.map((faq, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    {faq}
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
