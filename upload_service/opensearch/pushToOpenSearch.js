import { Client } from "@opensearch-project/opensearch";

const PushToOpenSearch = async (title, description, author, videoUrl) => {
  try {
    console.log("Pushing to openSearch");
    let auth =  process.env.AUTH;
    let host =process.env.HOST

    let client = new Client({
      node: host,
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });

    let index_name = "video";
    let document = {
      title: title,
      author: author,
      description: description,
      videoUrl: videoUrl,
    };

    let response = await client.index({
      id: title, // id should ideally be db id
      index: index_name,
      body: document,
      refresh: true,
    });
    console.log("Adding document:");
    console.log(response.body);
  } catch (error) {
    console.log(error.message);
  }
};

export default PushToOpenSearch
