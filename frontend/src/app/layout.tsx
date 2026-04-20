import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal FAQ Q&A",
  description: "AI-powered legal FAQ assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <nav className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              <Link href="/">Legal AI Assistant</Link>
            </h1>
            <div className="space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Ask
              </Link>
              <Link href="/logs" className="text-gray-600 hover:text-gray-900 font-medium">
                Logs
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
