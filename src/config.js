import { resolve} from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV?? 'development'
config({path: resolve(`.env.${process.env.NODE_ENV?? 'development'}`)})


const env = process.env
export const PORT = parseInt(env.PORT?? 3000)

export const URI = env.URI
