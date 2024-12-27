import React from "react";
import { IoVideocam } from "react-icons/io5";

const VideoUpload = () => (
  <div className="mb-6">
    <div className="flex justify-between items-center bg-[#007BFF] p-2 text-white">
      <div className="flex items-center gap-1 text-lg">
        <IoVideocam />
        <h3 className="text-base font-semibold">My Video</h3>
      </div>
      <button>Add</button>
    </div>
    <div className="mt-4 border-gray-300 rounded-lg flex items-center justify-center h-32">
      <img src="https://s.rozee.pk/r/i/rz-grad/video.svg" alt="Upload Video" />
    </div>
  </div>
);

export default VideoUpload;
