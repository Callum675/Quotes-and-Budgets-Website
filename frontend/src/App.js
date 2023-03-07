import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/index.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        
      </Routes>
    </BrowserRouter>
  );
}
