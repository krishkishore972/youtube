"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";

function Room() {
  const [mounted, setMounted] = useState(false); // initially false
  const [userStream, setUserStream] = useState();

  const callUser = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setUserStream(stream);
  };

  // This runs only on the client (browser)
  useEffect(() => {
    setMounted(true); // now we know we are on client
  }, []);

  if (!mounted) return null; // Don’t render anything until we are sure we are on the client

  return (
    <div>
      <div className="m-10">
        <ReactPlayer
          width="1280px"
          height="720px"
          playing={true}
          controls={true}
          url="https://www.youtube.com/watch?v=brI3gt9girI"
        />
      </div>

      <button
        type="button"
        onClick={callUser}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
dark:focus:ring-blue-800 m-10"
      >
        Stream
      </button>

      <div className="m-10">
        <ReactPlayer
          width="1280px"
          height="720px"
          url={userStream}
          controls={true}
        />
      </div>
    </div>
  );
}
export default Room;
