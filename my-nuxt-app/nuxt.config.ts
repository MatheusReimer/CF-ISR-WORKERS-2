export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      wrangler: {
        compatibility_flags: ["nodejs_compat"],
        kv_namespaces: [
          {
            binding: "NUXT_CACHE",
            id: "2353ef87daff429483828b8d4e4e5c3c",
            preview_id: "c06abb1ffa384efc86d8de241e5021a5"
          }
        ]
      }
    }
  },

  modules: [
    "nitro-cloudflare-dev",
    "@nuxtjs/tailwindcss"
  ],

  css: ["~/assets/css/tailwind.css"],
})
