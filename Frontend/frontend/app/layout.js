import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./app/components/Navbar";
import { Suspense } from "react";
import PageTransitionLoader from "./app/components/PageTransitionLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StackNova Jobs | Find Your Dream Career",
  description: "Explore premium job opportunities, post remote and full-time vacancies, and connect with top-tier tech talent on StackNova Jobs.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <Suspense fallback={null}>
          <PageTransitionLoader />
        </Suspense>
        <Navbar />
        <main className="flex-1 flex flex-col mb-16 sm:mb-24">
          {children}
        </main>
        
        {/* Sleek Footer */}
        <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950 transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2 space-y-4">
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                  StackNova<span className="text-indigo-600 dark:text-indigo-400">Jobs</span>
                </span>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Connecting top industry talent with outstanding hiring teams worldwide. Your next career milestone starts here.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">For Candidates</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><a href="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400">Browse Jobs</a></li>
                  <li><a href="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Create Account</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">For Employers</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><a href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">Post a Job</a></li>
                  <li><a href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Employer Portal</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                &copy; {new Date().getFullYear()} StackNova Jobs. All rights reserved.
              </p>
              <div className="flex gap-6 text-xs text-slate-400 dark:text-slate-500">
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

