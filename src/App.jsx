import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
    <div>
      <Toaster position="top-right" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/*" element={<AdminPage />} />

        <Route path="/*" element={<h1 className="text-2xl font-bold ">404 not found</h1>} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;