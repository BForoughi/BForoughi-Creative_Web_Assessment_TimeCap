import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./pages/App.jsx"
import TestConnection from "./pages/testConnection.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <TestConnection/> */}
  </StrictMode>
)
