'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        formData
      )

      localStorage.setItem('token', response.data.data.token)
      toast.success('Login successful!')
      setTimeout(() => { window.location.href = '/student' }, 1500)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-scholar-50 to-ai-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          <button type="submit" disabled={loading} className="w-full bg-scholar-600 text-white py-3 rounded-lg font-semibold">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          <Link href="/auth/student" className="text-scholar-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
