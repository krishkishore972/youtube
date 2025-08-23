import AWS from "aws-sdk";


const uploadFileToS3 = async (req, res) => {
  console.log("Upload req received");

  if(!req.file){
    console.log("No file received");
    return res.status(400).send("No file received")
  }

  const file = req.file;

  AWS.config.update({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: file.originalname,
    Body: file.buffer
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).send("Failed to upload file.");
    }

    console.log("File uploaded successfully. File location:", data.Location);
    return res.status(200).send({
      message: "File uploaded successfully!",
      url: data.Location,
    });
  });
};

export default uploadFileToS3;
