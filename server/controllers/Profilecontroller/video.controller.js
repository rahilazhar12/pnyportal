const Video = require("../../models/Newprofile/videoSchema");

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const video = new Video({
      userId: req.user.id, // Assuming authentication middleware sets req.user
      videoPath: req.file.path,
      originalName: req.file.originalname,
    });

    await video.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: {
        id: video._id,
        path: video.videoPath,
        originalName: video.originalName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload video" });
  }
};

const getVideosByUserId = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user is authenticated and the userId is in the req.user object

    // Find all videos uploaded by the user
    const videos = await Video.find({ userId });

    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: "No videos found for this user" });
    }

    res.status(200).json({
      message: "Videos fetched successfully",
      videos: videos.map((video) => ({
        id: video._id,
        path: video.videoPath,
        originalName: video.originalName,
        uploadDate: video.uploadDate,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

module.exports = { uploadVideo , getVideosByUserId};
