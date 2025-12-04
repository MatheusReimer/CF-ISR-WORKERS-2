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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
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
            <p class="text-gray-400 mt-2 ml-1">
              Built by 
              <a href="https://www.thinklogic.com/" target="_blank" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors ml-1">
                Thinklogic
              </a>
              <span class="mx-2">•</span>
              for 
              <span class="text-blue-400 font-semibold ml-1">CPI (Chatsworth Products)</span>
            </p>
          </div>
          
          <!-- Cache Status Badge -->
          <div class="flex items-center gap-3 bg-gradient-to-r from-gray-900 to-black/80 border border-white/10 px-4 py-3 rounded-xl backdrop-blur-md shadow-lg">
            <div class="relative">
              <div class="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
              <div class="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
            </div>
            <div>
              <span class="text-gray-300 text-sm tracking-wide font-medium">ISR Cache Active</span>
              <div class="text-xs text-gray-500 mt-0.5">60s TTL</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 px-4 py-8 md:py-12 container mx-auto max-w-6xl relative z-10">
      <!-- Cache Visualization -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold text-gray-300 mb-6 text-center">Cache Lifecycle Visualization</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Cache Miss -->
          <div class="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 mb-4 mx-auto">
              <span class="text-red-400 text-2xl">🔄</span>
            </div>
            <h3 class="text-center font-medium text-gray-300 mb-2">Cache Miss</h3>
            <p class="text-gray-500 text-sm text-center">First request generates fresh content</p>
          </div>
          
          <!-- Cache Hit -->
          <div class="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative">
            <div class="absolute -top-2 -right-2">
              <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">ACTIVE</span>
            </div>
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 mb-4 mx-auto">
              <span class="text-green-400 text-2xl">⚡</span>
            </div>
            <h3 class="text-center font-medium text-gray-300 mb-2">Cache Hit</h3>
            <p class="text-gray-500 text-sm text-center">Served instantly from KV cache</p>
          </div>
          
          <!-- Regeneration -->
          <div class="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 mb-4 mx-auto">
              <span class="text-blue-400 text-2xl">⏱️</span>
            </div>
            <h3 class="text-center font-medium text-gray-300 mb-2">Regeneration</h3>
            <p class="text-gray-500 text-sm text-center">Auto-revalidates after 60 seconds</p>
          </div>
        </div>
      </div>

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
                <h3 class="font-medium text-gray-300">Regenerated At</h3>
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-500/5 border border-blue-400/20 rounded-xl p-5">
              <h4 class="font-semibold text-blue-300 mb-3">Testing Instructions</h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-2">
                  <span class="text-blue-400 mt-0.5">•</span>
                  <span>Refresh multiple times within <strong class="text-white">60 seconds</strong></span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-400 mt-0.5">•</span>
                  <span>On cache HIT → values stay <strong class="text-white">frozen</strong></span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-blue-400 mt-0.5">•</span>
                  <span>After 60 seconds → page <strong class="text-white">regenerates</strong></span>
                </li>
              </ul>
            </div>
            
            <div class="bg-gray-800/20 border border-white/10 rounded-xl p-5">
              <h4 class="font-semibold text-gray-300 mb-3">Monitoring</h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-2">
                  <span class="text-green-400 mt-0.5">✓</span>
                  <span>Check <code class="bg-black/30 px-2 py-1 rounded text-sm">ISR Cache HIT</code> in logs</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-yellow-400 mt-0.5">✓</span>
                  <span>Monitor <code class="bg-black/30 px-2 py-1 rounded text-sm">regeneration times</code></span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-purple-400 mt-0.5">✓</span>
                  <span>Watch <code class="bg-black/30 px-2 py-1 rounded text-sm">Request ID changes</code></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Refresh Button -->
      <div class="mt-8 text-center">
        <button
          @click="refreshData"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 mx-auto"
        >
          <span>🔄</span>
          <span>Refresh Page</span>
        </button>
        <p class="text-gray-500 text-sm mt-2">Manually trigger a refresh to test cache behavior</p>
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
const { data: pageData, refresh } = await useAsyncData('page-data', async () => {
  const now = new Date().toISOString()
  return {
    time: now,
    generatedAt: now,
    requestId: Math.random().toString(36).substring(7)
  }
}, {
  server: true,
  lazy: false
})

// Refresh function
const refreshData = () => {
  refresh()
  // Add a subtle animation feedback
  const btn = document.querySelector('button')
  if (btn) {
    btn.classList.add('scale-95')
    setTimeout(() => btn.classList.remove('scale-95'), 150)
  }
}

// Format time for display
const formatTime = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Calculate cache age (for visual indicator)
const cacheAgeSeconds = computed(() => {
  if (!pageData.value) return 0
  const generated = new Date(pageData.value.generatedAt).getTime()
  const now = Date.now()
  return Math.floor((now - generated) / 1000)
})

const cacheAgePercentage = computed(() => {
  const age = cacheAgeSeconds.value
  // Show progress from 0-60 seconds (TTL period)
  return Math.min(100, (age / 60) * 100)
})
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