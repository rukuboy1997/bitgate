const MARKETPLACE_APIS = [
  // 🔹 Core APIs
  {
    id: 1,
    name: "Crypto Price Feed",
    description: "Real-time pricing for BTC, STX, ETH, and stablecoins with ultra-low latency and historical data support.",
    price: 0.5,
    asset: "USDCx",
    endpoint: "https://api.bitgate.so/v1/price-feed",
    usageCount: 14502,
    earnings: 7251,
    category: "DeFi Data"
  },
  {
    id: 2,
    name: "Stacks Blockchain Indexer",
    description: "Query SIP-009 NFTs and SIP-010 tokens, balances, transactions, and smart contract states instantly.",
    price: 1.2,
    asset: "sBTC",
    endpoint: "https://api.bitgate.so/v1/indexer",
    usageCount: 893,
    earnings: 1071.6,
    category: "Infrastructure"
  },
  {
    id: 3,
    name: "AI Sentiment Analysis",
    description: "Analyze crypto sentiment across Twitter and Discord using real-time NLP models.",
    price: 1.5,
    asset: "STX",
    endpoint: "https://api.bitgate.so/v1/sentiment",
    usageCount: 340,
    earnings: 510,
    category: "AI / ML"
  },

  // 🔹 Communication & Messaging
  {
    id: 4,
    name: "SMS & Voice Gateway",
    description: "Send SMS, automate voice calls, and build communication workflows globally.",
    price: 0.8,
    asset: "USDCx",
    endpoint: "https://api.bitgate.so/v1/communication",
    usageCount: 2100,
    earnings: 1680,
    category: "Communication"
  },
  {
    id: 5,
    name: "Email Automation API",
    description: "Programmatically send, read, and manage email campaigns and inbox data.",
    price: 0.4,
    asset: "STX",
    endpoint: "https://api.bitgate.so/v1/email",
    usageCount: 1800,
    earnings: 720,
    category: "Communication"
  },

  // 🔹 Finance & Payments
  {
    id: 6,
    name: "Payment Processing API",
    description: "Securely process online payments, subscriptions, and billing workflows.",
    price: 1.8,
    asset: "USDCx",
    endpoint: "https://api.bitgate.so/v1/payments",
    usageCount: 950,
    earnings: 1710,
    category: "Finance"
  },
  {
    id: 7,
    name: "Market Data API",
    description: "Access real-time stock, forex, and crypto market data feeds.",
    price: 0.6,
    asset: "sBTC",
    endpoint: "https://api.bitgate.so/v1/market-data",
    usageCount: 3200,
    earnings: 1920,
    category: "Finance"
  },

  // 🔹 Maps & Location
  {
    id: 8,
    name: "Maps & Navigation API",
    description: "Embed maps, geolocation services, and routing into your applications.",
    price: 0.7,
    asset: "STX",
    endpoint: "https://api.bitgate.so/v1/maps",
    usageCount: 2700,
    earnings: 1890,
    category: "Location"
  },
  {
    id: 9,
    name: "Weather Data API",
    description: "Get real-time and historical weather data globally.",
    price: 0.3,
    asset: "USDCx",
    endpoint: "https://api.bitgate.so/v1/weather",
    usageCount: 4100,
    earnings: 1230,
    category: "Location"
  },
  {
    id: 10,
    name: "Country Info API",
    description: "Retrieve country data including capital, currency, and languages.",
    price: 0.2,
    asset: "STX",
    endpoint: "https://api.bitgate.so/v1/countries",
    usageCount: 1500,
    earnings: 300,
    category: "Location"
  },

  // 🔹 Content & Media
  {
    id: 11,
    name: "Image Library API",
    description: "Access millions of high-quality images for apps and websites.",
    price: 0.5,
    asset: "USDCx",
    endpoint: "https://api.bitgate.so/v1/images",
    usageCount: 5000,
    earnings: 2500,
    category: "Media"
  },
  {
    id: 12,
    name: "Video & Streaming API",
    description: "Embed videos, manage streams, and access video metadata.",
    price: 1.0,
    asset: "sBTC",
    endpoint: "https://api.bitgate.so/v1/video",
    usageCount: 1200,
    earnings: 1200,
    category: "Media"
  },
  {
    id: 13,
    name: "Music Data API",
    description: "Access music catalogs, playlists, and artist data.",
    price: 0.6,
    asset: "STX",
    endpoint: "https://api.bitgate.so/v1/music",
    usageCount: 2100,
    earnings: 1260,
    category: "Media"
  },

  // 🔹 Development & Testing
  {
    id: 14,
    name: "Git Repository API",
    description: "Manage repositories, automate workflows, and access project data.",
    price: 0.9,
    asset: "USDCx",
    endpoint: "https://api.bitgate.so/v1/git",
    usageCount: 1800,
    earnings: 1620,
    category: "Development"
  },
  {
    id: 15,
    name: "Mock Data API",
    description: "Generate fake data for testing and prototyping applications.",
    price: 0.1,
    asset: "STX",
    endpoint: "https://api.bitgate.so/v1/mock",
    usageCount: 6000,
    earnings: 600,
    category: "Development"
  },
  {
    id: 16,
    name: "Sci-Fi Data API",
    description: "Fun API providing structured data from fictional universes.",
    price: 0.2,
    asset: "sBTC",
    endpoint: "https://api.bitgate.so/v1/scifi",
    usageCount: 900,
    earnings: 180,
    category: "Development"
  },

  // 🔹 AI & Machine Learning
  {
    id: 17,
    name: "AI Text Generation API",
    description: "Generate human-like text, summaries, and chat responses.",
    price: 1.7,
    asset: "STX",
    endpoint: "https://api.bitgate.so/v1/ai-text",
    usageCount: 1300,
    earnings: 2210,
    category: "AI / ML"
  },
  {
    id: 18,
    name: "Image Recognition API",
    description: "Detect objects, extract text, and analyze images using AI.",
    price: 1.3,
    asset: "USDCx",
    endpoint: "https://api.bitgate.so/v1/vision",
    usageCount: 800,
    earnings: 1040,
    category: "AI / ML"
  }
];


export function getApis(req, res) {
  res.json(MARKETPLACE_APIS);
}
