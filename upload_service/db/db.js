import PushToOpenSearch from "../opensearch/pushToOpenSearch.js";
import prisma from "./PrismaClient.js";

export async function addVideoDetailsToDB(
  title,
  description,
  author,
  url,
  filename
) {
  const videoDetails = await prisma.videoData.create({
    data: {
      title: title,
      description: description,
      author: author,
      url: url,
      filename: filename,
    },
  });
  console.log(videoDetails);
}

export async function updateVideoUrlInDB(filename, transcodedUrl) {
  try {
    console.log("---- ENTERED updateVideoUrlInDB ----");
    console.log(
      "Inputs => filename:",
      filename,
      " transcodedUrl:",
      transcodedUrl
    );
    const updatedVideo = await prisma.videoData.update({
      where: { filename: filename },
      data: { transcodedUrl: transcodedUrl },
      select: {
        id: true,
        title: true,
        description: true,
        author: true,
        url: true,
        filename: true,
        transcodedUrl: true, // the updated field
      },
    });
    await PushToOpenSearch(
      updatedVideo.id,
      updatedVideo.title,
      updatedVideo.description,
      updatedVideo.author,
      updatedVideo.transcodedUrl,
      filename
    );
    console.log("DB update SUCCESS ", updatedVideo.id);
    return updatedVideo;
  } catch (error) {
    console.error("DB update ERROR ", error);
  }
}
