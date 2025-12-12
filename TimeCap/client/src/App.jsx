import AppNavbar from "./components/nav"
import { Routes, BrowserRouter, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import TestConnection from "./pages/TestConnection"
import LoginForm from "./pages/LoginForm"
import TimeCap from "./pages/TimeCap"
import RegisterForm from "./pages/RegisterForm"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
    <AppNavbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/TestConnection" element={<TestConnection />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path="/TimeCap" element={
          <ProtectedRoute>
            <TimeCap />
          </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
    
  
  )
}

export default App
