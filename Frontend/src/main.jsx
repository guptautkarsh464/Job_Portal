// main.jsx / index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Tailwind CSS import
import App from "./App.jsx";

// React 18 root
const root = createRoot(document.getElementById("root"));
root.render(<App />);
