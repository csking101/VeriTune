'use client'

import { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Shield, 
  Database,
  Tag,
  User,
  Calendar,
  DollarSign,
  HardDrive
} from 'lucide-react'
import { formatCurrency, formatBytes } from '@/lib/utils'

// Mock dataset data
const datasets = [
  {
    id: 1,
    name: 'Customer Support Conversations v2.1',
    description: 'High-quality customer support conversations from leading SaaS companies. Includes sentiment analysis and resolution outcomes.',
    owner: 'DataCorp Analytics',
    price: 199.99,
    size: 2147483648, // 2GB
    quality: 9.2,
    rating: 4.8,
    downloads: 1247,
    tags: ['customer-support', 'nlp', 'conversation', 'sentiment'],
    category: 'Text',
    uploadDate: '2024-01-10',
    verified: true,
    preview: 'Support Agent: Hello! How can I help you today?\nCustomer: I\'m having trouble with my account login...',
    samples: 50000,
    license: 'Commercial Use',
  },
  {
    id: 2,
    name: 'GitHub Code Reviews Dataset',
    description: 'Comprehensive dataset of code review comments and suggestions from open-source repositories. Perfect for training code analysis models.',
    owner: 'OpenSource Collective',
    price: 299.99,
    size: 5368709120, // 5GB
    quality: 8.9,
    rating: 4.6,
    downloads: 892,
    tags: ['code-review', 'programming', 'analysis', 'github'],
    category: 'Code',
    uploadDate: '2024-01-08',
    verified: true,
    preview: '// Function to validate email format\nfunction validateEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}',
    samples: 75000,
    license: 'Open Source',
  },
  {
    id: 3,
    name: 'Medical Cases Database v1.3',
    description: 'Anonymized medical case studies with diagnostic information. Curated by certified medical professionals.',
    owner: 'MedTech Solutions',
    price: 799.99,
    size: 1073741824, // 1GB
    quality: 9.7,
    rating: 4.9,
    downloads: 234,
    tags: ['medical', 'diagnosis', 'healthcare', 'cases'],
    category: 'Healthcare',
    uploadDate: '2024-01-12',
    verified: true,
    preview: 'Patient presents with chest pain and shortness of breath. History of hypertension...',
    samples: 15000,
    license: 'Research Only',
  },
  {
    id: 4,
    name: 'Stock Market Data 2020-2024',
    description: 'Complete stock market data including prices, volumes, and technical indicators for major exchanges.',
    owner: 'FinanceAI Corp',
    price: 449.99,
    size: 3221225472, // 3GB
    quality: 8.5,
    rating: 4.4,
    downloads: 567,
    tags: ['finance', 'stocks', 'trading', 'market-data'],
    category: 'Finance',
    uploadDate: '2024-01-05',
    verified: true,
    preview: 'AAPL,2024-01-15,185.25,187.50,183.75,186.12,125000000',
    samples: 2000000,
    license: 'Commercial Use',
  },
  {
    id: 5,
    name: 'Social Media Sentiment Dataset',
    description: 'Millions of social media posts with sentiment labels. Great for training sentiment analysis models.',
    owner: 'SocialData Inc',
    price: 159.99,
    size: 4294967296, // 4GB
    quality: 7.8,
    rating: 4.2,
    downloads: 1456,
    tags: ['social-media', 'sentiment', 'nlp', 'classification'],
    category: 'Text',
    uploadDate: '2024-01-14',
    verified: false,
    preview: 'Amazing product! Love the new features 😍 #ProductLaunch',
    samples: 1000000,
    license: 'Academic Use',
  },
  {
    id: 6,
    name: 'Image Classification Dataset',
    description: 'High-resolution images across 1000 categories. Perfect for computer vision training.',
    owner: 'VisionTech Labs',
    price: 349.99,
    size: 10737418240, // 10GB
    quality: 9.1,
    rating: 4.7,
    downloads: 678,
    tags: ['computer-vision', 'images', 'classification', 'deep-learning'],
    category: 'Images',
    uploadDate: '2024-01-11',
    verified: true,
    preview: '[Image preview not available in text format]',
    samples: 100000,
    license: 'Commercial Use',
  },
]

const categories = ['All', 'Text', 'Code', 'Healthcare', 'Finance', 'Images']
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'recent', label: 'Most Recent' },
]

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [cart, setCart] = useState<number[]>([])

  const filteredAndSortedDatasets = useMemo(() => {
    let filtered = datasets.filter(dataset => {
      const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || dataset.category === selectedCategory
      const matchesPrice = dataset.price >= priceRange[0] && dataset.price <= priceRange[1]
      const matchesVerified = !verifiedOnly || dataset.verified
      
      return matchesSearch && matchesCategory && matchesPrice && matchesVerified
    })

    // Sort datasets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.downloads - a.downloads
        case 'recent':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, priceRange, verifiedOnly])

  const addToCart = (datasetId: number) => {
    if (!cart.includes(datasetId)) {
      setCart([...cart, datasetId])
    }
  }

  const removeFromCart = (datasetId: number) => {
    setCart(cart.filter(id => id !== datasetId))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Data Marketplace</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover verified datasets for your AI training pipelines
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-gray-50 flex flex-wrap items-center gap-4">
          {/* Categories */}
          <div className="flex items-center space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Verified Only */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Verified only</span>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedDatasets.map((dataset) => (
          <div key={dataset.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {dataset.name}
                </h3>
                {dataset.verified && (
                  <Shield className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {dataset.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {dataset.rating} ({dataset.downloads})
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <HardDrive className="h-4 w-4 mr-1" />
                  {formatBytes(dataset.size)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Database className="h-4 w-4 mr-1" />
                  {dataset.samples.toLocaleString()} samples
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  Quality: {dataset.quality}/10
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {dataset.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
                {dataset.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{dataset.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Owner and Date */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{dataset.owner}</span>
                <span>{new Date(dataset.uploadDate).toLocaleDateString()}</span>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <div className="flex items-center mb-2">
                  <Eye className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-xs font-medium text-gray-700">Preview</span>
                </div>
                <div className="text-xs text-gray-600 font-mono bg-white p-2 rounded border overflow-hidden">
                  {dataset.preview}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(dataset.price)}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  {cart.includes(dataset.id) ? (
                    <button
                      onClick={() => removeFromCart(dataset.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(dataset.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredAndSortedDatasets.length === 0 && (
        <div className="text-center py-12">
          <Database className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No datasets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 right-0 m-6 bg-white rounded-lg shadow-lg border p-4 min-w-[300px]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Cart ({cart.length})</h4>
            <button className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
          <div className="text-sm text-gray-600 mb-3">
            Total: {formatCurrency(
              cart.reduce((sum, id) => {
                const dataset = datasets.find(d => d.id === id)
                return sum + (dataset?.price || 0)
              }, 0)
            )}
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Proceed to Pipeline Builder
          </button>
        </div>
      )}
    </div>
  )
}
