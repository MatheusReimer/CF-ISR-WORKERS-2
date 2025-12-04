// server/plugins/isr-cache.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    // Only cache if we marked it in middleware
    const url = event.path || event.node.req.url || '/'
    const env = event.context.cloudflare?.env
    const kv = env?.NUXT_CACHE
    
    if (!kv || !response.body) return

    const key = `isr:html:${url}`
    const ttl = 60
    const html = response.body
    const ctx = event.context.cloudflare?.context
    
    console.log(`💾 Caching ${url}: ${html.length} bytes`)
    
    if (ctx?.waitUntil) {
      ctx.waitUntil(
        kv.put(key, html, { expirationTtl: ttl })
          .then(() => console.log(`✅ Cached: ${url}`))
          .catch((err) => console.error(`❌ Cache failed:`, err.message))
      )
    }
  })
})