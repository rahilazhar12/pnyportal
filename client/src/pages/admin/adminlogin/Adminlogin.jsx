import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdLogin } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/Sessionstorage"; // Import the context

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser, setRole } = useContext(UserContext); // Use context to set user and role
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/members/member-login`,
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
          `${import.meta.env.VITE_CRYPTO_SECRET}`
        ).toString();
        localStorage.setItem("Data", encryptedData);

        // Set user data in context
        setUser(data);
        setRole(data.role);

        navigate("/admin-dashboard");
        window.location.reload();

        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message:
            data.message || "Login failed. Please check your credentials.",
          severity: "error",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "An error occurred. Please try again later.",
        severity: "error",
      });
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://www.yalgaar.io/Content/themes/Admin/img/login_full_bg.jpg")',
      }}
    >
      <Paper
        elevation={3}
        className="w-full max-w-md p-8 rounded-lg shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <AiOutlineUser size={50} className="text-gray-700 mb-2" />
          <Typography variant="h5" className="text-gray-700 font-bold mb-4">
            Admin Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            autoComplete="off"
            className="w-full space-y-4"
          >
            <Box
              display="flex"
              alignItems="center"
              className="border-b-2 border-gray-300 py-2"
            >
              <AiOutlineUser size={20} className="text-gray-500 mr-2" />
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
            </Box>
            <Box
              display="flex"
              alignItems="center"
              className="border-b-2 border-gray-300 py-2"
            >
              <RiLockPasswordLine size={20} className="text-gray-500 mr-2" />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            {error && (
              <Typography color="error" variant="body2" className="mt-2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              startIcon={<MdLogin />}
              className="mt-4"
              disabled={isSubmitting}
            >
              Login
            </Button>
          </Box>
          <Typography variant="body2" color="textSecondary" className="mt-4">
            © 2024 Admin Panel. All rights reserved.
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLogin;
