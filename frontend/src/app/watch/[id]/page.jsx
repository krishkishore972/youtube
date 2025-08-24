"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Hls from "hls.js";

function WatchPage() {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8080/watch/${id}`);
        setVideo(data); // backend should return {title, author, description, signedUrl}
      } catch (error) {
        console.error("Error fetching video", error);
      }
    };
    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (video?.signedUrl && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(video.signedUrl);
      hls.attachMedia(videoRef.current);

      return () => {
        hls.destroy();
      };
    } else if (
      video?.signedUrl &&
      videoRef.current?.canPlayType("application/vnd.apple.mpegurl")
    ) {
      // For Safari (native HLS support)
      videoRef.current.src = video.signedUrl;
    }
  }, [video]);

  if (!video) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          controls
          className="w-full h-full object-contain bg-black"
        />
      </div>
      <div className="w-full max-w-4xl mt-6">
        <h1 className="text-2xl font-bold">{video.title}</h1>
      </div>
    </div>
  );
}

export default WatchPage;
