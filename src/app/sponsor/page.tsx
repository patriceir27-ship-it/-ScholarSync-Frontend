'use client'

import { useEffect, useState } from 'react'

export default function SponsorDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-6">
        <h1 className="text-2xl font-bold text-ai-600">ScholarSync Sponsor Portal</h1>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8">Sponsor Dashboard</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-ai-600">5</div>
            <p className="text-gray-600 mt-2">Active Scholarships</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-scholar-600">342</div>
            <p className="text-gray-600 mt-2">Total Applications</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-amber-600">28</div>
            <p className="text-gray-600 mt-2">Pending Review</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-green-600">$250K+</div>
            <p className="text-gray-600 mt-2">Total Distributed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
