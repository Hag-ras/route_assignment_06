import {bootStrapDB} from './DB/connection.db.js'
import { globalErrorHandling } from './middleware/index.js'
import express from 'express'
import cors from 'cors'
const app = express()


bootStrapDB(app)
app.use(cors(), express.json())

console.log(process.env.NODE_ENV);



app.get('/', (req, res) => res.send('Hello World!'))
// app.all('/*f',(req,res,next)=>{
//     return res.status(404).json({message: "Not Found!"})
// })

app.use((req,res,next)=>{
    return res.status(404).json({message: "Not Found!"})
})

app.use(globalErrorHandling)
