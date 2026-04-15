const config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3002',
    shopName: `Fayzy's Cuts` // TODO: Fetch from API when shop setting feature is built
} as const

export default config