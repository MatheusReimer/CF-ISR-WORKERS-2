import { ISR_CONFIG } from "../config/isr"

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE as any | undefined
  
  if (!kv) {
    return { error: 'KV not available' }
  }

  const url = getQuery(event).url || '/'
  const key = `${ISR_CONFIG.CACHE_KEY_PREFIX}${url}`
  
  try {
    // Get the cached HTML
    const cached = await kv.get(key, 'text')
    
    // Get metadata using getWithMetadata
    const withMetadata = await kv.getWithMetadata(key, 'text')
    
    return {
      key,
      url,
      exists: !!cached,
      size: cached ? cached.length : 0,
      preview: cached ? cached.substring(0, 500) + '...' : null,
      metadata: withMetadata.metadata,
      fullPreview: cached ? {
        firstLine: cached.split('\n')[0],
        containsDOCTYPE: cached.includes('<!DOCTYPE'),
        containsHTML: cached.includes('<html'),
        containsHead: cached.includes('<head'),
        containsBody: cached.includes('<body')
      } : null
    }
  } catch (error: any) {
    return { error: error.message }
  }
})