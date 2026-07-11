<template>
  <div class="dash">
    <!-- ═══ TOP NAV ═══ -->
    <header class="top-nav">
      <div class="nav-left">
        <a class="nav-brand" @click="router.push('/settings')">
          <svg viewBox="0 0 24 24" fill="none" class="nav-logo">
            <circle cx="12" cy="12" r="11" fill="#0B0E11" stroke="#F0B90B" stroke-width="1.5"/>
            <path d="M12 4L7 9l1.5 1.5L12 7l3.5 3.5L17 9l-5-5z" fill="#F0B90B"/>
            <path d="M12 7L7 12l1.5 1.5L12 10l3.5 3.5L17 12l-5-5z" fill="#F0B90B" opacity="0.6"/>
            <path d="M12 10L7 15l1.5 1.5L12 13l3.5 3.5L17 15l-5-5z" fill="#F0B90B" opacity="0.3"/>
          </svg>
          <span class="nav-brand-text">Binance</span>
        </a>
        <div class="nav-links">
          <span class="nav-link active">Trade</span>
          <span class="nav-link" @click="router.push('/profile')">Portfolio</span>
          <span class="nav-link" @click="router.push('/settings')">Settings</span>
        </div>
      </div>
      <div class="nav-right">
        <button class="nav-live-btn" :class="{ active: store.liveMode }" @click="store.toggleLiveMode()" title="Toggle live prices">
          <span class="live-dot" :class="{ active: store.liveMode }"></span>
          <span class="live-text">LIVE</span>
        </button>
        <button class="nav-btn" @click="store.randomizePrices()" title="Shuffle all prices">
          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM1 10.5A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3z"/></svg>
          Shuffle
        </button>
        <div class="nav-user" @click="handleLogout" title="Logout">
          <span class="nav-avatar">{{ store.currentUser?.avatar }}</span>
          <span class="nav-username">{{ store.currentUser?.name?.split(' ')[0] }}</span>
        </div>
      </div>
    </header>

    <!-- ═══ AUTO-SCROLLING TICKER ═══ -->
    <div class="ticker ticker-marquee">
      <div class="ticker-marquee-content">
        <template v-for="dup in 2" :key="dup">
          <div v-for="pair in store.cryptoPairs" :key="pair.id + dup"
            class="ticker-item"
            :class="{ active: pair.id === store.selectedPairId }"
            @click="store.selectPair(pair.id)">
            <span class="ticker-sym">{{ pair.baseAsset }}<span class="ticker-q">/USDT</span></span>
            <span class="ticker-price num-mono" :class="flashClass(pair.id)">${{ fmtPrice(pair.price) }}</span>
            <span class="ticker-chg" :class="pair.priceChangePercent24h >= 0 ? 'up' : 'down'">
              {{ pair.priceChangePercent24h >= 0 ? '+' : '' }}{{ pair.priceChangePercent24h.toFixed(2) }}%
            </span>
          </div>
        </template>
      </div>
    </div>

    <!-- ═══ MAIN 3-COL LAYOUT ═══ -->
    <div class="main">
      <!-- ─── LEFT: Market Pairs ─── -->
      <aside class="col-left">
        <div class="market-tabs">
          <button v-for="t in tabs" :key="t.key" class="market-tab" :class="{ active: store.activeMarketTab === t.key }" @click="store.activeMarketTab = t.key">{{ t.label }}</button>
        </div>
        <div class="market-search">
          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" class="search-icon"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input v-model="store.searchQuery" placeholder="Search" class="market-search-input" />
        </div>
        <div class="pair-hdr"><span>Name</span><span class="r">Price</span><span class="r">Change</span></div>
        <div class="pair-list">
          <div v-for="pair in store.filteredPairs" :key="pair.id"
            class="pair-row" :class="{ selected: pair.id === store.selectedPairId }"
            @click="store.selectPair(pair.id)">
            <div class="pr-info">
              <button class="pr-fav" :class="{ active: pair.isFavorite }" @click.stop="store.toggleFavorite(pair.id)">
                <svg viewBox="0 0 20 20" fill="currentColor" width="10" height="10"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </button>
              <span class="pr-name">{{ pair.baseAsset }}</span>
              <span class="pr-quote">/USDT</span>
            </div>
            <span class="pr-price num-mono" :class="flashClass(pair.id)">${{ fmtPrice(pair.price) }}</span>
            <span class="pr-chg num-mono" :class="pair.priceChangePercent24h >= 0 ? 'up' : 'down'">{{ pair.priceChangePercent24h >= 0 ? '+' : '' }}{{ pair.priceChangePercent24h.toFixed(2) }}%</span>
          </div>
          <div v-if="store.filteredPairs.length === 0" class="pair-empty">No results</div>
        </div>
      </aside>

      <!-- ─── CENTER: Full Trading Panel ─── -->
      <main class="col-center" v-if="store.selectedPair">
        <!-- Price Bar -->
        <div class="price-bar">
          <div class="pb-left">
            <span class="pb-symbol">{{ store.selectedPair.baseAsset }}/{{ store.selectedPair.quoteAsset }}</span>
            <span class="pb-price num-mono" :class="selectedFlash">{{ fmtPrice(store.selectedPair.price) }}</span>
            <span class="pb-chg" :class="store.selectedPair.priceChangePercent24h >= 0 ? 'up' : 'down'">
              ${{ store.selectedPair.priceChange24h >= 0 ? '+' : '' }}{{ fmtPrice(store.selectedPair.priceChange24h) }}
              ({{ store.selectedPair.priceChangePercent24h >= 0 ? '+' : '' }}{{ store.selectedPair.priceChangePercent24h.toFixed(2) }}%)
            </span>
          </div>
          <div class="pb-stats">
            <span class="pb-stat"><span class="pbs-lbl">24h High</span><span class="pbs-val">${{ fmtPrice(store.selectedPair.high24h) }}</span></span>
            <span class="pb-stat"><span class="pbs-lbl">24h Low</span><span class="pbs-val">${{ fmtPrice(store.selectedPair.low24h) }}</span></span>
            <span class="pb-stat"><span class="pbs-lbl">Volume</span><span class="pbs-val">${{ fmtVol(store.selectedPair.volume24h) }}</span></span>
          </div>
        </div>

        <!-- Candle Chart -->
        <div class="chart-section">
          <div class="tf-tabs">
            <button v-for="tf in timeframes" :key="tf" class="tf-tab" :class="{ active: store.selectedTimeframe === tf }" @click="store.selectedTimeframe = tf; store.regenerateCandles()">{{ tf }}</button>
          </div>
          <div class="candle-chart">
            <svg viewBox="0 0 800 220" class="candle-svg" preserveAspectRatio="none">
              <!-- Grid -->
              <line v-for="i in 3" :key="'gl'+i" x1="0" :y1="55*i" x2="800" :y2="55*i" stroke="#2B3139" stroke-width="0.5"/>
              <line v-for="i in 7" :key="'gv'+i" :x1="100*i" y1="0" :x2="100*i" y2="220" stroke="#2B3139" stroke-width="0.5"/>
              <!-- Candles -->
              <g v-for="(c, idx) in visibleCandles" :key="c.time">
                <!-- Wick -->
                <line
                  :x1="candleX(idx)" :y1="priceToY(c.high)"
                  :x2="candleX(idx)" :y2="priceToY(c.low)"
                  :stroke="c.close >= c.open ? '#0ECB81' : '#F6465D'"
                  stroke-width="1.5"
                />
                <!-- Body -->
                <rect
                  :x="candleX(idx) - candleW/2"
                  :y="priceToY(Math.max(c.open, c.close))"
                  :width="candleW"
                  :height="Math.max(1, Math.abs(priceToY(c.close) - priceToY(c.open)))"
                  :fill="c.close >= c.open ? '#0ECB81' : '#F6465D'"
                />
              </g>
            </svg>
            <!-- Volume bars -->
            <div class="volume-bars">
              <svg viewBox="0 0 800 40" class="vol-svg" preserveAspectRatio="none">
                <rect v-for="(c, idx) in visibleCandles" :key="c.time"
                  :x="candleX(idx) - candleW/2" y="0"
                  :width="candleW"
                  :height="Math.min(40, (c.volume / maxVol) * 40)"
                  :fill="c.close >= c.open ? 'rgba(14,203,129,0.3)' : 'rgba(246,70,93,0.3)'"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Bottom: Order Book + Market Trades + Order Form -->
        <div class="bottom-panel">
          <!-- Order Book -->
          <div class="orderbook-panel">
            <div class="ob-header">Order Book</div>
            <div class="ob-col-hdr"><span>Price (USDT)</span><span class="r">Qty</span><span class="r">Total</span></div>
            <div class="ob-asks">
              <div v-for="(ask, i) in store.orderBookAsks" :key="i" class="ob-row ask-row">
                <span class="ob-price down num-mono">{{ fmtPrice(ask.price) }}</span>
                <span class="ob-qty num-mono r">{{ ask.quantity.toFixed(4) }}</span>
                <span class="ob-total num-mono r">{{ fmtPrice(ask.total) }}</span>
                <div class="ob-depth depth-ask" :style="{ width: depthPct(i, 'ask') + '%' }"></div>
              </div>
            </div>
            <div class="ob-spread">
              <span class="spread-price num-mono">{{ fmtPrice(store.selectedPair.price) }}</span>
              <span class="spread-diff">Spread: {{ spreadPct }}%</span>
            </div>
            <div class="ob-bids">
              <div v-for="(bid, i) in store.orderBookBids" :key="i" class="ob-row bid-row">
                <span class="ob-price up num-mono">{{ fmtPrice(bid.price) }}</span>
                <span class="ob-qty num-mono r">{{ bid.quantity.toFixed(4) }}</span>
                <span class="ob-total num-mono r">{{ fmtPrice(bid.total) }}</span>
                <div class="ob-depth depth-bid" :style="{ width: depthPct(i, 'bid') + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Market Trades -->
          <div class="trades-panel">
            <div class="ob-header">Market Trades</div>
            <div class="ob-col-hdr"><span>Time</span><span class="r">Price</span><span class="r">Qty</span></div>
            <div class="trades-list">
              <div v-for="trade in store.marketTrades" :key="trade.id" class="trade-row">
                <span class="trade-time">{{ trade.time }}</span>
                <span class="trade-price num-mono" :class="trade.side === 'buy' ? 'up' : 'down'">{{ fmtPrice(trade.price) }}</span>
                <span class="trade-qty num-mono r">{{ trade.quantity.toFixed(4) }}</span>
              </div>
            </div>
          </div>

          <!-- Order Form -->
          <div class="order-form-panel">
            <div class="of-tabs">
              <button class="of-tab" :class="{ active: store.orderSide === 'buy' }" @click="store.orderSide = 'buy'">Buy</button>
              <button class="of-tab" :class="{ active: store.orderSide === 'sell' }" @click="store.orderSide = 'sell'">Sell</button>
            </div>
            <div class="of-body">
              <div class="of-row"><span class="of-lbl">Price</span><div class="of-iwrap"><input type="number" v-model.number="orderPrice" class="of-input num-mono" step="any" /><span class="of-suf">USDT</span></div></div>
              <div class="of-row"><span class="of-lbl">Amount</span><div class="of-iwrap"><input type="number" v-model.number="orderQty" class="of-input num-mono" step="any" /><span class="of-suf">{{ store.selectedPair.baseAsset }}</span></div></div>
              <div class="of-row"><span class="of-lbl">Total</span><div class="of-iwrap"><input type="number" :value="orderPrice * orderQty || 0" class="of-input num-mono" readonly /><span class="of-suf">USDT</span></div></div>
              <button class="of-submit" :class="store.orderSide === 'buy' ? 'sub-buy' : 'sub-sell'" @click="placeOrder">{{ store.orderSide === 'buy' ? 'Buy' : 'Sell' }} {{ store.selectedPair.baseAsset }}</button>
              <!-- Quick edit prices -->
              <div class="of-quick">
                <span class="of-qlbl">Set Price</span>
                <button class="of-qbtn" @click="quickChange(0.5)">+0.5%</button>
                <button class="of-qbtn" @click="quickChange(-0.5)">-0.5%</button>
                <button class="of-qbtn" @click="quickChange(1)">+1%</button>
                <button class="of-qbtn" @click="quickChange(-1)">-1%</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Loading state -->
      <main class="col-center" v-else>
        <div class="no-pair"><p>Select a trading pair</p></div>
      </main>

      <!-- ─── RIGHT: Portfolio ─── -->
      <aside class="col-right">
        <div class="pnl-hero" :class="store.totalPnl >= 0 ? 'pnl-up' : 'pnl-down'">
          <div class="pnl-hero-lbl"><span class="live-dot" :class="{ active: store.liveMode }"></span> P&L</div>
          <div class="pnl-hero-val num-mono" :key="'pnl-' + Math.round(store.totalPnl * 100)">
            {{ store.totalPnl >= 0 ? '+' : '' }}${{ fmtPrice(Math.abs(store.totalPnl)) }}
          </div>
          <div class="pnl-hero-pct">{{ store.totalPnlPercent >= 0 ? '+' : '' }}{{ store.totalPnlPercent.toFixed(2) }}%</div>
          <div class="pnl-hero-port">${{ fmtPrice(store.totalPortfolioValue) }}</div>
        </div>

        <div class="section"><div class="section-hdr">Balances</div>
          <div v-for="bal in store.balances" :key="bal.asset" class="bal-row">
            <div class="bal-l"><span class="bal-a">{{ bal.asset }}</span><span class="bal-q num-mono">{{ fmtBal(bal.free + bal.locked) }}</span></div>
            <div class="bal-r"><span class="bal-v num-mono">${{ fmtPrice(bal.usdtValue) }}</span><span class="bal-p num-mono" :class="bal.pnl >= 0 ? 'up' : 'down'">{{ bal.pnlPercent.toFixed(2) }}%</span></div>
          </div>
        </div>

        <div class="section" v-if="store.orders.length > 0"><div class="section-hdr">Orders</div>
          <div v-for="ord in store.orders.slice(0, 4)" :key="ord.id" class="ord-item">
            <div class="oi-top"><span class="oi-side" :class="ord.side">{{ ord.side.toUpperCase() }}</span><span class="oi-sym">{{ ord.symbol }}</span><span class="oi-status" :class="ord.status">{{ ord.status }}</span></div>
            <div class="oi-bot num-mono">{{ ord.quantity.toFixed(4) }} @ ${{ fmtPrice(ord.price) }}</div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCryptoStore } from '../stores/cryptoStore'

const router = useRouter()
const store = useCryptoStore()
const orderPrice = ref(0)
const orderQty = ref(0)

watch(() => store.selectedPair?.price, (p) => { if (p) orderPrice.value = p }, { immediate: true })

const tabs = [
  { key: 'all' as const, label: 'All' },
  { key: 'favorites' as const, label: 'Favorites' },
  { key: 'gainers' as const, label: 'Gainers' },
  { key: 'losers' as const, label: 'Losers' },
]

const timeframes = ['1m', '5m', '15m', '1h', '4h'] as const

// Candlestick rendering
const visibleCandles = computed(() => store.candles.slice(-60))
const candleW = computed(() => Math.max(2, 800 / visibleCandles.value.length - 1))

const maxVol = computed(() => {
  if (visibleCandles.value.length === 0) return 100
  return Math.max(...visibleCandles.value.map(c => c.volume), 1)
})

function candleX(idx: number): number {
  const total = visibleCandles.value.length
  if (total <= 1) return 400
  return (idx / (total - 1)) * 800
}

function priceToY(price: number): number {
  if (visibleCandles.value.length === 0) return 110
  const high = Math.max(...visibleCandles.value.map(c => c.high))
  const low = Math.min(...visibleCandles.value.map(c => c.low))
  const range = high - low || 1
  return 200 - ((price - low) / range) * 180
}

// Order book depth
const maxAskTotal = computed(() => Math.max(...store.orderBookAsks.map(a => a.total), 1))
const maxBidTotal = computed(() => Math.max(...store.orderBookBids.map(b => b.total), 1))

function depthPct(idx: number, side: 'ask' | 'bid'): number {
  const arr = side === 'ask' ? store.orderBookAsks : store.orderBookBids
  const max = side === 'ask' ? maxAskTotal.value : maxBidTotal.value
  return (arr[idx]?.total ?? 0) / max * 100
}

const spreadPct = computed(() => {
  if (store.selectedPair && store.orderBookAsks.length > 0 && store.orderBookBids.length > 0) {
    const ask = store.orderBookAsks[0].price
    const bid = store.orderBookBids[0].price
    return ((ask - bid) / bid * 100).toFixed(3)
  }
  return '0.000'
})

function flashClass(pairId: string): string {
  const dir = store.flashMap[pairId]
  return dir === 'up' ? 'flash-green' : dir === 'down' ? 'flash-red' : ''
}

const selectedFlash = computed(() => {
  if (!store.selectedPair) return ''
  return flashClass(store.selectedPair.id)
})

function fmtPrice(v: number): string {
  if (v >= 1000) return v.toLocaleString('en-US', { minFraction: 2, maxFraction: 2 })
  if (v >= 1) return v.toLocaleString('en-US', { minFraction: 2, maxFraction: 4 })
  return v.toLocaleString('en-US', { minFraction: 4, maxFraction: 6 })
}
function fmtVol(v: number): string {
  if (v >= 1e9) return (v / 1e9).toFixed(2) + 'B'
  if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M'
  return v >= 1e3 ? (v / 1e3).toFixed(2) + 'K' : v.toFixed(2)
}
function fmtBal(v: number): string {
  return v >= 1 ? v.toFixed(4) : v.toFixed(6)
}

function quickChange(pct: number) {
  if (store.selectedPair) store.updatePriceChange(store.selectedPair.id, pct)
}

function placeOrder() {
  if (!store.selectedPair || orderPrice.value <= 0 || orderQty.value <= 0) return
  store.placeOrder(store.selectedPair.symbol, store.orderSide, 'limit', orderPrice.value, orderQty.value)
  orderQty.value = 0
}

function handleLogout() {
  store.logout()
  router.replace('/login')
}
</script>

<style scoped>
.dash { height: 100vh; display: flex; flex-direction: column; background: #0B0E11; overflow: hidden; }
/* ─── NAV ─── */
.top-nav { height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: #1E2329; border-bottom: 1px solid #2B3139; flex-shrink: 0; z-index: 10; }
.nav-left { display: flex; align-items: center; gap: 24px; }
.nav-brand { display: flex; align-items: center; gap: 8px; cursor: pointer; text-decoration: none; }
.nav-logo { width: 24px; height: 24px; }
.nav-brand-text { font-size: 16px; font-weight: 800; color: #FFF; letter-spacing: -0.3px; }
.nav-links { display: flex; gap: 2px; }
.nav-link { padding: 6px 12px; font-size: 13px; font-weight: 500; color: #848E9C; cursor: pointer; border-radius: 4px; transition: all 0.15s; }
.nav-link:hover { color: #EAECEF; background: #2B3139; }
.nav-link.active { color: #FFF; }
.nav-right { display: flex; align-items: center; gap: 8px; }
.nav-live-btn { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border: 1px solid #474D57; border-radius: 4px; background: transparent; cursor: pointer; transition: all 0.2s; }
.nav-live-btn.active { border-color: #0ECB81; }
.live-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #5E6673; }
.live-dot.active { background: #0ECB81; animation: pulseDot 1.5s ease-in-out infinite; }
@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
.live-text { font-size: 10px; font-weight: 700; color: #5E6673; letter-spacing: .08em; }
.nav-live-btn.active .live-text { color: #0ECB81; }
.nav-btn { display: flex; align-items: center; gap: 4px; padding: 6px 10px; background: #2B3139; border: 1px solid #474D57; color: #848E9C; font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; border-radius: 4px; transition: all .15s; }
.nav-btn:hover { border-color: #F0B90B; color: #F0B90B; }
.nav-user { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background .15s; }
.nav-user:hover { background: #2B3139; }
.nav-avatar { width: 28px; height: 28px; border-radius: 4px; background: #F0B90B; color: #0B0E11; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.nav-username { font-size: 13px; color: #EAECEF; font-weight: 500; }

/* ─── TICKER ─── */
.ticker { height: 40px; background: #181A20; border-bottom: 1px solid #2B3139; flex-shrink: 0; }
.ticker-marquee { overflow: hidden; white-space: nowrap; mask-image: linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%); }
.ticker-marquee-content { display: inline-flex; animation: marquee 45s linear infinite; will-change: transform; }
.ticker-marquee-content:hover { animation-play-state: paused; }
@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.ticker-item { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; cursor: pointer; flex-shrink: 0; border-right: 1px solid #2B3139; transition: background .1s; }
.ticker-item:hover { background: #2B3139; }
.ticker-item.active { background: rgba(240,185,11,.08); }
.ticker-sym { font-size: 12px; font-weight: 600; color: #EAECEF; }
.ticker-q { color: #5E6673; font-weight: 400; }
.ticker-price { font-size: 12px; font-weight: 500; }
.ticker-chg { font-size: 11px; font-weight: 500; }
.up { color: #0ECB81; }
.down { color: #F6465D; }

/* ─── FLASH ─── */
.flash-green { animation: flashGreen .6s ease-out; }
.flash-red { animation: flashRed .6s ease-out; }
@keyframes flashGreen { 0%{background:rgba(14,203,129,.3)} 100%{background:transparent} }
@keyframes flashRed { 0%{background:rgba(246,70,93,.3)} 100%{background:transparent} }

/* ─── MAIN 3-COL ─── */
.main { flex: 1; display: grid; grid-template-columns: 260px 1fr 280px; gap: 0; overflow: hidden; min-height: 0; }

/* ─── LEFT ─── */
.col-left { display: flex; flex-direction: column; background: #181A20; border-right: 1px solid #2B3139; overflow: hidden; }
.market-tabs { display: flex; padding: 8px 8px 0; gap: 2px; }
.market-tab { padding: 4px 8px; border: none; background: transparent; color: #5E6673; font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer; border-radius: 4px; transition: all .15s; }
.market-tab:hover { color: #848E9C; }
.market-tab.active { color: #F0B90B; background: rgba(240,185,11,.08); }
.market-search { display: flex; align-items: center; gap: 6px; margin: 8px; padding: 6px 8px; background: #2B3139; border: 1px solid #474D57; border-radius: 4px; }
.search-icon { color: #5E6673; flex-shrink: 0; }
.market-search-input { flex: 1; background: none; border: none; outline: none; color: #EAECEF; font-size: 12px; font-family: inherit; }
.market-search-input::placeholder { color: #5E6673; }
.pair-hdr { display: flex; justify-content: space-between; padding: 4px 12px; font-size: 10px; color: #5E6673; text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid #2B3139; }
.pair-list { flex: 1; overflow-y: auto; }
.pair-row { display: grid; grid-template-columns: 1fr auto 60px; gap: 4px; padding: 6px 12px; cursor: pointer; align-items: center; border-bottom: 1px solid #2B3139; transition: background .1s; }
.pair-row:hover { background: #2B3139; }
.pair-row.selected { background: rgba(240,185,11,.06); }
.pr-info { display: flex; align-items: center; gap: 4px; min-width: 0; }
.pr-fav { background: none; border: none; color: #2B3139; cursor: pointer; padding: 2px; display: flex; transition: color .15s; }
.pr-fav.active { color: #F0B90B; }
.pr-name { font-size: 13px; font-weight: 600; color: #EAECEF; }
.pr-quote { font-size: 10px; color: #5E6673; }
.pr-price { font-size: 12px; font-weight: 500; color: #EAECEF; text-align: right; }
.pr-chg { font-size: 11px; font-weight: 500; text-align: right; }
.pair-empty { padding: 24px; text-align: center; color: #5E6673; font-size: 13px; }
.r { text-align: right; }

/* ─── CENTER ─── */
.col-center { display: flex; flex-direction: column; overflow-y: auto; padding: 8px; gap: 6px; }
.no-pair { display: flex; align-items: center; justify-content: center; height: 100%; color: #5E6673; }

/* Price Bar */
.price-bar { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: #181A20; border: 1px solid #2B3139; border-radius: 4px; flex-shrink: 0; }
.pb-left { display: flex; align-items: center; gap: 12px; }
.pb-symbol { font-size: 18px; font-weight: 700; color: #FFF; }
.pb-price { font-size: 22px; font-weight: 700; }
.pb-chg { font-size: 13px; font-weight: 500; }
.pb-stats { display: flex; gap: 12px; }
.pb-stat { display: flex; flex-direction: column; gap: 1px; }
.pbs-lbl { font-size: 9px; color: #5E6673; text-transform: uppercase; }
.pbs-val { font-size: 11px; font-weight: 600; color: #EAECEF; }

/* Candle Chart */
.chart-section { flex-shrink: 0; }
.tf-tabs { display: flex; gap: 2px; margin-bottom: 4px; }
.tf-tab { padding: 2px 8px; border: none; background: transparent; color: #5E6673; font-size: 11px; font-weight: 500; font-family: inherit; cursor: pointer; border-radius: 3px; transition: all .15s; }
.tf-tab:hover { color: #848E9C; }
.tf-tab.active { color: #F0B90B; background: rgba(240,185,11,.08); }
.candle-chart { background: #181A20; border: 1px solid #2B3139; border-radius: 4px; overflow: hidden; }
.candle-svg { width: 100%; height: 200px; display: block; }
.volume-bars { padding: 0; }
.vol-svg { width: 100%; height: 30px; display: block; }

/* Bottom Panel (Order Book + Trades + Order Form) */
.bottom-panel { display: grid; grid-template-columns: 1fr 1fr 260px; gap: 6px; flex: 1; min-height: 0; }

/* Order Book */
.orderbook-panel { background: #181A20; border: 1px solid #2B3139; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.ob-header { font-size: 12px; font-weight: 600; color: #EAECEF; padding: 6px 8px; border-bottom: 1px solid #2B3139; }
.ob-col-hdr { display: grid; grid-template-columns: 1fr 60px 80px; gap: 4px; padding: 3px 8px; font-size: 9px; color: #5E6673; text-transform: uppercase; letter-spacing: .04em; border-bottom: 1px solid #2B3139; }
.ob-asks, .ob-bids { overflow-y: auto; flex: 1; }
.ob-row { display: grid; grid-template-columns: 1fr 60px 80px; gap: 4px; padding: 2px 8px; font-size: 11px; position: relative; }
.ob-price { font-weight: 500; z-index: 1; }
.ob-qty, .ob-total { z-index: 1; }
.ob-depth { position: absolute; right: 0; top: 0; bottom: 0; opacity: 0.15; z-index: 0; border-radius: 2px; }
.depth-ask { background: #F6465D; }
.depth-bid { background: #0ECB81; }
.ob-spread { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: #1E2329; border-top: 1px solid #2B3139; border-bottom: 1px solid #2B3139; }
.spread-price { font-size: 14px; font-weight: 700; color: #F0B90B; }
.spread-diff { font-size: 10px; color: #5E6673; }

/* Market Trades */
.trades-panel { background: #181A20; border: 1px solid #2B3139; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.trades-list { flex: 1; overflow-y: auto; }
.trade-row { display: grid; grid-template-columns: 60px 1fr 60px; gap: 4px; padding: 2px 8px; font-size: 11px; }
.trade-time { color: #5E6673; }
.trade-price { font-weight: 500; }
.trade-qty { color: #848E9C; }

/* Order Form */
.order-form-panel { background: #181A20; border: 1px solid #2B3139; border-radius: 4px; display: flex; flex-direction: column; overflow: hidden; }
.of-tabs { display: flex; }
.of-tab { flex: 1; padding: 6px; border: none; background: transparent; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; text-transform: uppercase; letter-spacing: .03em; transition: all .15s; color: #5E6673; }
.of-tab.active:first-child { color: #0ECB81; box-shadow: inset 0 -2px 0 #0ECB81; }
.of-tab.active:last-child { color: #F6465D; box-shadow: inset 0 -2px 0 #F6465D; }
.of-body { padding: 8px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.of-row { display: flex; align-items: center; justify-content: space-between; }
.of-lbl { font-size: 11px; color: #848E9C; flex-shrink: 0; }
.of-iwrap { display: flex; align-items: center; background: #2B3139; border: 1px solid #474D57; border-radius: 3px; padding: 0 6px; width: 150px; }
.of-input { flex: 1; background: none; border: none; outline: none; color: #EAECEF; font-size: 12px; padding: 5px 4px; font-family: var(--font-mono); text-align: right; }
.of-input[readonly] { opacity: .5; }
.of-suf { font-size: 10px; color: #5E6673; flex-shrink: 0; }
.of-submit { width: 100%; padding: 8px; border: none; border-radius: 3px; font-size: 13px; font-weight: 700; font-family: inherit; cursor: pointer; text-transform: uppercase; letter-spacing: .02em; transition: filter .15s; }
.sub-buy { background: #0ECB81; color: #0B0E11; }
.sub-sell { background: #F6465D; color: #FFF; }
.of-quick { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: auto; }
.of-qlbl { font-size: 9px; color: #5E6673; text-transform: uppercase; width: 100%; }
.of-qbtn { padding: 3px 6px; border: 1px solid #474D57; background: #2B3139; color: #848E9C; font-size: 10px; font-weight: 500; font-family: inherit; cursor: pointer; border-radius: 3px; transition: all .15s; }
.of-qbtn:hover { border-color: #F0B90B; color: #F0B90B; }

/* ─── RIGHT ─── */
.col-right { display: flex; flex-direction: column; gap: 8px; background: #181A20; border-left: 1px solid #2B3139; overflow-y: auto; padding: 8px; }
.pnl-hero { background: #1E2329; border: 1px solid #2B3139; border-radius: 4px; padding: 14px; text-align: center; }
.pnl-up { border-color: rgba(14,203,129,.3); background: rgba(14,203,129,.05); }
.pnl-down { border-color: rgba(246,70,93,.3); background: rgba(246,70,93,.05); }
.pnl-hero-lbl { font-size: 10px; color: #5E6673; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; gap: 6px; }
.pnl-hero-val { font-size: 24px; font-weight: 800; line-height: 1.2; }
.pnl-up .pnl-hero-val { color: #0ECB81; }
.pnl-down .pnl-hero-val { color: #F6465D; }
.pnl-hero-pct { font-size: 13px; font-weight: 600; margin-top: 2px; }
.pnl-hero-port { font-size: 12px; color: #848E9C; margin-top: 6px; }
.section-hdr { font-size: 11px; color: #848E9C; text-transform: uppercase; letter-spacing: .05em; font-weight: 600; padding: 8px 4px 4px; }
.bal-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-radius: 4px; transition: background .1s; }
.bal-row:hover { background: #2B3139; }
.bal-l { display: flex; flex-direction: column; gap: 1px; }
.bal-a { font-size: 13px; font-weight: 600; color: #EAECEF; }
.bal-q { font-size: 10px; color: #5E6673; }
.bal-r { text-align: right; display: flex; flex-direction: column; gap: 1px; }
.bal-v { font-size: 12px; font-weight: 500; color: #EAECEF; }
.bal-p { font-size: 10px; font-weight: 500; }
.ord-item { padding: 5px 8px; background: #1E2329; border: 1px solid #2B3139; border-radius: 4px; margin-bottom: 4px; }
.oi-top { display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.oi-side { font-size: 9px; font-weight: 700; padding: 1px 4px; border-radius: 2px; }
.oi-side.buy { background: rgba(14,203,129,.15); color: #0ECB81; }
.oi-side.sell { background: rgba(246,70,93,.15); color: #F6465D; }
.oi-sym { font-size: 12px; font-weight: 600; color: #EAECEF; }
.oi-status { margin-left: auto; font-size: 9px; font-weight: 500; padding: 1px 4px; border-radius: 2px; }
.oi-status.filled { background: rgba(14,203,129,.15); color: #0ECB81; }
.oi-status.open { background: rgba(240,185,11,.1); color: #F0B90B; }
.oi-status.cancelled { background: rgba(255,255,255,.05); color: #5E6673; }
.oi-bot { font-size: 10px; color: #848E9C; }

@media (max-width: 1200px) { .main { grid-template-columns: 220px 1fr; } .col-right { display: none; } }
@media (max-width: 768px) { .main { grid-template-columns: 1fr; } .col-left { display: none; } .bottom-panel { grid-template-columns: 1fr; } .nav-username { display: none; } }
</style>
