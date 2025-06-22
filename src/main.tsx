import { defineCustomElements } from "@ionic/pwa-elements/loader";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import React from "react";
import "./app.css";
import { validateEnv } from "./lib/env";

// Validar variables de entorno al inicio
validateEnv();

defineCustomElements(window);

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
