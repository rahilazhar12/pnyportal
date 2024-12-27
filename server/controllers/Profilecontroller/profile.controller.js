const Summary = require("../../models/Newprofile/summary");
const User = require("../../models/user.model");
const PNYAlumniSchema = require("../../models/pnyalumini");

exports.saveSummary = async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;

  if (!userId || !content) {
    return res
      .status(400)
      .json({ success: false, message: "User ID and content are required" });
  }

  try {
    // Check if the user exists in either User or PNYAlumniSchema
    const alumni = await PNYAlumniSchema.findOne({ _id: userId });
    const user = await User.findById({ _id: userId });

    if (!user && !alumni) {
      return res.status(404).json({
        success: false,
        message: "User not found in either User or PNYAlumniSchema",
      });
    }

    // Create a new summary for the user
    const summary = new Summary({ userId, content });
    await summary.save();

    res.status(200).json({
      success: true,
      message: "Summary saved successfully",
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save summary",
      error: error.message,
    });
  }
};

exports.getSummariesByUserId = async (req, res) => {
  const userId = req.user.id;

  try {
    const summaries = await Summary.find({ userId });
    if (!summaries || summaries.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No summaries found for this user" });
    }

    res.status(200).json({ success: true, summaries });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch summaries",
      error: error.message,
    });
  }
};

exports.updateSummary = async (req, res) => {
  const { summaryId, content } = req.body;

  if (!summaryId || !content) {
    return res
      .status(400)
      .json({ success: false, message: "Summary ID and content are required" });
  }

  try {
    // Find the summary by ID
    const summary = await Summary.findById(summaryId);
    if (!summary) {
      return res
        .status(404)
        .json({ success: false, message: "Summary not found" });
    }

    // Update the summary content
    summary.content = content;
    await summary.save();

    res.status(200).json({
      success: true,
      message: "Summary updated successfully",
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update summary",
      error: error.message,
    });
  }
};
