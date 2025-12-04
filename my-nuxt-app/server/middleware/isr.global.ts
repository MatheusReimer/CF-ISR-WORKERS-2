export default defineEventHandler(async (event) => {
  const url = event.path || event.node.req.url || '/'
  
  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE
  
  if (!kv) return

  const key = `isr:html:${url}`
  const ttl = 60

  // Try to serve from cache
  try {
    const cached = await kv.get(key, 'text')
    
    if (cached) {
      console.log(`✅ Cache HIT: ${url}`)
      // Return HTML directly - Nitro will handle sending it
      return cached
    }
  } catch (error) {
    console.error('❌ KV read error:', error)
  }

  console.log(`⏳ Cache MISS: ${url}`)
  
  // We can't easily capture the rendered HTML in middleware
  // So we need the plugin approach for caching after render
  // OR we accept that we can't do pure ISR with just middleware
})