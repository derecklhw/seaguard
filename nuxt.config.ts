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
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  plugins: [
    { src: "~/plugins/msal.js", mode: "client" },
    { src: "~/plugins/vue-camera-lib.client.js", ssr: false },
  ],
  build: {
    transpile: ["vue-camera-lib"],
  },
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
    azure: {
      tenantId: process.env.AZURE_TENANT_ID,
      clientId: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
      resourceGroup: process.env.AZURE_RESOURCE_GROUP,
      videoIndexerAccountName: process.env.AZURE_VIDEO_INDEXER_ACCOUNT_NAME,
    },
    azureVideoIndexer: {
      accountId: process.env.AZURE_VIDEO_INDEXER_ACCOUNT_ID,
      location: process.env.AZURE_VIDEO_INDEXER_LOCATION,
    },
    azureStorage: {
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    },
    geminiApiKey: process.env.GEMINI_API_KEY,
    azureAiDocumentIntelligence: {
      apiKey: process.env.AZURE_AI_DOCUMENT_INTELLIGENCE_API_KEY,
      endpoint: process.env.AZURE_AI_DOCUMENT_INTELLIGENCE_API_ENDPOINT,
    },
    stripeApiKey: process.env.STRIPE_SECRET_KEY
  },
  modules: [
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "shadcn-nuxt",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  i18n: {
    locales: [
      {
        code: "en",
        file: "en-US.json",
      },
      {
        code: "fr",
        file: "fr-FR.json",
      },
      {
        code: "mfe",
        file: "mfe-MFE.json",
      },
    ],
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
  },
});
