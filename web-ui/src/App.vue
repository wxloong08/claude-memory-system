<template>
  <div class="memory-shell lg:flex">
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click="mobileMenuOpen = false"
    ></div>

    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-[17.5rem] transform transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0 lg:flex lg:w-[17.5rem] xl:w-[18.5rem]',
        mobileMenuOpen ? 'translate-x-0 flex' : '-translate-x-full hidden lg:flex'
      ]"
      class="bg-[#f8f5f0] p-4 xl:p-5"
    >
      <div class="memory-nav-panel flex min-h-[calc(100vh-2rem)] w-full flex-col rounded-[28px] px-4 py-5">
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="mr-auto flex h-8 w-8 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 lg:hidden"
              aria-label="Close menu"
              @click="mobileMenuOpen = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-xs font-semibold tracking-[0.24em] text-stone-50">
              CM
            </div>
            <div class="min-w-0">
              <div class="text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400">{{ t('appName') }}</div>
              <h1 class="mt-1 text-[1.2rem] font-semibold tracking-tight text-stone-900">{{ t('appTitle') }}</h1>
            </div>
          </div>
          <p class="mt-4 text-sm leading-6 text-stone-600">
            {{ t('appDescription') }}
          </p>
        </div>

        <div class="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400">{{ t('browse') }}</div>
        <nav role="navigation" class="space-y-1.5">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :aria-label="item.label"
            :class="[
              'group flex items-center justify-between rounded-2xl px-3.5 py-3 transition-all duration-200',
              isActive(item.path)
                ? 'bg-stone-900 text-stone-50 shadow-lg shadow-stone-900/8'
                : 'text-stone-600 hover:bg-white/78 hover:text-stone-900'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold tracking-[0.2em]">{{ item.icon }}</span>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </div>
            <span
              class="h-2 w-2 rounded-full transition-colors"
              :class="isActive(item.path) ? 'bg-amber-300' : 'bg-stone-300 group-hover:bg-stone-400'"
            ></span>
          </router-link>
        </nav>

        <div class="mt-6 rounded-[24px] bg-white/78 px-4 py-4 text-stone-900 ring-1 ring-stone-200/70">
          <div class="text-[10px] uppercase tracking-[0.2em] text-stone-400">{{ t('language') }}</div>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button
              v-for="option in localeOptions"
              :key="option.value"
              type="button"
              class="rounded-full px-3 py-2 text-sm font-medium transition-colors"
              :class="locale === option.value ? 'bg-stone-900 text-stone-50' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'"
              @click="setLocale(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="mt-auto rounded-[24px] bg-white/78 px-4 py-4 text-stone-900 ring-1 ring-stone-200/70">
          <div class="flex items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="text-[10px] uppercase tracking-[0.2em] text-stone-400">{{ t('backend') }}</div>
              <div class="mt-1 text-sm font-medium">{{ connected ? t('connected') : t('offline') }}</div>
            </div>
            <span
              :class="connected ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-rose-500 shadow-rose-500/30'"
              class="inline-flex h-2.5 w-2.5 rounded-full shadow-md"
            ></span>
          </div>
          <p class="mt-3 text-xs leading-5 text-stone-500">
            {{ t('statusRefreshHint') }}
          </p>
        </div>
      </div>
    </aside>

    <div class="flex-1">
      <header class="px-4 pt-4 lg:hidden">
        <div class="memory-nav-panel rounded-[22px] px-4 py-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100"
                aria-label="Open menu"
                @click="mobileMenuOpen = true"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <div>
                <div class="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">{{ t('appName') }}</div>
                <div class="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{{ t('appTitle') }}</div>
              </div>
            </div>
            <span
              class="memory-badge"
              :class="connected ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
            >
              <span class="inline-block h-2 w-2 rounded-full" :class="connected ? 'bg-emerald-500' : 'bg-rose-500'"></span>
              {{ connected ? t('connected') : t('offline') }}
            </span>
          </div>
          <div class="mt-4 flex gap-2">
            <button
              v-for="option in localeOptions"
              :key="option.value"
              type="button"
              class="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              :class="locale === option.value ? 'bg-stone-900 text-stone-50' : 'bg-white/75 text-stone-700'"
              @click="setLocale(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
          <nav role="navigation" class="mt-4 flex gap-2 overflow-x-auto pb-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :aria-label="item.label"
              :class="[
                'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive(item.path)
                  ? 'bg-stone-900 text-stone-50'
                  : 'bg-white/75 text-stone-700'
              ]"
            >
              {{ item.label }}
            </router-link>
          </nav>
        </div>
      </header>

      <main role="main" class="px-4 pb-8 pt-4 lg:px-6 lg:pb-10 lg:pt-5 xl:px-8">
        <router-view />
      </main>
    </div>

    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2" style="pointer-events: none;">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id"
          style="pointer-events: auto;"
          class="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-300"
          :class="{
            'bg-green-50 text-green-800 ring-1 ring-green-200': toast.type === 'success',
            'bg-red-50 text-red-800 ring-1 ring-red-200': toast.type === 'error',
            'bg-stone-50 text-stone-800 ring-1 ring-stone-200': toast.type === 'info'
          }">
          <span>{{ toast.type === 'success' ? '\u2713' : toast.type === 'error' ? '\u2715' : '\u2139' }}</span>
          <span>{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import api from './api/memory-hub.js'
import { useI18n } from './composables/useI18n.js'
import { useToast } from './composables/useToast.js'

const route = useRoute()
const connected = ref(false)
const mobileMenuOpen = ref(false)
let healthInterval = null
const { locale, setLocale, t } = useI18n()
const { toasts } = useToast()

const navItems = computed(() => ([
  { path: '/', icon: '◎', label: t('navOverview') },
  { path: '/conversations', icon: '☰', label: t('navThreads') },
  { path: '/search', icon: '⌕', label: t('navSearch') },
  { path: '/memories', icon: '◆', label: t('navMemories') },
  { path: '/switch', icon: '⇄', label: t('navSwitch') },
  { path: '/settings', icon: '⚙', label: t('navSettings') },
]))

const localeOptions = computed(() => ([
  { value: 'zh-CN', label: t('languageZh') },
  { value: 'en', label: t('languageEn') },
]))

watch(() => route.path, () => { mobileMenuOpen.value = false })

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

async function checkConnection() {
  connected.value = await api.checkHealth()
}

onMounted(() => {
  checkConnection()
  healthInterval = setInterval(checkConnection, 30000)
})

onUnmounted(() => {
  if (healthInterval) clearInterval(healthInterval)
})
</script>

<style>
.toast-enter-active { transition: all 0.3s ease-out; }
.toast-leave-active { transition: all 0.3s ease-in; }
.toast-enter-from { opacity: 0; transform: translateX(100%); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
