// src/pages/admin/dashboard.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LogOut, FileText, Users, TrendingUp, Settings } from 'lucide-react';
import { dashboardService } from '../../services/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const metricsRes = await dashboardService.getMetrics();
      const analyticsRes = await dashboardService.getAnalytics();
      setMetrics(metricsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-chancen-green text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Chancen Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-chancen-green-dark px-4 py-2 rounded-lg hover:bg-black transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard
            title="Total Applications"
            value={metrics?.totalApplications}
            icon={<FileText size={32} />}
            color="bg-blue-100"
          />
          <MetricCard
            title="Accepted"
            value={metrics?.acceptedApplications}
            icon={<Users size={32} />}
            color="bg-green-100"
          />
          <MetricCard
            title="Enrolled Students"
            value={metrics?.enrolledStudents}
            icon={<TrendingUp size={32} />}
            color="bg-purple-100"
          />
          <MetricCard
            title="Employment Rate"
            value={metrics?.employmentRate}
            icon={<TrendingUp size={32} />}
            color="bg-yellow-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ActionCard
            title="Review Applications"
            description="Screen and evaluate pending applications"
            link="/admin/screening"
          />
          <ActionCard
            title="Eligibility Rules"
            description="Define and manage screening rules"
            link="/admin/rules"
          />
          <ActionCard
            title="Student Monitoring"
            description="Track student lifecycle and progress"
            link="/admin/students"
          />
        </div>

        {/* Charts */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-chancen-gray mb-4">Applications Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.applicationsTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#2D7D4A" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-chancen-gray mb-4">Employment Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.employmentByStatus || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2D7D4A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold text-chancen-gray mt-2">{value}</p>
        </div>
        <div className="text-chancen-green opacity-30">{icon}</div>
      </div>
    </div>
  );
}

function ActionCard({ title, description, link }) {
  return (
    <Link href={link}>
      <a className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-chancen-green">
        <h3 className="text-lg font-semibold text-chancen-gray mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-4 text-chancen-green font-semibold">→ Go</div>
      </a>
    </Link>
  );
}

// src/pages/admin/screening.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ScreeningDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading applications...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-chancen-green mb-8">Candidate Screening</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-chancen-green text-white">
            <tr>
              <th className="px-6 py-3 text-left">Student Name</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Score</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{app.student_id?.full_name || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">{app.screening_id?.ai_score || '-'}</td>
                <td className="px-6 py-4">
                  <button className="text-chancen-green hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// src/pages/admin/rules.js
export default function RuleBuilder() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-chancen-green mb-8">Eligibility Rule Builder</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Rule builder interface coming soon...</p>
      </div>
    </div>
  );
}

// src/pages/admin/students.js
export default function StudentMonitoring() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-chancen-green mb-8">Student Monitoring</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Student lifecycle monitoring dashboard coming soon...</p>
      </div>
    </div>
  );
}
