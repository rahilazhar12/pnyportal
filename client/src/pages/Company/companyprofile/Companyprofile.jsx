import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Paper,
  Modal,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import { FormControl } from "@mui/material";
import { experienceLevels } from "../../../components/Data/Dropdownsdata";
import { employmentTypes } from "../../../components/Data/Dropdownsdata";
import { jobCategories } from "../../../components/Data/Dropdownsdata";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null); // Track job selected for deletion

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/jobs/get-jobs-companyId`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error("Failed to fetch jobs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Open the modal for editing
  const handleEdit = (job) => {
    setEditJob(job);
    setOpenModal(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpenModal(false);
    setEditJob(null);
  };

  // Handle save after editing
  const handleSave = async () => {
    if (!editJob) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/jobs/update-job/${editJob._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editJob),
        }
      );

      if (response.ok) {
        const updatedJob = await response.json();
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === updatedJob.job._id ? updatedJob.job : job
          )
        );
        handleClose();
      } else {
        console.error("Failed to update job:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  // Handle delete modal open
  const handleDeleteModalOpen = (job) => {
    setJobToDelete(job);
    setOpenDeleteModal(true);
  };

  // Confirm and delete job
  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/jobs/delete-jobs/${
          jobToDelete._id
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setJobs((prevJobs) =>
          prevJobs.filter((job) => job._id !== jobToDelete._id)
        );
      } else {
        console.error("Failed to delete job:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setOpenDeleteModal(false);
      setJobToDelete(null);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const applyForJob = (job) => {
    const jobTitleWithoutSpaces = job.jobTitle.replace(/\s+/g, ""); // Remove spaces
    const jobIdLastTwoDigits = job._id.slice(-5); // Get last two digits of _id
    navigate(`/job_details/${jobTitleWithoutSpaces}-${jobIdLastTwoDigits}`, {
      state: { job },
    }); // Pass job data via state
  };

  return (
    <Container sx={{ py: 5 }} maxWidth="xl">
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        Company Dashboard
      </Typography>
      {jobs.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "100%", overflowX: "auto" }}
        >
          <Table aria-label="jobs table">
            <TableHead>
              <TableRow>
                <TableCell>Job Title</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.jobTitle}</TableCell>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>{job.jobLocation}</TableCell>
                  <TableCell>
                    {job.minPrice} - {job.maxPrice} {job.salaryType}
                  </TableCell>
                  <TableCell>{job.experienceLevel}</TableCell>
                  <TableCell align="center" sx={{ p: 0 }}>
                    <Button
                      onClick={() => handleEdit(job)}
                      size="small"
                      color="primary"
                      variant="contained"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteModalOpen(job)}
                      size="small"
                      color="secondary"
                      variant="contained"
                    >
                      Delete
                    </Button>
                    <Link
                      to={`/application_details/${job._id}`}
                      className="ml-2"
                    >
                      <Button size="small" color="warning" variant="contained">
                        Resume
                      </Button>
                    </Link>
                    <Button onClick={() => applyForJob(job)} className="ml-2">
                      <Button size="small" color="info" variant="contained">
                        View
                      </Button>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" align="center" sx={{ width: "100%", mt: 5 }}>
          No jobs found.
        </Typography>
      )}

      {/* Edit Modal */}
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            width: { xs: "95%", sm: "80%", md: "60%", lg: "50%" },
            maxHeight: "90vh",
            overflowY: "auto",
            p: 4,
            bgcolor: "background.paper",
            mx: "auto",
            mt: 2,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Edit Job
          </Typography>
          <Grid container spacing={3}>
            {/** Job Details Section */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Job Title"
                fullWidth
                value={editJob?.jobTitle || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobTitle: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Company Name"
                fullWidth
                value={editJob?.companyName || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, companyName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Location"
                fullWidth
                value={editJob?.jobLocation || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, jobLocation: e.target.value })
                }
              />
            </Grid>

            {/** Salary Section */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Minimum Salary"
                fullWidth
                value={editJob?.minPrice || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, minPrice: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Maximum Salary"
                fullWidth
                value={editJob?.maxPrice || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, maxPrice: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Salary Type</InputLabel>
                <Select
                  value={editJob?.salaryType || ""}
                  onChange={(e) =>
                    setEditJob({ ...editJob, salaryType: e.target.value })
                  }
                >
                  <MenuItem value="Hourly">Hourly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/** Experience, Skills, Employment Type */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={editJob?.experienceLevel || ""}
                  onChange={(e) =>
                    setEditJob({ ...editJob, experienceLevel: e.target.value })
                  }
                >
                  {experienceLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={editJob?.employmentType || ""}
                  onChange={(e) =>
                    setEditJob({ ...editJob, employmentType: e.target.value })
                  }
                >
                  {employmentTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/** Category & Description */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editJob?.category || ""}
                  onChange={(e) =>
                    setEditJob({ ...editJob, category: e.target.value })
                  }
                >
                  {jobCategories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Expiration Date"
                type="date"
                fullWidth
                value={editJob?.expirationDate || ""}
                onChange={(e) =>
                  setEditJob({ ...editJob, expirationDate: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                multiline
                rows={3}
                value={editJob?.jobDescription || ""}
                onChange={(e) =>
                  e.target.value.length <= 300 &&
                  setEditJob({ ...editJob, jobDescription: e.target.value })
                }
                helperText={`${
                  300 - (editJob?.jobDescription?.length || 0)
                } characters remaining`}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1">Skills Required</Typography>
              <CreatableSelect
                isMulti
                value={
                  editJob?.skillsRequired?.map((skill) => ({
                    value: skill,
                    label: skill,
                  })) || []
                }
                onChange={(selected) =>
                  setEditJob({
                    ...editJob,
                    skillsRequired: selected.map((option) => option.value),
                  })
                }
                placeholder="Add skills"
              />
            </Grid>

            {/** Expiration Date & Job Description */}

            <Grid item xs={12}>
              <Typography variant="subtitle1">Job Description</Typography>
              <ReactQuill
              className="h-52"
                value={editJob?.description || ""}
                onChange={(value) =>
                  setEditJob({ ...editJob, description: value })
                }
                theme="snow"
              />
            </Grid>
          </Grid>

          {/** Save Button */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 2, px: 3  , marginTop:5}}
            >
              Save Job
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            No
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CompanyProfile;
