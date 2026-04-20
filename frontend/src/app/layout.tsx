import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Scale, MessageSquare, ShieldAlert } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal AI Assistant",
  description: "Professional AI-powered legal FAQ assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col text-slate-900`}>
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:bg-indigo-700 transition-colors shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-slate-800 hidden sm:block">
                Legal AI Assistant
              </h1>
            </Link>
            <div className="flex gap-2">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Ask
              </Link>
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-10 w-full flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Legal AI Assistant MVP. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
