// server/api/purge.delete.ts
export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)
  
  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  const env = event.context.cloudflare?.env
  const kv = env?.NUXT_CACHE
  
  if (!kv) {
    throw createError({
      statusCode: 500,
      message: 'KV store not available'
    })
  }

  const key = `isr:html:${url}`
  
  try {
    await kv.delete(key)
    console.log(`🗑️ Purged cache for: ${url}`)
    
    return {
      success: true,
      message: `Cache purged for ${url}`,
      key
    }
  } catch (error) {
    console.error('❌ Purge error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to purge cache'
    })
  }
})