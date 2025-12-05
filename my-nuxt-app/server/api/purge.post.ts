import { ISR_CONFIG } from "../config/isr"

export default defineEventHandler(async (event) => {
  console.log('🗑️ Purge API called')
  
  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE as any | undefined
  
  if (!kv) {
    console.error('❌ KV not available in purge API')
    return { success: false, error: 'KV not available' }
  }

  let url = '/'
  try {
    const body = await readBody(event)
    if (body && body.url) {
      url = body.url
    }
  } catch (e) {
    console.log('No body provided, using default URL: /')
  }
  
  const key = `${ISR_CONFIG.CACHE_KEY_PREFIX}${url}`
  
  console.log(`🔑 Attempting to purge key: ${key}`)
  
  try {
    // Check if it exists before deletion
    const beforeDelete = await kv.get(key, 'text')
    console.log(`📦 Before delete - exists: ${!!beforeDelete}, size: ${beforeDelete?.length || 0} bytes`)
    
    if (!beforeDelete) {
      console.log('⚠️ Warning: No cache found to purge')
      return {
        success: true,
        message: 'No cache to purge (already empty)',
        key,
        hadCache: false,
        timestamp: new Date().toISOString()
      }
    }
    
    await kv.delete(key)
    console.log(`✅ Delete command executed for: ${key}`)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const afterDelete = await kv.get(key, 'text')
    console.log(`📦 After delete - exists: ${!!afterDelete}`)
    
    if (afterDelete) {
      console.error('⚠️ WARNING: Key still exists after deletion!')
      return {
        success: false,
        message: 'Cache deletion may have failed',
        key,
        stillExists: true,
        timestamp: new Date().toISOString()
      }
    }
    
    return {
      success: true,
      message: `HTML cache purged for ${url}`,
      key,
      hadCache: true,
      confirmedDeleted: true,
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