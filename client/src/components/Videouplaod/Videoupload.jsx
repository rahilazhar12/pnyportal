import React, { useState, useEffect } from "react";
import { IoVideocam } from "react-icons/io5";

const VideoUpload = () => {
  const [video, setVideo] = useState(null); // Stores the selected video file
  const [message, setMessage] = useState(""); // Displays feedback to the user
  const [isUploading, setIsUploading] = useState(false); // Tracks upload state
  const [uploadedVideo, setUploadedVideo] = useState(null); // Stores the uploaded video details
  const [videos, setVideos] = useState([]); // Stores the list of fetched videos

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/get-videos`, {
        method: "GET",
        credentials: "include", // Include cookies and credentials
      });

      if (!response.ok) {
        throw new Error("Failed to fetch videos.");
      }

      const result = await response.json();
      setVideos(result.videos || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setMessage("Failed to load videos.");
    }
  };

  // Fetch videos when the component mounts
  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setMessage("File size must not exceed 50MB.");
        setVideo(null);
      } else {
        setVideo(file);
        setMessage(""); // Clear any previous message
      }
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!video) {
      setMessage("Please select a video file to upload.");
      return;
    }

    setIsUploading(true); // Start upload
    const formData = new FormData();
    formData.append("video", video); // Append video file to the FormData object

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/upload-video`, {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies and credentials
      });

      if (!response.ok) {
        throw new Error("Failed to upload video.");
      }

      const result = await response.json();
      setUploadedVideo(result.video); // Store the uploaded video details
      setMessage("Video uploaded successfully!");

      // Fetch videos again to include the new upload
      fetchVideos();
      console.log("Response:", result); // Log the response from the server
    } catch (error) {
      setMessage(error.message || "An error occurred during the upload.");
    } finally {
      setIsUploading(false); // End upload
    }
  };

  // Check if the user has any uploaded videos
  const hasUploadedVideo = videos.length > 0;



  return (
    <div className="mb-6">
      {/* Upload Section */}
      {!hasUploadedVideo && (
        <div>
          <div className="flex justify-between items-center bg-[#007BFF] p-2 text-white">
            <div className="flex items-center gap-1 text-lg">
              <IoVideocam />
              <h3 className="text-base font-semibold">My Video</h3>
            </div>
            <label
              htmlFor="video-upload"
              className="cursor-pointer text-white px-3 py-1 rounded-lg"
            >
              Add
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-4 border-gray-300 rounded-lg flex items-center justify-center h-32">
            {video ? (
              <video
                src={URL.createObjectURL(video)}
                controls
                className="h-full rounded-md"
              />
            ) : (
              <img
                src="https://s.rozee.pk/r/i/rz-grad/video.svg"
                alt="Upload Video"
              />
            )}
          </div>

          {<p className="text-xs text-center">No Video Found</p>}

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`px-6 py-2 rounded-lg text-white ${
                isUploading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      )}

      {/* Displaying the fetched videos */}
      <div className="mt-6">
        {/* <h4 className="font-semibold">Uploaded Videos:</h4> */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {videos.map((video) => (
            <div key={video._id} className="border rounded-lg overflow-hidden">
              <video
                src={`${import.meta.env.VITE_API_URL}/${video.path}`}
                controls
                className="w-full h-auto"
              />
              <div className="p-2">
                <p className="text-sm font-semibold">{video.originalName}</p>
                <p className="text-xs text-gray-600">{new Date(video.uploadDate).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
