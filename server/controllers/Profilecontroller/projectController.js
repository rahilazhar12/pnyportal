const Project = require("../../models/Newprofile/Project");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    // Ensure that req.body.projects is an array and has at least one project
    if (!Array.isArray(req.body.projects) || req.body.projects.length === 0) {
      return res
        .status(400)
        .json({ message: "Projects array is required and cannot be empty." });
    }

    // Find the existing project for the user
    const existingProject = await Project.findOne({ userId: req.user.id });

    if (existingProject) {
      // If the user already has a project, add the new projects to the existing array
      existingProject.projects.push(...req.body.projects);
      await existingProject.save(); // Save the updated project
      return res.status(200).json({
        message: "Projects added successfully",
        project: existingProject,
      });
    } else {
      // If no existing project, create a new one
      const project = new Project({
        projects: req.body.projects, // Use the projects array from the request body
        userId: req.user.id, // Associate the project with the user
      });

      console.log(req.body.projects);

      // Save the new project to the database
      await project.save();
      return res
        .status(201)
        .json({ message: "Project created successfully", project });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(400).json({ message: error.message });
  }
};

// Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    // Find the project document associated with the user
    const project = await Project.findOne({ userId: req.user.id });

    if (project) {
      // Return the projects array
      return res.status(200).json({ projects: project.projects });
    } else {
      // If no projects found, return an empty array or a 404 error
      return res.status(200).json({ projects: [] });
      // Or, if you prefer to send a 404 error:
      // return res.status(404).json({ message: "No projects found for this user." });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ message: error.message });
  }
};

exports.editProject = async (req, res) => {
  try {
    const { projectId } = req.params; // Extract projectId from URL parameters
    const updatedData = req.body; // Contains the fields to update

    // Find the user's Project document
    const userProject = await Project.findOne({ userId: req.user.id });

    if (!userProject) {
      return res
        .status(404)
        .json({ message: "No projects found for this user." });
    }

    // Find the specific project by _id
    const project = userProject.projects.id(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Update the project fields
    Object.keys(updatedData).forEach((key) => {
      // Ensure that only allowed fields are updated
      if (
        [
          "name",
          "projectUrl",
          "startMonth",
          "startYear",
          "endMonth",
          "endYear",
          "isOngoing",
          "association",
          "description",
          "image",
        ].includes(key)
      ) {
        project[key] = updatedData[key];
      }
    });

    // If the project is marked as ongoing, clear endMonth and endYear
    if (project.isOngoing) {
      project.endMonth = undefined;
      project.endYear = undefined;
    }

    // Save the updated Project document
    await userProject.save();

    return res
      .status(200)
      .json({ message: "Project updated successfully.", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
    try {
      const { projectId } = req.params; // Extract projectId from URL parameters
  
      // Find the user's Project document
      const userProject = await Project.findOne({ userId: req.user.id });
  
      if (!userProject) {
        return res.status(404).json({ message: "No projects found for this user." });
      }
  
      // Check if the project exists
      const project = userProject.projects.id(projectId);
  
      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }
  
      // Remove the project from the array using the pull method
      userProject.projects.pull(projectId);
  
      // Save the updated Project document
      await userProject.save();
  
      return res.status(200).json({ message: "Project deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  