'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/student`,
        formData
      )

      // Store token
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))

      toast.success('Registration successful! Redirecting...')
      
      setTimeout(() => {
        window.location.href = '/student'
      }, 1500)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-scholar-50 to-ai-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Join ScholarSync</h2>
        <p className="text-gray-600 mb-8">Create your student account and find scholarships</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scholar-600"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scholar-600"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scholar-600"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password (min 8 chars, with uppercase, lowercase, numbers)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scholar-600"
            required
          />

          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scholar-600"
            required
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scholar-600"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-scholar-600 text-white py-3 rounded-lg font-semibold hover:bg-scholar-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-scholar-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-4">Are you a sponsor?</p>
          <Link 
            href="/auth/sponsor"
            className="w-full block text-center px-4 py-3 border border-scholar-600 text-scholar-600 rounded-lg hover:bg-scholar-50 transition font-semibold"
          >
            Register as Sponsor
          </Link>
        </div>
      </div>
    </div>
  )
}
