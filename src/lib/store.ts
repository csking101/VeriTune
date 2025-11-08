// Simple global state management for the application
export interface Dataset {
  id: number
  name: string
  description: string
  owner: string
  price: number
  size: number
  quality: number
  rating: number
  downloads: number
  tags: string[]
  category: string
  uploadDate: string
  verified: boolean
  preview: string
  samples: number
  license: string
}

export interface PipelineNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: { label: string; subtitle: string; price?: number; [key: string]: any }
}

export interface PipelineEdge {
  id: string
  source: string
  target: string
  markerEnd?: { type: string }
  style?: { strokeWidth: number }
}

export interface Pipeline {
  id: string
  name: string
  nodes: PipelineNode[]
  edges: PipelineEdge[]
  datasets: Dataset[]
  createdAt: string
  updatedAt: string
}

export interface TrainingConfig {
  computeId: string
  modelSize: string
  priority: string
  autoShutdown: boolean
  notifications: boolean
}

export interface TrainingJob {
  id: number
  name: string
  status: string
  progress: number
  pipeline: Pipeline
  config: TrainingConfig
  startTime?: string
  endTime?: string
  duration: number
  cost: number
  dataset: string
  model: string
  compute: string
  accuracy?: number
  loss?: number
}

// Global state
class AppStore {
  private static instance: AppStore
  private state = {
    cart: [] as Dataset[],
    savedPipelines: [] as Pipeline[],
    currentPipeline: null as Pipeline | null,
    trainingJobs: [] as TrainingJob[],
    currentTrainingConfig: null as TrainingConfig | null,
  }

  private listeners: (() => void)[] = []

  static getInstance(): AppStore {
    if (!AppStore.instance) {
      AppStore.instance = new AppStore()
    }
    return AppStore.instance
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }

  // Cart management
  addToCart(dataset: Dataset) {
    if (!this.state.cart.find(item => item.id === dataset.id)) {
      this.state.cart.push(dataset)
      this.notify()
    }
  }

  removeFromCart(datasetId: number) {
    this.state.cart = this.state.cart.filter(item => item.id !== datasetId)
    this.notify()
  }

  getCart(): Dataset[] {
    return this.state.cart
  }

  clearCart() {
    this.state.cart = []
    this.notify()
  }

  getCartTotal(): number {
    return this.state.cart.reduce((sum, item) => sum + item.price, 0)
  }

  getPipelineTotal(): number {
    if (!this.state.currentPipeline) return 0
    return this.state.currentPipeline.nodes.reduce((sum, node) => sum + (node.data.price || 0), 0)
  }

  getGrandTotal(): number {
    return this.getCartTotal() + this.getPipelineTotal()
  }

  // Pipeline management
  savePipeline(pipeline: Pipeline) {
    const existingIndex = this.state.savedPipelines.findIndex(p => p.id === pipeline.id)
    if (existingIndex >= 0) {
      this.state.savedPipelines[existingIndex] = pipeline
    } else {
      this.state.savedPipelines.push(pipeline)
    }
    this.notify()
  }

  getCurrentPipeline(): Pipeline | null {
    return this.state.currentPipeline
  }

  setCurrentPipeline(pipeline: Pipeline | null) {
    this.state.currentPipeline = pipeline
    this.notify()
  }

  getSavedPipelines(): Pipeline[] {
    return this.state.savedPipelines
  }

  // Training management
  setTrainingConfig(config: TrainingConfig) {
    this.state.currentTrainingConfig = config
    this.notify()
  }

  getTrainingConfig(): TrainingConfig | null {
    return this.state.currentTrainingConfig
  }

  createTrainingJob(name: string): TrainingJob {
    const job: TrainingJob = {
      id: Date.now(),
      name,
      status: 'queued',
      progress: 0,
      pipeline: this.state.currentPipeline!,
      config: this.state.currentTrainingConfig!,
      startTime: new Date().toISOString(),
      duration: 0,
      cost: 0,
      dataset: this.state.currentPipeline?.datasets[0]?.name || 'Unknown',
      model: 'GPT-4',
      compute: this.state.currentTrainingConfig?.computeId || 'unknown',
    }

    this.state.trainingJobs.push(job)
    this.notify()
    return job
  }

  getTrainingJobs(): TrainingJob[] {
    return this.state.trainingJobs
  }

  updateTrainingJob(jobId: number, updates: Partial<TrainingJob>) {
    const jobIndex = this.state.trainingJobs.findIndex(job => job.id === jobId)
    if (jobIndex >= 0) {
      this.state.trainingJobs[jobIndex] = { ...this.state.trainingJobs[jobIndex], ...updates }
      this.notify()
    }
  }
}

export const store = AppStore.getInstance()
