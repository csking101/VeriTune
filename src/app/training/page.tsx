'use client'

import { useState } from 'react'
import { 
  Server, 
  Cpu, 
  Zap, 
  Clock, 
  DollarSign, 
  Database, 
  HardDrive,
  Gauge,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react'
import { formatCurrency, formatDuration } from '@/lib/utils'

// Mock compute options
const computeOptions = [
  {
    id: 'cpu-basic',
    name: 'Basic CPU',
    type: 'CPU',
    specs: {
      cores: 4,
      memory: 16,
      storage: 100,
    },
    pricing: {
      hourly: 0.12,
      setup: 0,
    },
    availability: 'high',
    queueTime: 0,
    region: 'us-west-2',
    provider: 'AWS',
    icon: Cpu,
    color: 'blue',
    recommended: false,
  },
  {
    id: 'cpu-premium',
    name: 'Premium CPU',
    type: 'CPU',
    specs: {
      cores: 8,
      memory: 32,
      storage: 200,
    },
    pricing: {
      hourly: 0.24,
      setup: 0,
    },
    availability: 'high',
    queueTime: 0,
    region: 'us-west-2',
    provider: 'AWS',
    icon: Cpu,
    color: 'green',
    recommended: false,
  },
  {
    id: 'gpu-t4',
    name: 'NVIDIA T4',
    type: 'GPU',
    specs: {
      cores: 4,
      memory: 16,
      storage: 100,
      gpu: 'T4 16GB',
      vram: 16,
    },
    pricing: {
      hourly: 0.85,
      setup: 5,
    },
    availability: 'medium',
    queueTime: 300, // 5 minutes
    region: 'us-west-2',
    provider: 'AWS',
    icon: Zap,
    color: 'orange',
    recommended: true,
  },
  {
    id: 'gpu-a100',
    name: 'NVIDIA A100',
    type: 'GPU',
    specs: {
      cores: 8,
      memory: 64,
      storage: 500,
      gpu: 'A100 40GB',
      vram: 40,
    },
    pricing: {
      hourly: 2.95,
      setup: 10,
    },
    availability: 'low',
    queueTime: 1800, // 30 minutes
    region: 'us-east-1',
    provider: 'GCP',
    icon: Zap,
    color: 'purple',
    recommended: false,
  },
  {
    id: 'gpu-h100',
    name: 'NVIDIA H100',
    type: 'GPU',
    specs: {
      cores: 16,
      memory: 128,
      storage: 1000,
      gpu: 'H100 80GB',
      vram: 80,
    },
    pricing: {
      hourly: 4.50,
      setup: 25,
    },
    availability: 'very-low',
    queueTime: 3600, // 1 hour
    region: 'us-east-1',
    provider: 'Azure',
    icon: Zap,
    color: 'red',
    recommended: false,
  },
]

const trainingEstimates = {
  small: { hours: 2, description: 'Small model (< 1B params)' },
  medium: { hours: 8, description: 'Medium model (1-7B params)' },
  large: { hours: 24, description: 'Large model (7-30B params)' },
  xlarge: { hours: 72, description: 'XL model (30B+ params)' },
}

export default function TrainingPortal() {
  const [selectedCompute, setSelectedCompute] = useState<string>('')
  const [modelSize, setModelSize] = useState<keyof typeof trainingEstimates>('medium')
  const [priority, setPriority] = useState<'standard' | 'high' | 'urgent'>('standard')
  const [autoShutdown, setAutoShutdown] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const selectedOption = computeOptions.find(opt => opt.id === selectedCompute)
  const estimate = trainingEstimates[modelSize]
  
  const calculateCost = () => {
    if (!selectedOption || !estimate) return 0
    
    const baseCost = selectedOption.pricing.hourly * estimate.hours
    const setupCost = selectedOption.pricing.setup
    const priorityMultiplier = priority === 'urgent' ? 2 : priority === 'high' ? 1.5 : 1
    
    return (baseCost + setupCost) * priorityMultiplier
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-orange-600'
      case 'very-low': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'high': return <CheckCircle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'low': return <Clock className="h-4 w-4" />
      case 'very-low': return <Clock className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Training Portal</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure compute resources and launch your training job
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compute Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Select Compute Resources</h2>
              <p className="text-sm text-gray-500 mt-1">Choose the best compute option for your training job</p>
            </div>

            <div className="p-6 space-y-4">
              {computeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                    selectedCompute === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${option.recommended ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
                  onClick={() => setSelectedCompute(option.id)}
                >
                  {option.recommended && (
                    <div className="absolute -top-2 left-4">
                      <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-2 rounded-lg bg-${option.color}-100`}>
                        <option.icon className={`h-6 w-6 text-${option.color}-600`} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{option.name}</h3>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Cpu className="h-4 w-4 mr-1" />
                            {option.specs.cores} cores
                          </span>
                          <span className="flex items-center">
                            <Database className="h-4 w-4 mr-1" />
                            {option.specs.memory}GB RAM
                          </span>
                          <span className="flex items-center">
                            <HardDrive className="h-4 w-4 mr-1" />
                            {option.specs.storage}GB
                          </span>
                          {option.specs.gpu && (
                            <span className="flex items-center">
                              <Zap className="h-4 w-4 mr-1" />
                              {option.specs.gpu}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {option.region} ({option.provider})
                          </span>
                          <span className={`flex items-center ${getAvailabilityColor(option.availability)}`}>
                            {getAvailabilityIcon(option.availability)}
                            <span className="ml-1 capitalize">{option.availability} availability</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(option.pricing.hourly)}/hr
                      </div>
                      {option.pricing.setup > 0 && (
                        <div className="text-sm text-gray-500">
                          +{formatCurrency(option.pricing.setup)} setup
                        </div>
                      )}
                      {option.queueTime > 0 && (
                        <div className="text-sm text-orange-600 mt-1">
                          ~{formatDuration(option.queueTime)} queue
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="compute"
                    value={option.id}
                    checked={selectedCompute === option.id}
                    onChange={() => setSelectedCompute(option.id)}
                    className="sr-only"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Training Configuration */}
          <div className="bg-white rounded-lg shadow mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Training Configuration</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Size
                </label>
                <select
                  value={modelSize}
                  onChange={(e) => setModelSize(e.target.value as keyof typeof trainingEstimates)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(trainingEstimates).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['standard', 'high', 'urgent'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`px-4 py-2 rounded-md text-sm font-medium border ${
                        priority === p
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                      {p === 'high' && ' (+50%)'}
                      {p === 'urgent' && ' (+100%)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoShutdown}
                    onChange={(e) => setAutoShutdown(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Auto-shutdown after training completion
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Send notifications for status updates
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Estimate & Launch */}
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Cost Estimate</h2>
            </div>

            <div className="p-6">
              {selectedOption ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Compute ({estimate.hours}h)</span>
                    <span className="font-medium">
                      {formatCurrency(selectedOption.pricing.hourly * estimate.hours)}
                    </span>
                  </div>

                  {selectedOption.pricing.setup > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Setup fee</span>
                      <span className="font-medium">
                        {formatCurrency(selectedOption.pricing.setup)}
                      </span>
                    </div>
                  )}

                  {priority !== 'standard' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Priority ({priority === 'high' ? '+50%' : '+100%'})
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          (selectedOption.pricing.hourly * estimate.hours) * 
                          (priority === 'high' ? 0.5 : 1)
                        )}
                      </span>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(calculateCost())}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Info className="h-5 w-5 text-blue-600 mr-2" />
                      <div className="text-sm text-blue-800">
                        <div className="font-medium">Estimated completion</div>
                        <div>
                          {new Date(Date.now() + (selectedOption.queueTime + estimate.hours * 3600) * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Server className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select compute</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a compute option to see cost estimate
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Launch Button */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <button
                disabled={!selectedCompute}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium ${
                  selectedCompute
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Launch Training Job
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>

              {selectedCompute && (
                <div className="mt-4 text-xs text-gray-500 text-center">
                  You will be charged {formatCurrency(calculateCost())} upon launch
                </div>
              )}
            </div>
          </div>

          {/* Resource Monitor */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Resource Monitor</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-medium">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-medium">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              {selectedOption?.specs.gpu && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">GPU Usage</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}

              <div className="pt-2 text-xs text-gray-500 text-center">
                Resource usage will appear here during training
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
