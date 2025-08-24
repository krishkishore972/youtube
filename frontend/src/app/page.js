import React from "react";

import NavBar from "@/components/NavBar";
import YouTubeHome from "@/components/YouTubeHome";


export default function Home() {
  return (
    <div>
      <NavBar />
      <div className=" mt-1">
        <YouTubeHome/>

      </div>
    </div>
  );
}
