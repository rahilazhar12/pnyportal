import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  CircularProgress,
  Alert,
  AlertTitle,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { pink, grey } from "@mui/material/colors";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import companybgimage from "../../../assets/img/backgrounds/userbg.jpg";

// Custom theme
const theme = createTheme({
  palette: {
    primary: pink,
  },
});

// Styled components
const StyledBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundImage: `url(${companybgimage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const FormBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  maxWidth: "400px",
  width: "100%",
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  backgroundColor: grey[50],
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  fontSize: "0.9rem",
  color: grey[800],
  fontWeight: "bold",
}));

// Transition for modal
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CompanyLogin = () => {
  const navigate = useNavigate();

  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
    open: false,
  });
  const [loading, setLoading] = useState(false);

  // Verification modal states
  const [verificationModal, setVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isCodeValid, setIsCodeValid] = useState(null); // null: no check, true: valid, false: invalid
  const [showPassword, setShowPassword] = useState(false);
  // Forgot password / OTP states
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Loading states for forgot password and OTP reset (to show spinners)
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [otpResetLoading, setOtpResetLoading] = useState(false);

  const loginCompany = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/company/companies-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          `${import.meta.env.CRYPTO_SECRET}`
        ).toString();

        localStorage.setItem("Data", encryptedData);
        navigate("/");
        window.location.reload();
        setAlert({
          severity: "success",
          message: "Login successful!",
          open: true,
        });
      } else {
        setAlert({ severity: "error", message: data.message, open: true });
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message: "An error occurred. Please try again later.",
        open: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/company/companies-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          `${import.meta.env.CRYPTO_SECRET}`
        ).toString();

        localStorage.setItem("Data", encryptedData);
        navigate("/");
        window.location.reload();
        setAlert({ severity: "success", message: data.message, open: true });
      } else if (
        data.message ===
        "Account not verified. A new verification code has been sent to your email."
      ) {
        setAlert({ severity: "warning", message: data.message, open: true });
        setTimeout(() => {
          setVerificationModal(true);
        }, 2000);
      } else {
        setAlert({ severity: "error", message: data.message, open: true });
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message: "An error occurred. Please try again later.",
        open: true,
      });
      setLoading(false);
    }
  };

  const handleVerificationCodeChange = (index, value) => {
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);

    if (newCode.every((digit) => digit !== "")) {
      verifyCode(newCode.join(""));
    }

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const verifyCode = async (code) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/company/verify-company`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        }
      );

      if (response.ok) {
        setIsCodeValid(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setVerificationModal(false);
        setAlert({
          severity: "success",
          message: "Account verified successfully! Logging in...",
          open: true,
        });

        setTimeout(loginCompany, 1000);
      } else {
        setIsCodeValid(false);
        setAlert({
          severity: "error",
          message: "Incorrect code. Please try again.",
          open: true,
        });
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message: "An error occurred during verification. Please try again.",
        open: true,
      });
    }
  };

  const handleClearCode = () => {
    setVerificationCode(["", "", "", "", "", ""]);
    setIsCodeValid(null);
    document.getElementById("code-input-0").focus();
  };

  const handleToastClose = () => {
    setAlert({ ...alert, open: false });
  };

  // Forgot Password Flow
  const requestPasswordReset = async () => {
    // Show loading spinner for forgot password
    setForgotPasswordLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/reset/reset-password-company`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setForgotPasswordModal(false);
        setOtpModal(true);
        setAlert({
          severity: "success",
          message: "OTP sent to email",
          open: true,
        });
      } else {
        setAlert({ severity: "error", message: data.message, open: true });
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message: "Error in connection",
        open: true,
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const verifyOtpAndResetPassword = async () => {
    // Show loading spinner for OTP reset
    setOtpResetLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/reset/verify-otp-company`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, password: newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOtpModal(false);
        setAlert({
          severity: "success",
          message: "Password reset successfully",
          open: true,
        });
      } else {
        setAlert({ severity: "error", message: data.message, open: true });
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message: "Error in connection",
        open: true,
      });
    } finally {
      setOtpResetLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledBox>
        <Container component="main" maxWidth="xs">
          {alert.open && (
            <StyledAlert severity={alert.severity} onClose={handleToastClose}>
              <AlertTitle>
                {alert.severity === "success"
                  ? "Success"
                  : alert.severity === "error"
                  ? "Error"
                  : "Warning"}
              </AlertTitle>
              {alert.message}
            </StyledAlert>
          )}
          <FormBox>
            <Typography component="h1" variant="h5" align="center">
              Company Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
              <Button
                fullWidth
                color="secondary"
                sx={{ mt: 1 }}
                onClick={() => setForgotPasswordModal(true)}
              >
                Forgot Password?
              </Button>
            </form>
          </FormBox>
        </Container>

        {/* Verification Code Modal */}
        <Dialog
          open={verificationModal}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="verification-dialog-description"
          fullWidth
          maxWidth="xs"
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
                  onChange={(e) =>
                    handleVerificationCodeChange(index, e.target.value)
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    border: `2px solid ${
                      isCodeValid === true
                        ? "green"
                        : isCodeValid === false
                        ? "red"
                        : "#e0e0e0"
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

        {/* Forgot Password Modal */}
        <Dialog
          open={forgotPasswordModal}
          TransitionComponent={Transition}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent className="mt-10">
            <TextField
              placeholder="Please Enter Your Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForgotPasswordModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={requestPasswordReset}
              color="primary"
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Send OTP"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* OTP and New Password Modal */}
        <Dialog
          open={otpModal}
          TransitionComponent={Transition}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Enter OTP & New Password</DialogTitle>
          <DialogContent>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOtpModal(false)}>Cancel</Button>
            <Button
              onClick={verifyOtpAndResetPassword}
              color="primary"
              disabled={otpResetLoading}
            >
              {otpResetLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Reset Password"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </StyledBox>
    </ThemeProvider>
  );
};

export default CompanyLogin;
