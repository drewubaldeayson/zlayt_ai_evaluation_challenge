"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, KeyRound } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFillCredentials = () => {
    setUsername("admin");
    setPassword("admin123");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await axios.post(`${apiUrl}/api/admin/login`, {
        username,
        password,
      });

      localStorage.setItem("admin_token", response.data.token);
      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-4 text-rose-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Admin Access</h2>
          <p className="text-slate-500 text-sm mt-2">Sign in to view logs and analytics</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition-all"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-300 transition-colors font-medium flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={handleFillCredentials}
            type="button"
            className="w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors font-medium flex items-center justify-center gap-2 text-sm border border-rose-100"
          >
            <KeyRound className="w-4 h-4" />
            Use Test Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
