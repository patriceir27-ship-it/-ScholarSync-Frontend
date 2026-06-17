// src/pages/student/dashboard.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogOut, FileText, BookOpen, Briefcase, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState('application');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-chancen-green text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Student Portal</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-chancen-green-dark px-4 py-2 rounded-lg hover:bg-black transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-chancen-gray">Welcome, {user.first_name}!</h2>
            <p className="text-gray-600">Track your application, academic progress, and ISA repayment</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <TabButton
            label="Application"
            icon={<FileText size={20} />}
            active={activeTab === 'application'}
            onClick={() => setActiveTab('application')}
          />
          <TabButton
            label="Academic Progress"
            icon={<BookOpen size={20} />}
            active={activeTab === 'academic'}
            onClick={() => setActiveTab('academic')}
          />
          <TabButton
            label="Employment"
            icon={<Briefcase size={20} />}
            active={activeTab === 'employment'}
            onClick={() => setActiveTab('employment')}
          />
          <TabButton
            label="ISA Repayment"
            icon={<CreditCard size={20} />}
            active={activeTab === 'repayment'}
            onClick={() => setActiveTab('repayment')}
          />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-8">
          {activeTab === 'application' && <ApplicationTab />}
          {activeTab === 'academic' && <AcademicTab />}
          {activeTab === 'employment' && <EmploymentTab />}
          {activeTab === 'repayment' && <RepaymentTab />}
        </div>
      </main>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 font-semibold transition border-b-2 ${
        active
          ? 'border-chancen-green text-chancen-green'
          : 'border-transparent text-gray-600 hover:text-chancen-green'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ApplicationTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-chancen-gray">Application Status</h3>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <p className="text-blue-900">
          Your application is under review. We'll notify you as soon as a decision is made.
        </p>
        <button className="mt-4 px-6 py-2 bg-chancen-green text-white rounded-lg hover:bg-chancen-green-dark transition">
          View Full Application
        </button>
      </div>
      
      <div className="mt-8">
        <h4 className="font-semibold text-chancen-gray mb-4">Application Timeline</h4>
        <div className="space-y-4">
          <TimelineItem status="completed" title="Application Submitted" date="Jan 15, 2024" />
          <TimelineItem status="completed" title="Initial Screening" date="Jan 20, 2024" />
          <TimelineItem status="active" title="Under Review" date="In Progress" />
          <TimelineItem status="pending" title="Interview" date="Pending" />
          <TimelineItem status="pending" title="Decision" date="Pending" />
        </div>
      </div>
    </div>
  );
}

function AcademicTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-chancen-gray">Academic Progress</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-chancen-green-light bg-opacity-10 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Current GPA</p>
          <p className="text-3xl font-bold text-chancen-green mt-2">3.75</p>
        </div>
        <div className="bg-chancen-gold bg-opacity-10 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Attendance</p>
          <p className="text-3xl font-bold text-chancen-gold mt-2">95%</p>
        </div>
      </div>
      <p className="text-gray-600">Academic progress details and course information coming soon...</p>
    </div>
  );
}

function EmploymentTab() {
  const [employmentStatus, setEmploymentStatus] = useState('unemployed');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Employment information updated');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-chancen-gray">Employment Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-chancen-gray mb-2">Status</label>
          <select
            value={employmentStatus}
            onChange={(e) => setEmploymentStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option>unemployed</option>
            <option>employed</option>
            <option>self_employed</option>
          </select>
        </div>

        {employmentStatus === 'employed' && (
          <>
            <div>
              <label className="block text-sm font-medium text-chancen-gray mb-2">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-chancen-gray mb-2">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-chancen-gray mb-2">Monthly Salary (RWF)</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="px-6 py-2 bg-chancen-green text-white rounded-lg hover:bg-chancen-green-dark transition"
        >
          Update Employment Info
        </button>
      </form>
    </div>
  );
}

function RepaymentTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-chancen-gray">ISA Repayment Status</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">ISA Amount</p>
          <p className="text-3xl font-bold text-green-600 mt-2">5,000,000 RWF</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Remaining Balance</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">3,500,000 RWF</p>
        </div>
      </div>
      <p className="text-gray-600">Income threshold: 80,000 RWF/month | Repayment percentage: 10%</p>
      <p className="text-gray-600">Detailed repayment schedule and payment history coming soon...</p>
    </div>
  );
}

function TimelineItem({ status, title, date }) {
  const statusColor = {
    completed: 'bg-green-100 border-green-300',
    active: 'bg-blue-100 border-blue-300',
    pending: 'bg-gray-100 border-gray-300',
  };

  return (
    <div className={`border-l-4 ${statusColor[status]} p-4 rounded`}>
      <p className="font-semibold text-chancen-gray">{title}</p>
      <p className="text-sm text-gray-600">{date}</p>
    </div>
  );
}

// src/pages/student/application.js
export default function ApplicationForm() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-chancen-green mb-8">Application Form</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Application form interface coming soon...</p>
      </div>
    </div>
  );
}
