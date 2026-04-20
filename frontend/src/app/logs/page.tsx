"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Loader2, ThumbsUp, ThumbsDown } from "lucide-react";

interface LogEntry {
  id: number;
  user_query: string;
  retrieved_faq_titles: string;
  ai_response: string;
  feedback: number;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await axios.get(`${apiUrl}/api/logs`);
        setLogs(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load logs. Ensure the backend is running on port 8080.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
        {error}
      </div>
    );
  }

  // Calculate simple stats
  const totalQueries = logs.length;
  const positiveFeedback = logs.filter(l => l.feedback === 1).length;
  const negativeFeedback = logs.filter(l => l.feedback === -1).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analytics & Logs</h2>
          <p className="text-gray-500">History of user questions, AI responses, and feedback.</p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Queries</span>
          <span className="text-3xl font-bold text-gray-900 mt-2">{totalQueries}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><ThumbsUp className="w-4 h-4 text-green-500"/> Positive Feedback</span>
          <span className="text-3xl font-bold text-green-600 mt-2">{positiveFeedback}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><ThumbsDown className="w-4 h-4 text-red-500"/> Negative Feedback</span>
          <span className="text-3xl font-bold text-red-600 mt-2">{negativeFeedback}</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl shadow-sm border border-gray-100 text-gray-500">
          No logs available yet.
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map((log) => {
            let titles = [];
            try {
              titles = JSON.parse(log.retrieved_faq_titles);
            } catch (e) {
              titles = [log.retrieved_faq_titles];
            }

            return (
              <div
                key={log.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase">Question</h4>
                    <p className="text-gray-900 font-medium mt-1">{log.user_query}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(log.timestamp + "Z"), "PPpp")}
                    </span>
                    {log.feedback === 1 && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><ThumbsUp className="w-3 h-3"/> Helpful</span>}
                    {log.feedback === -1 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><ThumbsDown className="w-3 h-3"/> Not Helpful</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase">AI Answer</h4>
                  <p className="text-gray-700 mt-1 line-clamp-3 hover:line-clamp-none">
                    {log.ai_response}
                  </p>
                </div>

                {titles && titles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase">Retrieved Context</h4>
                    <ul className="mt-1 space-y-1">
                      {titles.map((title: string, i: number) => (
                        <li key={i} className="text-sm text-blue-600">
                          • {title}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
