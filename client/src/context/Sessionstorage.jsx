import React, { createContext, useContext, useState, useEffect } from "react";
import CryptoJS from "crypto-js";

// Create the context
export const UserContext = createContext(); // Ensure export here

// Create a provider component
export const SessionStorageProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const encryptedData = localStorage.getItem("Data");
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedData,
          `${import.meta.env.VITE_CRYPTO_SECRET}` // Corrected environment variable syntax
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setUser(decryptedData);
        setRole(decryptedData.role);
      } catch (error) {
        console.error("Decryption error", error);
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      // Call the logout API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/logoutuser`,
        {
          method: "POST",
          credentials: "include", // Ensure cookies are sent with the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Clear localStorage and update state
        localStorage.removeItem("Data");
        setUser(null);
        setRole(null);
      } else {
        console.error("Logout failed", await response.json());
      }
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, role, loading, setUser, setRole, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useSessionStorage = () => useContext(UserContext);
