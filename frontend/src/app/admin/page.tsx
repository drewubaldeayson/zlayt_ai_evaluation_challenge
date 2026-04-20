"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Loader2, ThumbsUp, ThumbsDown, MessageSquare, History, Activity, MapPin, MonitorSmartphone, Globe2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogEntry {
  id: number;
  user_query: string;
  retrieved_faq_titles: string;
  ai_response: string;
  feedback: number;
  ip_address: string;
  user_agent: string;
  country: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-rose-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm font-medium animate-pulse">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  const totalQueries = logs.length;
  const positiveFeedback = logs.filter(l => l.feedback === 1).length;
  const negativeFeedback = logs.filter(l => l.feedback === -1).length;
  
  // Quick aggregation for Countries
  const countryCounts = logs.reduce((acc, log) => {
    const c = log.country || "Unknown";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCountry = Object.keys(countryCounts).sort((a,b) => countryCounts[b] - countryCounts[a])[0] || "N/A";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-in-out">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-rose-600" />
            Admin Dashboard
          </h2>
          <p className="text-lg text-slate-500">Comprehensive overview of system usage and detailed logs.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-xl transition-colors self-start md:self-auto border border-slate-200"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Admin KPIs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <span className="relative text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
            <History className="w-4 h-4" /> Total Queries
          </span>
          <span className="relative text-3xl font-black text-slate-800">{totalQueries}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <span className="relative text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
            <ThumbsUp className="w-4 h-4 text-emerald-500" /> Positive
          </span>
          <span className="relative text-3xl font-black text-emerald-600">{positiveFeedback}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <span className="relative text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
            <ThumbsDown className="w-4 h-4 text-rose-500" /> Negative
          </span>
          <span className="relative text-3xl font-black text-rose-600">{negativeFeedback}</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
          <span className="relative text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Globe2 className="w-4 h-4 text-indigo-500" /> Top Location
          </span>
          <span className="relative text-xl font-black text-indigo-600 truncate pt-1">{topCountry}</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-4">
          <MessageSquare className="w-12 h-12 text-slate-300" />
          <p className="text-lg font-medium text-slate-500">No logs available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4">Detailed Audit Logs</h3>
          
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
                className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">User Question</h4>
                    <p className="text-xl font-bold text-slate-800 leading-snug">{log.user_query}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-3 min-w-max">
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      {format(new Date(log.timestamp + "Z"), "MMM d, yyyy • h:mm a")}
                    </span>
                    {log.feedback === 1 && (
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                      </span>
                    )}
                    {log.feedback === -1 && (
                      <span className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-rose-100">
                        <ThumbsDown className="w-3.5 h-3.5" /> Not Helpful
                      </span>
                    )}
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-rose-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Response</h4>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {log.ai_response}
                  </p>
                </div>

                {/* Audit Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">IP / Location</p>
                      <p className="text-sm font-medium text-slate-700">{log.ip_address} <br/> <span className="text-slate-500 font-normal">{log.country}</span></p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MonitorSmartphone className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Browser / User-Agent</p>
                      <p className="text-sm font-medium text-slate-700 truncate max-w-full" title={log.user_agent}>{log.user_agent}</p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
