import React from 'react'
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom'
import './index.css'
import Hero from './components/Hero'
import Services from './components/Solution'
import Narbar from './components/Navbar'
import Footer from './components/Footer'  
import About from './pages/About'


function App() {
  return (
    <>
     <Narbar/>
    <Router>
       <Narbar/>
      <Routes>
      <Route path='/'element={<Hero/>}/>
      <Route path='/home' element={<Hero/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/services' element={<Services/>}/>
      <Route path='/contact' element={<Footer/>}/>
    </Routes>
    <About/>
    <Services/>
    <Footer/>
    </Router>
  
   
   
      
    </>
  )
}

export default App
