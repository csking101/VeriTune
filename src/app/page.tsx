'use client'

import { useState } from 'react'
import { 
  Activity, 
  Database, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus,
  TrendingUp,
  Users,
  Server,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

// Mock data for dashboard
const stats = [
  {
    name: 'Active Models',
    value: '12',
    change: '+4.75%',
    changeType: 'positive' as const,
    icon: Database,
  },
  {
    name: 'Training Jobs',
    value: '8',
    change: '+54.02%',
    changeType: 'positive' as const,
    icon: Activity,
  },
  {
    name: 'Total Spend',
    value: '$2,847',
    change: '-1.39%',
    changeType: 'negative' as const,
    icon: DollarSign,
  },
  {
    name: 'Success Rate',
    value: '94.2%',
    change: '+2.1%',
    changeType: 'positive' as const,
    icon: TrendingUp,
  },
]

const recentModels = [
  {
    id: 1,
    name: 'Customer Support GPT-4',
    status: 'completed',
    progress: 100,
    cost: 234.50,
    startTime: '2024-01-15T10:30:00Z',
    endTime: '2024-01-15T14:45:00Z',
    dataset: 'Customer Support Conversations v2.1',
    accuracy: 92.4,
  },
  {
    id: 2,
    name: 'Code Review Assistant',
    status: 'training',
    progress: 67,
    cost: 145.20,
    startTime: '2024-01-16T08:15:00Z',
    dataset: 'GitHub Code Reviews Dataset',
    accuracy: null,
  },
  {
    id: 3,
    name: 'Medical Diagnosis Helper',
    status: 'failed',
    progress: 23,
    cost: 89.30,
    startTime: '2024-01-16T12:00:00Z',
    dataset: 'Medical Cases Database v1.3',
    accuracy: null,
  },
  {
    id: 4,
    name: 'Financial Analysis Model',
    status: 'queued',
    progress: 0,
    cost: 0,
    startTime: null,
    dataset: 'Stock Market Data 2020-2024',
    accuracy: null,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'training':
      return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'queued':
      return <Clock className="h-5 w-5 text-yellow-500" />
    default:
      return <Clock className="h-5 w-5 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  
  switch (status) {
    case 'completed':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'training':
      return `${baseClasses} bg-blue-100 text-blue-800`
    case 'failed':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'queued':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your verifiable model fine-tuning pipelines
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {item.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.change}
                </span>
                <span className="text-gray-500"> from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Models */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Training Jobs
            </h3>
            <Link
              href="/marketplace"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Training Job
            </Link>
          </div>
          
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentModels.map((model) => (
                  <tr key={model.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(model.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {model.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {model.dataset}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(model.status)}>
                        {model.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${model.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{model.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(model.cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {model.accuracy ? `${model.accuracy}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/progress?id=${model.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Link
          href="/marketplace"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
              <Database className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              Browse Datasets
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Explore verified datasets from the Walrus marketplace
            </p>
          </div>
        </Link>

        <Link
          href="/pipeline"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
              <Server className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              Build Pipeline
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Create custom training pipelines with visual builder
            </p>
          </div>
        </Link>

        <Link
          href="/progress"
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div>
            <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
              <Activity className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              Track Progress
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Monitor all your training jobs and deployments
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
