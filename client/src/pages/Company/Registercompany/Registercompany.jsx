import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import { useForm } from "react-hook-form";
import BackgroundImage from "../../../assets/img/backgrounds/companyregister.jpg";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff4081",
    },
  },
});

const TransparentBox = styled(Box)({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
});

const BackgroundContainer = styled(Container)({
  backgroundImage: `url(${BackgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "top",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const RegisterCompany = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [userEmail, setUserEmail] = useState("");
  const [isCodeValid, setIsCodeValid] = useState(null);

  const handleVerificationCodeChange = (index, value) => {
    const newCode = [...verificationCode];
    if (value.length > 1) {
      const pastedValues = value.slice(0, 6).split("");
      pastedValues.forEach((digit, i) => {
        newCode[i] = digit;
      });
    } else {
      newCode[index] = value.slice(-1);
    }
    setVerificationCode(newCode);

    if (newCode.every((digit) => digit !== "")) {
      verifyCode(newCode.join(""));
    }

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      const newCode = [...verificationCode];
      if (newCode[index]) {
        newCode[index] = "";
      } else if (index > 0) {
        document.getElementById(`code-input-${index - 1}`).focus();
        newCode[index - 1] = "";
      }
      setVerificationCode(newCode);
    }
  };

  const verifyCode = async (code) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/company/verify-company`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, code }),
        }
      );

      if (response.ok) {
        setIsCodeValid(true);
        setTimeout(() => {
          setVerificationModal(false);
          setAlertMessage("Email verified successfully! Pending admin approval.");
          setAlertType("success");
          reset();
        }, 1500);
      } else {
        setIsCodeValid(false);
        setAlertMessage("Invalid verification code. Please try again.");
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage("Verification error. Please try again.");
      setAlertType("error");
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/company/companies-register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setUserEmail(data.email);
        setVerificationModal(true);
        setAlertMessage("Verification code sent to your email.");
        setAlertType("info");
      } else {
        setAlertMessage(result.message || "Failed to register company");
        setAlertType("error");
      }
    } catch (error) {
      setAlertMessage("An error occurred. Please try again.");
      setAlertType("error");
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <BackgroundContainer maxWidth="false">
        <TransparentBox maxWidth="md">
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Register Your Company
          </Typography>
          <Grid item xs={12} textAlign="center" sx={{ marginTop: 3 }}>
            <Typography variant="body1" sx={{ color: "#000000" }}>
              Not yet registered? Join us today to post jobs and attract top talent!
            </Typography>
          </Grid>

          {alertMessage && (
            <Alert severity={alertType} sx={{ mb: 2 }}>
              {alertMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Name" fullWidth variant="outlined"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="NTN" fullWidth variant="outlined"
                  {...register("ntnnumber", { required: "NTN is required" })}
                  error={!!errors.ntnnumber} helperText={errors.ntnnumber?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email" fullWidth variant="outlined"
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email} helperText={errors.email?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Person in contact" fullWidth variant="outlined"
                  {...register("personincontact", { required: "Contact person is required" })}
                  error={!!errors.personincontact} helperText={errors.personincontact?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="CNIC" fullWidth variant="outlined"
                  {...register("cnic", { required: "CNIC is required" })}
                  error={!!errors.cnic} helperText={errors.cnic?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Password" fullWidth variant="outlined" type="password"
                  {...register("password", { required: "Password is required" })}
                  error={!!errors.password} helperText={errors.password?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="City" fullWidth variant="outlined"
                  {...register("city", { required: "City is required" })}
                  error={!!errors.city} helperText={errors.city?.message} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Website" fullWidth variant="outlined"
                  {...register("website")}
                  placeholder="Optional" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Facebook" fullWidth variant="outlined"
                  {...register("facebook")}
                  placeholder="Optional" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="LinkedIn" fullWidth variant="outlined"
                  {...register("linkedin")}
                  placeholder="Optional" />
              </Grid>
            </Grid>
            <Box textAlign="center" mt={4}>
              <Button type="submit" variant="contained" color="primary" size="large"
                disabled={loading} startIcon={loading && <CircularProgress size={24} />}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </Box>
          </form>
        </TransparentBox>

        {/* Verification Code Modal */}
        <Dialog open={verificationModal} keepMounted fullWidth maxWidth="xs">
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogContent>
            <Box display="flex" justifyContent="center" gap={1}>
              {verificationCode.map((digit, index) => (
                <input key={index} id={`code-input-${index}`} type="text" maxLength="1"
                  value={digit} onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: "40px", height: "40px", textAlign: "center", fontSize: "1.5rem",
                    border: `2px solid ${isCodeValid === true ? "green" : isCodeValid === false ? "red" : "#e0e0e0"}`,
                    borderRadius: "5px", transition: "border-color 0.3s ease",
                  }}
                />
              ))}
            </Box>
            {isCodeValid && (
              <Typography color="green" variant="body1" align="center" mt={2}>
                Email verified successfully! Pending admin approval.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVerificationCode(["", "", "", "", "", ""])} color="secondary">
              Clear
            </Button>
          </DialogActions>
        </Dialog>
      </BackgroundContainer>
    </ThemeProvider>
  );
};

export default RegisterCompany;
