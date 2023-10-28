import React from "react";
import { ToastContainer } from "react-toastify";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Routes, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";
import ImagePage from "./components/ImagePage";

function App() {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <ToolBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/images/:imageId" element={<ImagePage />} />
      </Routes>
    </div>
  );
}

export default App;
