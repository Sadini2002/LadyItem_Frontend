import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";



function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/*"  element={<HomePage />} />
        <Route path="/"element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/*" element={<Admin />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;