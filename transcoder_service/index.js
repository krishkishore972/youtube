import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import KafkaConfig from "../upload_service/kafka/kafka.js";
import convertToHLS from "./hls/transcoder.js";
import s3ToS3 from "./hls/transcoder.js";
// import { pushUrlToUploadService } from "./hls/kafkapublisher.js";

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

app.get("/", (req, res) => {
  res.send("hi from transcoder");
});

app.get("/transcode" , (req,res) => {
  convertToHLS();
  res.send("transcoding done")
})

const kafkaTranscoder = new KafkaConfig("transcoder-service");

kafkaTranscoder.consume("transcode", async (message) => {
  try {
    console.log("got data from kafka:", message);
    // parsing json message value;
    const value = JSON.parse(message);
    // checking is value and file name exits;
    if (value && value.filename) {
      console.log("Filename is", value.filename);
      const manifestUrl = await s3ToS3(value.filename);
      await kafkaTranscoder.produce("video-transcoded", [
        {
          key: "video-transcoded",
          value: JSON.stringify({filename:value.filename, manifestUrl}),
        },
      ]);
    } else {
      console.log("Didn't receive filename to be picked from S3");
    }
  } catch (error) {
    console.error("Error processing Kafka message:", error);
    // You might want to handle or log this error appropriately
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
