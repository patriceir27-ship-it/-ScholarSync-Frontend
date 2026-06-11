'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-scholar-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-scholar-600">🎓 ScholarSync</h1>
        <div className="flex gap-4">
          <span className="text-gray-600">Welcome, {user.email}</span>
          <button onClick={() => {
            localStorage.clear()
            window.location.href = '/auth/login'
          }} className="text-red-600 hover:text-red-700">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Student Dashboard</h2>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-scholar-600 mb-2">0</div>
            <p className="text-gray-600">Profile Completion %</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-ai-600 mb-2">0</div>
            <p className="text-gray-600">Recommendations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-green-600 mb-2">0</div>
            <p className="text-gray-600">Active Applications</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-amber-600 mb-2">0</div>
            <p className="text-gray-600">Potential Funding</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Complete Your Profile</h3>
            <p className="text-gray-600 mb-4">Help us match you with better scholarships</p>
            <Link href="/student/profile" className="text-scholar-600 hover:underline font-semibold">
              Go to Profile →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Find Scholarships</h3>
            <p className="text-gray-600 mb-4">Browse and apply for scholarships</p>
            <Link href="/student/discover" className="text-scholar-600 hover:underline font-semibold">
              Browse Scholarships →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Get AI Help</h3>
            <p className="text-gray-600 mb-4">Chat with our AI assistant</p>
            <Link href="/student/ai-assistance" className="text-ai-600 hover:underline font-semibold">
              Open AI Assistant →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
