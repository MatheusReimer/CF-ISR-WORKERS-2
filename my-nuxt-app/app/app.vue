<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/3 rounded-full blur-3xl"></div>
    </div>

    <!-- Header -->
    <header class="px-6 py-8 border-b border-white/10 backdrop-blur-xl bg-gray-900/60 relative z-10">
      <div class="container mx-auto max-w-6xl">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
          <div class="relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-30"></div>
            <span class="relative bg-gray-900 px-4 py-2 rounded-lg flex items-center gap-2">
              ⚡ Cloudflare ISR Demo
            </span>
          </div>
          <span class="text-xs px-3 py-1.5 rounded-full border border-white/20 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 uppercase tracking-wider font-mono">
            Nuxt 3 • Workers • KV Cache
          </span>
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 px-4 py-8 md:py-12 container mx-auto max-w-6xl relative z-10">
      <!-- Data Card -->
      <div class="rounded-2xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-white/10 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <!-- Shimmer Effect -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
        
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <div class="w-2 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded"></div>
          ISR Data Block
        </h2>

        <!-- Data Display -->
        <div v-if="pageData" class="space-y-6">
          <!-- Server Time -->
          <div class="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <span class="text-blue-400">🕒</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-300">Server Time</h3>
                <p class="text-2xl font-mono font-bold text-white mt-1">{{ formatTime(pageData.time) }}</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm font-mono bg-black/30 px-3 py-2 rounded mt-2">{{ pageData.time }}</p>
          </div>

          <!-- Regeneration Time -->
          <div class="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <span class="text-green-400">🔄</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-300">Generated At</h3>
                <p class="text-2xl font-mono font-bold text-white mt-1">{{ formatTime(pageData.generatedAt) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <div class="w-full bg-gray-800 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                  :style="{ width: cacheAgePercentage + '%' }"
                ></div>
              </div>
              <span class="text-xs text-gray-400 whitespace-nowrap">{{ cacheAgeSeconds }}s ago</span>
            </div>
          </div>

          <!-- Request ID -->
          <div class="bg-gradient-to-r from-gray-900/80 to-black/80 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 group">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <span class="text-purple-400">🔑</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-300">Request ID</h3>
                <p class="text-xl font-mono font-bold text-white mt-1 tracking-wider">{{ pageData.requestId }}</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mt-2">Unique identifier for this request</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else class="text-center py-8">
          <div class="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <span class="text-red-400 text-2xl">⚠️</span>
          </div>
          <p class="font-semibold text-lg text-red-400">No Data Available</p>
          <p class="text-gray-400 mt-2">SSR likely failed. Check console for diagnostics.</p>
        </div>

        <!-- Instructions Panel -->
        <div class="mt-10 pt-8 border-t border-white/10">
          <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
            <span class="text-blue-400">ℹ️</span>
            ISR Instructions
          </h3>
          <div class="bg-blue-500/5 border border-blue-400/20 rounded-xl p-5">
            <h4 class="font-semibold text-blue-300 mb-3">How It Works</h4>
            <ul class="space-y-3">
              <li class="flex items-start gap-2">
                <span class="text-blue-400 mt-0.5">•</span>
                <span>First visit generates fresh HTML and caches it in Cloudflare KV</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 mt-0.5">•</span>
                <span>Subsequent visits serve the cached HTML instantly (check timestamp - it stays the same!)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 mt-0.5">•</span>
                <span>After 5 minutes, cache expires and page regenerates automatically</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-400 mt-0.5">•</span>
                <span>Click "Purge" to force immediate regeneration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          @click="simpleRefresh"
          :disabled="isRefreshing"
          :class="{ 'opacity-50 cursor-not-allowed': isRefreshing }"
          class="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Refresh Page</span>
        </button>
        
        <button
          @click="purgeAndRefresh"
          :disabled="isRefreshing"
          :class="{ 'opacity-50 cursor-not-allowed': isRefreshing }"
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/20 flex items-center gap-2 disabled:hover:scale-100"
        >
          <span>{{ isRefreshing ? '🔄' : '🗑️' }}</span>
          <span>{{ isRefreshing ? 'Purging Cache...' : 'Purge Cache' }}</span>
        </button>
      </div>
      
      <div class="mt-4 text-center">
        <p class="text-gray-400 text-sm">
          Watch the timestamp - it stays the same when served from cache! Check DevTools Network tab for response time (5-20ms = cached, 200ms+ = fresh render)
        </p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="px-6 py-6 text-center border-t border-white/10 backdrop-blur-xl bg-gray-900/60 relative z-10">
      <div class="container mx-auto max-w-6xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="text-gray-400">
            <p class="flex items-center justify-center md:justify-start gap-1">
              Crafted by
              <a href="https://www.thinklogic.com/" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors font-medium ml-1">
                Thinklogic
              </a>
            </p>
            <p class="text-gray-500 text-sm mt-1">Innovating with Cloudflare Workers & Nuxt 3</p>
          </div>
          
          <div class="text-gray-500 text-sm">
            <div class="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full border border-white/10">
              <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>Demo for</span>
              <span class="text-blue-400 font-medium">CPI (Chatsworth Products)</span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-white/10 text-xs text-gray-600">
          <p>Cloudflare Workers • Nuxt 3 • KV Cache • Incremental Static Regeneration</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { data: pageData } = await useAsyncData('page-data', async () => {
  if (import.meta.server) {
    const event = useRequestEvent()
    
    const now = new Date().toISOString()
    const newData = {
      time: now,
      generatedAt: now,
      requestId: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    }
    
    if (event) {
      event.context.pageData = newData
    }
    
    console.log('🆕 Generated fresh data')
    return newData
  }
  
  return null
}, {
  server: true,
  lazy: false
})

const isRefreshing = ref(false)

const simpleRefresh = () => {
  if (isRefreshing.value) return
  window.location.reload()
}

const purgeAndRefresh = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  
  try {
    console.log('🗑️ Starting purge process...')
    
    const response = await $fetch('/api/purge', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: '/' })
    })
    
    console.log('✅ Purge API response:', response)
    
    if (!response.success) {
      console.error('❌ Purge reported failure:', response)
      alert('Purge failed: ' + (response.error || response.message))
      isRefreshing.value = false
      return
    }
    
    if (response.hadCache) {
      console.log('✅ Cache was found and deleted')
    } else {
      console.log('⚠️ No cache found to delete')
    }
    
    // Wait for KV propagation
    console.log('⏳ Waiting for cache deletion to propagate...')
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('🔄 Reloading page...')
    window.location.reload()
  } catch (error: any) {
    console.error('❌ Purge request failed:', error)
    alert('Purge error: ' + error.message)
    isRefreshing.value = false
  }
}

const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const cacheAgeSeconds = computed(() => {
  if (!pageData.value) return 0
  const generated = new Date(pageData.value.generatedAt).getTime()
  const now = Date.now()
  return Math.floor((now - generated) / 1000)
})

const cacheAgePercentage = computed(() => {
  const age = cacheAgeSeconds.value
  return Math.min(100, (age / 300) * 100)
})

if (import.meta.client) {
  setInterval(() => {
    if (pageData.value) {
      pageData.value = { ...pageData.value }
    }
  }, 1000)
}
</script>


<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
}

.float-animation {
  animation: float 3s ease-in-out infinite;
}

.pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #06b6d4);
  border-radius: 4px;
}
</style>