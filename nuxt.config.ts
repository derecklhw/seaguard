// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devServer: {
    port: 8000,
  },
  devtools: { enabled: true },
  css: ["~/assets/scss/main.scss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_colors.scss" as *;',
        },
      },
    },
  },
  plugins: [{ src: "~/plugins/msal.js", mode: "client" }],
  runtimeConfig: {
    public: {
      clientId: process.env.CLIENT_ID,
      authority: process.env.AUTHORITY,
      redirectUri: process.env.REDIRECT_URI,
    },
    azureMSSQLConfig: {
      user: process.env.AZURE_MYSQL_USER,
      password: process.env.AZURE_MYSQL_PASSWORD,
      server: process.env.AZURE_MYSQL_SERVER,
      database: process.env.AZURE_MYSQL_DATABASE,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    },
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
});
