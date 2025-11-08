'use client'

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  MarkerType,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Database, 
  Settings, 
  Brain, 
  BarChart3, 
  Shield, 
  Zap,
  Plus,
  Save,
  Play,
  FileText,
  Filter,
  GitBranch
} from 'lucide-react'
import { useStore } from '@/lib/hooks'
import { Pipeline } from '@/lib/store'

// Custom node types
const nodeTypes = {
  dataset: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 relative">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <Database className="h-4 w-4 mr-2 text-blue-500" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-sm text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  preprocessing: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 relative">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-green-500" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-sm text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  model: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 relative">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <Brain className="h-4 w-4 mr-2 text-purple-500" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-sm text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  training: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-orange-500 relative">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <Settings className="h-4 w-4 mr-2 text-orange-500" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-sm text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  evaluation: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-red-500 relative">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <BarChart3 className="h-4 w-4 mr-2 text-red-500" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-sm text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  verification: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-500 relative">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <Shield className="h-4 w-4 mr-2 text-yellow-500" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-sm text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  deployment: ({ data }: { data: any }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-indigo-500 relative">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <Zap className="h-4 w-4 mr-2 text-indigo-500" />
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-sm text-gray-500">{data.subtitle}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
}

// Component library for drag and drop
const componentLibrary = [
  {
    type: 'dataset',
    label: 'Dataset',
    icon: Database,
    color: 'blue',
    description: 'Input dataset from marketplace',
  },
  {
    type: 'preprocessing',
    label: 'Preprocessing',
    icon: Filter,
    color: 'green',
    description: 'Data cleaning and transformation',
  },
  {
    type: 'model',
    label: 'Model',
    icon: Brain,
    color: 'purple',
    description: 'Base model selection',
  },
  {
    type: 'training',
    label: 'Training Config',
    icon: Settings,
    color: 'orange',
    description: 'Hyperparameters and training settings',
  },
  {
    type: 'evaluation',
    label: 'Evaluation',
    icon: BarChart3,
    color: 'red',
    description: 'Model validation and metrics',
  },
  {
    type: 'verification',
    label: 'Verification',
    icon: Shield,
    color: 'yellow',
    description: 'Nautilus TEE attestation',
  },
  {
    type: 'deployment',
    label: 'Deployment',
    icon: Zap,
    color: 'indigo',
    description: 'Model deployment configuration',
  },
]

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'dataset',
    position: { x: 100, y: 100 },
    data: { label: 'Customer Support Data', subtitle: '50K samples, 2GB' },
    sourcePosition: 'right' as any,
  },
]

const initialEdges: Edge[] = []

export default function PipelineBuilder() {
  const router = useRouter()
  const { cart, currentPipeline, setCurrentPipeline, savePipeline } = useStore()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodeIdCounter, setNodeIdCounter] = useState(2)
  const [pipelineName, setPipelineName] = useState('My Training Pipeline')

  // Initialize nodes from cart datasets
  const cartNodes = useMemo(() => {
    return cart.map((dataset, index) => ({
      id: `dataset-${dataset.id}`,
      type: 'dataset',
      position: { x: 100, y: 100 + (index * 120) },
      data: { 
        label: dataset.name,
        subtitle: `${dataset.samples.toLocaleString()} samples, ${(dataset.size / (1024 * 1024 * 1024)).toFixed(1)}GB`,
        dataset: dataset
      },
      sourcePosition: 'right' as any,
    }))
  }, [cart])

  // Update initial nodes when cart changes
  const updateNodesFromCart = useCallback(() => {
    if (cartNodes.length > 0) {
      setNodes(cartNodes)
      setNodeIdCounter(cartNodes.length + 1)
    }
  }, [cartNodes, setNodes])

  // Initialize nodes from cart on component mount
  useEffect(() => {
    updateNodesFromCart()
  }, [updateNodesFromCart])

  const handleSavePipeline = () => {
    const pipeline: Pipeline = {
      id: Date.now().toString(),
      name: pipelineName,
      nodes: nodes as any,
      edges: edges as any,
      datasets: cart,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    savePipeline(pipeline)
    setCurrentPipeline(pipeline)
  }

  const handleRunPipeline = () => {
    // Save pipeline first
    handleSavePipeline()
    // Navigate to training portal
    router.push('/training')
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 },
    }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const component = componentLibrary.find(c => c.type === type)

      if (typeof type === 'undefined' || !type || !component) {
        return
      }

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 100,
      }

      const newNode: Node = {
        id: nodeIdCounter.toString(),
        type,
        position,
        data: { 
          label: component.label,
          subtitle: 'Configure settings'
        },
        sourcePosition: 'right' as any,
        targetPosition: 'left' as any,
      }

      setNodes((nds) => nds.concat(newNode))
      setNodeIdCounter(prev => prev + 1)
    },
    [nodeIdCounter, setNodes]
  )

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
    }
    return colorMap[color] || 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
  }

  return (
    <div className="h-screen flex">
      {/* Component Library Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline Components</h2>
          <p className="text-sm text-gray-500 mt-1">Drag components to build your pipeline</p>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {componentLibrary.map((component) => (
            <div
              key={component.type}
              draggable
              onDragStart={(event) => onDragStart(event, component.type)}
              className={`p-3 border-2 border-dashed rounded-lg cursor-move transition-colors ${getColorClasses(component.color)}`}
            >
              <div className="flex items-center mb-2">
                <component.icon className="h-5 w-5 mr-2" />
                <span className="font-medium">{component.label}</span>
              </div>
              <p className="text-xs">{component.description}</p>
            </div>
          ))}
        </div>

        {/* Pipeline Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button 
            onClick={handleSavePipeline}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Pipeline
          </button>
          <button 
            onClick={handleRunPipeline}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Pipeline
          </button>
        </div>
      </div>

      {/* Main Flow Area */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pipeline Builder</h1>
              <p className="text-sm text-gray-500">Design your training pipeline</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FileText className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <GitBranch className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant={'dots' as any} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Node Configuration Panel */}
      {selectedNode && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Configure Node</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{selectedNode.data.label}</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {selectedNode.type === 'dataset' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dataset Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={selectedNode.data.label}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Walrus Storage</option>
                    <option>Upload File</option>
                    <option>External URL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>JSON</option>
                    <option>CSV</option>
                    <option>Parquet</option>
                    <option>JSONL</option>
                  </select>
                </div>
              </div>
            )}

            {selectedNode.type === 'preprocessing' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preprocessing Steps
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Text normalization</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Remove duplicates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Token filtering</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Script
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="def preprocess(data):\n    # Your custom preprocessing logic\n    return processed_data"
                  />
                </div>
              </div>
            )}

            {selectedNode.type === 'model' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Model
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>GPT-3.5 Turbo</option>
                    <option>GPT-4</option>
                    <option>Claude-3 Sonnet</option>
                    <option>Llama 2 7B</option>
                    <option>BERT Base</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model Size
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Small (7B parameters)</option>
                    <option>Medium (13B parameters)</option>
                    <option>Large (30B parameters)</option>
                    <option>XL (70B parameters)</option>
                  </select>
                </div>
              </div>
            )}

            {selectedNode.type === 'training' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Rate
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="0.0001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="16"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Epochs
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warmup Steps
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="500"
                  />
                </div>
              </div>
            )}

            {selectedNode.type === 'evaluation' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metrics
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Accuracy</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">F1 Score</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">BLEU Score</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Perplexity</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Validation Split
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue="0.2"
                  />
                </div>
              </div>
            )}

            {selectedNode.type === 'verification' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TEE Provider
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Nautilus TEE</option>
                    <option>Intel SGX</option>
                    <option>AMD SEV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attestation Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Basic</option>
                    <option>Enhanced</option>
                    <option>Full Audit</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Store attestation on Sui</span>
                </div>
              </div>
            )}

            {selectedNode.type === 'deployment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deployment Target
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>HuggingFace Inference</option>
                    <option>Custom Endpoint</option>
                    <option>Sui NFT Mint</option>
                    <option>Agent Marketplace</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instance Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>CPU (2 cores, 8GB RAM)</option>
                    <option>GPU (1x T4, 16GB VRAM)</option>
                    <option>GPU (1x A100, 40GB VRAM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto-scaling
                  </label>
                  <div className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Enable auto-scaling</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Update Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
