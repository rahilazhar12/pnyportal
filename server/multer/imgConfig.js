const multer = require("multer");

// Function to sanitize file name
const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9.]/g, "_").replace(/\s+/g, "_");
};

const storage = multer.diskStorage({
  destination: "uploads",

  filename: function (req, file, cb) {
    const sanitizedFileName = sanitizeFileName(file.originalname);
    const extension = sanitizedFileName.split(".").pop();
    cb(null, `image-${Date.now()}.${extension}`);
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/svg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/mov" ||
    file.mimetype === "video/mkv" ||
    file.mimetype === "video/avi"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // for 2MB
  },
});

module.exports = upload;
