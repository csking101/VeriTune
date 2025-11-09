'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bot, 
  Brain, 
  Zap, 
  Settings, 
  MessageCircle, 
  Play, 
  Save, 
  Upload, 
  Globe, 
  Shield, 
  Users, 
  ChevronRight,
  Check,
  Star,
  Clock,
  DollarSign,
  Activity,
  Code,
  Database,
  Sliders,
  TestTube,
  Rocket,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useStore } from '@/lib/hooks'
import { formatCurrency } from '@/lib/utils'

// Mock data for available trained models
const mockTrainedModels = [
  {
    id: 1,
    name: 'Customer Support GPT-4',
    baseModel: 'GPT-4',
    trainingJob: 'Training Job - 11/8/2025',
    status: 'completed',
    accuracy: 94.2,
    completedAt: '2025-11-08T14:30:00Z',
    dataset: 'Customer Support Data',
    description: 'Fine-tuned model for customer support conversations',
    parameters: '7B',
    cost: 125.50,
    metrics: {
      perplexity: 2.1,
      bleuScore: 0.85,
      f1Score: 0.92
    }
  },
  {
    id: 2,
    name: 'Legal Document GPT-3.5',
    baseModel: 'GPT-3.5 Turbo',
    trainingJob: 'Legal Training - 11/7/2025',
    status: 'completed',
    accuracy: 89.7,
    completedAt: '2025-11-07T09:15:00Z',
    dataset: 'Legal Document Analysis',
    description: 'Specialized model for legal document processing',
    parameters: '3.5B',
    cost: 89.25,
    metrics: {
      perplexity: 2.8,
      bleuScore: 0.78,
      f1Score: 0.87
    }
  },
  {
    id: 3,
    name: 'Code Assistant Llama-2',
    baseModel: 'Llama 2 7B',
    trainingJob: 'Code Training - 11/6/2025',
    status: 'completed',
    accuracy: 91.8,
    completedAt: '2025-11-06T16:45:00Z',
    dataset: 'Programming Dataset',
    description: 'Code generation and debugging assistant',
    parameters: '7B',
    cost: 156.75,
    metrics: {
      perplexity: 2.4,
      bleuScore: 0.82,
      f1Score: 0.89
    }
  }
]

// Agent templates
const agentTemplates = [
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'Handles customer inquiries and support tickets',
    icon: MessageCircle,
    personality: 'Helpful, patient, and professional',
    capabilities: ['FAQ answering', 'Ticket routing', 'Issue resolution'],
    defaultConfig: {
      temperature: 0.3,
      maxTokens: 512,
      systemPrompt: 'You are a helpful customer support agent. Be polite, professional, and solution-oriented.'
    }
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Helps with coding tasks and debugging',
    icon: Code,
    personality: 'Technical, precise, and educational',
    capabilities: ['Code generation', 'Bug fixing', 'Code review'],
    defaultConfig: {
      temperature: 0.1,
      maxTokens: 1024,
      systemPrompt: 'You are an expert programming assistant. Provide clean, efficient code with explanations.'
    }
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Creates marketing and creative content',
    icon: Star,
    personality: 'Creative, engaging, and brand-aware',
    capabilities: ['Blog posts', 'Social media', 'Ad copy'],
    defaultConfig: {
      temperature: 0.7,
      maxTokens: 800,
      systemPrompt: 'You are a creative content writer. Generate engaging, original content that resonates with the target audience.'
    }
  }
]

export default function AgentBuilder() {
  const router = useRouter()
  const { trainingJobs } = useStore()
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    temperature: 0.5,
    maxTokens: 512,
    systemPrompt: '',
    personality: '',
    capabilities: [] as string[],
    deploymentType: 'endpoint' as 'endpoint' | 'marketplace' | 'webhook',
    pricing: {
      type: 'per-request' as 'per-request' | 'subscription' | 'free',
      amount: 0.01
    },
    rateLimits: {
      requestsPerMinute: 60,
      requestsPerDay: 1000
    },
    security: {
      requireAuth: true,
      allowedDomains: [] as string[],
      logRequests: true
    }
  })
  const [activeTab, setActiveTab] = useState<'models' | 'configure' | 'test' | 'deploy'>('models')
  const [testInput, setTestInput] = useState('')
  const [testOutput, setTestOutput] = useState('')
  const [isTestLoading, setIsTestLoading] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'deployed'>('idle')

  // Combine real training jobs with mock data for demonstration
  const availableModels = [
    ...mockTrainedModels,
    ...trainingJobs
      .filter(job => job.status === 'completed')
      .map(job => ({
        id: job.id,
        name: job.name,
        baseModel: job.model,
        trainingJob: job.name,
        status: job.status,
        accuracy: job.accuracy || 90 + Math.random() * 10,
        completedAt: job.endTime || new Date().toISOString(),
        dataset: job.dataset,
        description: `Fine-tuned ${job.model} model`,
        parameters: '7B',
        cost: job.cost,
        metrics: {
          perplexity: 2 + Math.random(),
          bleuScore: 0.8 + Math.random() * 0.2,
          f1Score: 0.85 + Math.random() * 0.15
        }
      }))
  ]

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setAgentConfig(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      temperature: template.defaultConfig.temperature,
      maxTokens: template.defaultConfig.maxTokens,
      systemPrompt: template.defaultConfig.systemPrompt,
      personality: template.personality,
      capabilities: template.capabilities
    }))
    setActiveTab('configure')
  }

  const handleTestAgent = async () => {
    if (!testInput.trim()) return
    
    setIsTestLoading(true)
    // Simulate API call
    setTimeout(() => {
      const responses = [
        "Hello! I'm your AI assistant. How can I help you today?",
        "I understand your question. Let me provide you with a detailed response...",
        "Based on the context you've provided, here's what I recommend...",
        "Thank you for reaching out. I'm here to assist you with any questions you might have."
      ]
      setTestOutput(responses[Math.floor(Math.random() * responses.length)])
      setIsTestLoading(false)
    }, 1500)
  }

  const handleDeploy = async () => {
    setDeploymentStatus('deploying')
    // Simulate deployment
    setTimeout(() => {
      setDeploymentStatus('deployed')
    }, 3000)
  }

  const renderModelSelection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Trained Model</h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose from your completed training jobs to create an AI agent
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableModels.map((model) => (
          <div
            key={model.id}
            onClick={() => {
              setSelectedModel(model)
              setActiveTab('configure')
            }}
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedModel?.id === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                  <p className="text-sm text-gray-500">{model.baseModel} • {model.parameters}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  {model.status}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{model.accuracy.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">accuracy</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{model.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{model.metrics.f1Score.toFixed(2)}</div>
                <div className="text-xs text-gray-500">F1 Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{model.metrics.perplexity.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Perplexity</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{formatCurrency(model.cost)}</div>
                <div className="text-xs text-gray-500">Training Cost</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Dataset: {model.dataset}</span>
              <span>{new Date(model.completedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderConfiguration = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configure Your Agent</h2>
        <p className="text-sm text-gray-600 mb-6">
          Customize your agent's behavior, personality, and capabilities
        </p>
      </div>

      {/* Agent Templates */}
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-4">Choose a Template (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {agentTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-3">
                <template.icon className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-gray-900">{template.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="space-y-1">
                {template.capabilities.slice(0, 2).map((capability, index) => (
                  <div key={index} className="text-xs text-gray-500">• {capability}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Configuration */}
        <div className="space-y-6">
          <h3 className="text-md font-medium text-gray-900">Basic Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
            <input
              type="text"
              value={agentConfig.name}
              onChange={(e) => setAgentConfig(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My AI Assistant"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={agentConfig.description}
              onChange={(e) => setAgentConfig(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what your agent does..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
            <textarea
              value={agentConfig.systemPrompt}
              onChange={(e) => setAgentConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="You are a helpful AI assistant..."
            />
          </div>
        </div>

        {/* Advanced Configuration */}
        <div className="space-y-6">
          <h3 className="text-md font-medium text-gray-900">Advanced Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: {agentConfig.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={agentConfig.temperature}
              onChange={(e) => setAgentConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Focused</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
            <input
              type="number"
              value={agentConfig.maxTokens}
              onChange={(e) => setAgentConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="50"
              max="2048"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limits</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Requests/min</label>
                <input
                  type="number"
                  value={agentConfig.rateLimits.requestsPerMinute}
                  onChange={(e) => setAgentConfig(prev => ({ 
                    ...prev, 
                    rateLimits: { ...prev.rateLimits, requestsPerMinute: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Requests/day</label>
                <input
                  type="number"
                  value={agentConfig.rateLimits.requestsPerDay}
                  onChange={(e) => setAgentConfig(prev => ({ 
                    ...prev, 
                    rateLimits: { ...prev.rateLimits, requestsPerDay: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Security Settings</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={agentConfig.security.requireAuth}
                  onChange={(e) => setAgentConfig(prev => ({ 
                    ...prev, 
                    security: { ...prev.security, requireAuth: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require API authentication</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={agentConfig.security.logRequests}
                  onChange={(e) => setAgentConfig(prev => ({ 
                    ...prev, 
                    security: { ...prev.security, logRequests: e.target.checked }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Log all requests</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTesting = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Your Agent</h2>
        <p className="text-sm text-gray-600 mb-6">
          Try out your agent with sample inputs to see how it responds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Test Input</label>
          <div className="space-y-4">
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your test message here..."
            />
            <button
              onClick={handleTestAgent}
              disabled={!testInput.trim() || isTestLoading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Agent
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agent Response</label>
          <div className="h-32 p-3 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto">
            {testOutput ? (
              <p className="text-sm text-gray-900">{testOutput}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">Agent response will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* Sample Prompts */}
      <div>
        <h3 className="text-md font-medium text-gray-900 mb-3">Sample Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Hello, can you help me with my account?",
            "What are your capabilities?",
            "I need assistance with a technical issue",
            "Can you explain how this works?"
          ].map((prompt, index) => (
            <button
              key={index}
              onClick={() => setTestInput(prompt)}
              className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDeployment = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Deploy Your Agent</h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose how you want to deploy and monetize your AI agent
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[
          {
            id: 'endpoint',
            name: 'API Endpoint',
            description: 'Deploy as a private API endpoint',
            icon: Globe,
            features: ['Custom domain', 'API key authentication', 'Usage analytics']
          },
          {
            id: 'marketplace',
            name: 'Agent Marketplace',
            description: 'List in public marketplace',
            icon: Users,
            features: ['Public discovery', 'Revenue sharing', 'User reviews']
          },
          {
            id: 'webhook',
            name: 'Webhook Integration',
            description: 'Integrate with external services',
            icon: Zap,
            features: ['Real-time triggers', 'Custom payloads', 'Event handling']
          }
        ].map((option) => (
          <div
            key={option.id}
            onClick={() => setAgentConfig(prev => ({ ...prev, deploymentType: option.id as any }))}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
              agentConfig.deploymentType === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-4">
              <option.icon className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">{option.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{option.description}</p>
            <ul className="space-y-2">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-500">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Pricing Configuration */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-md font-medium text-gray-900 mb-4">Pricing Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'free', name: 'Free', description: 'No cost to users' },
            { id: 'per-request', name: 'Per Request', description: 'Charge per API call' },
            { id: 'subscription', name: 'Subscription', description: 'Monthly/yearly plans' }
          ].map((pricing) => (
            <label
              key={pricing.id}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                agentConfig.pricing.type === pricing.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name="pricing"
                value={pricing.id}
                checked={agentConfig.pricing.type === pricing.id}
                onChange={(e) => setAgentConfig(prev => ({ 
                  ...prev, 
                  pricing: { ...prev.pricing, type: e.target.value as any }
                }))}
                className="sr-only"
              />
              <div>
                <div className="font-medium text-gray-900">{pricing.name}</div>
                <div className="text-sm text-gray-500">{pricing.description}</div>
              </div>
            </label>
          ))}
        </div>

        {agentConfig.pricing.type !== 'free' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price {agentConfig.pricing.type === 'per-request' ? 'per request' : 'per month'}
            </label>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="number"
                step="0.01"
                value={agentConfig.pricing.amount}
                onChange={(e) => setAgentConfig(prev => ({ 
                  ...prev, 
                  pricing: { ...prev.pricing, amount: parseFloat(e.target.value) }
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Deploy Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleDeploy}
          disabled={deploymentStatus === 'deploying'}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center text-lg font-medium"
        >
          {deploymentStatus === 'deploying' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Deploying...
            </>
          ) : deploymentStatus === 'deployed' ? (
            <>
              <Check className="h-5 w-5 mr-3" />
              Deployed Successfully
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-3" />
              Deploy Agent
            </>
          )}
        </button>
      </div>

      {/* Deployment Success */}
      {deploymentStatus === 'deployed' && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-4">
            <Check className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-medium text-green-900">Agent Deployed Successfully!</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <div className="font-medium text-gray-900">API Endpoint</div>
                <div className="text-sm text-gray-500">https://api.veritune.ai/agents/{agentConfig.name.toLowerCase().replace(/ /g, '-')}</div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <div className="font-medium text-gray-900">API Key</div>
                <div className="text-sm text-gray-500">vt_xxxxxxxxxxxxxxxxxxxxxxxx</div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex space-x-3 pt-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Documentation
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                <Activity className="h-4 w-4 mr-2" />
                Monitor Usage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Agent Builder</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create AI agents from your fine-tuned models
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { id: 'models', name: 'Select Model', icon: Brain },
            { id: 'configure', name: 'Configure', icon: Settings },
            { id: 'test', name: 'Test', icon: TestTube },
            { id: 'deploy', name: 'Deploy', icon: Rocket }
          ].map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => selectedModel && setActiveTab(step.id as any)}
                disabled={step.id !== 'models' && !selectedModel}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === step.id
                    ? 'bg-blue-600 text-white'
                    : selectedModel || step.id === 'models'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <step.icon className="h-4 w-4 mr-2" />
                {step.name}
              </button>
              {index < 3 && (
                <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-8">
          {activeTab === 'models' && renderModelSelection()}
          {activeTab === 'configure' && renderConfiguration()}
          {activeTab === 'test' && renderTesting()}
          {activeTab === 'deploy' && renderDeployment()}
        </div>
      </div>
    </div>
  )
}
