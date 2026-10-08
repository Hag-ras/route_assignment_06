import { MongoClient } from 'mongodb'
import { DB_NAME, PORT, URI } from '../config.js'

export const client = new MongoClient(URI)
export const db = client.db(DB_NAME)

export const bootStrapDB = async (app) => {
  try {
    await client.connect()
    console.log('DB connected successfully!')
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.log('Failed to connect to DB')
    console.error(error)
  }
}