import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import { AuthContextProvider } from "./context/AuthContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
