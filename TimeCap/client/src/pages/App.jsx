import React from "react"
import "../stylesheets/App.css"
import AppNavbar from "../components/nav"
import { Routes, BrowserRouter, Route } from "react-router-dom"
import TestConnection from "./testConnection"


function App() {
  return (
    <BrowserRouter>
      <AppNavbar/>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/TestConnection" element={<TestConnection />} />
      </Routes>
    </BrowserRouter>
    
  
  )
}

export default App
