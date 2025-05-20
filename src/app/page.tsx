"use client"
import React from "react";

export default function Home() {
  return (
    <div className="h-svh w-full bg-black ">
      <video loop autoPlay muted playsInline className="h-full w-full">
          <source src="/comingsoon.MP4" type="video/mp4" />
          Your browser does not support the video.
    </video>
    </div>
  );
}
