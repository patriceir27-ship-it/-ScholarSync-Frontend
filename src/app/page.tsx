'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-scholar-50 via-white to-ai-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-scholar-600">🎓 ScholarSync</div>
        <div className="flex gap-6">
          <Link href="/auth/login" className="text-gray-700 hover:text-scholar-600">
            Login
          </Link>
          <Link 
            href="/auth/student" 
            className="px-6 py-2 bg-scholar-600 text-white rounded-lg hover:bg-scholar-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-6 text-gray-900">
            Find Your Perfect <span className="text-scholar-600">Scholarship</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            AI-powered matching technology connects you with scholarships that fit your 
            academic profile, goals, and financial needs. Get personalized recommendations 
            in minutes, not hours.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/auth/student"
              className="px-8 py-4 bg-scholar-600 text-white rounded-lg hover:bg-scholar-700 font-semibold text-lg"
            >
              Student Registration
            </Link>
            <Link 
              href="/auth/sponsor"
              className="px-8 py-4 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold text-lg"
            >
              For Sponsors
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-20">
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3">AI Matching</h3>
            <p className="text-gray-600">
              Our intelligent algorithm analyzes your profile and recommends scholarships 
              with the highest match probability.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-600">
              Complete your profile, upload documents, and get matched with opportunities 
              in minutes, not weeks.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your information is encrypted and protected. We never share your data 
              without permission.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 py-20 border-t border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-scholar-600 mb-2">500+</div>
            <p className="text-gray-600">Scholarships</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-scholar-600 mb-2">50K+</div>
            <p className="text-gray-600">Students Matched</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-scholar-600 mb-2">$100M+</div>
            <p className="text-gray-600">Distributed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-scholar-600 mb-2">98%</div>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p>&copy; 2024 ScholarSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
