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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage/>} />
        <Route path="/*" element={<h1>404 Not Founded</h1>} />
        <Route path='/userdata' element={<UserData/>}/>
     <Route path='/homePage' element={<Home/>}/>
     <Route path='/products' element={<ProductPage/>}/>
     <Route path='/contact' element={<h1>Contact</h1>}/>
     <Route path='/about' element={<h1>About</h1>}/>
     <Route path='/profile' element={<h1>Wishlist</h1>}/>
     <Route path='/cart' element={<CartPage />} />
     <Route path='/overview/:id' element={<ProductOverview/>}/>
      </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;