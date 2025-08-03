import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import route from "./src/router/route.js"
import { connectDataBase } from "./src/configs/DataBase.js"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors())
connectDataBase()
app.get("/", (req, res) => { res.send("hello") })
app.use('/api/v1/', route)

app.listen(PORT, () => {
      console.log(`✅ Server running successfully\n📡 Listening on port: ${PORT}\n`);
})