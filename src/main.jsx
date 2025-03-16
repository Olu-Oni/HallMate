import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext/index.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>
  </BrowserRouter>
);
