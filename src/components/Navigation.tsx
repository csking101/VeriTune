'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Brain, Database, Settings, Wallet, Activity, ShoppingCart, X, ArrowRight, Bot } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useStore } from '@/lib/hooks'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Brain },
  { name: 'Marketplace', href: '/marketplace', icon: Database },
  { name: 'Pipeline Builder', href: '/pipeline', icon: Settings },
  { name: 'Training Portal', href: '/training', icon: Activity },
  { name: 'Progress Tracker', href: '/progress', icon: Activity },
  { name: 'Agent Builder', href: '/agents', icon: Bot },
]

export function Navigation() {
  const pathname = usePathname()
  const { cart, removeFromCart, cartTotal, pipelineTotal, grandTotal, currentPipeline } = useStore()
  const [showCart, setShowCart] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">VeriTune</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Cart Dropdown */}
            <div className="relative">
              <button 
                className="relative p-2 rounded-md text-gray-400 hover:text-gray-500"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {showCart && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Shopping Cart</h3>
                      <button
                        onClick={() => setShowCart(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <div className="text-center py-6">
                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Add some datasets to get started
                        </p>
                        <Link
                          href="/marketplace"
                          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          onClick={() => setShowCart(false)}
                        >
                          Browse Datasets
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Cart Items */}
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {/* Datasets */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Datasets</h4>
                            {cart.map((dataset) => (
                              <div key={dataset.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {dataset.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {dataset.size} samples • {dataset.category}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(dataset.price)}
                                  </span>
                                  <button
                                    onClick={() => removeFromCart(dataset.id)}
                                    className="text-red-400 hover:text-red-500"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Pipeline Components */}
                          {currentPipeline && currentPipeline.nodes.length > 0 && (
                            <div className="space-y-2 border-t pt-2">
                              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Pipeline Components</h4>
                              {currentPipeline.nodes.filter(node => node.data.price && node.data.price > 0).map((node) => (
                                <div key={node.id} className="flex items-center space-x-3 p-2 border rounded-lg bg-gray-50">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {node.data.label}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Pipeline component
                                    </p>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(node.data.price || 0)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Cart Total */}
                        <div className="border-t pt-4 mt-4">
                          {/* Subtotals */}
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Datasets</span>
                              <span className="text-gray-900">{formatCurrency(cartTotal)}</span>
                            </div>
                            {pipelineTotal > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Pipeline Components</span>
                                <span className="text-gray-900">{formatCurrency(pipelineTotal)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center mb-4 pt-2 border-t">
                            <span className="text-base font-medium text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(grandTotal)}
                            </span>
                          </div>
                          <Link
                            href="/pipeline"
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            onClick={() => setShowCart(false)}
                          >
                            Continue to Pipeline
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Background overlay */}
      {showCart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setShowCart(false)}
        />
      )}
    </nav>
  )
}
