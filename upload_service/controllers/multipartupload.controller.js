import AWS from "aws-sdk";
import { addVideoDetailsToDB } from "../db/db.js";
import { pushVideoForEncodingToKafka } from "./kafkapublisher.controller.js";
import PushToOpenSearch from "../opensearch/pushToOpenSearch.js";


//initializeUpload
export const initializeUpload = async (req, res) => {
  try {
    console.log("initializeUpload called");
    const { fileName } = req.body;
    console.log(fileName);

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const bucketName = process.env.AWS_BUCKET;

    const createParams = {
      Bucket: bucketName,
      Key: fileName,
      ContentType: "video/mp4",
    };

    const multipartParams = await s3
      .createMultipartUpload(createParams)
      .promise();
    console.log("multipartparams---- ", multipartParams);
    const uploadId = multipartParams.UploadId;
    res.status(200).json({ uploadId });
  } catch (error) {
    console.error("Error initializing upload:", err);
    res.status(500).send("Upload initialization failed");
  }
};

//upload chunk
export const uploadChunk = async (req, res) => {
  try {
    console.log("upload chunk called");
    const { fileName, chunkIndex, uploadId } = req.body;

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });

    const bucketName = process.env.AWS_BUCKET;

    const partParams = {
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
      PartNumber: parseInt(chunkIndex) + 1,
      Body: req.file.buffer,
    };

    const data = await s3.uploadPart(partParams).promise();
    console.log("data-------", data);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error uploading chunk:", error);
    res.status(500).send("Chunk could not be uploaded");
  }
};

//  Complete upload
export const completeUpload = async (req, res) => {
  try {
    console.log("Completing Upload");
    const { fileName, totalChunks, uploadId, title, description, author } =
      req.body;
    const uploadedParts = [];
    // Build uploadedParts array from request body
    for (let i = 0; i < totalChunks; i++) {
      uploadedParts.push({ PartNumber: i + 1, ETag: req.body[`part${i + 1}`] });
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-south-1",
    });
    const bucketName = process.env.AWS_BUCKET;

    const completeParams = {
      Bucket: bucketName,
      Key: fileName,
      UploadId: uploadId,
    };

    // Listing parts using promise
    const data = await s3.listParts(completeParams).promise();

    const parts = data.Parts.map((part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    completeParams.MultipartUpload = {
      Parts: parts,
    };

    // Completing multipart upload using promise
    const uploadResult = await s3
      .completeMultipartUpload(completeParams)
      .promise();
    console.log("data----- ", uploadResult);
    const rawUrl = uploadResult.Location;
    console.log("Video uploaded at ", rawUrl);
    await addVideoDetailsToDB(title, description, author,rawUrl,fileName);
    await pushVideoForEncodingToKafka(title, fileName);
    // PushToOpenSearch(title, description, author, url); //pushing non transcoded url, need to push manifest url
    return res.status(200).json({
      message: "Uploaded successfully!",
      url: rawUrl,
      kafkaPublished: true,
    });
  } catch (error) {
     console.error("Upload completion error:", error);
     return res.status(500).json({
       error: "Upload completion failed",
       details: error.message,
     });
  }
};

// adding data to db for testing
export const uploadToDb = async (req,res) => {
  console.log("adding data to db");

  try {
    const videoDetails = req.body;
    await addVideoDetailsToDB(videoDetails.title,videoDetails.description,videoDetails.author,videoDetails.url);
    return res.status(200).send("success");
  } catch (error) {
    console.log("Error in adding to DB ", error);
    return res.status(400).send(error);
  }
}