/// <reference types="vite/client" />

// Allow importing GLB/GLTF as URL strings via ?url suffix
declare module '*.glb' {
  const src: string
  export default src
}
declare module '*.gltf' {
  const src: string
  export default src
}
