/**
 * ============================================================================
 * ADMIN DASHBOARD COMPONENT
 * ============================================================================
 * Main admin interface for managing applications, screening, and decisions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Application, ApplicationStatistics, ScreeningMetrics } from '@/types';
import { adminService } from '@/services/admin.service';
import LoadingSpinner from '@/components/common/Loading';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import ApplicationReviewPanel from '@/components/admin/ApplicationReviewPanel';
import RuleBuilder from '@/components/admin/RuleBuilder';

const CHANCEN_GREEN = '#22C55E';
const CHANCEN_DARK_GREEN = '#16A34A';
const ACCENT_BLUE = '#3B82F6';

interface DashboardMetrics {
  totalApplications: number;
  applicationsSubmitted: number;
  applicationsScreened: number;
  acceptanceRate: number;
  averageScreeningScore: number;
  pendingReview: number;
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'applications' | 'rules' | 'analytics'>('overview');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  // Fetch metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery(
    ['adminMetrics'],
    () => adminService.getDashboardMetrics(),
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  // Fetch pending applications
  const { data: pendingAppsData, isLoading: appsLoading } = useQuery(
    ['pendingApplications'],
    () => adminService.getPendingApplications({ limit: 20 }),
    { refetchInterval: 60000 }
  );

  // Fetch screening metrics
  const { data: screeningMetrics, isLoading: metricsScreeningLoading } = useQuery(
    ['screeningMetrics'],
    () => adminService.getScreeningMetrics(),
    { refetchInterval: 60000 }
  );

  // Fetch historical statistics
  const { data: statisticsData } = useQuery(
    ['applicationStatistics'],
    () => adminService.getApplicationStatistics({ days: 30 }),
    { refetchInterval: 300000 } // Refetch every 5 minutes
  );

  const isLoading = metricsLoading || appsLoading || metricsScreeningLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const metrics: DashboardMetrics = {
    totalApplications: metricsData?.total_applications || 0,
    applicationsSubmitted: metricsData?.submitted_applications || 0,
    applicationsScreened: metricsData?.screened_applications || 0,
    acceptanceRate: metricsData?.acceptance_rate || 0,
    averageScreeningScore: metricsData?.average_screening_score || 0,
    pendingReview: metricsData?.pending_count || 0,
  };

  const applicationStatusData = [
    { name: 'Submitted', value: metricsData?.submitted_applications || 0, fill: CHANCEN_GREEN },
    { name: 'Screening', value: metricsData?.screening_applications || 0, fill: ACCENT_BLUE },
    { name: 'Accepted', value: metricsData?.accepted_applications || 0, fill: '#10B981' },
    { name: 'Rejected', value: metricsData?.rejected_applications || 0, fill: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Chancen International Rwanda - Admissions Management System</p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-lg border-t-4 border-green-500">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalApplications}</p>
            <p className="text-green-600 text-sm mt-2">
              {metrics.applicationsSubmitted} submitted this period
            </p>
          </div>
        </Card>

        <Card className="bg-white shadow-lg border-t-4 border-blue-500">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Pending Review</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.pendingReview}</p>
            <p className="text-blue-600 text-sm mt-2">Action required</p>
          </div>
        </Card>

        <Card className="bg-white shadow-lg border-t-4 border-yellow-500">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Average Score</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.averageScreeningScore.toFixed(1)}</p>
            <p className="text-yellow-600 text-sm mt-2">Screening performance</p>
          </div>
        </Card>

        <Card className="bg-white shadow-lg border-t-4 border-purple-500">
          <div className="p-6">
            <p className="text-gray-600 text-sm font-medium">Acceptance Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{(metrics.acceptanceRate * 100).toFixed(1)}%</p>
            <p className="text-purple-600 text-sm mt-2">Year to date</p>
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        {(['overview', 'applications', 'rules', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              selectedTab === tab
                ? `border-green-500 text-green-600`
                : `border-transparent text-gray-600 hover:text-gray-900`
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* TAB: Overview */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Application Status Chart */}
          <Card className="bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Trend Chart */}
          <Card className="bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Applications Trend (Last 30 Days)</h2>
            {statisticsData && statisticsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statisticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total_applications" stroke={CHANCEN_GREEN} strokeWidth={2} />
                  <Line type="monotone" dataKey="applications_screened" stroke={ACCENT_BLUE} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </Card>
        </div>
      )}

      {/* TAB: Applications */}
      {selectedTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Pending Applications</h2>
            <button
              onClick={() => setShowRuleBuilder(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              + Trigger Screening
            </button>
          </div>

          {pendingAppsData && pendingAppsData.length > 0 ? (
            <div className="space-y-4">
              {pendingAppsData.map(app => (
                <Card
                  key={app.id}
                  className="bg-white shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedApplication(app)}
                >
                  <div className="p-6 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{app.program_name}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Academic Score: {app.academic_score}/100
                      </p>
                      <p className="text-gray-600 text-sm">Submitted: {new Date(app.submitted_at!).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-lg p-8 text-center">
              <p className="text-gray-500">No pending applications</p>
            </Card>
          )}
        </div>
      )}

      {/* TAB: Rules */}
      {selectedTab === 'rules' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Screening Rules Management</h2>
          {showRuleBuilder ? (
            <RuleBuilder onClose={() => setShowRuleBuilder(false)} />
          ) : (
            <Card className="bg-white shadow-lg p-8">
              <p className="text-gray-600 text-center mb-4">Configure automated screening rules</p>
              <button
                onClick={() => setShowRuleBuilder(true)}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Open Rule Builder
              </button>
            </Card>
          )}
        </div>
      )}

      {/* TAB: Analytics */}
      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Screening Analytics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium">Total Screened</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {screeningMetrics?.total_screened || 0}
              </p>
            </Card>

            <Card className="bg-white shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium">Accept Rate</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {screeningMetrics?.accepted && screeningMetrics?.total_screened
                  ? ((screeningMetrics.accepted / screeningMetrics.total_screened) * 100).toFixed(1)
                  : '0'}%
              </p>
            </Card>

            <Card className="bg-white shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium">Avg Confidence</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {screeningMetrics?.confidence_level?.toFixed(1) || '0'}%
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Application Review Modal */}
      {selectedApplication && (
        <Modal onClose={() => setSelectedApplication(null)} title="Review Application">
          <ApplicationReviewPanel
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
          />
        </Modal>
      )}
    </div>
  );
}
