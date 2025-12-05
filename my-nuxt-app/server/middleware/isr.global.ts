import { ISR_CONFIG } from '../config/isr'

export default defineEventHandler(async (event) => {
  const fullUrl = event.path || event.node.req.url || '/'
  const url = fullUrl.split('?')[0]
  
  if (
    url.startsWith('/api/') || 
    url.startsWith('/_nuxt/') ||
    (url.includes('.') && !url.endsWith('.html')) ||
    event.method !== 'GET'
  ) {
    return
  }
  
  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE as any | undefined
  
  if (!kv) {
    event.context.isCacheHit = false
    return
  }

  const key = `${ISR_CONFIG.CACHE_KEY_PREFIX}${url}`
  
  try {
    let cachedHtml = await kv.get(key, 'text')
    
    if (cachedHtml) {
      console.log(`✅ Cache HIT: / - Serving from KV (${cachedHtml.length} bytes)`)
      
      cachedHtml = cachedHtml.replace(
        "window.__NUXT_CACHE_STATUS__ = 'MISS'",
        "window.__NUXT_CACHE_STATUS__ = 'HIT'"
      )
      
      setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
      setResponseHeader(event, 'X-Cache-Status', 'HIT')
      
      event.context.isCacheHit = true
      event.node.res.end(cachedHtml)
      return
    }
  } catch (error) {
    console.error('❌ KV read error:', error)
  }

  console.log(`⏳ Cache MISS: / - Will generate and cache`)
  setResponseHeader(event, 'X-Cache-Status', 'MISS')
  event.context.isCacheHit = false
})