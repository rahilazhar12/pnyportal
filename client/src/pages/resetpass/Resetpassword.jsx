import React, { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle sending reset link
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/reset/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset link. Please try again.");
      }

      const data = await response.json();
      setStatusMessage(data.message || "Reset code sent successfully!");
      setIsModalOpen(true); // Open the modal on success
    } catch (error) {
      setStatusMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification and password reset
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/reset/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify OTP or reset password.");
      }

      const data = await response.json();
      setStatusMessage(data.Message || "Password reset successfully!");
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      setStatusMessage(errorMessage || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6">
          Reset Your Password
        </h2>
        <p className="text-gray-600 mb-8">
          Enter your email address below and we'll send you a code to reset
          your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="border-t-transparent border-solid animate-spin rounded-full border-white border-4 h-5 w-5 mr-2"></div>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          {statusMessage && (
            <p className="mt-4 text-center text-sm text-white p-2 rounded bg-green-500">
              {statusMessage}
            </p>
          )}
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-indigo-600 mb-4">Verify OTP</h3>
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 font-medium mb-2"
                >
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-gray-700 font-medium mb-2"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  placeholder="Enter New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Verify & Reset Password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
