import prisma from "./PrismaClient.js";

export async function addVideoDetailsToDB(title, description, author, url, filename) {
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
    const updatedVideo = prisma.videoData.update({
      where: { filename: filename },
      data: { transcodedUrl: transcodedUrl },
    });
    console.log("DB update SUCCESS ", updatedVideo);
    return updatedVideo;
  } catch (error) {
    console.error("DB update ERROR ", error);
  }
}
