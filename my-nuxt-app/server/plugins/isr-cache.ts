import { ISR_CONFIG } from '../config/isr'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', async (event) => {
    const fullUrl = event.path || event.node.req.url || '/'
    const url = fullUrl.split('?')[0]
    
    // Skip API routes, assets, and non-GET requests
    if (url.startsWith('/api/') || (url.includes('.') && !url.endsWith('.html')) || event.node.req.method !== 'GET') {
      return
    }
    
    // Only cache if it was a cache miss
    if (event.context.cacheHit) {
      return
    }
    
    const env = event.context.cloudflare?.env
    const kv = env?.NUXT_CACHE
    
    if (!kv || !event.context.pageData) {
      return
    }

    const key = `${ISR_CONFIG.CACHE_KEY_PREFIX}${url}`
    
    try {
      await kv.put(key, JSON.stringify(event.context.pageData), { expirationTtl: ISR_CONFIG.TTL })
      console.log(`✅ Successfully cached: ${url} (TTL: ${ISR_CONFIG.TTL}s)`)
    } catch (err: any) {
      console.error(`❌ Cache write failed:`, err.message)
    }
  })
})