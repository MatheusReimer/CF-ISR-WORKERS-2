import { ISR_CONFIG } from '../config/isr'

export default defineEventHandler(async (event) => {
  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE
  
  if (!kv) {
    return { success: false, error: 'KV not available' }
  }

  const url = '/'
  const key = `${ISR_CONFIG.CACHE_KEY_PREFIX}${url}`
  
  try {
    await kv.delete(key)
    console.log(`✅ Cache purged: ${key}`)
    
    return {
      success: true,
      message: `Cache purged for ${url}`,
      key,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('❌ Delete failed:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
})