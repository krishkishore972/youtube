import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import watchRouter from './routes/watch.route.js';



dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);

app.use(express.json());




app.use("/watch",watchRouter)

app.get("/" , (req,res) => {
    res.send("hi from watch service")
})

app.listen(port ,() => {
console.log("listning on port:",port);
})