import { ISR_CONFIG } from '../config/isr'

export default defineEventHandler(async (event) => {
  const fullUrl = event.path || event.node.req.url || '/'
  const url = fullUrl.split('?')[0]

  // Skip API routes and assets
  if (url.startsWith('/api/') || (url.includes('.') && !url.endsWith('.html'))) {
    return
  }
  
  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE
  
  if (!kv) {
    event.context.cacheHit = false
    return
  }

  const key = `${ISR_CONFIG.CACHE_KEY_PREFIX}${url}`

  try {
    const cached = await kv.get(key, 'json')
    
    if (cached) {
      console.log(`✅ Cache HIT: ${url}`)
      event.context.cacheHit = true
      event.context.cachedData = cached
      return
    }
  } catch (error) {
    console.error('❌ KV read error:', error)
  }

  console.log(`⏳ Cache MISS: ${url}`)
  event.context.cacheHit = false
})