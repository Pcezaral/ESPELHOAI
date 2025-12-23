import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Mantém o App do Manus AI

const root = document.getElementById("root");

if (!root) throw new Error("Root element não encontrado");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
