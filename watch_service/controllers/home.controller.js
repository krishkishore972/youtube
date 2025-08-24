import prisma from "../db/prismaClient.js";
const getAllVideos = async (req, res) => {
  try {
    const videos = await prisma.videoData.findMany();
    console.log(videos);
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default getAllVideos;
