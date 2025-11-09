import { useEffect, useState } from 'react'
import { store, Dataset, Pipeline, TrainingJob, TrainingConfig, DeployedAgent } from './store'

export function useStore() {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      forceUpdate({})
    })
    return unsubscribe
  }, [])

  return {
    // Cart
    cart: store.getCart(),
    addToCart: (dataset: Dataset) => store.addToCart(dataset),
    removeFromCart: (datasetId: number) => store.removeFromCart(datasetId),
    clearCart: () => store.clearCart(),
    cartTotal: store.getCartTotal(),
    pipelineTotal: store.getPipelineTotal(),
    grandTotal: store.getGrandTotal(),

    // Pipeline
    currentPipeline: store.getCurrentPipeline(),
    setCurrentPipeline: (pipeline: Pipeline | null) => store.setCurrentPipeline(pipeline),
    savePipeline: (pipeline: Pipeline) => store.savePipeline(pipeline),
    savedPipelines: store.getSavedPipelines(),

    // Training
    trainingConfig: store.getTrainingConfig(),
    setTrainingConfig: (config: TrainingConfig) => store.setTrainingConfig(config),
    createTrainingJob: (name: string) => store.createTrainingJob(name),
    trainingJobs: store.getTrainingJobs(),
    updateTrainingJob: (jobId: number, updates: Partial<TrainingJob>) => store.updateTrainingJob(jobId, updates),

    // Agents
    deployedAgents: store.getDeployedAgents(),
    createAgent: (agentData: Omit<DeployedAgent, 'id' | 'createdAt' | 'totalRequests' | 'monthlyRequests' | 'revenue'>) => store.createAgent(agentData),
    updateAgent: (agentId: number, updates: Partial<DeployedAgent>) => store.updateAgent(agentId, updates),
    deleteAgent: (agentId: number) => store.deleteAgent(agentId),
  }
}
