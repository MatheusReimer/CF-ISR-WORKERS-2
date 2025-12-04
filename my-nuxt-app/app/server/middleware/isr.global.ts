
// server/middleware/isr.global.ts
export default defineEventHandler(async (event) => {
  const url = event.path || event.node.req.url || '/'
  
  console.log('🔍 ISR Middleware - URL:', url)

  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE
  
  console.log('🔍 KV available:', !!kv)
  
  if (!kv) {
    console.log('❌ No KV, skipping ISR')
    return
  }

  const key = `isr:html:${url}`
  const ttl = 60

  // Try to serve from cache
  try {
    const cached = await kv.get(key, 'text')
    console.log('🔍 Cache check result:', cached ? `FOUND (${cached.length} bytes)` : 'NOT FOUND')
    
    if (cached) {
      console.log(`✓ ISR Cache HIT: ${url}`)
      
      event.node.res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Cache-Status': 'HIT',
      })
      event.node.res.end(cached)
      event._handled = true
      return
    }
  } catch (error) {
    console.error('❌ KV read error:', error)
  }

  console.log(`✗ ISR Cache MISS: ${url}`)
  
  // INTERCEPT the response write to capture HTML
  const originalWrite = event.node.res.write
  const originalEnd = event.node.res.end
  let responseBody = ''
  
  // @ts-ignore - override write to capture chunks
  event.node.res.write = function(chunk, ...args) {
    if (chunk) {
      responseBody += chunk.toString()
    }
    return originalWrite.call(this, chunk, ...args)
  }
  
  // @ts-ignore - override end to capture final chunk and cache
  event.node.res.end = function(chunk, ...args) {
    if (chunk) {
      responseBody += chunk.toString()
    }
    
    // Cache the complete HTML
    if (responseBody && kv) {
      console.log('🔍 Captured response body:', responseBody.length, 'bytes')
      // Fire and forget
      kv.put(key, responseBody, { expirationTtl: ttl })
        .then(() => console.log(`✓ ISR Cached: ${url}`))
        .catch((err:any) => console.error('❌ Cache error:', err.message))
    }
    
    return originalEnd.call(this, chunk, ...args)
  }
  
  // Store for cleanup if needed
  event.context._isrCache = { key, ttl, url }
})