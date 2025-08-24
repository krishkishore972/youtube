import KafkaConfig from "../kafka/kafka.js";
import { updateVideoUrlInDB } from "../db/db.js";

const kafkaUpload = new KafkaConfig("upload-service");


const sendMessageToKafka = async (req, res) => {
  console.log("got here in upload service...");
  try {
    const message = req.body;
    console.log("body : ", message);
    const kafkaconfig = new KafkaConfig();
    const msgs = [
      {
        key: "key1",
        value: JSON.stringify(message),
      },
    ];
    const result = await kafkaconfig.produce("transcode", msgs);
    console.log("result of produce : ", result);
    res.status(200).json("message uploaded successfully");
  } catch (error) {
    console.log(error);
  }
};
export default sendMessageToKafka;

export const pushVideoForEncodingToKafka = async (title, filename) => {
  try {
    const message = {
      title: title,
      filename: filename, // Add filename for the transcoder
    };

    console.log("Publishing to Kafka:", message);

    const msgs = [
      {
        key: "video-upload",
        value: JSON.stringify(message),
      },
    ];
    await kafkaUpload.produce("transcode", msgs);
    console.log("published")
    return { success: true };
  } catch (error) {
    console.error("Kafka publish error:", error);
    return { success: false, error: error.message };
  }
};

export const listenForTranscodedVideos = async () => {
  await kafkaUpload.consume("video-transcoded", async (message) => {
    try {
      const {filename , manifestUrl} = JSON.parse(message);
      console.log("inside kafka listner" ,filename, manifestUrl);

      console.log(filename, manifestUrl);
      await updateVideoUrlInDB(filename, manifestUrl);
      console.log(` Video updated with manifest: ${filename}`);
    } catch (error) {
      console.error("Error processing transcoded video message:", error);
    }
  });
};