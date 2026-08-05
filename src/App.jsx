import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/header";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPage from "./pages/admin/adminpage";



function App() {
  return (
    <BrowserRouter>
    <div>
      <Header/>

      <Routes>

        <Route path="/*"  element={<HomePage />} />
        <Route path="/"element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/*" element={<AdminPage/>} />
        <Route path="/*" element={<h1>404 Not Founded</h1>} />
      </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;