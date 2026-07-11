<template>
  <div class="profile-page">
    <!-- ═══ HEADER ═══ -->
    <header class="prof-nav">
      <div class="prof-nav-left">
        <button class="prof-back" @click="router.push('/dashboard')">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
        <h1 class="prof-title">My Portfolio</h1>
      </div>
      <div class="prof-nav-right">
        <button class="prof-logout" @click="handleLogout">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          Sign Out
        </button>
      </div>
    </header>

    <div class="prof-body">
      <div class="prof-content">
        <!-- ═══════ PROFILE CARD ═══════ -->
        <div class="prof-card profile-card">
          <div class="pc-avatar">{{ store.currentUser?.avatar }}</div>
          <div class="pc-info">
            <span class="pc-name">{{ store.currentUser?.name }}</span>
            <span class="pc-cred">
              <span class="pc-label">Login:</span>
              <span class="pc-val">Aromin</span>
              <span class="pc-sep">/</span>
              <span class="pc-val">Password1!</span>
            </span>
          </div>
          <div class="pc-stats">
            <div class="pcs-item">
              <span class="pcs-lbl">Assets</span>
              <span class="pcs-val">{{ store.balances.length }}</span>
            </div>
            <div class="pcs-item">
              <span class="pcs-lbl">Orders</span>
              <span class="pcs-val">{{ store.orders.length }}</span>
            </div>
          </div>
        </div>

        <!-- ═══════ P&L FLEX HERO ═══════ -->
        <div class="prof-card pnl-card" :class="store.totalPnl >= 0 ? 'pnl-up' : 'pnl-down'">
          <div class="pnc-top">
            <span class="pnc-lbl">
              <span class="live-dot" :class="{ active: store.liveMode }"></span>
              TOTAL PROFIT / LOSS
            </span>
            <div class="pnc-quick">
              <button class="q-btn" @click="store.toggleLiveMode()" :class="{ active: store.liveMode }">
                <span class="live-dot" :class="{ active: store.liveMode }"></span>
                {{ store.liveMode ? 'LIVE ON' : 'LIVE OFF' }}
              </button>
            </div>
          </div>
          <div class="pnc-value num-mono" :key="'pnl-' + Math.round(store.totalPnl * 100)">
            {{ store.totalPnl >= 0 ? '+' : '' }}${{ fmtPrice(Math.abs(store.totalPnl)) }}
          </div>
          <div class="pnc-row">
            <span class="pnc-pct">{{ store.totalPnlPercent >= 0 ? '+' : '' }}{{ store.totalPnlPercent.toFixed(2) }}%</span>
            <span class="pnc-port">Portfolio Value: <strong>${{ fmtPrice(store.totalPortfolioValue) }}</strong></span>
          </div>
        </div>

        <!-- ═══════ ASSET EDITOR ═══════ -->
        <div class="prof-card">
          <div class="card-hdr">
            <div>
              <h2 class="card-title">My Assets</h2>
              <p class="card-desc">Edit your holdings — free, locked, and cost basis</p>
            </div>
            <div class="card-actions">
              <button class="sbtn sbtn-yellow" @click="showMarketTools = !showMarketTools">
                <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3z"/></svg>
                Market Tools
              </button>
            </div>
          </div>

          <!-- Market tools panel -->
          <transition name="slide">
            <div v-if="showMarketTools" class="market-tools">
              <div class="mt-row">
                <span class="mt-lbl">Shift all prices:</span>
                <input type="number" v-model.number="bulkPct" class="mt-input" step="0.1" />
                <span class="mt-unit">%</span>
                <button class="sbtn sbtn-green" @click="store.applyMarketShift(bulkPct)">+{{ bulkPct }}%</button>
                <button class="sbtn sbtn-red" @click="store.applyMarketShift(-bulkPct)">-{{ bulkPct }}%</button>
                <button class="sbtn sbtn-outline" @click="store.randomizePrices()">🎲 Randomize</button>
              </div>
              <div class="mt-presets">
                <button class="sbtn pres pres-bull" @click="store.applyMarketShift(10)">🐂 Bull +10%</button>
                <button class="sbtn pres pres-bear" @click="store.applyMarketShift(-10)">🐻 Bear -10%</button>
                <button class="sbtn pres pres-moon" @click="store.applyMarketShift(100)">🚀 Moon +100%</button>
                <button class="sbtn pres pres-crash" @click="store.applyMarketShift(-50)">💥 Crash -50%</button>
              </div>
            </div>
          </transition>

          <!-- Asset table -->
          <table class="atable">
            <thead>
              <tr>
                <th class="at-asset">Asset</th>
                <th class="at-free">Free</th>
                <th class="at-locked">Locked</th>
                <th class="at-cost">Cost Basis</th>
                <th class="at-value">Value (USDT)</th>
                <th class="at-pnl">P&L</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bal in store.balances" :key="bal.asset" class="atr">
                <td class="at-asset">
                  <span class="at-sym">{{ bal.asset }}</span>
                  <span class="at-icon" :class="assetIcon(bal.asset)"></span>
                </td>
                <td class="at-free">
                  <input type="number" :value="bal.free" @change="onEditFree(bal.asset, ($event.target as HTMLInputElement).value)" step="any" class="ai num-mono" />
                </td>
                <td class="at-locked">
                  <input type="number" :value="bal.locked" @change="onEditLocked(bal.asset, ($event.target as HTMLInputElement).value)" step="any" class="ai num-mono" />
                </td>
                <td class="at-cost">
                  <div class="cost-wrap">
                    <span class="cost-cur">$</span>
                    <input type="number" :value="bal.costBasis" @change="onEditCost(bal.asset, ($event.target as HTMLInputElement).value)" step="any" class="ai num-mono" />
                  </div>
                </td>
                <td class="at-value num-mono">${{ fmtPrice(bal.usdtValue) }}</td>
                <td class="at-pnl num-mono" :class="bal.pnl >= 0 ? 'up' : 'down'">
                  <span class="pnl-val">{{ bal.pnl >= 0 ? '+' : '' }}${{ fmtPrice(Math.abs(bal.pnl)) }}</span>
                  <span class="pnl-pct">({{ bal.pnlPercent.toFixed(2) }}%)</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Total row -->
          <div class="asset-total">
            <div class="atot-left">
              <span class="atot-lbl">Total Portfolio</span>
              <span class="atot-val num-mono">${{ fmtPrice(store.totalPortfolioValue) }}</span>
            </div>
            <div class="atot-right" :class="store.totalPnl >= 0 ? 'up' : 'down'">
              <span class="atot-lbl">Total P&L</span>
              <span class="atot-val num-mono">{{ store.totalPnl >= 0 ? '+' : '' }}${{ fmtPrice(Math.abs(store.totalPnl)) }} ({{ store.totalPnlPercent.toFixed(2) }}%)</span>
            </div>
          </div>
        </div>

        <!-- ═══════ QUICK REFERENCE ═══════ -->
        <div class="prof-card">
          <div class="card-hdr">
            <div>
              <h2 class="card-title">Price Reference</h2>
              <p class="card-desc">Current crypto prices — click to edit</p>
            </div>
          </div>
          <table class="atable">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price (USDT)</th>
                <th>24h Change</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pair in store.cryptoPairs.slice(0, 8)" :key="pair.id" class="atr">
                <td>
                  <span class="at-sym">{{ pair.baseAsset }}</span>
                  <span class="at-quote">/USDT</span>
                </td>
                <td>
                  <div class="cost-wrap">
                    <span class="cost-cur">$</span>
                    <input type="number" :value="pair.price" @change="onEditPrice(pair.id, ($event.target as HTMLInputElement).value)" step="any" class="ai-sm num-mono" />
                  </div>
                </td>
                <td class="num-mono" :class="pair.priceChangePercent24h >= 0 ? 'up' : 'down'">
                  {{ pair.priceChangePercent24h >= 0 ? '+' : '' }}{{ pair.priceChangePercent24h.toFixed(2) }}%
                </td>
                <td>
                  <button class="q-btn-sm" @click="quickEdit(pair.id, 5)">+5%</button>
                  <button class="q-btn-sm" @click="quickEdit(pair.id, -5)">-5%</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCryptoStore } from '../stores/cryptoStore'

const router = useRouter()
const store = useCryptoStore()
const showMarketTools = ref(false)
const bulkPct = ref(5)

function fmtPrice(v: number): string {
  if (v >= 1000) return v.toLocaleString('en-US', { minFraction: 2, maxFraction: 2 })
  if (v >= 1) return v.toLocaleString('en-US', { minFraction: 2, maxFraction: 4 })
  return v.toLocaleString('en-US', { minFraction: 4, maxFraction: 6 })
}

function assetIcon(asset: string): string {
  const icons: Record<string, string> = { BTC: '₿', ETH: '⟠', BNB: '◎', SOL: '◎', XRP: '✕', ADA: '🅰', DOGE: 'Ð', DOT: '◉', LINK: '🔗', AVAX: '▲', MATIC: '⬡', UNI: '🦄', LTC: 'Ł', ATOM: '⚛', FIL: '◈', USDT: '₮' }
  return icons[asset] || '●'
}

function onEditFree(asset: string, val: string) {
  const n = parseFloat(val)
  if (isNaN(n) || n < 0) return
  const bal = store.balances.find(b => b.asset === asset)
  if (bal) store.updateBalance(asset, n, bal.locked, bal.costBasis)
}

function onEditLocked(asset: string, val: string) {
  const n = parseFloat(val)
  if (isNaN(n) || n < 0) return
  const bal = store.balances.find(b => b.asset === asset)
  if (bal) store.updateBalance(asset, bal.free, n, bal.costBasis)
}

function onEditCost(asset: string, val: string) {
  const n = parseFloat(val)
  if (isNaN(n) || n < 0) return
  store.updateBalance(asset, store.balances.find(b => b.asset === asset)?.free ?? 0, undefined, n)
}

function onEditPrice(id: string, val: string) {
  const n = parseFloat(val)
  if (n > 0) store.updatePrice(id, n)
}

function quickEdit(id: string, pct: number) {
  store.updatePriceChange(id, pct)
}

function handleLogout() {
  store.logout()
  router.replace('/login')
}
</script>

<style scoped>
.profile-page {
  height: 100vh; display: flex; flex-direction: column;
  background: #0B0E11; overflow: hidden;
}

/* ─── NAV ─── */
.prof-nav {
  height: 56px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; background: #1E2329; border-bottom: 1px solid #2B3139; flex-shrink: 0;
}
.prof-nav-left { display: flex; align-items: center; gap: 12px; }
.prof-back {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border: 1px solid #474D57;
  background: #2B3139; color: #848E9C; cursor: pointer; border-radius: 4px; transition: all .15s;
}
.prof-back:hover { border-color: #F0B90B; color: #F0B90B; }
.prof-title { font-size: 18px; font-weight: 700; color: #FFF; }
.prof-nav-right { display: flex; align-items: center; gap: 8px; }
.prof-logout {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 12px; border: 1px solid #474D57; background: #2B3139;
  color: #848E9C; font-size: 12px; font-weight: 500; font-family: inherit;
  cursor: pointer; border-radius: 4px; transition: all .15s;
}
.prof-logout:hover { border-color: #F6465D; color: #F6465D; }

/* ─── BODY ─── */
.prof-body { flex: 1; overflow-y: auto; padding: 20px; }
.prof-content { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }

/* ─── CARDS ─── */
.prof-card {
  background: #181A20; border: 1px solid #2B3139;
  border-radius: 6px; overflow: hidden;
}

/* ─── PROFILE CARD ─── */
.profile-card {
  display: flex; align-items: center; gap: 16px; padding: 20px;
}
.pc-avatar {
  width: 52px; height: 52px; border-radius: 8px;
  background: #F0B90B; color: #0B0E11;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; flex-shrink: 0;
}
.pc-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.pc-name { font-size: 17px; font-weight: 700; color: #EAECEF; }
.pc-cred { font-size: 12px; color: #5E6673; }
.pc-label { color: #5E6673; }
.pc-val { color: #F0B90B; font-family: var(--font-mono); font-weight: 600; }
.pc-sep { color: #2B3139; margin: 0 4px; }
.pc-stats { display: flex; gap: 20px; }
.pcs-item { text-align: center; }
.pcs-lbl { display: block; font-size: 10px; color: #5E6673; text-transform: uppercase; letter-spacing: .04em; }
.pcs-val { font-size: 18px; font-weight: 700; color: #EAECEF; }

/* ─── P&L HERO ─── */
.pnl-card { padding: 20px; }
.pnl-up { border-color: rgba(14,203,129,.3); background: linear-gradient(135deg, rgba(14,203,129,.06), transparent); }
.pnl-down { border-color: rgba(246,70,93,.3); background: linear-gradient(135deg, rgba(246,70,93,.06), transparent); }
.pnc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.pnc-lbl { font-size: 11px; color: #5E6673; text-transform: uppercase; letter-spacing: .05em; display: flex; align-items: center; gap: 6px; }
.pnc-value { font-size: 36px; font-weight: 800; line-height: 1.1; }
.pnl-up .pnc-value { color: #0ECB81; }
.pnl-down .pnc-value { color: #F6465D; }
.pnc-row { display: flex; align-items: center; gap: 20px; margin-top: 8px; }
.pnc-pct { font-size: 16px; font-weight: 600; }
.pnl-up .pnc-pct { color: #0ECB81; }
.pnl-down .pnc-pct { color: #F6465D; }
.pnc-port { font-size: 13px; color: #848E9C; }
.pnc-port strong { color: #EAECEF; }

/* Live dot */
.live-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #5E6673; }
.live-dot.active { background: #0ECB81; animation: pulseDot 1.5s ease-in-out infinite; }
@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }

.q-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 4px 8px; border: 1px solid #474D57; border-radius: 4px;
  background: transparent; color: #5E6673; font-size: 10px; font-weight: 600;
  font-family: inherit; cursor: pointer; transition: all .15s; letter-spacing: .04em;
}
.q-btn.active { border-color: #0ECB81; color: #0ECB81; }

/* ─── CARD HEADER ─── */
.card-hdr { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 20px; border-bottom: 1px solid #2B3139; }
.card-title { font-size: 16px; font-weight: 700; color: #EAECEF; margin-bottom: 2px; }
.card-desc { font-size: 12px; color: #5E6673; }
.card-actions { display: flex; gap: 6px; }

/* ─── BUTTONS ─── */
.sbtn {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 10px; border: none; border-radius: 4px;
  font-size: 11px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all .15s;
}
.sbtn-yellow { background: #F0B90B; color: #0B0E11; }
.sbtn-yellow:hover { background: #D8A609; }
.sbtn-outline { background: transparent; color: #848E9C; border: 1px solid #474D57; }
.sbtn-outline:hover { border-color: #F0B90B; color: #F0B90B; }
.sbtn-green { background: #0ECB81; color: #0B0E11; }
.sbtn-green:hover { filter: brightness(1.1); }
.sbtn-red { background: #F6465D; color: #FFF; }
.sbtn-red:hover { filter: brightness(1.1); }

/* Market tools */
.market-tools { padding: 12px 20px; background: #1E2329; border-bottom: 1px solid #2B3139; display: flex; flex-direction: column; gap: 8px; }
.mt-row { display: flex; align-items: center; gap: 6px; }
.mt-lbl { font-size: 12px; color: #848E9C; }
.mt-input { width: 60px; padding: 4px 8px; background: #2B3139; border: 1px solid #474D57; border-radius: 4px; color: #EAECEF; font-size: 13px; font-family: var(--font-mono); text-align: center; outline: none; }
.mt-input:focus { border-color: #F0B90B; }
.mt-unit { font-size: 11px; color: #5E6673; }
.mt-presets { display: flex; gap: 6px; }
.pres { border: 1px solid #2B3139; background: #181A20; color: #EAECEF; }
.pres-bull:hover { border-color: #0ECB81; background: rgba(14,203,129,.08); }
.pres-bear:hover { border-color: #F6465D; background: rgba(246,70,93,.08); }
.pres-moon:hover { border-color: #F0B90B; background: rgba(240,185,11,.08); }
.pres-crash:hover { border-color: #F6465D; background: rgba(246,70,93,.08); }

/* ─── ASSET TABLE ─── */
.atable { width: 100%; border-collapse: collapse; }
.atable th {
  font-size: 10px; color: #5E6673; text-transform: uppercase;
  letter-spacing: .04em; font-weight: 600; padding: 8px 12px;
  text-align: left; border-bottom: 1px solid #2B3139; white-space: nowrap;
}
.atable td { padding: 7px 12px; border-bottom: 1px solid #2B3139; font-size: 13px; }
.atr:hover { background: #1E2329; }

.at-asset { display: flex; align-items: center; gap: 8px; }
.at-sym { font-weight: 700; color: #EAECEF; font-size: 14px; }
.at-icon { font-size: 16px; }
.at-quote { font-size: 10px; color: #5E6673; }

.ai {
  width: 100px; padding: 4px 8px; background: transparent;
  border: 1px solid transparent; border-radius: 4px; color: #EAECEF;
  font-size: 13px; outline: none; font-family: var(--font-mono);
  transition: border-color .15s;
}
.ai:focus { border-color: #F0B90B; background: #2B3139; }
.ai:hover { border-color: #474D57; }

.ai-sm {
  width: 120px; padding: 3px 6px; background: transparent;
  border: 1px solid transparent; border-radius: 3px; color: #EAECEF;
  font-size: 13px; outline: none; font-family: var(--font-mono);
  transition: border-color .15s;
}
.ai-sm:focus { border-color: #F0B90B; background: #2B3139; }
.ai-sm:hover { border-color: #474D57; }

.cost-wrap { display: flex; align-items: center; gap: 2px; }
.cost-cur { font-size: 11px; color: #5E6673; }

.at-value { text-align: right; font-weight: 500; color: #EAECEF; }
.at-pnl { text-align: right; }
.pnl-val { display: block; }
.pnl-pct { font-size: 10px; opacity: .7; }

.up { color: #0ECB81; }
.down { color: #F6465D; }

.q-btn-sm {
  padding: 2px 5px; border: 1px solid #474D57; background: #2B3139;
  color: #848E9C; font-size: 9px; font-weight: 500; font-family: inherit;
  cursor: pointer; border-radius: 3px; transition: all .15s;
}
.q-btn-sm:hover { border-color: #F0B90B; color: #F0B90B; }

/* Asset total row */
.asset-total {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 20px; background: #1E2329; border-top: 1px solid #2B3139;
}
.atot-left, .atot-right { display: flex; flex-direction: column; gap: 2px; }
.atot-lbl { font-size: 10px; color: #5E6673; text-transform: uppercase; letter-spacing: .04em; }
.atot-val { font-size: 15px; font-weight: 700; }

/* ─── TRANSITIONS ─── */
.slide-enter-active, .slide-leave-active { transition: all .2s ease; max-height: 120px; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; padding: 0 20px; }

/* ═══════════════════════════════════════════════════════
   MOBILE RESPONSIVE — 320px up to 768px
   ═══════════════════════════════════════════════════════ */

/* Tablet / small laptop */
@media (max-width: 900px) {
  .pc-stats { display: none; }
  .atable { font-size: 12px; }
  .atable th, .atable td { padding: 6px 8px; }
  .ai { width: 80px; }
  .ai-sm { width: 100px; }
  .at-locked, .at-cost { display: none; }
}

/* Phone landscape + small tablet */
@media (max-width: 640px) {
  .prof-body { padding: 10px; }
  .prof-content { gap: 12px; }
  .pnc-value { font-size: 28px; }
  .pnl-card { padding: 14px; }
  .pnc-top { flex-direction: column; align-items: flex-start; gap: 8px; }
  .pnc-row { flex-direction: column; align-items: flex-start; gap: 6px; }

  .profile-card { flex-wrap: wrap; gap: 12px; }
  .pc-avatar { width: 44px; height: 44px; font-size: 16px; }

  .card-hdr { flex-direction: column; gap: 8px; padding: 12px 14px; }
  .card-title { font-size: 15px; }
  .card-desc { font-size: 11px; }

  .atable { display: block; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
  .atable th, .atable td { padding: 5px 6px; font-size: 11px; }
  .atable th:first-child, .atable td:first-child { position: sticky; left: 0; background: #181A20; z-index: 1; }
  .atr:hover td:first-child { background: #1E2329; }

  /* Hide less important columns on mobile */
  .at-locked { display: none; }
  .at-cost { display: none; }

  .ai { width: 70px; padding: 3px 6px; font-size: 12px; }
  .ai-sm { width: 85px; padding: 2px 5px; font-size: 12px; }

  .at-sym { font-size: 13px; }
  .at-icon { display: none; }

  .asset-total { flex-direction: column; gap: 8px; align-items: flex-start; padding: 10px 14px; }
  .atot-val { font-size: 14px; }
  .atot-right { width: 100%; }

  .mt-row { flex-wrap: wrap; }
  .mt-presets { flex-wrap: wrap; }

  .prof-title { font-size: 16px; }
}

/* Small phones */
@media (max-width: 420px) {
  .prof-body { padding: 8px; }
  .prof-content { gap: 10px; }
  .prof-nav { padding: 0 10px; }
  .prof-title { font-size: 14px; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .pnc-value { font-size: 24px; }

  .atable { font-size: 10px; }
  .atable th, .atable td { padding: 4px 4px; }
  .ai { width: 60px; padding: 2px 4px; font-size: 11px; }
  .ai-sm { width: 70px; font-size: 11px; }
  .cost-cur { font-size: 9px; }

  .at-sym { font-size: 12px; }
  .at-free { display: none; }
  .at-value { font-size: 11px; }

  .q-btn-sm { padding: 1px 4px; font-size: 8px; }
  .sbtn { font-size: 10px; padding: 4px 8px; }

  .card-hdr { padding: 10px 12px; }
  .card-title { font-size: 14px; }
  .market-tools { padding: 10px 12px; }
  .mt-input { width: 50px; font-size: 12px; }
  .mt-presets { gap: 4px; }
  .pres { font-size: 10px; padding: 4px 8px; }

  .live-text { font-size: 9px; }
}
</style>
