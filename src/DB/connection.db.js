import { MongoClient} from 'mongodb'
import { PORT, URI } from '../config.js'

export const client = new MongoClient(URI)

export const bootStrapDB = async (app)=>{
     try {
          await client.connect()
          console.log(`DB connected successfully!`);
          app.listen(PORT,()=>{})
     } catch (error) {
          console.log(`Failed to connect to DB`);
          
     }
}

export const db = client