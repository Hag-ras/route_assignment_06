import express from 'express'
import cors from 'cors'
import { bootStrapDB } from './DB/connection.db.js'
import { globalErrorHandling } from './middleware/index.js'
import { bookController } from './modules/index.js'

const app = express()

app.use(cors(), express.json())
app.use(bookController)

console.log(process.env.NODE_ENV);



app.get('/', (req, res) => res.send('Hello World!'))

app.use((req, res) => {
  return res.status(404).json({ message: 'Not Found!' })
})

app.use(globalErrorHandling)

bootStrapDB(app)
