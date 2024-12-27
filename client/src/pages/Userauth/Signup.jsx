import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Grid,
  useMediaQuery,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import userbgimage from "../../assets/img/backgrounds/userbg.jpg";


// Transition for modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StudentRegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [alumniStatus, setAlumniStatus] = useState("No");
  const [batchNo, setBatchNo] = useState("");
  const [courseName, setCourseName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [isCodeValid, setIsCodeValid] = useState(null); // null: no check, true: valid, false: invalid
  const [showCompletion, setShowCompletion] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAlumniChange = (event) => {
    setAlumniStatus(event.target.value);
    if (event.target.value === "Yes") {
      setOpenModal(true);
    } else {
      setBatchNo("");
      setCourseName("");
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    const payload = {
      name,
      email,
      password,
      contact,
      city,
      isPNYAlumni: alumniStatus === "Yes",
      batchNo: alumniStatus === "Yes" ? batchNo : undefined,
      courseName: alumniStatus === "Yes" ? courseName : undefined,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/register-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setLoading(false); // Stop loading

      if (response.ok) {
        setToast({ open: true, message: "Verification code sent to your email.", severity: "success" });
        setUserEmail(email);
        setVerificationModal(true);
      } else {
        setToast({ open: true, message: data.message || "Failed to register user", severity: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setToast({ open: true, message: "An error occurred. Please try again.", severity: "error" });
      setLoading(false); // Stop loading
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    // Automatically verify if the code is complete
    if (newCode.every((digit) => digit !== "")) {
      verifyCode(newCode.join(""));
    }

    // Focus next input
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const verifyCode = async (code) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, code }),
        }
      );

      if (response.ok) {
        setIsCodeValid(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait briefly to show green color
        setVerificationModal(false);
        setShowCompletion(true);
        setTimeout(() => {
          setShowCompletion(false);
          navigate("/login-users");
        }, 2000);
      } else {
        setIsCodeValid(false);
      }
    } catch (error) {
      console.error("Verification Error:", error);
      setToast({ open: true, message: "An error occurred during verification. Please try again.", severity: "error" });
    }
  };

  const handleClearCode = () => {
    setVerificationCode(["", "", "", "", "", ""]);
    setIsCodeValid(null);
    document.getElementById("code-input-0").focus();
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: isMobile ? 2 : 0,
          backgroundImage: `url(${userbgimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography className="text-white" variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
          Student Registration
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: isMobile ? "100%" : 500,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: isMobile ? 2 : 4,
            borderRadius: 2,
            boxShadow: 3,
            backdropFilter: "blur(5px)",
          }}
        >
          <TextField label="Name" variant="outlined" fullWidth required value={name} onChange={(e) => setName(e.target.value)} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }} />

          <TextField label="Email" variant="outlined" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} type="email" InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Password" variant="outlined" fullWidth required type="password" value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Contact" variant="outlined" fullWidth required type="tel" value={contact} onChange={(e) => setContact(e.target.value)} InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }} />
            </Grid>
          </Grid>

          <TextField label="City" variant="outlined" fullWidth required value={city} onChange={(e) => setCity(e.target.value)} InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationCityIcon />
                </InputAdornment>
              ),
            }} />

          <TextField select label="Are you a PNY Alumni?" value={alumniStatus} onChange={handleAlumniChange} fullWidth required>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>

          {alumniStatus === "Yes" && (
            <>
              <TextField
                label="Batch No"
                variant="outlined"
                fullWidth
                required
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
              />
              <TextField
                label="Course Name"
                variant="outlined"
                fullWidth
                required
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </>
          )}

          <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </Box>

        {/* Verification Code Modal */}
        <Dialog
          open={verificationModal}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="verification-dialog-description"
          fullWidth
          maxWidth="xs"
          disableEscapeKeyDown // Prevent closing by pressing ESC
          PaperProps={{ onClick: (e) => e.stopPropagation() }} // Prevent closing by clicking outside
        >
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center" gap={1}>
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    border: `2px solid ${
                      isCodeValid === true ? "green" : isCodeValid === false ? "red" : "#e0e0e0"
                    }`,
                    borderRadius: "5px",
                    transition: "border-color 0.3s ease",
                  }}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClearCode} color="secondary">
              Clear
            </Button>
          </DialogActions>
        </Dialog>

        {/* Completion Animation */}
        {showCompletion && (
          <Box className="completion-animation">
            <CheckCircleOutlineIcon className="completion-icon" color="success" />
            <Typography variant="h6" color="green" className="completion-text">
              Registration Complete!
            </Typography>
          </Box>
        )}

        {/* Snackbar for Toast Notifications */}
        <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleToastClose}>
          <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: "100%" }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
