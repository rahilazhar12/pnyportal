import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./components/router/router.jsx";
import "./index.css";
import { SessionStorageProvider } from "./context/Sessionstorage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to include the styles

createRoot(document.getElementById("root")).render(
  <SessionStorageProvider>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right" // Change position if needed
      autoClose={5000} // Set auto-close timeout in ms
      hideProgressBar={false} // Show progress bar
      newestOnTop={false} // Whether to show the newest toast on top
      closeOnClick
      rtl={false} // Right to Left for languages like Arabic, Hebrew, etc.
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" // Set light or dark theme
    />
  </SessionStorageProvider>
);
