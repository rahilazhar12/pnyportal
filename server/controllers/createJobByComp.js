const Jobs = require('../models/postJobs.js');


// exports.createNewJob = async (req, res) => {
//   const { companyName, jobTitle, companyLogo, minPrice, maxPrice, salaryType, jobLocation, postingDate, experienceLevel, skillsRequired, employmentType, description, jobPostedBy, category } = req.body;
//   const { id } = req.user
//   let companyLogoFilename = req.file ? req.file.filename : null;



//   // checking whether a user provided all requisite information

//   if (!companyName) {
//     return res.status(401).json({ message: "Company name is required" });
//   }
//   if (!jobTitle) {
//     return res.status(401).json({ message: "Job title is required" });
//   }
//   // if (!companyLogo) {
//   //   return res.status(401).json({ message: "Company logo is required" });
//   // }
//   if (!minPrice) {
//     return res.status(401).json({ message: "Minimum price is required" });
//   }
//   if (!maxPrice) {
//     return res.status(401).json({ message: "Maximum price is required" });
//   }
//   if (!salaryType) {
//     return res.status(401).json({ message: "Salary type price is required" });
//   }
//   if (!jobLocation) {
//     return res.status(401).json({ message: "Job location price is required" });
//   }
//   if (!postingDate) {
//     return res.status(401).json({ message: "Posting date price is required" });
//   }
//   if (!experienceLevel) {
//     return res.status(401).json({ message: "Experience level price is required" });
//   }
//   if (!skillsRequired) {
//     return res.status(401).json({ message: "Required skils is required" });
//   }
//   if (!employmentType) {
//     return res.status(401).json({ message: "Employment type is required" });
//   }
//   if (!description) {
//     return res.status(401).json({ message: "Description is required" });
//   }
//   if (!jobPostedBy) {
//     return res.status(401).json({ message: "Job posted by is required" });
//   }
//   if (!category) {
//     return res.status(401).json({ message: "Category is required" });
//   }

//   try {
//     // creating new job entry
//     let job = await new Jobs({
//       companyName,
//       jobTitle,
//       minPrice,
//       maxPrice,
//       salaryType,
//       jobLocation,
//       postingDate,
//       experienceLevel,
//       skillsRequired,
//       employmentType,
//       description,
//       jobPostedBy,
//       category,
//       companyLogo: companyLogoFilename,
//       companyId: id
//     }).save();
//     // res.send(job);

//     res.status(200).send({
//       success: true,
//       message: "job posted successfully",
//       job
//     });
//   }
//   catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in posting job",
//       error,
//     });
//   }
// };

exports.createNewJob = async (req, res) => {
  const { 
    companyName, jobTitle, companyLogo, minPrice, maxPrice, salaryType, 
    jobLocation, postingDate, expirationDate, experienceLevel, skillsRequired, 
    employmentType, description, jobPostedBy, category , jobDescription
  } = req.body;
  
  const { id } = req.user;
  let companyLogoFilename = req.file ? req.file.filename : null;

  // Checking required fields
  if (!companyName) return res.status(401).json({ message: "Company name is required" });
  if (!jobTitle) return res.status(401).json({ message: "Job title is required" });
  if (!minPrice) return res.status(401).json({ message: "Minimum price is required" });
  if (!maxPrice) return res.status(401).json({ message: "Maximum price is required" });
  if (!salaryType) return res.status(401).json({ message: "Salary type is required" });
  if (!jobLocation) return res.status(401).json({ message: "Job location is required" });
  if (!postingDate) return res.status(401).json({ message: "Posting date is required" });
  if (!expirationDate) return res.status(401).json({ message: "Expiration date is required" });
  if (!experienceLevel) return res.status(401).json({ message: "Experience level is required" });
  if (!skillsRequired) return res.status(401).json({ message: "Skills required is required" });
  if (!employmentType) return res.status(401).json({ message: "Employment type is required" });
  if (!description) return res.status(401).json({ message: "Description is required" });
  if (!jobPostedBy) return res.status(401).json({ message: "Job posted by is required" });
  if (!category) return res.status(401).json({ message: "Category is required" });
  if (!jobDescription) return res.status(401).json({ message: "JobDescription is required" });

  // Ensure expiration date is valid
  if (new Date(expirationDate) <= new Date(postingDate)) {
    return res.status(400).json({ message: "Expiration date must be after the posting date" });
  }

  try {
    // Creating new job entry
    let job = await new Jobs({
      companyName,
      jobTitle,
      minPrice,
      maxPrice,
      salaryType,
      jobLocation,
      postingDate,
      expirationDate, // Save expiration date
      experienceLevel,
      skillsRequired,
      employmentType,
      description,
      jobPostedBy,
      category,
      jobDescription,
      companyLogo: companyLogoFilename,
      companyId: id
    }).save();

    res.status(200).send({
      success: true,
      message: "Job posted successfully",
      job
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in posting job",
      error,
    });
  }
};


exports.Getjobsbycategories = async (req, res) => {
  try {
    // Fetch jobs by category and populate the `about` field from the associated company
    const jobs = await Jobs.find({ category: req.params.category })
      .populate({
        path: 'companyId', // Refers to the companyId field in the jobs schema
        select: 'about', // Fetch only the `about` field from the company
      });

    // Transform the response to include `about` at the top level
    const jobsWithAbout = jobs.map(job => {
      return {
        ...job._doc, // Spread job details
        about: job.companyId?.about, // Add the about field from the populated company
      };
    });

    res.status(200).send(jobsWithAbout);
  } catch (error) {
    res.status(500).send({ message: "Error fetching jobs", error });
  }
};




exports.GetjobsbycompanyId = async (req, res) => {
  try {
    // Assuming req.user contains the decoded JWT payload with companyId
    const companyId = req.user.id; // JWT should contain companyId in the payload, or it's the user's id that matches companyId


    // Fetch jobs by companyId
    const jobs = await Jobs.find({ companyId });

    // Return the list of jobs
    res.status(200).send(jobs);
  } catch (error) {
    // Handle any errors during the database query
    res.status(500).send({ message: "Error fetching jobs by company", error });
  }
};










