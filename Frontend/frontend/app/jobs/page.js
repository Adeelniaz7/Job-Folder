'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Jobs() {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)
  const [applying, setApplying] = useState(false)
  const [appliedJobs, setAppliedJobs] = useState([]) // Track local mock applications

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/job/all', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }
        const data = await res.json()
        setJobs(data.jobs || [])
      } catch (err) {
        console.error('Failed to fetch jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [router])

  const handleApply = (jobId) => {
    setApplying(true)
    setTimeout(() => {
      setApplying(false)
      setAppliedJobs((prev) => [...prev, jobId])
    }, 1200)
  }

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const titleOrCompany = (job.title || '').toLowerCase() + ' ' + (job.company || '').toLowerCase()
    const matchesSearch = titleOrCompany.includes(searchQuery.toLowerCase())
    
    const matchesLocation = !locationQuery || (job.location || '').toLowerCase().includes(locationQuery.toLowerCase())
    
    const jobType = (job.JobType || job.jobType || 'full-time').toLowerCase()
    const matchesTab = activeTab === 'all' || jobType === activeTab

    return matchesSearch && matchesLocation && matchesTab
  })

  // Format currency helper
  const formatSalary = (salary) => {
    if (!salary) return 'Negotiable'
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(salary)
  }

  // Job type badge colors helper
  const getBadgeStyles = (type) => {
    const normalized = (type || 'full-time').toLowerCase()
    switch (normalized) {
      case 'full-time':
        return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-950/30 dark:text-indigo-300'
      case 'part-time':
        return 'bg-amber-50 text-amber-700 ring-amber-700/10 dark:bg-amber-950/30 dark:text-amber-300'
      case 'remote':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-700/10 dark:bg-emerald-950/30 dark:text-emerald-300'
      case 'freelance':
        return 'bg-sky-50 text-sky-700 ring-sky-700/10 dark:bg-sky-950/30 dark:text-sky-300'
      default:
        return 'bg-slate-50 text-slate-700 ring-slate-700/10 dark:bg-slate-900/30 dark:text-slate-300'
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Loading available jobs...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative">
      {/* Action Spinner Overlay */}
      {applying && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center gap-5 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-xl shadow-2xl max-w-xs w-full text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-10 w-10 rounded-full bg-indigo-500/30 blur-md animate-pulse"></div>
              <svg className="animate-spin h-12 w-12 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div className="space-y-1">
              <span className="text-slate-900 dark:text-white text-base font-bold tracking-wide">Submitting</span>
              <p className="text-slate-500 dark:text-slate-400 text-xs animate-pulse">Sending your application...</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-12 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Available Positions
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Find and apply for top tech opportunities in software engineering, management, and design.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-xl shadow-slate-100/50 dark:shadow-none mb-12 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title / Company Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search job title or hiring company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>

            {/* Location Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by location (e.g. Remote, Karachi)..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Job Type Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {['all', 'full-time', 'part-time', 'remote', 'freelance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => {
              const jobType = job.JobType || job.jobType || 'full-time'
              return (
                <div
                  key={job._id}
                  onClick={() => setSelectedJob(job)}
                  className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 shadow-md hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Badge & Info Header */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      {/* Avatar initial */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-slate-800 dark:to-slate-800 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                      
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${getBadgeStyles(jobType)}`}>
                        {jobType}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                      {job.title}
                    </h2>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">
                      {job.company}
                    </p>

                    {/* Metadata list */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatSalary(job.salary)}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold group flex items-center gap-1 mt-auto">
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>

                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-16 text-center shadow-xl shadow-slate-100/50 dark:shadow-none max-w-xl mx-auto mt-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No Jobs Found</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              No matching listings were found. Try resetting your keywords or applying different filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setLocationQuery('')
                setActiveTab('all')
              }}
              className="mt-6 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Job Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 mb-6 pr-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:from-slate-800 dark:to-slate-800 text-indigo-700 dark:text-indigo-300 font-extrabold text-lg flex-shrink-0">
                  {selectedJob.company ? selectedJob.company.charAt(0).toUpperCase() : 'J'}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {selectedJob.title}
                  </h3>
                  <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                    {selectedJob.company}
                  </p>
                </div>
              </div>

              {/* Badges Info */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getBadgeStyles(selectedJob.JobType || selectedJob.jobType)}`}>
                  {selectedJob.JobType || selectedJob.jobType || 'full-time'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                  </svg>
                  {selectedJob.location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/10">
                  <span className="font-semibold">{formatSalary(selectedJob.salary)}</span>
                </span>
              </div>

              {/* Job Description */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Job Description
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-6 whitespace-pre-line">
                  {selectedJob.description || 'No job description provided.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                
                {appliedJobs.includes(selectedJob._id) ? (
                  <button
                    disabled
                    className="rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30 px-6 py-2.5 text-sm font-bold flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Applied Successfully
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(selectedJob._id)}
                    disabled={applying}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:translate-y-0.5 flex items-center gap-2"
                  >
                    {applying ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending application...
                      </>
                    ) : (
                      'Apply for this Job'
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}