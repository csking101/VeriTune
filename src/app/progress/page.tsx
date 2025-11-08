'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  Share,
  RefreshCw,
  ChevronRight,
  Play,
  Pause,
  Square,
  MoreVertical,
  Zap,
  Database,
  Settings,
  BarChart3,
  Shield,
  FileText,
  ExternalLink
} from 'lucide-react'
import { formatCurrency, formatDuration } from '@/lib/utils'

// Mock training jobs data
const trainingJobs = [
  {
    id: 1,
    name: 'Customer Support GPT-4',
    status: 'completed',
    progress: 100,
    startTime: '2024-01-15T10:30:00Z',
    endTime: '2024-01-15T14:45:00Z',
    duration: 15300, // 4h 15m in seconds
    cost: 234.50,
    dataset: 'Customer Support Conversations v2.1',
    model: 'GPT-4',
    compute: 'NVIDIA T4',
    accuracy: 92.4,
    loss: 0.23,
    steps: [
      { id: 1, name: 'Dataset Loading', status: 'completed', progress: 100, duration: 180 },
      { id: 2, name: 'Preprocessing', status: 'completed', progress: 100, duration: 600 },
      { id: 3, name: 'Model Training', status: 'completed', progress: 100, duration: 12600 },
      { id: 4, name: 'Evaluation', status: 'completed', progress: 100, duration: 900 },
      { id: 5, name: 'Verification', status: 'completed', progress: 100, duration: 720 },
      { id: 6, name: 'Deployment', status: 'completed', progress: 100, duration: 300 },
    ],
    logs: [
      { timestamp: '2024-01-15T10:30:00Z', level: 'info', message: 'Starting training job...' },
      { timestamp: '2024-01-15T10:33:00Z', level: 'info', message: 'Dataset loaded successfully (50,000 samples)' },
      { timestamp: '2024-01-15T10:43:00Z', level: 'info', message: 'Preprocessing completed' },
      { timestamp: '2024-01-15T14:30:00Z', level: 'info', message: 'Training completed with accuracy: 92.4%' },
      { timestamp: '2024-01-15T14:45:00Z', level: 'success', message: 'Model deployed successfully' },
    ],
    metrics: {
      accuracy: [0.45, 0.67, 0.78, 0.85, 0.89, 0.92],
      loss: [2.1, 1.4, 0.8, 0.5, 0.3, 0.23],
      epochs: 6,
    }
  },
  {
    id: 2,
    name: 'Code Review Assistant',
    status: 'training',
    progress: 67,
    startTime: '2024-01-16T08:15:00Z',
    endTime: null,
    duration: 19800, // 5h 30m in seconds (ongoing)
    cost: 145.20,
    dataset: 'GitHub Code Reviews Dataset',
    model: 'GPT-3.5 Turbo',
    compute: 'NVIDIA T4',
    accuracy: null,
    loss: 0.45,
    steps: [
      { id: 1, name: 'Dataset Loading', status: 'completed', progress: 100, duration: 240 },
      { id: 2, name: 'Preprocessing', status: 'completed', progress: 100, duration: 900 },
      { id: 3, name: 'Model Training', status: 'running', progress: 67, duration: null },
      { id: 4, name: 'Evaluation', status: 'pending', progress: 0, duration: null },
      { id: 5, name: 'Verification', status: 'pending', progress: 0, duration: null },
      { id: 6, name: 'Deployment', status: 'pending', progress: 0, duration: null },
    ],
    logs: [
      { timestamp: '2024-01-16T08:15:00Z', level: 'info', message: 'Starting training job...' },
      { timestamp: '2024-01-16T08:19:00Z', level: 'info', message: 'Dataset loaded successfully (75,000 samples)' },
      { timestamp: '2024-01-16T08:34:00Z', level: 'info', message: 'Preprocessing completed' },
      { timestamp: '2024-01-16T13:45:00Z', level: 'info', message: 'Epoch 4/6 completed, current loss: 0.45' },
    ],
    metrics: {
      accuracy: [0.32, 0.58, 0.71, 0.79],
      loss: [2.3, 1.2, 0.7, 0.45],
      epochs: 4,
    }
  },
  {
    id: 3,
    name: 'Medical Diagnosis Helper',
    status: 'failed',
    progress: 23,
    startTime: '2024-01-16T12:00:00Z',
    endTime: '2024-01-16T14:30:00Z',
    duration: 9000, // 2h 30m in seconds
    cost: 89.30,
    dataset: 'Medical Cases Database v1.3',
    model: 'BERT Base',
    compute: 'NVIDIA T4',
    accuracy: null,
    loss: null,
    steps: [
      { id: 1, name: 'Dataset Loading', status: 'completed', progress: 100, duration: 120 },
      { id: 2, name: 'Preprocessing', status: 'completed', progress: 100, duration: 480 },
      { id: 3, name: 'Model Training', status: 'failed', progress: 23, duration: 8400 },
      { id: 4, name: 'Evaluation', status: 'pending', progress: 0, duration: null },
      { id: 5, name: 'Verification', status: 'pending', progress: 0, duration: null },
      { id: 6, name: 'Deployment', status: 'pending', progress: 0, duration: null },
    ],
    logs: [
      { timestamp: '2024-01-16T12:00:00Z', level: 'info', message: 'Starting training job...' },
      { timestamp: '2024-01-16T12:02:00Z', level: 'info', message: 'Dataset loaded successfully (15,000 samples)' },
      { timestamp: '2024-01-16T12:10:00Z', level: 'info', message: 'Preprocessing completed' },
      { timestamp: '2024-01-16T14:20:00Z', level: 'error', message: 'Training failed: GPU memory exceeded' },
      { timestamp: '2024-01-16T14:30:00Z', level: 'error', message: 'Job terminated due to resource constraints' },
    ],
    metrics: {
      accuracy: [0.25, 0.41],
      loss: [2.8, 1.9],
      epochs: 2,
    }
  },
  {
    id: 4,
    name: 'Financial Analysis Model',
    status: 'queued',
    progress: 0,
    startTime: null,
    endTime: null,
    duration: 0,
    cost: 0,
    dataset: 'Stock Market Data 2020-2024',
    model: 'Llama 2 7B',
    compute: 'NVIDIA A100',
    accuracy: null,
    loss: null,
    steps: [
      { id: 1, name: 'Dataset Loading', status: 'pending', progress: 0, duration: null },
      { id: 2, name: 'Preprocessing', status: 'pending', progress: 0, duration: null },
      { id: 3, name: 'Model Training', status: 'pending', progress: 0, duration: null },
      { id: 4, name: 'Evaluation', status: 'pending', progress: 0, duration: null },
      { id: 5, name: 'Verification', status: 'pending', progress: 0, duration: null },
      { id: 6, name: 'Deployment', status: 'pending', progress: 0, duration: null },
    ],
    logs: [
      { timestamp: '2024-01-16T15:00:00Z', level: 'info', message: 'Job queued, waiting for available compute resources' },
    ],
    metrics: {
      accuracy: [],
      loss: [],
      epochs: 0,
    }
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'training':
    case 'running':
      return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'queued':
    case 'pending':
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
    case 'running':
      return `${baseClasses} bg-blue-100 text-blue-800`
    case 'failed':
      return `${baseClasses} bg-red-100 text-red-800`
    case 'queued':
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

export default function ProgressTracker() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const selectedJobData = selectedJob ? trainingJobs.find(job => job.id === selectedJob) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Progress Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor your training jobs and view detailed progress
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Training Jobs</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {trainingJobs.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedJob === job.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedJob(job.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getStatusIcon(job.status)}
                      <h3 className="ml-2 text-sm font-medium text-gray-900 truncate">
                        {job.name}
                      </h3>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 min-w-[3rem]">{job.progress}%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className={getStatusBadge(job.status)}>
                      {job.status}
                    </span>
                    <span>{formatCurrency(job.cost)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="lg:col-span-2">
          {selectedJobData ? (
            <div className="space-y-6">
              {/* Job Overview */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(selectedJobData.status)}
                      <div className="ml-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedJobData.name}
                        </h2>
                        <p className="text-sm text-gray-500">{selectedJobData.dataset}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Share className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="mt-1">
                        <span className={getStatusBadge(selectedJobData.status)}>
                          {selectedJobData.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">
                        {selectedJobData.progress}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">
                        {selectedJobData.duration > 0 ? formatDuration(selectedJobData.duration) : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Cost</div>
                      <div className="mt-1 text-lg font-semibold text-gray-900">
                        {formatCurrency(selectedJobData.cost)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Overall Progress</span>
                      <span>{selectedJobData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedJobData.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Metrics */}
                  {selectedJobData.accuracy && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Accuracy</div>
                        <div className="mt-1 text-2xl font-bold text-green-600">
                          {selectedJobData.accuracy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Final Loss</div>
                        <div className="mt-1 text-2xl font-bold text-orange-600">
                          {selectedJobData.loss || '-'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pipeline Steps */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Pipeline Steps</h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {selectedJobData.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedStep === step.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                      >
                        <div className="flex-shrink-0 mr-4">
                          {getStatusIcon(step.status)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                            <span className="text-xs text-gray-500">
                              {step.duration ? formatDuration(step.duration) : '-'}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${step.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 min-w-[3rem]">
                              {step.progress}%
                            </span>
                          </div>
                        </div>

                        <ChevronRight className={`h-4 w-4 text-gray-400 ml-2 transition-transform ${
                          selectedStep === step.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step Details Blade */}
              {selectedStep && (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Step Details: {selectedJobData.steps.find(s => s.id === selectedStep)?.name}
                      </h3>
                      <button
                        onClick={() => setSelectedStep(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="mt-1">
                          <span className={getStatusBadge(selectedJobData.steps.find(s => s.id === selectedStep)?.status || '')}>
                            {selectedJobData.steps.find(s => s.id === selectedStep)?.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="mt-1 text-lg font-semibold text-gray-900">
                          {selectedJobData.steps.find(s => s.id === selectedStep)?.duration 
                            ? formatDuration(selectedJobData.steps.find(s => s.id === selectedStep)!.duration!)
                            : 'In progress...'}
                        </div>
                      </div>
                    </div>

                    {/* Logs for this step */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Logs</h4>
                      <div className="bg-gray-50 rounded-md p-4 max-h-40 overflow-y-auto">
                        <div className="space-y-2 font-mono text-xs">
                          {selectedJobData.logs.slice(-3).map((log, index) => (
                            <div key={index} className="flex">
                              <span className="text-gray-500 mr-2">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className={`mr-2 font-medium ${
                                log.level === 'error' ? 'text-red-600' :
                                log.level === 'success' ? 'text-green-600' :
                                'text-blue-600'
                              }`}>
                                [{log.level.toUpperCase()}]
                              </span>
                              <span className="text-gray-700">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Training Logs */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Training Logs</h3>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                      <FileText className="h-4 w-4 mr-1" />
                      Download Full Logs
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2 font-mono text-xs">
                      {selectedJobData.logs.map((log, index) => (
                        <div key={index} className="flex">
                          <span className="text-gray-500 mr-2">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={`mr-2 font-medium ${
                            log.level === 'error' ? 'text-red-600' :
                            log.level === 'success' ? 'text-green-600' :
                            'text-blue-600'
                          }`}>
                            [{log.level.toUpperCase()}]
                          </span>
                          <span className="text-gray-700">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
              <div className="text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Select a training job</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a job from the list to view detailed progress and logs
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
