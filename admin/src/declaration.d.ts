// Tells TS to accept CSS imports

declare module '*.css'
declare module '*.module.css'

// Enables the read of .env file
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}