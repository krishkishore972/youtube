import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import uploadRouter from "./routes/upload.route.js";
import kafkaPublishRouter from './routes/kafkaPublisher.route.js'
import { listenForTranscodedVideos } from "./controllers/kafkapublisher.controller.js";


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

app.use("/upload",  uploadRouter);
app.use("/publish",  kafkaPublishRouter);

app.get("/", (req, res) => {
  res.send("hi from krish");
});

(async () => {
  await listenForTranscodedVideos();
})();

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
