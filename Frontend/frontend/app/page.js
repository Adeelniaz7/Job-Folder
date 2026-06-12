'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col justify-center min-h-[calc(100vh-4rem)] transition-colors duration-300">
      
      {/* Background Decorative Gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div 
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 lg:px-8 text-center">
        {/* Main Hero Title */}
        <div className="max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-600/10 mb-6 animate-pulse">
            Next-Gen Job Matching Platform
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Find the job that aligns with your{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              passion & skills
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
            StackNova Jobs is a premier recruitment ecosystem connecting leading developer talent with stellar teams globally. Discover your perfect match today.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-14 flex items-center justify-center gap-x-6">
          <Link
            href="/jobs"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all duration-200 hover:-translate-y-0.5"
          >
            Explore Jobs
          </Link>
          <Link
            href="/register"
            className="text-base font-semibold text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
          >
            Join as Employer <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <dl className="mt-28 grid grid-cols-1 gap-8 sm:grid-cols-3 border-t border-slate-200 dark:border-slate-800 pt-20 max-w-4xl mx-auto">
          <div className="flex flex-col gap-y-3">
            <dd className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">12k+</dd>
            <dt className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">Active Listings</dt>
          </div>
          <div className="flex flex-col gap-y-3">
            <dd className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">4.5k+</dd>
            <dt className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">Verified Companies</dt>
          </div>
          <div className="flex flex-col gap-y-3">
            <dd className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">98%</dd>
            <dt className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">Success Match Rate</dt>
          </div>
        </dl>

        {/* Dynamic Dual CTA Card Section */}
        <div className="mt-36 grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-5xl mx-auto">
          {/* Candidate Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-xl shadow-slate-100 dark:shadow-none hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Looking for a Career Shift?</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Browse thousand of curated engineering, product, and design jobs. Setup smart alerts and apply with a single click.
            </p>
            <div className="mt-8">
              <Link href="/jobs" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Browse positions <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Employer Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-xl shadow-slate-100 dark:shadow-none hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Are You Hiring Top Talent?</h3>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Get your open roles in front of thousands of qualified software engineers, designers, and managers. Start posting today.
            </p>
            <div className="mt-8">
              <Link href="/dashboard" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Post a new job <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

