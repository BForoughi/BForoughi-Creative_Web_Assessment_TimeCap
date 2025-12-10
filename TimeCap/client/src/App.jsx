import AppNavbar from "./components/nav"
import { Routes, BrowserRouter, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import TestConnection from "./pages/TestConnection"
import LoginForm from "./pages/LoginForm"
import TimeCap from "./pages/TimeCap"

function App() {
  return (
    <BrowserRouter>
    <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/TestConnection" element={<TestConnection />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/TimeCap" element={<TimeCap />} />
      </Routes>
    </BrowserRouter>
    
  
  )
}

export default App
