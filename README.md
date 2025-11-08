# VeriTune - Verifiable Model Fine-Tuning Pipeline

A comprehensive frontend application for building, managing, and monitoring verifiable AI model fine-tuning pipelines with provable data authenticity.

## 🚀 Features

### Core Functionality
- **Dashboard**: Overview of training jobs, models, and key metrics
- **Data Marketplace**: Browse and purchase verified datasets with search, filters, and detailed previews
- **Pipeline Builder**: Visual drag-and-drop interface for creating training pipelines using ReactFlow
- **Training Portal**: Configure compute resources, estimate costs, and launch training jobs
- **Progress Tracker**: Real-time monitoring with detailed logs and step-by-step progress visualization

### Technology Integration
- **Walrus Storage**: Decentralized blob storage for datasets and model weights
- **Sui Blockchain**: NFT minting, smart contracts, and on-chain settlements
- **Nautilus TEE**: Trusted execution environment for computation verification
- **Seal**: On-chain access control and data tokenization

## 🛠 Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Pipeline Visualization**: ReactFlow for interactive flow diagrams
- **State Management**: React hooks and local state
- **Mock Data**: Comprehensive dummy data for all features

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd VeriTune
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
VeriTune/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Dashboard page
│   │   ├── marketplace/       # Data marketplace
│   │   ├── pipeline/          # Pipeline builder
│   │   ├── training/          # Training portal
│   │   ├── progress/          # Progress tracker
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   └── Navigation.tsx     # Main navigation
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 🎯 User Workflow

### 1. Dashboard
- View summary of all training jobs and models
- Quick access to key metrics and recent activity
- Navigation to main features

### 2. Data Marketplace
- **Search & Filter**: Find datasets by name, category, price, rating
- **Dataset Cards**: Detailed information including quality scores, size, previews
- **Shopping Cart**: Add multiple datasets for purchase
- **Verification**: Verified datasets marked with shields

### 3. Pipeline Builder
- **Drag & Drop**: Visual pipeline creation with ReactFlow
- **Component Library**: Pre-built nodes for datasets, preprocessing, training, evaluation
- **Configuration**: Detailed settings for each pipeline component
- **Save & Execute**: Store pipelines and launch training jobs

### 4. Training Portal
- **Compute Selection**: Choose from CPU/GPU options with pricing
- **Resource Monitoring**: Real-time usage tracking
- **Cost Estimation**: Transparent pricing with breakdown
- **Launch Control**: One-click training job initiation

### 5. Progress Tracker
- **Job Monitoring**: Real-time progress tracking
- **Step Details**: Expandable pipeline step information
- **Logs Viewing**: Comprehensive logging with filtering
- **Status Management**: Visual status indicators and controls

## 🎨 Design Features

### UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Clean Interface**: Professional, modern design
- **Interactive Elements**: Hover states, animations, and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Data Visualization
- **Progress Bars**: Real-time training progress
- **Status Indicators**: Color-coded job states
- **Interactive Charts**: Training metrics visualization
- **Pipeline Graphs**: Visual representation of training workflows

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_API_URL=your_api_endpoint
NEXT_PUBLIC_WALRUS_ENDPOINT=walrus_storage_endpoint
NEXT_PUBLIC_SUI_NETWORK=sui_network_config
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette
- Extended spacing and typography
- Responsive breakpoints
- Dark mode support preparation

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npx vercel deploy
```

## 🧪 Mock Data

The application includes comprehensive mock data for:
- **Training Jobs**: Various states (completed, running, failed, queued)
- **Datasets**: Different categories with realistic metadata
- **Compute Options**: CPU/GPU configurations with pricing
- **Pipeline Components**: Pre-configured training steps
- **Metrics**: Training accuracy, loss, and performance data

## 🔄 Integration Points

### Blockchain Integration
- **Sui Wallet**: Connect wallet functionality (UI ready)
- **NFT Minting**: Model certification as NFTs
- **Smart Contracts**: Access control and payments

### Storage Integration  
- **Walrus**: Decentralized dataset and model storage
- **IPFS**: Metadata and attestation storage

### Verification
- **Nautilus TEE**: Computation verification
- **Attestations**: Cryptographic proofs of training authenticity

## 🎯 Future Enhancements

- [ ] Real API integration
- [ ] Wallet connection functionality
- [ ] Advanced metrics dashboard
- [ ] Collaborative pipeline sharing
- [ ] Advanced filtering and search
- [ ] Real-time notifications
- [ ] Model marketplace
- [ ] Training templates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Hackathon Features

Built for the AI x Data + Provably Authentic track, this application demonstrates:

- **Verifiable Training**: TEE-based computation verification
- **Data Provenance**: Blockchain-backed dataset authenticity  
- **Transparent Costs**: Clear pricing and resource allocation
- **Professional UI**: Production-ready interface design
- **Scalable Architecture**: Modular, maintainable codebase

---

**VeriTune** - Making AI model training transparent, verifiable, and accessible.
