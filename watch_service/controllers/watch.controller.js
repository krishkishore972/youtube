import AWS from "aws-sdk";
import prisma from "../db/prismaClient.js";
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: "v4",
});
const watchVideo = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const video = await prisma.videoData.findUnique({
      where: { id: id },
    });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    const bucketName = process.env.AWS_BUCKET;
    const key = video.transcodedUrl.split(`${bucketName}/`)[1];
    console.log(key);
    

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 60 * 60, // valid for 1 hour
    };
    // Generate signed URL only for .m3u8
    const signedUrl = s3.getSignedUrl("getObject", params);

      res.json({ signedUrl });
  } catch (error) {
    console.error("Error in /watch/:id:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default watchVideo;
