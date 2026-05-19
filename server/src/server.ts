import dotenv from 'dotenv'
import path from 'path'

// Load from root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') })
import app from './app'

const PORT = process.env.PORT_SERVER || 3002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})