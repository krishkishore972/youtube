// import KafkaConfig from "../../upload_service/kafka/kafka.js";

// const kafkaTranscoder = new KafkaConfig("transcoder-service");
// export const pushUrlToUploadService = async (fileName, manifestUrl) => {
//   try {
//     const message = {
//      fileName:fileName,
//      manifestUrl:manifestUrl
//     };
//     console.log("Publishing to Kafka:", message);
//     const msgs = [
//       {
//         key: "video-upload",
//         value: JSON.stringify(message),
//       },
//     ];
//     await kafkaTranscoder.produce("video-transcoded", msgs);
//     return { success: true };
//   } catch (error) {
//     console.error("Kafka publish error:", error);
//     return { success: false, error: error.message };
//   }
// };
