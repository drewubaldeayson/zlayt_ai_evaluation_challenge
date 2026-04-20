"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface LogEntry {
  id: number;
  user_query: string;
  retrieved_faq_titles: string;
  ai_response: string;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await axios.get(`${apiUrl}/api/logs`);
        setLogs(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load logs.");
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Query Logs</h2>
      <p className="text-gray-500">History of user questions and AI responses.</p>

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
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {format(new Date(log.timestamp + "Z"), "PPpp")}
                  </span>
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
