import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div style={{ padding: 40, fontSize: 24 }}>
      ESPELHO AI — React funcionando
    </div>
  );
};

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element não encontrado");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
