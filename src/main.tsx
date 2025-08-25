import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <FpjsProvider loadOptions={{apiKey: ''}}>
        <App />
      </FpjsProvider>
    </BrowserRouter>
  </StrictMode>
);
