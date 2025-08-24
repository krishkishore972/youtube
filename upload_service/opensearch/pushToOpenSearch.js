import { Client } from "@opensearch-project/opensearch";

const PushToOpenSearch = async (id,title, description, author, videoUrl,filename) => {
  try {
    console.log("Pushing to openSearch");

    let host =process.env.HOST

    let client = new Client({
      node: host
    });

    let index_name = "video";
    let document = {
      title: title,
      author: author,
      description: description,
      videoUrl: videoUrl,
      filename:filename
    };

    let response = await client.index({
      id: id, 
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
