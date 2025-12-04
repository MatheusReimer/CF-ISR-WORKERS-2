export default defineEventHandler(async (event) => {
  const url = event.node.req.url

  // Only apply ISR to THIS specific page
  if (url !== '/time') return

  const cf = event.context.cloudflare
  if (!cf) return

  const kv = cf.env?.NUXT_CACHE
  if (!kv) return

  const key = 'isr:page:time'
  const ttl = 60

  // 1. Check KV for cached HTML
  const cached = await kv.get(key)
  if (cached) {
    event.node.res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    return cached
  }

  // 2. Render the page using Nuxt SSR engine
  const renderer = event.context.nitro.renderer
  const html = await renderer.renderToString(event)

  // 3. Cache HTML in KV
  await kv.put(key, html, { expirationTtl: ttl })

  // 4. Return freshly rendered HTML
  event.node.res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  return html
})
