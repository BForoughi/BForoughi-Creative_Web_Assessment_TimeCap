import AppNavbar from "./components/nav"
import { Routes, BrowserRouter, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import TestConnection from "./pages/TestConnection"
import LoginForm from "./pages/LoginForm"
import TimeCap from "./pages/TimeCap"
import RegisterForm from "./pages/RegisterForm"
import LockPage from "./pages/Lock"
import OpenCapsules from "./pages/OpenCapsules"

import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/TestConnection" element={<TestConnection />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          
          <Route path="/RegisterForm" element={<RegisterForm />} />

          <Route path="/TimeCap" element={
            <ProtectedRoute>
              <TimeCap />
            </ProtectedRoute>
            } 
          />
          <Route path="/LockPage" element={
            <ProtectedRoute>
              <LockPage />
            </ProtectedRoute>
            } 
          />
          <Route path="/albums/:id" element={
            <ProtectedRoute>
              <OpenCapsules />
            </ProtectedRoute>
            } 
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
    
  
  )
}

export default App
