import React from "react";

import NavBar from "@/components/NavBar";

import YouTubeHome from "@/components/YouTubeHome";
import VideoPlayer from "@/pages/VideoPlayer";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className=" mt-1">
        <YouTubeHome/>
        {/* <VideoPlayer/> */}
      </div>
    </div>
  );
}
