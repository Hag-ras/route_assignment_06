import { resolve } from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV ?? 'development'
config({ path: resolve(`.env.${process.env.NODE_ENV ?? 'development'}`) })

const env = process.env
export const PORT = Number(env.PORT ?? 3000)
export const URI = env.URI ?? 'mongodb://127.0.0.1:27017'
export const DB_NAME = env.DB_NAME ?? 'assignment7'
export const HOST = env.HOST ?? '127.0.0.1'
