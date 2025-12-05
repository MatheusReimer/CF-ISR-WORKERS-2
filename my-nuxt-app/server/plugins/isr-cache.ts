import { ISR_CONFIG } from '../config/isr'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', async (html, { event }) => {
    const fullUrl = event.path || event.node.req.url || '/'
    const url = fullUrl.split('?')[0]
    
    if (
      url.startsWith('/api/') || 
      url.startsWith('/_nuxt/') ||
      (url.includes('.') && !url.endsWith('.html'))
    ) {
      return
    }
    
    if (event.context.isCacheHit) {
      console.log(`⏭️  Skipping cache write (was served from cache): ${url}`)
      return
    }
    
    const env = event.context.cloudflare?.env
    const kv = env?.NUXT_CACHE as any | undefined
    
    if (!kv) {
      console.log('❌ KV not available in plugin')
      return
    }

    const key = `${ISR_CONFIG.CACHE_KEY_PREFIX}${url}`
    
    // Build the complete HTML document from arrays
    const htmlString = [
      '<!DOCTYPE html>',
      '<html' + (html.htmlAttrs ? ' ' + html.htmlAttrs.join(' ') : '') + '>',
      '<head>',
      ...(html.head || []),
      '</head>',
      '<body' + (html.bodyAttrs ? ' ' + html.bodyAttrs.join(' ') : '') + '>',
      ...(html.bodyPrepend || []),
      ...(html.body || []),
      ...(html.bodyAppend || []),
      '</body>',
      '</html>'
    ].join('')
    
    try {
      // Cache the entire HTML page
      await kv.put(key, htmlString, { 
        expirationTtl: ISR_CONFIG.TTL,
        metadata: {
          cachedAt: new Date().toISOString(),
          url: url
        }
      })
      
      console.log(`✅ Successfully cached HTML: ${url} (${htmlString.length} bytes, TTL: ${ISR_CONFIG.TTL}s)`)
      
      // Verify it was written
      const verification = await kv.get(key, 'text')
      if (verification) {
        console.log(`✅ Verified HTML cache: ${url}`)
      } else {
        console.error(`❌ Verification failed: ${url}`)
      }
    } catch (err: any) {
      console.error(`❌ Cache write failed for ${url}:`, err.message)
    }
  })
})