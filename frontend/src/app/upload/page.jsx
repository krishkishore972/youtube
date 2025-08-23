"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function UploadForm() {

const router = useRouter();


  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
   const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file before uploading.");
      return;
    }

    try {
      setIsUploading(true); // Start loading
      setError("");
      if (!title || !author) {
        alert("Title and Author are required fields.");
        return;
      }
      const formData = new FormData();
      formData.append("fileName", selectedFile.name);
      const initializeRes = await axios.post(
        "http://localhost:8000/upload/initialize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { uploadId } = initializeRes.data;
      console.log("upload id is :", uploadId);

      ///////
      const chunkSize = 5 * 1024 * 1024; // 5mb
      const totalChunks = Math.ceil(selectedFile.size / chunkSize);

      let start = 0;
      // Before for loop for chunking -
      const uploadPromises = [];

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chunk = selectedFile.slice(start, start + chunkSize);
        start += chunkSize;
        const chunkFormData = new FormData();
        chunkFormData.append("fileName", selectedFile.name);
        chunkFormData.append("chunk", chunk);
        chunkFormData.append("totalChunks", totalChunks.toString());
        chunkFormData.append("chunkIndex", chunkIndex.toString());
        chunkFormData.append("uploadId", uploadId);

        const uploadPromise = axios.post(
          "http://localhost:8000/upload",
          chunkFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadPromises.push(uploadPromise);
      }
      await Promise.all(uploadPromises);
      ///////

      const completeRes = await axios.post(
        "http://localhost:8000/upload/complete",
        {
          fileName: selectedFile.name,
          totalChunks: totalChunks,
          uploadId: uploadId,
          title: title,
          description: description,
          author: author,
        }
      );
      // Reset all form fields after successful upload
      setTitle("");
      setDescription("");
      setAuthor("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      console.log(completeRes.data);
      // Redirect to home page after successful upload
      router.push("/"); // Or your specific home route
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false); // End loading
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form encType="multipart/form-data" className="flex flex-col gap-4">
        <div className=" mb-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="px-3 py-2 w-full border rounded-md focus:outline-none
focus:border-blue-500"
          />
        </div>
        <div className=" mb-4">
          <input
            type="text"
            name="description"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 w-full border rounded-md focus:outline-none
focus:border-blue-500"
          />
        </div>
        <div className=" mb-4">
          <input
            type="text"
            name="author"
            placeholder="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="px-3 py-2 w-full border rounded-md focus:outline-none
focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <label
            htmlFor="fileUpload"
            className="text-white bg-gradient-to-br from-purple-600
to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm
px-5 py-2.5 text-center transition-all duration-300 transform cursor-pointer"
          >
            Choose File
          </label>
          <input
            type="file"
            id="fileUpload"
            name="file"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <span className="text-sm text-gray-700">
            {selectedFile ? selectedFile.name : "No file chosen"}
          </span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading} // Disable during upload
          className={`text-white bg-gradient-to-br from-purple-600
          to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
          focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm
          px-5 py-2.5 text-center transition-all duration-300 transform cursor-pointer
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;
