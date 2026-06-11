'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function SponsorRegister() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    organizationName: '',
    website: '',
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
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register/sponsor`,
        formData
      )

      localStorage.setItem('token', response.data.data.token)
      toast.success('Registration successful!')
      setTimeout(() => { window.location.href = '/sponsor' }, 1500)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ai-50 to-scholar-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-2">Register Your Organization</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <input type="text" name="organizationName" placeholder="Organization Name" value={formData.organizationName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          <input type="url" name="website" placeholder="Website (optional)" value={formData.website} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-ai-600 text-white py-3 rounded-lg font-semibold">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          <Link href="/auth/student" className="text-scholar-600 hover:underline">Register as Student</Link>
        </p>
      </div>
    </div>
  )
}
