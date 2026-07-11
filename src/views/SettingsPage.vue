<template>
  <div class="settings-page">
    <!-- Nav -->
    <header class="set-nav">
      <div class="set-nav-left">
        <button class="set-back" @click="router.push('/dashboard')">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
        <h1 class="set-title">Settings</h1>
      </div>
      <div class="set-nav-right">
        <button class="set-logout" @click="handleLogout">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          Sign Out
        </button>
      </div>
    </header>

    <div class="set-body">
      <div class="set-wrap">
        <!-- ═══ P&L FLEX CARD ═══ -->
        <div class="set-card">
          <div class="flex-hero" :class="store.totalPnl >= 0 ? 'flex-up' : 'flex-down'">
            <div class="flex-main">
              <span class="flex-lbl">
                <span class="live-dot-settings" :class="{ active: store.liveMode }"></span>
                TOTAL PROFIT / LOSS
              </span>
              <span class="flex-val num-mono count-anim" :key="'spnl-' + Math.round(store.totalPnl * 100)">{{ store.totalPnl >= 0 ? '+' : '' }}${{ fmtPrice(Math.abs(store.totalPnl)) }}</span>
              <span class="flex-pct num-mono">{{ store.totalPnlPercent >= 0 ? '+' : '' }}{{ store.totalPnlPercent.toFixed(2) }}%</span>
            </div>
            <div class="flex-side">
              <span class="flex-port">Portfolio: ${{ fmtPrice(store.totalPortfolioValue) }}</span>
            </div>
          </div>
        </div>

        <!-- ═══ PRICE EDITOR ═══ -->
        <div class="set-card">
          <div class="set-card-hdr">
            <div>
              <h2 class="set-card-title">Crypto Prices</h2>
              <p class="set-card-desc">Edit any price — changes update everywhere instantly</p>
            </div>
            <div class="set-card-actions">
              <button class="sbtn sbtn-yellow" @click="showBulk = !showBulk">
                <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM1 10.5A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z"/></svg>
                Bulk
              </button>
              <button class="sbtn sbtn-outline" @click="store.randomizePrices()">
                <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/></svg>
                Randomize
              </button>
            </div>
          </div>

          <!-- Bulk shift -->
          <transition name="slide">
            <div v-if="showBulk" class="bulk-bar">
              <span class="bulk-lbl">Apply to all pairs:</span>
              <input type="number" v-model.number="bulkPct" class="bulk-input" step="0.1" />
              <span class="bulk-unit">%</span>
              <button class="sbtn sbtn-green" @click="store.applyMarketShift(bulkPct)">+{{ bulkPct }}%</button>
              <button class="sbtn sbtn-red" @click="store.applyMarketShift(-bulkPct)">-{{ bulkPct }}%</button>
            </div>
          </transition>

          <!-- Price table -->
          <table class="ptable">
            <thead>
              <tr>
                <th class="pts-n">Asset</th>
                <th class="pts-p">Price (USDT)</th>
                <th class="pts-c">24h %</th>
                <th class="pts-h">High</th>
                <th class="pts-l">Low</th>
                <th class="pts-a"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pair in store.cryptoPairs" :key="pair.id" class="ptr">
                <td class="pts-n">
                  <button class="pfav" :class="{ active: pair.isFavorite }" @click="store.toggleFavorite(pair.id)">★</button>
                  <span class="pan">{{ pair.baseAsset }}</span>
                  <span class="paq">/USDT</span>
                </td>
                <td class="pts-p">
                  <div class="pe-wrap">
                    <span class="pe-cur">$</span>
                    <input type="number" :value="pair.price" @change="onEditPrice(pair.id, ($event.target as HTMLInputElement).value)" step="any" class="pe-input num-mono" />
                  </div>
                </td>
                <td class="pts-c">
                  <input type="number" :value="pair.priceChangePercent24h.toFixed(2)" @change="onEditChg(pair.id, ($event.target as HTMLInputElement).value)" step="0.1" class="pc-input num-mono" :class="pair.priceChangePercent24h >= 0 ? 'up' : 'down'" />
                  <span class="pc-sym">%</span>
                </td>
                <td class="pts-h num-mono">${{ fmtPrice(pair.high24h) }}</td>
                <td class="pts-l num-mono">${{ fmtPrice(pair.low24h) }}</td>
                <td class="pts-a">
                  <button class="pa-btn" @click="quickEdit(pair.id, 5)">+5%</button>
                  <button class="pa-btn" @click="quickEdit(pair.id, -5)">-5%</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ═══ BALANCES ═══ -->
        <div class="set-card">
          <div class="set-card-hdr">
            <div>
              <h2 class="set-card-title">Balances</h2>
              <p class="set-card-desc">Edit holdings and cost basis</p>
            </div>
          </div>
          <table class="ptable">
            <thead>
              <tr>
                <th class="bt-a">Asset</th>
                <th class="bt-f">Free</th>
                <th class="bt-l">Locked</th>
                <th class="bt-c">Cost Basis</th>
                <th class="bt-v">Value (USDT)</th>
                <th class="bt-p">P&L</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bal in store.balances" :key="bal.asset" class="ptr">
                <td class="bt-a"><span class="pan">{{ bal.asset }}</span></td>
                <td class="bt-f"><input type="number" :value="bal.free" @change="onEditBal(bal.asset, 'free', ($event.target as HTMLInputElement).value)" step="any" class="bi num-mono" /></td>
                <td class="bt-l"><input type="number" :value="bal.locked" @change="onEditBal(bal.asset, 'locked', ($event.target as HTMLInputElement).value)" step="any" class="bi num-mono" /></td>
                <td class="bt-c"><input type="number" :value="bal.costBasis" @change="onEditCost(bal.asset, ($event.target as HTMLInputElement).value)" step="any" class="bi num-mono" /></td>
                <td class="bt-v num-mono">${{ fmtPrice(bal.usdtValue) }}</td>
                <td class="bt-p num-mono" :class="bal.pnl >= 0 ? 'up' : 'down'">{{ bal.pnl >= 0 ? '+' : '' }}{{ bal.pnlPercent.toFixed(2) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ═══ QUICK ACTIONS ═══ -->
        <div class="set-card">
          <div class="set-card-hdr">
            <div>
              <h2 class="set-card-title">Market Moves</h2>
              <p class="set-card-desc">One-click market-wide price shifts</p>
            </div>
          </div>
          <div class="qactions">
            <button class="qa qa-bull" @click="store.applyMarketShift(10)">
              <span class="qa-icon">📈</span> Bull +10%
            </button>
            <button class="qa qa-bear" @click="store.applyMarketShift(-10)">
              <span class="qa-icon">📉</span> Bear -10%
            </button>
            <button class="qa qa-moon" @click="store.applyMarketShift(100)">
              <span class="qa-icon">🚀</span> Moon +100%
            </button>
            <button class="qa qa-crash" @click="store.applyMarketShift(-50)">
              <span class="qa-icon">💥</span> Crash -50%
            </button>
            <button class="qa qa-shuffle" @click="store.randomizePrices()">
              <span class="qa-icon">🎲</span> Randomize
            </button>
            <button class="qa qa-reset" @click="handleReset">
              <span class="qa-icon">🔄</span> Reset All
            </button>
          </div>
        </div>

        <!-- ═══ ACCOUNT ═══ -->
        <div class="set-card">
          <div class="set-card-hdr">
            <div>
              <h2 class="set-card-title">Account</h2>
            </div>
          </div>
          <div class="acct-info">
            <div class="acct-avatar">{{ store.currentUser?.avatar }}</div>
            <div class="acct-details">
              <div class="acct-name">{{ store.currentUser?.name }}</div>
              <div class="acct-cred">Login: <strong>Aromin</strong> / <strong>Password1!</strong></div>
            </div>
          </div>
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
const showBulk = ref(false)
const bulkPct = ref(5)

function fmtPrice(v: number): string {
  if (v >= 1000) return v.toLocaleString('en-US', { minFraction: 2, maxFraction: 2 })
  if (v >= 1) return v.toLocaleString('en-US', { minFraction: 2, maxFraction: 4 })
  return v.toLocaleString('en-US', { minFraction: 4, maxFraction: 6 })
}

function onEditPrice(id: string, val: string) {
  const n = parseFloat(val)
  if (n > 0) store.updatePrice(id, n)
}

function onEditChg(id: string, val: string) {
  const n = parseFloat(val)
  if (!isNaN(n)) store.updatePriceChange(id, n)
}

function quickEdit(id: string, pct: number) {
  store.updatePriceChange(id, pct)
}

function onEditBal(asset: string, field: 'free' | 'locked', val: string) {
  const n = parseFloat(val)
  if (isNaN(n) || n < 0) return
  const bal = store.balances.find(b => b.asset === asset)
  if (bal) {
    if (field === 'free') store.updateBalance(asset, n, bal.locked)
    else store.updateBalance(asset, bal.free, n)
  }
}

function onEditCost(asset: string, val: string) {
  const n = parseFloat(val)
  if (isNaN(n) || n < 0) return
  store.updateBalance(asset, store.balances.find(b => b.asset === asset)?.free ?? 0, undefined, n)
}

function handleReset() {
  if (confirm('Reset all data to defaults?')) store.resetAllData()
}

function handleLogout() {
  store.logout()
  router.replace('/login')
}
</script>

<style scoped>
.settings-page {
  height: 100vh; display: flex; flex-direction: column;
  background: #0B0E11; overflow: hidden;
}

.set-nav {
  height: 56px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; background: #1E2329; border-bottom: 1px solid #2B3139; flex-shrink: 0;
}

.set-nav-left { display: flex; align-items: center; gap: 12px; }

.set-back {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border: 1px solid #474D57;
  background: #2B3139; color: #848E9C; cursor: pointer; border-radius: 4px;
  transition: all 0.15s;
}

.set-back:hover { border-color: #F0B90B; color: #F0B90B; }

.set-title { font-size: 18px; font-weight: 700; color: #FFFFFF; }

.set-nav-right { display: flex; align-items: center; gap: 8px; }

.set-logout {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 12px; border: 1px solid #474D57; background: #2B3139;
  color: #848E9C; font-size: 12px; font-weight: 500; font-family: inherit;
  cursor: pointer; border-radius: 4px; transition: all 0.15s;
}

.set-logout:hover { border-color: #F6465D; color: #F6465D; }

.set-body {
  flex: 1; overflow-y: auto; padding: 20px;
}

.set-wrap {
  max-width: 960px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 16px;
}

.set-card {
  background: #181A20; border: 1px solid #2B3139;
  border-radius: 6px; overflow: hidden;
}

.set-card-hdr {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 16px 20px; border-bottom: 1px solid #2B3139;
}

.set-card-title { font-size: 16px; font-weight: 700; color: #EAECEF; margin-bottom: 2px; }
.set-card-desc { font-size: 12px; color: #5E6673; }

.set-card-actions { display: flex; gap: 6px; }

.sbtn {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 10px; border: none; border-radius: 4px;
  font-size: 11px; font-weight: 600; font-family: inherit; cursor: pointer;
  transition: all 0.15s;
}

.sbtn-yellow { background: #F0B90B; color: #0B0E11; }
.sbtn-yellow:hover { background: #D8A609; }
.sbtn-outline { background: transparent; color: #848E9C; border: 1px solid #474D57; }
.sbtn-outline:hover { border-color: #F0B90B; color: #F0B90B; }
.sbtn-green { background: #0ECB81; color: #0B0E11; }
.sbtn-green:hover { filter: brightness(1.1); }
.sbtn-red { background: #F6465D; color: #FFFFFF; }
.sbtn-red:hover { filter: brightness(1.1); }

/* ── Flex Hero ── */
.flex-hero {
  display: flex; justify-content: space-between; align-items: center;
  padding: 24px 20px;
}

.flex-up { background: linear-gradient(135deg, rgba(14,203,129,0.08), transparent); }
.flex-down { background: linear-gradient(135deg, rgba(246,70,93,0.08), transparent); }

.flex-lbl { font-size: 11px; color: #5E6673; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px; }
.flex-val { font-size: 36px; font-weight: 800; display: block; line-height: 1.1; }
.flex-up .flex-val { color: #0ECB81; }
.flex-down .flex-val { color: #F6465D; }
.flex-pct { font-size: 16px; font-weight: 600; display: block; margin-top: 4px; }
.flex-up .flex-pct { color: #0ECB81; }
.flex-down .flex-pct { color: #F6465D; }
.flex-port { font-size: 13px; color: #848E9C; }

/* ── Bulk ── */
.bulk-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px; background: #1E2329; border-bottom: 1px solid #2B3139;
}

.bulk-lbl { font-size: 12px; color: #848E9C; }
.bulk-input {
  width: 60px; padding: 4px 8px; background: #2B3139;
  border: 1px solid #474D57; border-radius: 4px; color: #EAECEF;
  font-size: 13px; font-family: var(--font-mono); text-align: center; outline: none;
}
.bulk-input:focus { border-color: #F0B90B; }
.bulk-unit { font-size: 11px; color: #5E6673; }

/* ── Price Table ── */
.ptable { width: 100%; border-collapse: collapse; }
.ptable th {
  font-size: 10px; color: #5E6673; text-transform: uppercase;
  letter-spacing: 0.04em; font-weight: 600; padding: 8px 12px;
  text-align: left; border-bottom: 1px solid #2B3139; white-space: nowrap;
}

.ptable td { padding: 6px 12px; border-bottom: 1px solid #2B3139; font-size: 13px; }

.ptr:hover { background: #1E2329; }

.pts-n { display: flex; align-items: center; gap: 4px; }
.pts-p { width: 200px; }
.pts-c { width: 100px; }
.pts-h, .pts-l { width: 100px; }
.pts-a { width: 100px; }

.live-dot-settings { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #5E6673; margin-right: 6px; vertical-align: middle; }
.live-dot-settings.active { background: #0ECB81; animation: pulseDot 1.5s ease-in-out infinite; }
@keyframes pulseDot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }

.pfav { background: none; border: none; color: #2B3139; cursor: pointer; font-size: 12px; padding: 0; }
.pfav.active { color: #F0B90B; }

.pan { font-weight: 600; color: #EAECEF; }
.paq { font-size: 10px; color: #5E6673; }

.pe-wrap { display: flex; align-items: center; gap: 2px; }
.pe-cur { font-size: 11px; color: #5E6673; }

.pe-input, .pc-input {
  width: 100%; padding: 4px 6px; background: transparent;
  border: 1px solid transparent; border-radius: 4px; color: #EAECEF;
  font-size: 13px; font-weight: 500; outline: none;
  font-family: var(--font-mono); transition: border-color 0.15s;
}

.pe-input:focus, .pc-input:focus { border-color: #F0B90B; background: #2B3139; }
.pe-input:hover, .pc-input:hover { border-color: #474D57; }

.pc-input { width: 60px; text-align: right; }
.pc-sym { font-size: 10px; color: #5E6673; }

.pa-btn {
  padding: 2px 6px; border: 1px solid #474D57; background: #2B3139;
  color: #848E9C; font-size: 10px; font-weight: 500; font-family: inherit;
  cursor: pointer; border-radius: 3px; transition: all 0.15s;
}

.pa-btn:hover { border-color: #F0B90B; color: #F0B90B; }

/* Balance table */
.bi {
  width: 100px; padding: 4px 6px; background: transparent;
  border: 1px solid transparent; border-radius: 4px; color: #EAECEF;
  font-size: 13px; outline: none; font-family: var(--font-mono);
  transition: border-color 0.15s;
}

.bi:focus { border-color: #F0B90B; background: #2B3139; }
.bi:hover { border-color: #474D57; }

.up { color: #0ECB81; }
.down { color: #F6465D; }

/* ── Quick Actions ── */
.qactions {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px; padding: 16px 20px;
}

.qa {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 12px; border: 1px solid #2B3139;
  background: #1E2329; color: #EAECEF; font-size: 12px; font-weight: 600;
  font-family: inherit; cursor: pointer; border-radius: 4px;
  transition: all 0.15s;
}

.qa:hover { border-color: #474D57; background: #2B3139; }
.qa-icon { font-size: 16px; }

.qa-bull:hover { border-color: #0ECB81; background: rgba(14,203,129,0.08); }
.qa-bear:hover { border-color: #F6465D; background: rgba(246,70,93,0.08); }
.qa-moon:hover { border-color: #F0B90B; background: rgba(240,185,11,0.08); }
.qa-crash:hover { border-color: #F6465D; background: rgba(246,70,93,0.08); }

/* ── Account ── */
.acct-info {
  display: flex; align-items: center; gap: 16px; padding: 16px 20px;
}

.acct-avatar {
  width: 44px; height: 44px; border-radius: 6px;
  background: #F0B90B; color: #0B0E11;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700;
}

.acct-name { font-size: 15px; font-weight: 700; color: #EAECEF; }
.acct-cred { font-size: 12px; color: #848E9C; margin-top: 4px; }
.acct-cred strong { color: #F0B90B; font-family: var(--font-mono); }

/* ── Transitions ── */
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; max-height: 60px; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; padding: 0 20px; }

@media (max-width: 768px) {
  .set-body { padding: 12px; }
  .flex-val { font-size: 28px; }
  .qactions { grid-template-columns: 1fr 1fr; }
  .pts-h, .pts-l { display: none; }
}
</style>
