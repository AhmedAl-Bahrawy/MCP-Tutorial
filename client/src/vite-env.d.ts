/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STYTCH_PUBLIC_TOKEN: string
  readonly VITE_STYTCH_SDK?: 'consumer'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
