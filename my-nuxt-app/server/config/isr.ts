export const ISR_CONFIG = {
  TTL: 300, // 5 minutes
  CACHE_KEY_PREFIX: 'isr:html:',
  KV_BINDING: 'NUXT_CACHE' 
} as const