import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  password: string
  avatar: string
}

export interface CryptoPair {
  id: string
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
  priceChange24h: number
  priceChangePercent24h: number
  high24h: number
  low24h: number
  volume24h: number
  marketCap: number
  isFavorite: boolean
  lastUpdated: string
}

export interface Balance {
  asset: string
  free: number
  locked: number
  usdtValue: number
  costBasis: number
  pnl: number
  pnlPercent: number
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface OrderBookEntry {
  price: number
  quantity: number
  total: number
}

export interface MarketTrade {
  id: string
  time: string
  price: number
  quantity: number
  side: 'buy' | 'sell'
}

export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market'
  price: number
  quantity: number
  filled: number
  total: number
  status: 'open' | 'filled' | 'cancelled'
  createdAt: string
}

const DEFAULT_PAIRS: Omit<CryptoPair, 'id' | 'isFavorite'>[] = [
  { symbol: 'BTC/USDT', baseAsset: 'BTC', quoteAsset: 'USDT', price: 67432.50, priceChange24h: 1250.80, priceChangePercent24h: 1.89, high24h: 68900.00, low24h: 65800.00, volume24h: 28450000000, marketCap: 1324000000000, lastUpdated: new Date().toISOString() },
  { symbol: 'ETH/USDT', baseAsset: 'ETH', quoteAsset: 'USDT', price: 3452.80, priceChange24h: -78.20, priceChangePercent24h: -2.21, high24h: 3580.00, low24h: 3380.00, volume24h: 18500000000, marketCap: 415000000000, lastUpdated: new Date().toISOString() },
  { symbol: 'BNB/USDT', baseAsset: 'BNB', quoteAsset: 'USDT', price: 578.20, priceChange24h: -12.40, priceChangePercent24h: -2.10, high24h: 598.00, low24h: 565.00, volume24h: 2100000000, marketCap: 89000000000, lastUpdated: new Date().toISOString() },
  { symbol: 'SOL/USDT', baseAsset: 'SOL', quoteAsset: 'USDT', price: 146.35, priceChange24h: 8.45, priceChangePercent24h: 6.12, high24h: 152.00, low24h: 136.50, volume24h: 5200000000, marketCap: 65200000000, lastUpdated: new Date().toISOString() },
  { symbol: 'XRP/USDT', baseAsset: 'XRP', quoteAsset: 'USDT', price: 0.6234, priceChange24h: 0.0289, priceChangePercent24h: 4.86, high24h: 0.6450, low24h: 0.5900, volume24h: 3800000000, marketCap: 34000000000, lastUpdated: new Date().toISOString() },
  { symbol: 'ADA/USDT', baseAsset: 'ADA', quoteAsset: 'USDT', price: 0.4521, priceChange24h: -0.0185, priceChangePercent24h: -3.93, high24h: 0.4780, low24h: 0.4410, volume24h: 1800000000, marketCap: 16000000000, lastUpdated: new Date().toISOString() },
  { symbol: 'DOGE/USDT', baseAsset: 'DOGE', quoteAsset: 'USDT', price: 0.1245, priceChange24h: 0.0085, priceChangePercent24h: 7.33, high24h: 0.1320, low24h: 0.1150, volume24h: 2500000000, marketCap: 17800000000, lastUpdated: new Date().toISOString() },
  { symbol: 'DOT/USDT', baseAsset: 'DOT', quoteAsset: 'USDT', price: 7.82, priceChange24h: -0.35, priceChangePercent24h: -4.28, high24h: 8.25, low24h: 7.65, volume24h: 850000000, marketCap: 11200000000, lastUpdated: new Date().toISOString() },
  { symbol: 'LINK/USDT', baseAsset: 'LINK', quoteAsset: 'USDT', price: 18.45, priceChange24h: 1.25, priceChangePercent24h: 7.27, high24h: 19.20, low24h: 17.10, volume24h: 1100000000, marketCap: 10800000000, lastUpdated: new Date().toISOString() },
  { symbol: 'AVAX/USDT', baseAsset: 'AVAX', quoteAsset: 'USDT', price: 38.92, priceChange24h: -1.58, priceChangePercent24h: -3.90, high24h: 41.00, low24h: 38.00, volume24h: 780000000, marketCap: 14700000000, lastUpdated: new Date().toISOString() },
  { symbol: 'MATIC/USDT', baseAsset: 'MATIC', quoteAsset: 'USDT', price: 0.7250, priceChange24h: 0.0320, priceChangePercent24h: 4.62, high24h: 0.7500, low24h: 0.6880, volume24h: 920000000, marketCap: 7200000000, lastUpdated: new Date().toISOString() },
  { symbol: 'UNI/USDT', baseAsset: 'UNI', quoteAsset: 'USDT', price: 9.87, priceChange24h: 0.42, priceChangePercent24h: 4.44, high24h: 10.25, low24h: 9.35, volume24h: 520000000, marketCap: 5900000000, lastUpdated: new Date().toISOString() },
  { symbol: 'LTC/USDT', baseAsset: 'LTC', quoteAsset: 'USDT', price: 84.20, priceChange24h: 3.60, priceChangePercent24h: 4.47, high24h: 86.50, low24h: 80.00, volume24h: 680000000, marketCap: 6300000000, lastUpdated: new Date().toISOString() },
  { symbol: 'ATOM/USDT', baseAsset: 'ATOM', quoteAsset: 'USDT', price: 9.34, priceChange24h: -0.28, priceChangePercent24h: -2.91, high24h: 9.70, low24h: 9.10, volume24h: 410000000, marketCap: 3650000000, lastUpdated: new Date().toISOString() },
  { symbol: 'FIL/USDT', baseAsset: 'FIL', quoteAsset: 'USDT', price: 5.87, priceChange24h: -0.43, priceChangePercent24h: -6.83, high24h: 6.35, low24h: 5.75, volume24h: 390000000, marketCap: 3100000000, lastUpdated: new Date().toISOString() },
]

const DEFAULT_BALANCE_ASSETS = [
  { asset: 'BTC', free: 0.085, locked: 0.015, costBasis: 42000 },
  { asset: 'ETH', free: 2.450, locked: 0.500, costBasis: 2200 },
  { asset: 'SOL', free: 15.000, locked: 0, costBasis: 80 },
  { asset: 'BNB', free: 5.200, locked: 1.000, costBasis: 410 },
  { asset: 'USDT', free: 12500.00, locked: 3500.00, costBasis: 1 },
  { asset: 'ADA', free: 5000.00, locked: 0, costBasis: 0.35 },
  { asset: 'DOGE', free: 10000.00, locked: 0, costBasis: 0.05 },
]

export const useCryptoStore = defineStore('crypto', () => {
  const saved = sessionStorage.getItem('bn_user')
  const currentUser = ref<User | null>(saved ? JSON.parse(saved) : null)
  const isLoggedIn = ref(!!saved)
  const users = ref<User[]>([
    { id: 1, name: 'Eddyson Tristan Aromin', email: 'Aromin', password: 'Password1!', avatar: 'EA' },
  ])

  const cryptoPairs = ref<CryptoPair[]>(loadPairs())
  const balances = ref<Balance[]>(loadBalances())
  const orders = ref<Order[]>(loadOrders())
  const selectedPairId = ref<string | null>(null)
  const searchQuery = ref('')
  const activeMarketTab = ref<'all' | 'favorites' | 'gainers' | 'losers'>('all')
  const orderSide = ref<'buy' | 'sell'>('buy')

  // Computed
  const selectedPair = computed(() =>
    cryptoPairs.value.find(p => p.id === selectedPairId.value) || null
  )

  const totalPortfolioValue = computed(() =>
    balances.value.reduce((s, b) => s + b.usdtValue, 0)
  )

  const totalPnl = computed(() =>
    balances.value.reduce((s, b) => s + b.pnl, 0)
  )

  const totalPnlPercent = computed(() => {
    const totalCost = balances.value.reduce((s, b) => s + b.costBasis * (b.free + b.locked), 0)
    return totalCost > 0 ? (totalPnl.value / totalCost) * 100 : 0
  })

  const filteredPairs = computed(() => {
    let pairs = [...cryptoPairs.value]
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      pairs = pairs.filter(p => p.symbol.toLowerCase().includes(q) || p.baseAsset.toLowerCase().includes(q))
    }
    switch (activeMarketTab.value) {
      case 'favorites': pairs = pairs.filter(p => p.isFavorite); break
      case 'gainers': pairs = pairs.filter(p => p.priceChangePercent24h > 0); break
      case 'losers': pairs = pairs.filter(p => p.priceChangePercent24h < 0); break
    }
    return pairs
  })

  const marketSummary = computed(() => ({
    total: cryptoPairs.value.length,
    gainers: cryptoPairs.value.filter(p => p.priceChangePercent24h > 0).length,
    losers: cryptoPairs.value.filter(p => p.priceChangePercent24h < 0).length,
  }))

  // ── Persistence ──
  function loadPairs(): CryptoPair[] {
    const stored = localStorage.getItem('bn_pairs')
    if (stored) { try { return JSON.parse(stored) } catch {} }
    return DEFAULT_PAIRS.map((p, i) => ({
      ...p, id: `pair_${i}`, isFavorite: i < 4,
    }))
  }

  function loadBalances(): Balance[] {
    const stored = localStorage.getItem('bn_balances')
    if (stored) { try { return JSON.parse(stored) } catch {} }
    return DEFAULT_BALANCE_ASSETS.map(b => {
      const pair = cryptoPairs.value.find(p => p.baseAsset === b.asset)
      const price = pair ? pair.price : (b.asset === 'USDT' ? 1 : 0)
      const total = b.free + b.locked
      const value = b.asset === 'USDT' ? total : total * price
      const cost = b.costBasis * total
      return { ...b, usdtValue: value, pnl: value - cost, pnlPercent: cost > 0 ? ((value - cost) / cost) * 100 : 0 }
    })
  }

  function loadOrders(): Order[] {
    const stored = localStorage.getItem('bn_orders')
    if (stored) { try { return JSON.parse(stored) } catch {} }
    return []
  }

  function savePairs() { localStorage.setItem('bn_pairs', JSON.stringify(cryptoPairs.value)) }
  function saveBalances() { localStorage.setItem('bn_balances', JSON.stringify(balances.value)) }
  function saveOrders() { localStorage.setItem('bn_orders', JSON.stringify(orders.value)) }

  // ── Auth ──
  function login(email: string, password: string): boolean {
    const user = users.value.find(u => u.email === email && u.password === password)
    if (user) {
      currentUser.value = user; isLoggedIn.value = true
      sessionStorage.setItem('bn_user', JSON.stringify(user))
      return true
    }
    return false
  }
  function logout() {
    currentUser.value = null; isLoggedIn.value = false
    sessionStorage.removeItem('bn_user')
  }

  function selectPair(id: string) { selectedPairId.value = id }
  function toggleFavorite(id: string) {
    const p = cryptoPairs.value.find(p => p.id === id)
    if (p) { p.isFavorite = !p.isFavorite; savePairs() }
  }

  // ── Customizable Pricing ──
  function updatePrice(pairId: string, newPrice: number) {
    const pair = cryptoPairs.value.find(p => p.id === pairId)
    if (!pair || newPrice <= 0) return
    pair.priceChange24h = newPrice - (pair.price - pair.priceChange24h)
    pair.priceChangePercent24h = pair.price > 0 ? ((newPrice - pair.price) / pair.price) * 100 : 0
    pair.price = newPrice
    pair.lastUpdated = new Date().toISOString()
    if (newPrice > pair.high24h) pair.high24h = newPrice
    if (newPrice < pair.low24h) pair.low24h = newPrice
    savePairs()
    recalcBalances()
    // Regenerate chart data if this is the selected pair
    if (pairId === selectedPairId.value) {
      addCandleTick()
      generateOrderBook(newPrice)
      generateMarketTrades(newPrice)
    }
  }

  function updatePriceChange(pairId: string, percent: number) {
    const pair = cryptoPairs.value.find(p => p.id === pairId)
    if (!pair) return
    updatePrice(pairId, pair.price * (1 + percent / 100))
  }

  function applyMarketShift(percent: number) {
    for (const p of cryptoPairs.value) {
      const newPrice = p.price * (1 + percent / 100)
      p.priceChange24h = newPrice - (p.price - p.priceChange24h)
      p.priceChangePercent24h = p.price > 0 ? ((newPrice - p.price) / p.price) * 100 : 0
      p.price = newPrice; p.lastUpdated = new Date().toISOString()
    }
    savePairs(); recalcBalances()
  }

  function randomizePrices() {
    for (const p of cryptoPairs.value) {
      const change = (Math.random() - 0.5) * 12
      const newPrice = p.price * (1 + change / 100)
      p.priceChange24h = newPrice - (p.price - p.priceChange24h)
      p.priceChangePercent24h = change
      p.price = newPrice; p.lastUpdated = new Date().toISOString()
    }
    savePairs(); recalcBalances()
  }

  // ── LIVE PRICE SIMULATION ──
  const liveMode = ref(true)
  const flashMap = ref<Record<string, 'up' | 'down' | null>>({})
  let liveTimer: ReturnType<typeof setInterval> | null = null

  function simulateLiveTick() {
    if (!liveMode.value) return
    // Pick 3-5 random pairs to update
    const count = Math.floor(Math.random() * 3) + 2
    const shuffled = [...cryptoPairs.value].sort(() => Math.random() - 0.5)
    const updated: Record<string, 'up' | 'down'> = {}

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const p = shuffled[i]
      // Small random change: -0.5% to +0.5%
      const change = (Math.random() - 0.5) * 0.8
      const newPrice = p.price * (1 + change / 100)
      const direction = change >= 0 ? 'up' : 'down'

      p.priceChange24h = newPrice - (p.price - p.priceChange24h)
      p.priceChangePercent24h = p.price > 0 ? ((newPrice - p.price) / p.price) * 100 : 0
      p.price = newPrice
      p.lastUpdated = new Date().toISOString()
      updated[p.id] = direction
    }

    // Update flash map
    flashMap.value = {}
    for (const [id, dir] of Object.entries(updated)) {
      flashMap.value[id] = dir as 'up' | 'down'
    }

    savePairs()
    recalcBalances()

    // Clear flash after 600ms
    setTimeout(() => {
      flashMap.value = {}
    }, 600)
  }

  function startLiveSimulation() {
    if (liveTimer) clearInterval(liveTimer)
    liveTimer = setInterval(simulateLiveTick, 2500 + Math.random() * 2000)
  }

  function stopLiveSimulation() {
    if (liveTimer) { clearInterval(liveTimer); liveTimer = null }
  }

  function toggleLiveMode() {
    liveMode.value = !liveMode.value
    if (liveMode.value) startLiveSimulation()
    else stopLiveSimulation()
  }

  // Start live simulation on init
  startLiveSimulation()

  function recalcBalances() {
    for (const b of balances.value) {
      if (b.asset === 'USDT') {
        b.usdtValue = b.free + b.locked
      } else {
        const pair = cryptoPairs.value.find(p => p.baseAsset === b.asset)
        b.usdtValue = pair ? (b.free + b.locked) * pair.price : 0
      }
      const total = b.free + b.locked
      const cost = b.costBasis * total
      b.pnl = b.usdtValue - cost
      b.pnlPercent = cost > 0 ? ((b.usdtValue - cost) / cost) * 100 : 0
    }
    saveBalances()
  }

  function updateBalance(asset: string, free: number, locked?: number, costBasis?: number) {
    const bal = balances.value.find(b => b.asset === asset)
    if (bal) {
      bal.free = free
      if (locked !== undefined) bal.locked = locked
      if (costBasis !== undefined) bal.costBasis = costBasis
      recalcBalances()
    }
  }

  // ── Orders ──
  function placeOrder(symbol: string, side: 'buy' | 'sell', type: 'limit' | 'market', price: number, qty: number) {
    const order: Order = {
      id: 'ord_' + Date.now(), symbol, side, type, price, quantity: qty,
      filled: type === 'market' ? qty : 0, total: price * qty,
      status: type === 'market' ? 'filled' : 'open',
      createdAt: new Date().toISOString(),
    }
    orders.value.unshift(order); saveOrders()
    if (type === 'market') {
      const base = symbol.split('/')[0]
      const bal = balances.value.find(b => b.asset === base)
      if (bal) {
        if (side === 'buy') bal.free += qty
        else bal.free = Math.max(0, bal.free - qty)
        recalcBalances()
      }
    }
    return order
  }

  function cancelOrder(id: string) {
    const o = orders.value.find(o => o.id === id)
    if (o && o.status === 'open') { o.status = 'cancelled'; saveOrders() }
  }

  // ── Reset ──
  function resetAllData() {
    localStorage.removeItem('bn_pairs'); localStorage.removeItem('bn_balances'); localStorage.removeItem('bn_orders')
    location.reload()
  }

  // ── PRICE DRIFT STATE (trend momentum) ──
  const priceDrift: Record<string, number> = {}
  const priceVolatility: Record<string, number> = {}

  // ── CANDLESTICK DATA ──
  const candles = ref<Candle[]>([])
  const selectedTimeframe = ref<'1m' | '5m' | '15m' | '1h' | '4h'>('15m')

  /** Geometric Brownian Motion candle generator — realistic financial data */
  function generateCandles(basePrice: number, count: number = 80): Candle[] {
    const result: Candle[] = []
    const now = Date.now()
    const interval = { '1m': 60000, '5m': 300000, '15m': 900000, '1h': 3600000, '4h': 14400000 }[selectedTimeframe.value]

    // Use a deterministic seed based on basePrice for consistency
    const seed = Math.round(basePrice * 100) % 7919
    let rng = seed

    function pseudoRandom(): number {
      rng = (rng * 16807 + 0) % 2147483647
      return (rng & 0x7fffffff) / 0x7fffffff
    }

    // Start slightly below current price, with a trend
    const drift = (pseudoRandom() - 0.4) * 0.003 // slight bullish bias sometimes
    const vol = basePrice * 0.012 // volatility = 1.2% per candle
    let price = basePrice * (1 - drift * count * 0.5)

    for (let i = 0; i < count; i++) {
      const open = price
      // GBM step: close = open * exp((drift - 0.5*vol^2) + vol * randomNormal)
      const u1 = pseudoRandom()
      const u2 = pseudoRandom()
      const normal = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2)
      const ret = drift + vol * normal * 0.3 // scale down for realism
      const close = open * (1 + ret)

      // Realistic intra-candle range
      const range = Math.abs(close - open) * 0.3 + Math.random() * basePrice * 0.004
      const high = Math.max(open, close) + range * pseudoRandom()
      const low = Math.min(open, close) - range * pseudoRandom()

      // Volume — inversely correlated with vol (calm = low volume, volatile = high)
      const volFactor = 0.5 + Math.abs(ret) * 50
      const volume = (200 + volFactor * 50) * (0.5 + pseudoRandom())

      result.push({
        time: now - (count - i) * interval,
        open: Math.max(open, 0.001),
        high: Math.max(high, open * 1.001, low * 1.001),
        low: Math.max(Math.min(low, open * 0.999, close * 0.999), 0.001),
        close: Math.max(close, 0.001),
        volume,
      })
      price = close
    }
    return result
  }

  function regenerateCandles() {
    if (selectedPair.value) {
      candles.value = generateCandles(selectedPair.value.price)
    }
  }

  function addCandleTick() {
    if (!selectedPair.value || candles.value.length === 0) return
    const last = candles.value[candles.value.length - 1]
    const pair = selectedPair.value
    const price = pair.price

    // Realistic candle based on how much price moved
    const open = last.close
    const ret = (price - open) / open
    const range = Math.abs(ret) * price * 0.3 + price * 0.002
    const volume = 100 + Math.abs(ret) * 2000 + Math.random() * 100

    const newCandle: Candle = {
      time: Date.now(),
      open,
      high: Math.max(open, price) + range * Math.random(),
      low: Math.min(open, price) - range * Math.random(),
      close: price,
      volume,
    }
    candles.value.push(newCandle)
    if (candles.value.length > 100) candles.value.shift()
  }

  // ── ORDER BOOK — realistic cumulative depth ──
  const orderBookAsks = ref<OrderBookEntry[]>([])
  const orderBookBids = ref<OrderBookEntry[]>([])

  function generateOrderBook(basePrice: number) {
    const asks: OrderBookEntry[] = []
    const bids: OrderBookEntry[] = []

    // Tick size depends on price magnitude
    const tickSize = basePrice * 0.0001
    const spread = basePrice * 0.0004 // 0.04% spread

    const baseAsk = basePrice + spread / 2
    const baseBid = basePrice - spread / 2

    // Generate realistic depth — quantities increase further from mid price
    for (let i = 0; i < 15; i++) {
      // Quantities grow quadratically with distance from mid
      const distFactor = (i + 1) * 0.3
      const askQty = 0.05 + Math.pow(distFactor, 1.5) * 0.3 + Math.random() * 0.2
      const bidQty = 0.05 + Math.pow(distFactor, 1.5) * 0.3 + Math.random() * 0.2

      const askPx = baseAsk + tickSize * (i + 1) * (1 + Math.random() * 0.2)
      const bidPx = baseBid - tickSize * (i + 1) * (1 + Math.random() * 0.2)

      asks.push({ price: askPx, quantity: askQty, total: askPx * askQty })
      bids.push({ price: bidPx, quantity: bidQty, total: bidPx * bidQty })
    }

    orderBookAsks.value = asks
    orderBookBids.value = bids
  }

  function updateOrderBookTick() {
    if (!selectedPair.value) return
    const basePrice = selectedPair.value.price
    const tickSize = basePrice * 0.0001
    const spread = basePrice * 0.0004

    // Regenerate order book when price moves significantly
    const lastAsk = orderBookAsks.value[0]?.price ?? 0
    const lastBid = orderBookBids.value[0]?.price ?? 0
    const midPrice = (lastAsk + lastBid) / 2
    const pctDiff = Math.abs(basePrice - midPrice) / basePrice

    if (pctDiff > 0.001) {
      // Price moved — shift order book to track it
      const shift = basePrice - midPrice
      for (const a of orderBookAsks.value) a.price += shift
      for (const b of orderBookBids.value) b.price += shift
    }

    // Shuffle a few quantities
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * 15)
      if (idx < 15) {
        const distFactor = (idx + 1) * 0.3
        if (orderBookAsks.value[idx]) {
          orderBookAsks.value[idx].quantity = 0.05 + Math.pow(distFactor, 1.5) * 0.3 + Math.random() * 0.3
          orderBookAsks.value[idx].total = orderBookAsks.value[idx].price * orderBookAsks.value[idx].quantity
        }
        if (orderBookBids.value[idx]) {
          orderBookBids.value[idx].quantity = 0.05 + Math.pow(distFactor, 1.5) * 0.3 + Math.random() * 0.3
          orderBookBids.value[idx].total = orderBookBids.value[idx].price * orderBookBids.value[idx].quantity
        }
      }
    }
  }

  // ── MARKET TRADES ──
  const marketTrades = ref<MarketTrade[]>([])

  function generateMarketTrades(basePrice: number) {
    const trades: MarketTrade[] = []
    const now = Date.now()
    for (let i = 0; i < 25; i++) {
      // Trade sizes follow power law (few large, many small)
      const sizeRand = Math.random()
      const qty = Math.pow(sizeRand, 2) * 1.5 + 0.005
      const side = Math.random() > 0.5 ? 'buy' : 'sell'
      const dir = side === 'buy' ? 1 : -1
      trades.push({
        id: 'mt_' + i,
        time: new Date(now - i * 3500 - Math.random() * 3000).toLocaleTimeString(),
        price: basePrice + dir * Math.random() * basePrice * 0.0008,
        quantity: qty,
        side,
      })
    }
    marketTrades.value = trades
  }

  function addMarketTrade() {
    if (!selectedPair.value) return
    const bp = selectedPair.value.price
    const side = Math.random() > 0.5 ? 'buy' : 'sell'
    const dir = side === 'buy' ? 1 : -1
    const sizeRand = Math.random()
    const trade: MarketTrade = {
      id: 'mt_' + Date.now(),
      time: new Date().toLocaleTimeString(),
      price: bp + dir * Math.random() * bp * 0.0006,
      quantity: Math.pow(sizeRand, 2) * 1.5 + 0.005,
      side,
    }
    marketTrades.value.unshift(trade)
    if (marketTrades.value.length > 50) marketTrades.value.pop()
  }

  // ── REALISTIC LIVE PRICE SIMULATION ──
  function realisticPriceTick() {
    if (!liveMode.value) return

    // Update selected pair's price with trend momentum
    for (const pair of cryptoPairs.value) {
      // Initialize drift/volatility if not set
      if (!priceDrift[pair.id]) {
        priceDrift[pair.id] = (Math.random() - 0.48) * 0.002
        priceVolatility[pair.id] = 0.003 + Math.random() * 0.005
      }

      // Random walk with momentum: current drift + random shock
      const shock = (Math.random() - 0.5) * priceVolatility[pair.id]
      // Occasionally reverse drift (mean reversion)
      if (Math.random() < 0.02) {
        priceDrift[pair.id] = (Math.random() - 0.48) * 0.003
      }
      // Always add tiny mean reversion toward original baseline
      const totalRet = priceDrift[pair.id] + shock
      const newPrice = pair.price * (1 + totalRet)

      // Clamp to reasonable range
      const clampedPrice = Math.max(newPrice, pair.price * 0.97)
      const finalPrice = Math.min(clampedPrice, pair.price * 1.03)

      const direction = finalPrice >= pair.price ? 'up' : 'down'
      pair.priceChange24h = finalPrice - (pair.price - pair.priceChange24h)
      pair.priceChangePercent24h = pair.price > 0 ? ((finalPrice - pair.price) / pair.price) * 100 : 0
      pair.price = finalPrice
      pair.lastUpdated = new Date().toISOString()
      flashMap.value[pair.id] = direction
    }

    setTimeout(() => { flashMap.value = {} }, 600)
    savePairs()
    recalcBalances()
  }

  // Full market update
  function fullMarketTick() {
    realisticPriceTick()
    if (selectedPair.value) {
      addCandleTick()
      updateOrderBookTick()
      addMarketTrade()
    }
  }

  function reloadTradingData() {
    if (selectedPair.value) {
      candles.value = generateCandles(selectedPair.value.price)
      generateOrderBook(selectedPair.value.price)
      generateMarketTrades(selectedPair.value.price)
    }
  }

  // Watch pair changes
  if (typeof window !== 'undefined') {
    let lastPairId = selectedPairId.value
    setInterval(() => {
      if (selectedPairId.value !== lastPairId) {
        lastPairId = selectedPairId.value
        reloadTradingData()
      }
    }, 200)
  }

  // Init first selected pair (BEFORE trading data)
  if (cryptoPairs.value.length > 0) selectedPairId.value = cryptoPairs.value[0].id

  // Init trading data
  reloadTradingData()

  // Full live simulation
  function startFullLiveSimulation() {
    if (liveTimer) clearInterval(liveTimer)
    liveTimer = setInterval(fullMarketTick, 3000 + Math.random() * 1000)
  }

  function stopFullLiveSimulation() {
    if (liveTimer) { clearInterval(liveTimer); liveTimer = null }
  }

  startFullLiveSimulation()

  // Patch toggleLiveMode
  const origToggle = toggleLiveMode
  toggleLiveMode = function() {
    liveMode.value = !liveMode.value
    if (liveMode.value) startFullLiveSimulation()
    else stopFullLiveSimulation()
  }

  return {
    currentUser, isLoggedIn, cryptoPairs, balances, orders,
    selectedPairId, selectedPair, searchQuery, activeMarketTab, orderSide,
    filteredPairs, marketSummary, totalPortfolioValue, totalPnl, totalPnlPercent,
    flashMap, liveMode,
    candles, selectedTimeframe, orderBookAsks, orderBookBids, marketTrades,
    login, logout, selectPair, toggleFavorite,
    updatePrice, updatePriceChange, applyMarketShift, randomizePrices,
    updateBalance, recalcBalances,
    placeOrder, cancelOrder, resetAllData,
    startLiveSimulation, stopLiveSimulation, toggleLiveMode,
    reloadTradingData, regenerateCandles,
  }
})
