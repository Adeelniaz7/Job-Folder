'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Utility to decode JWT without external libraries
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export default function Dashboard() {
  const router = useRouter()
  
  // Form States
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [jobType, setJobType] = useState('full-time')
  
  // Dashboard & Listing States
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [myJobs, setMyJobs] = useState([])
  const [alertInfo, setAlertInfo] = useState({ show: false, text: '', type: '' })

  const fetchMyJobs = async (token, employerId) => {
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
      if (data.jobs) {
        // Filter jobs posted by this employer
        const filtered = data.jobs.filter((j) => j.postedBy === employerId)
        setMyJobs(filtered)
      }
    } catch (err) {
      console.error('Failed to load posted jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    const decoded = decodeToken(token)
    if (decoded) {
      if (decoded.role !== 'employer') {
        // Redirect jobseekers out of employer dashboard
        router.push('/jobs')
        return
      }
      fetchMyJobs(token, decoded.id)
    } else {
      router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !description || !company || !location) {
      setAlertInfo({ show: true, text: 'Please fill in all required fields.', type: 'error' })
      return
    }

    setSubmitting(true)
    setAlertInfo({ show: false, text: '', type: '' })
    const token = localStorage.getItem('token')

    try {
      const res = await fetch('http://localhost:5000/api/job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, company, location, salary: salary ? Number(salary) : undefined, jobType })
      })
      
      const data = await res.json()
      
      if (data.job) {
        setAlertInfo({ show: true, text: 'Job listing published successfully!', type: 'success' })
        // Reset form
        setTitle('')
        setDescription('')
        setCompany('')
        setLocation('')
        setSalary('')
        setJobType('full-time')
        
        // Refresh listings
        const decoded = decodeToken(token)
        if (decoded) fetchMyJobs(token, decoded.id)
      } else {
        setAlertInfo({ show: true, text: data.message || 'Failed to create job', type: 'error' })
      }
    } catch (err) {
      setAlertInfo({ show: true, text: 'Error connecting to backend API.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/api/job/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setAlertInfo({ show: true, text: 'Posting deleted successfully.', type: 'success' })
        setMyJobs((prev) => prev.filter((job) => job._id !== jobId))
      } else {
        const data = await res.json()
        setAlertInfo({ show: true, text: data.message || 'Failed to delete posting', type: 'error' })
      }
    } catch (err) {
      setAlertInfo({ show: true, text: 'Error deleting job.', type: 'error' })
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
          <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Loading employer console...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative">
      {/* Action Spinner Overlay */}
      {submitting && (
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
              <span className="text-slate-900 dark:text-white text-base font-bold tracking-wide">Publishing</span>
              <p className="text-slate-500 dark:text-slate-400 text-xs animate-pulse">Creating job posting...</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        
        {/* Title */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Employer Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Publish new vacancies, view mock hiring stats, and delete existing job postings.
          </p>
        </div>

        {/* Stats Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-md">
            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Listings</h3>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{myJobs.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-md">
            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mock Applicants</h3>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">{myJobs.length * 8}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-md">
            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg. Time to Hire</h3>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">12 Days</p>
          </div>
        </div>

        {/* Custom Alerts */}
        {alertInfo.show && (
          <div className={`p-4 rounded-xl text-sm border flex items-start gap-3 transition-all mb-8 max-w-full ${
            alertInfo.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800/30' 
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-800/30'
          }`}>
            {alertInfo.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span>{alertInfo.text}</span>
          </div>
        )}

        {/* Workspace Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Post Job Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Create New Job Listing</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-xl p-3 text-sm text-slate-900 dark:text-white transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. TechCorp Solutions"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-xl p-3 text-sm text-slate-900 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location *</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-xl p-3 text-sm text-slate-900 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Salary (PKR Monthly)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-xl p-3 text-sm text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-xl p-3 text-sm text-slate-900 dark:text-white transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="full-time" className="dark:bg-slate-900">Full Time</option>
                  <option value="part-time" className="dark:bg-slate-900">Part Time</option>
                  <option value="remote" className="dark:bg-slate-900">Remote</option>
                  <option value="freelance" className="dark:bg-slate-900">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Description *</label>
                <textarea
                  placeholder="Outline responsibilities, tech stack, and qualifications needed..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl p-3 text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing Listing...
                  </>
                ) : (
                  'Publish Job Post'
                )}
              </button>
            </form>
          </div>

          {/* Manage Jobs List Side Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-xl shadow-slate-100 dark:shadow-none flex flex-col max-h-[800px]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Your Posted Jobs</h2>
            
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              {myJobs.length > 0 ? (
                myJobs.map((job) => (
                  <div 
                    key={job._id}
                    className="border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl flex justify-between items-start gap-4 hover:border-slate-200 transition-all duration-200"
                  >
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{job.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.company}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                        </svg>
                        {job.location}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all"
                      title="Delete Posting"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-slate-400 dark:text-slate-500">You haven't posted any job listings yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

