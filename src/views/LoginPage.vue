<template>
  <div class="login-page">
    <div class="login-grid"></div>
    <div class="login-glow"></div>

    <div class="login-card">
      <!-- Top gold bar -->
      <div class="login-accent"></div>

      <div class="login-body">
        <!-- Logo -->
        <div class="login-brand">
          <svg viewBox="0 0 24 24" fill="none" class="login-logo">
            <circle cx="12" cy="12" r="11" fill="#0B0E11" stroke="#F0B90B" stroke-width="1.5"/>
            <path d="M12 4L7 9l1.5 1.5L12 7l3.5 3.5L17 9l-5-5z" fill="#F0B90B"/>
            <path d="M12 7L7 12l1.5 1.5L12 10l3.5 3.5L17 12l-5-5z" fill="#F0B90B" opacity="0.6"/>
            <path d="M12 10L7 15l1.5 1.5L12 13l3.5 3.5L17 15l-5-5z" fill="#F0B90B" opacity="0.3"/>
          </svg>
          <h1 class="login-title">Binance</h1>
          <p class="login-sub">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Username -->
          <div class="field">
            <label class="field-label">Username</label>
            <div class="field-input-wrap" :class="{ focused: f === 'email' }">
              <input
                v-model="email"
                type="text"
                placeholder="Username"
                class="field-input"
                @focus="f = 'email'"
                @blur="f = ''"
                autocomplete="username"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field">
            <label class="field-label">Password</label>
            <div class="field-input-wrap" :class="{ focused: f === 'pass' }">
              <input
                v-model="password"
                :type="showPass ? 'text' : 'password'"
                placeholder="Password"
                class="field-input"
                @focus="f = 'pass'"
                @blur="f = ''"
                autocomplete="current-password"
              />
              <button type="button" class="field-eye" tabindex="-1" @click="showPass = !showPass">
                <svg v-if="!showPass" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                  <path d="M10 4C5.273 4 1.636 7.147.2 10c1.436 2.853 5.073 6 9.8 6s8.364-3.147 9.8-6C18.364 7.147 14.727 4 10 4z"/><circle cx="10" cy="10" r="2.5"/>
                </svg>
                <svg v-else viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                  <path d="M10 4C5.273 4 1.636 7.147.2 10c1.436 2.853 5.073 6 9.8 6s8.364-3.147 9.8-6C18.364 7.147 14.727 4 10 4z"/><circle cx="10" cy="10" r="2.5"/><line x1="3" y1="3" x2="17" y2="17" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          <transition name="fade">
            <p v-if="error" class="login-error">{{ error }}</p>
          </transition>

          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="!loading">Sign In</span>
            <span v-else class="login-spinner"></span>
          </button>
        </form>

        <div class="login-footer">
          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12" class="lock-icon">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
          </svg>
          <span>Secure connection</span>
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
const email = ref('Aromin')
const password = ref('Password1!')
const error = ref('')
const loading = ref(false)
const f = ref('')
const showPass = ref(false)

async function handleLogin() {
  error.value = ''; loading.value = true
  await new Promise(r => setTimeout(r, 500))
  if (store.login(email.value, password.value)) {
    await router.replace('/dashboard')
  } else {
    error.value = 'Invalid username or password.'
  }
  loading.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0B0E11;
  position: relative;
  overflow: hidden;
}

.login-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(240,185,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,185,11,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 35%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 35%, transparent 70%);
}

.login-glow {
  position: absolute; width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(240,185,11,0.05) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
}

.login-card {
  position: relative; width: 400px; max-width: 92vw;
  background: #181A20; border: 1px solid #2B3139;
  border-radius: 8px; overflow: hidden;
  animation: slideUp 0.4s ease-out;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-accent {
  height: 2px;
  background: linear-gradient(90deg, transparent, #F0B90B, #F0B90B, transparent);
}

.login-body { padding: 32px; }

.login-brand { text-align: center; margin-bottom: 28px; }

.login-logo {
  width: 48px; height: 48px; margin-bottom: 12px;
  filter: drop-shadow(0 2px 8px rgba(240,185,11,0.2));
}

.login-title {
  font-size: 24px; font-weight: 800; color: #FFFFFF;
  letter-spacing: -0.5px; margin-bottom: 4px;
}

.login-sub { font-size: 13px; color: #848E9C; }

.login-form { display: flex; flex-direction: column; gap: 16px; }

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 12px; font-weight: 600; color: #848E9C;
  text-transform: uppercase; letter-spacing: 0.04em;
}

.field-input-wrap {
  display: flex; align-items: center;
  background: #2B3139; border: 1px solid #474D57;
  border-radius: 4px; padding: 0 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input-wrap:hover { border-color: #5E6673; }
.field-input-wrap.focused { border-color: #F0B90B; box-shadow: 0 0 0 3px rgba(240,185,11,0.1); }

.field-input {
  flex: 1; background: none; border: none; outline: none;
  color: #FFFFFF; font-size: 14px; padding: 12px 0; font-family: inherit;
}

.field-input::placeholder { color: #5E6673; }

.field-eye {
  background: none; border: none; color: #5E6673; cursor: pointer;
  padding: 4px; display: flex; transition: color 0.2s;
}
.field-eye:hover { color: #848E9C; }
.field-input-wrap.focused .field-eye { color: #F0B90B; }

.login-error {
  color: #F6465D; font-size: 13px; text-align: center;
  background: rgba(246,70,93,0.1); border: 1px solid rgba(246,70,93,0.2);
  border-radius: 4px; padding: 8px 12px;
}

.login-btn {
  width: 100%; padding: 12px;
  background: #F0B90B; border: none; border-radius: 4px;
  color: #0B0E11; font-size: 14px; font-weight: 700;
  font-family: inherit; cursor: pointer; height: 44px;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) { background: #D8A609; }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.login-spinner {
  width: 20px; height: 20px; border: 2px solid rgba(11,14,17,0.2);
  border-top-color: #0B0E11; border-radius: 50%;
  animation: spin 0.6s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

.login-footer {
  display: flex; align-items: center; justify-content: center;
  gap: 6px; margin-top: 16px; color: #5E6673; font-size: 11px;
}
.lock-icon { opacity: 0.4; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .login-body { padding: 24px 20px; }
}
</style>
