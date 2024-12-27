import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSessionStorage } from "../../context/Sessionstorage";
import logo from "../../assets/img/logo/logo.png";
import { NavLink } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DropdownUser from "../profile/Dropdownuser";

const Navbar = () => {
  const { user, role, logout } = useSessionStorage();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openUserTypeDialog, setOpenUserTypeDialog] = useState(false);
  const [openLoginTypeDialog, setOpenLoginTypeDialog] = useState(false); // State for login type dialog

  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUserRegisterClick = () => {
    setOpenUserTypeDialog(true);
  };

  const handleUserLoginClick = () => {
    setOpenLoginTypeDialog(true); // Open dialog for login selection
  };

  const handleUserTypeSelection = (userType) => {
    setOpenUserTypeDialog(false);
    setTimeout(() => {
      if (userType === "individual") {
        navigate("/register-student");
      } else if (userType === "company") {
        navigate("/register-company");
      }
    }, 100);
  };

  const handleLoginTypeSelection = (loginType) => {
    setOpenLoginTypeDialog(false);
    setTimeout(() => {
      if (loginType === "individual") {
        navigate("/login-users"); // Navigate to individual login
      } else if (loginType === "company") {
        navigate("/company-login"); // Navigate to company login
      }
    }, 100);
  };

  const logouthandler = () => {
    logout();
  };

  return (
    <>
      <nav className="bg-white shadow-md w-full sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-16  flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-16" />
            </Link>
            <div className="hidden lg:block">
              <h1 className="text-sm font-bold text-blue-500">Job Finder</h1>
              <p className="text-red-500 text-xs font-montserrat-underline">
                Where Dreams Meet Opportunities!
              </p>
            </div>
          </div>

          <div className="hidden md:flex space-x-4">
            {role === "User" && (
              <>
                <Link
                  to="/new-profile"
                  className="px-4 py-2 text-black transition duration-300 ease-in-out"
                >
                  Profile
                </Link>
              </>
            )}
            {role === "company" && (
              <>
                <Link
                  to="/post-jobs"
                  className="px-4 py-2 text-black  transition duration-300 ease-in-out"
                >
                  Post Jobs
                </Link>
                <Link
                  to="/company-profile"
                  className="px-4 py-2 text-black  transition duration-300 ease-in-out"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex space-x-4">
            {user ? (
              <DropdownUser />
            ) : (
              <>
                <button
                  onClick={handleUserRegisterClick}
                  className=" text-white px-4  rounded-md bg-[#46b749] transition duration-300 ease-in-out"
                >
                  Register
                </button>

                <button
                  onClick={handleUserLoginClick}
                  className=" text-white px-4 py-1 rounded-md bg-[#337ab7] transition duration-300 ease-in-out"
                >
                  Login
                </button>

                <Link
                  to="/company-login"
                  className="text-white px-4 py-1 rounded-md bg-[#233261] transition duration-300 ease-in-out"
                >
                  Post a Job
                </Link>
                <Link
                  to="/admin-login"
                  className="px-4 py-1 rounded-md bg-yellow-700  text-white transition duration-300 ease-in-out"
                >
                  Admin
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* User Type Selection Dialog */}
        <Dialog
          fullScreen={isFullScreen}
          open={openUserTypeDialog}
          onClose={() => setOpenUserTypeDialog(false)}
          PaperProps={{
            style: {
              borderRadius: "12px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogContent
            style={{
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "20px",
            }}
          >
            <DialogTitle
              style={{ textAlign: "center", color: "#333", fontSize: "1.5rem" }}
            >
              Select Your Account Type
            </DialogTitle>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              style={{ marginBottom: "16px" }}
            >
              Are you here for personal growth or business success
            </Typography>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "center", paddingBottom: "16px" }}
          >
            <Button
              onClick={() => handleUserTypeSelection("individual")}
              variant="outlined"
              style={{
                margin: "8px",
                borderColor: "#007FFF",
                color: "#007FFF",
              }}
            >
              Individual
            </Button>
            <Button
              onClick={() => handleUserTypeSelection("company")}
              variant="contained"
              color="primary"
              style={{ margin: "8px" }}
            >
              Company
            </Button>
          </DialogActions>
        </Dialog>

        {/* Login Type Selection Dialog */}
        <Dialog
          fullScreen={isFullScreen}
          open={openLoginTypeDialog}
          onClose={() => setOpenLoginTypeDialog(false)}
          PaperProps={{
            style: {
              borderRadius: "12px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogContent
            style={{
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: "20px",
            }}
          >
            <DialogTitle
              style={{ textAlign: "center", color: "#333", fontSize: "1.5rem" }}
            >
              Select Login Type
            </DialogTitle>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              style={{ marginBottom: "16px" }}
            >
              Choose whether you are logging in as an individual or a company.
            </Typography>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "center", paddingBottom: "16px" }}
          >
            <Button
              onClick={() => handleLoginTypeSelection("individual")}
              variant="outlined"
              style={{
                margin: "8px",
                borderColor: "#007FFF",
                color: "#007FFF",
              }}
            >
              Individual
            </Button>
            <Button
              onClick={() => handleLoginTypeSelection("company")}
              variant="contained"
              color="primary"
              style={{ margin: "8px" }}
            >
              Company
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden bg-white transition duration-300 ease-in-out transform ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <div className="px-4 py-2 space-y-2">
              <Link to="/" className="block text-gray-700 hover:text-blue-900">
                Home
              </Link>
              {role === "company" && (
                <>
                  <Link to="/post-jobs" className="hover:text-blue-900">
                    Post a Job
                  </Link>
                  <Link to="/company-profile" className="hover:text-blue-900">
                    Profile
                  </Link>
                </>
              )}
              <div className="flex flex-col space-y-2">
                {user ? null : (
                  <>
                    <Button
                      onClick={handleUserRegisterClick}
                      className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300 ease-in-out"
                    >
                      User Register
                    </Button>
                    <Button
                      onClick={handleUserLoginClick}
                      className="border border-pink-500 text-pink-500 px-4 py-2 rounded-md hover:bg-pink-50 transition duration-300 ease-in-out"
                    >
                      User Login
                    </Button>
                  </>
                )}
                {(role === "User" || role === "pnyalumini") && (
                  <NavLink
                    to="/new-profile"
                    className={({ isActive }) =>
                      isActive ? "text-blue-900" : "hover:text-blue-900"
                    }
                  >
                    Profile Builder
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
