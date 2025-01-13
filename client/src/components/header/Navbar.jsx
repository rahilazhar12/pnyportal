import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSessionStorage } from "../../context/Sessionstorage";
import logo from "../../assets/img/logo/logo.png";
import DropdownUser from "../profile/Dropdownuser";

const Navbar = () => {
  const { user, role, logout } = useSessionStorage();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dropdown toggles
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle Register dropdown
  const handleRegisterDropdownToggle = () => {
    setIsRegisterDropdownOpen(!isRegisterDropdownOpen);
    // Ensure login dropdown is closed if open
    setIsLoginDropdownOpen(false);
  };

  // Toggle Login dropdown
  const handleLoginDropdownToggle = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
    // Ensure register dropdown is closed if open
    setIsRegisterDropdownOpen(false);
  };

  // Handle register type selection
  const handleRegisterTypeSelection = (userType) => {
    setIsRegisterDropdownOpen(false);
    setTimeout(() => {
      if (userType === "individual") {
        navigate("/register-student");
      } else if (userType === "company") {
        navigate("/register-company");
      }
    }, 100);
  };

  // Handle login type selection
  const handleLoginTypeSelection = (loginType) => {
    setIsLoginDropdownOpen(false);
    setTimeout(() => {
      if (loginType === "individual") {
        navigate("/login-users");
      } else if (loginType === "company") {
        navigate("/company-login");
      }
    }, 100);
  };

  // Logout
  const logouthandler = () => {
    logout();
  };

  return (
    <>
      <nav className="bg-white shadow-md w-full sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-16 flex items-center justify-between">
          {/* Logo Section */}
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

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-4">
           

            {role === "company" && (
              <>
                <Link
                  to="/post-jobs"
                  className="px-4 py-2 text-black transition duration-300 ease-in-out"
                >
                  Post Jobs
                </Link>
                <Link
                  to="/company-profile"
                  className="px-4 py-2 text-black transition duration-300 ease-in-out"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons & Dropdowns for Desktop */}
          <div className="hidden md:flex space-x-4 relative">
            {user ? (
              <DropdownUser />
            ) : (
              <>
                {/* Register Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleRegisterDropdownToggle}
                    className="text-white px-4 py-1 rounded-md bg-[#46b749] transition duration-300 ease-in-out"
                  >
                    Register
                  </button>
                  {isRegisterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50">
                      <button
                        onClick={() =>
                          handleRegisterTypeSelection("individual")
                        }
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Individual
                      </button>
                      <button
                        onClick={() => handleRegisterTypeSelection("company")}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Company
                      </button>
                    </div>
                  )}
                </div>

                {/* Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleLoginDropdownToggle}
                    className="text-white px-4 py-1 rounded-md bg-[#337ab7] transition duration-300 ease-in-out"
                  >
                    Login
                  </button>
                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md z-50">
                      <button
                        onClick={() => handleLoginTypeSelection("individual")}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Individual
                      </button>
                      <button
                        onClick={() => handleLoginTypeSelection("company")}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        Company
                      </button>
                    </div>
                  )}
                </div>

                {/* Post a Job */}
                <Link
                  to="/company-login"
                  className="text-white px-4 py-1 rounded-md bg-[#233261] transition duration-300 ease-in-out"
                >
                  Post a Job
                </Link>

                {/* Admin */}
                <Link
                  to="/admin-login"
                  className="px-4 py-1 rounded-md bg-yellow-700 text-white transition duration-300 ease-in-out"
                >
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle Button */}
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
                  <Link
                    to="/post-jobs"
                    className="block text-gray-700 hover:text-blue-900"
                  >
                    Post a Job
                  </Link>
                  <Link
                    to="/company-profile"
                    className="block text-gray-700 hover:text-blue-900"
                  >
                    Profile
                  </Link>
                </>
              )}

              {/* If no user is logged in */}
              {!user && (
                <>
                  {/* Register Dropdown for Mobile */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleRegisterDropdownToggle}
                      className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-300 ease-in-out"
                    >
                      Register
                    </button>
                    {/* Render register options below (inline) if open */}
                    {isRegisterDropdownOpen && (
                      <div className="ml-4 mt-2 space-y-2">
                        <button
                          onClick={() =>
                            handleRegisterTypeSelection("individual")
                          }
                          className="block w-full text-left px-4 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Individual
                        </button>
                        <button
                          onClick={() =>
                            handleRegisterTypeSelection("company")
                          }
                          className="block w-full text-left px-4 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Company
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Login Dropdown for Mobile */}
                  <div className="flex flex-col space-y-2 mt-2">
                    <button
                      onClick={handleLoginDropdownToggle}
                      className="border border-pink-500 text-pink-500 px-4 py-2 rounded-md hover:bg-pink-50 transition duration-300 ease-in-out"
                    >
                      Login
                    </button>
                    {/* Render login options below (inline) if open */}
                    {isLoginDropdownOpen && (
                      <div className="ml-4 mt-2 space-y-2">
                        <button
                          onClick={() =>
                            handleLoginTypeSelection("individual")
                          }
                          className="block w-full text-left px-4 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Individual
                        </button>
                        <button
                          onClick={() => handleLoginTypeSelection("company")}
                          className="block w-full text-left px-4 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Company
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* If User or Alumni is logged in */}
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
        )}
      </nav>
    </>
  );
};

export default Navbar;
