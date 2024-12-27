import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

// Custom styling for the form
const FormContainer = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(15px)",
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
}));

const BackgroundContainer = styled("div")({
  minHeight: "100vh",
  backgroundImage: `url('https://img.freepik.com/free-photo/colorful-arrow-symbols-mobile-phone-pen-blue-backdrop_23-2147875665.jpg?t=st=1728023065~exp=1728026665~hmac=306302eaedef8d45a18fc978d06eaa821a6158ebf4919bb8718be42247f35f8e&w=996')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
});

const PinkButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ff4c8b",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#ff3a79",
  },
}));

// Custom pink theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff4c8b",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label.Mui-focused": {
            color: "#ff4c8b",
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#ff4c8b",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#000",
            },
            "&:hover fieldset": {
              borderColor: "#ff4c8b",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff4c8b",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#000",
            },
            "&:hover fieldset": {
              borderColor: "#ff4c8b",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ff4c8b",
            },
          },
        },
      },
    },
  },
});

const Postajob = () => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    minPrice: "",
    maxPrice: "",
    salaryType: "",
    jobLocation: "",
    postingDate: "",
    experienceLevel: "",
    companyLogo: null,
    employmentType: "",
    description: "",
    jobPostedBy: "",
    category: "", // Added field for category
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formToSubmit = new FormData();
    for (const key in formData) {
      formToSubmit.append(key, formData[key]);
    }

    if (selectedOption.length > 0) {
      formToSubmit.append(
        "skillsRequired",
        JSON.stringify(selectedOption.map((option) => option.value))
      );
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jobs/create-new-jobs`, {
      method: "POST",
      body: formToSubmit,
      credentials: "include", // This will include credentials such as cookies
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setAlert({
            open: true,
            message: "Job posted successfully",
            severity: "success",
          });
          setFormData({
            jobTitle: "",
            companyName: "",
            minPrice: "",
            maxPrice: "",
            salaryType: "",
            jobLocation: "",
            postingDate: "",
            experienceLevel: "",
            companyLogo: null,
            employmentType: "",
            description: "",
            jobPostedBy: "",
            category: "", // Reset category on success
          });
          setSelectedOption([]);
        } else {
          setAlert({
            open: true,
            message: "Failed to post job: " + result.message,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: "An error occurred while posting the job.",
          severity: `error ${error}`,
        });
      });
  };

  const options = [
    { value: "Javascript", label: "Javascript" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "Bootstrap", label: "Bootstrap" },
    { value: "Tailwind", label: "Tailwind" },
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Express", label: "Express" },
    { value: "Redux", label: "Redux" },
    { value: "Github", label: "Github" },
    { value: "AWS", label: "AWS" },
  ];

  const customSelectStyles = {
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      color: "#000",
      opacity: 1,
      zIndex: 9999,
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderColor: "#000",
      color: "#fff",
      "&:hover": {
        borderColor: "#ff4c8b",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
  };

 
  return (
    <ThemeProvider theme={theme}>
      <BackgroundContainer>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ color: "#000000" }}
          >
            Post a Job
          </Typography>

          {/* <Grid item xs={12} textAlign="center" sx={{ marginTop: 3 }}>
            <Typography variant="body1" sx={{ color: "#000000" }}>
              Not yet registered? Join us today to post jobs and attract top talent! 
            </Typography>
            <Typography variant="body2" sx={{ color: "#ff4c8b", marginTop: 1 }}>
              Only businesses legally registered and compliant with local laws are eligible to post jobs on our platform.
            </Typography>
          </Grid> */}

          <FormContainer component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  sx={{ input: { color: "" } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Minimum Salary"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Maximum Salary"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Salary Type</InputLabel>
                  <Select
                    label="Salary Type"
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Choose your salary</MenuItem>
                    <MenuItem value="Hourly">Hourly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Job Location"
                  name="jobLocation"
                  value={formData.jobLocation}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  label="Job Posting Date"
                  name="postingDate"
                  value={formData.postingDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    label="Experience Level"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Choose your experience</MenuItem>
                    <MenuItem value="Intern / Student">
                      Intern / Student
                    </MenuItem>
                    <MenuItem value="Entry Level">Entry Level</MenuItem>
                    <MenuItem value="Experienced Professional">
                      Experienced Professional
                    </MenuItem>
                    <MenuItem value="Department Head">Department Head</MenuItem>
                    <MenuItem value="GM / CEO/Country Head / President">
                      GM / CEO / Country Head / President
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <InputLabel>Required Skill Sets</InputLabel>
                <CreatableSelect
                  isMulti
                  options={options}
                  value={selectedOption}
                  onChange={setSelectedOption}
                  styles={customSelectStyles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="file"
                  label="Company Logo"
                  name="companyLogo"
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    label="Employment Type"
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Choose your employment type</MenuItem>
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Temporary">Temporary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Job Description"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Job Posted By"
                  name="jobPostedBy"
                  value={formData.jobPostedBy}
                  onChange={handleInputChange}
                  placeholder="your email address"
                />
              </Grid>

              {/* Category Selection Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="design-creative">
                      Design & Creative
                    </MenuItem>
                    <MenuItem value="design-development">
                      Design & Development
                    </MenuItem>
                    <MenuItem value="sales-marketing">
                      Sales & Marketing
                    </MenuItem>
                    <MenuItem value="mobile-application">
                      Mobile Application
                    </MenuItem>
                    <MenuItem value="construction">Construction</MenuItem>
                    <MenuItem value="information-technology">
                      Information Technology
                    </MenuItem>
                    <MenuItem value="real-estate">Real Estate</MenuItem>
                    <MenuItem value="content-writer">Content Writer</MenuItem>
                    <MenuItem value="finance-accounting">
                      Finance & Accounting
                    </MenuItem>
                    <MenuItem value="customer-service">
                      Customer Service
                    </MenuItem>
                    <MenuItem value="healthcare-medical">
                      Healthcare & Medical
                    </MenuItem>
                    <MenuItem value="engineering">Engineering</MenuItem>
                    <MenuItem value="education-training">
                      Education & Training
                    </MenuItem>
                    <MenuItem value="human-resources">Human Resources</MenuItem>
                    <MenuItem value="administrative-clerical">
                      Administrative & Clerical
                    </MenuItem>
                    <MenuItem value="legal">Legal</MenuItem>
                    <MenuItem value="manufacturing-operations">
                      Manufacturing & Operations
                    </MenuItem>
                    <MenuItem value="project-management">
                      Project Management
                    </MenuItem>
                    <MenuItem value="logistics-supply-chain">
                      Logistics & Supply Chain
                    </MenuItem>
                    <MenuItem value="retail-ecommerce">
                      Retail & E-commerce
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} textAlign="center">
                <PinkButton type="submit" variant="contained" size="large">
                  Post Job
                </PinkButton>
              </Grid>
            </Grid>
          </FormContainer>

          {/* Snackbar and Alert for feedback */}
          <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseAlert}
              severity={alert.severity}
              sx={{ width: "100%" }}
            >
              {alert.message}
            </Alert>
          </Snackbar>
        </Container>
      </BackgroundContainer>
    </ThemeProvider>
  );
};

export default Postajob;
